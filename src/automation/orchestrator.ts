/**
 * Workflow Orchestration Engine
 * Manages workflow registration, execution, retry logic, and recovery
 */

import { nanoid } from 'nanoid';
import { EventEmitter } from 'events';

// ============ Type Definitions ============

export interface WorkflowEvent {
  workflow_id: string;
  run_id: string;
  event_type: 'started' | 'completed' | 'failed' | 'retrying' | 'recovered';
  payload: Record<string, unknown>;
  timestamp: string;
  correlation_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  retry_state: RetryState;
}

export interface RetryState {
  attempt: number;
  max_retries: number;
  backoff_ms: number;
  next_retry?: string;
  last_error?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  triggers: string[];
  timeout_seconds: number;
  max_retries: number;
  backoff_strategy: 'exponential' | 'linear' | 'fixed';
  idempotency_key?: string;
  circuit_breaker?: {
    failure_threshold: number;
    timeout_seconds: number;
  };
}

export interface WorkflowRun {
  run_id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'recovered';
  started_at: string;
  completed_at?: string;
  retry_state: RetryState;
  correlation_id: string;
  execution_context: Record<string, unknown>;
}

export interface Alert {
  alert_id: string;
  workflow_id: string;
  run_id: string;
  error_code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  retry_count: number;
  owner?: string;
  next_action: 'retry' | 'alert' | 'pause' | 'rollback';
  timestamp: string;
}

// ============ Orchestrator Implementation ============

export class WorkflowOrchestrator extends EventEmitter {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private runs: Map<string, WorkflowRun> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private deadLetterQueue: WorkflowEvent[] = [];
  private circuitBreakers: Map<string, { failures: number; lastFailure: number }> = new Map();

  constructor(private config: { maxDeadLetterSize?: number } = {}) {
    super();
    this.config.maxDeadLetterSize = config.maxDeadLetterSize || 1000;
  }

  // ============ Workflow Registration ============

  registerWorkflow(definition: WorkflowDefinition): void {
    if (this.workflows.has(definition.id)) {
      throw new Error(`Workflow ${definition.id} already registered`);
    }
    this.workflows.set(definition.id, definition);
    this.emit('workflow:registered', { workflow_id: definition.id, timestamp: new Date().toISOString() });
  }

  getWorkflow(workflowId: string): WorkflowDefinition | undefined {
    return this.workflows.get(workflowId);
  }

  listWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  // ============ Execution Control ============

  async executeWorkflow(
    workflowId: string,
    context: Record<string, unknown> = {},
    idempotencyKey?: string
  ): Promise<WorkflowRun> {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    // Check idempotency
    if (idempotencyKey) {
      const existing = Array.from(this.runs.values()).find(
        (r) => r.execution_context.idempotency_key === idempotencyKey
      );
      if (existing) {
        return existing;
      }
    }

    const run: WorkflowRun = {
      run_id: nanoid(),
      workflow_id: workflowId,
      status: 'pending',
      started_at: new Date().toISOString(),
      retry_state: {
        attempt: 1,
        max_retries: workflow.max_retries,
        backoff_ms: this.getInitialBackoff(workflow),
      },
      correlation_id: nanoid(),
      execution_context: { ...context, idempotency_key: idempotencyKey },
    };

    this.runs.set(run.run_id, run);
    this.emit('run:created', run);

    try {
      // Check circuit breaker
      if (this.isCircuitBreakerOpen(workflowId)) {
        throw new Error(`Circuit breaker open for workflow ${workflowId}`);
      }

      run.status = 'running';
      this.emit('run:started', { run_id: run.run_id, timestamp: new Date().toISOString() });

      // Simulate workflow execution (replace with actual execution logic)
      await this.executeWithTimeout(workflow, run);

      run.status = 'success';
      run.completed_at = new Date().toISOString();
      this.resetCircuitBreaker(workflowId);
    } catch (error) {
      await this.handleExecutionFailure(workflow, run, error as Error);
    }

    this.runs.set(run.run_id, run);
    return run;
  }

  getRun(runId: string): WorkflowRun | undefined {
    return this.runs.get(runId);
  }

  listRuns(filter?: { workflow_id?: string; status?: string }): WorkflowRun[] {
    let runs = Array.from(this.runs.values());
    if (filter?.workflow_id) {
      runs = runs.filter((r) => r.workflow_id === filter.workflow_id);
    }
    if (filter?.status) {
      runs = runs.filter((r) => r.status === filter.status);
    }
    return runs;
  }

  // ============ Retry and Recovery ============

  async retryWorkflow(runId: string): Promise<WorkflowRun> {
    const run = this.runs.get(runId);
    if (!run) {
      throw new Error(`Run ${runId} not found`);
    }

    const workflow = this.getWorkflow(run.workflow_id);
    if (!workflow) {
      throw new Error(`Workflow ${run.workflow_id} not found`);
    }

    if (run.retry_state.attempt >= run.retry_state.max_retries) {
      throw new Error(`Max retries exceeded for run ${runId}`);
    }

    run.retry_state.attempt += 1;
    run.retry_state.backoff_ms = this.calculateBackoff(workflow, run.retry_state.attempt);
    run.status = 'pending';
    run.retry_state.next_retry = new Date(Date.now() + run.retry_state.backoff_ms).toISOString();

    this.emit('run:retrying', {
      run_id: runId,
      attempt: run.retry_state.attempt,
      next_retry: run.retry_state.next_retry,
    });

    // Wait before retry
    await new Promise((resolve) => setTimeout(resolve, run.retry_state.backoff_ms));

    // Re-execute
    try {
      run.status = 'running';
      await this.executeWithTimeout(workflow, run);
      run.status = 'success';
      run.completed_at = new Date().toISOString();
      this.emit('run:recovered', { run_id: runId, attempt: run.retry_state.attempt });
    } catch (error) {
      await this.handleExecutionFailure(workflow, run, error as Error);
    }

    this.runs.set(runId, run);
    return run;
  }

  // ============ Dead Letter Queue ============

  addToDeadLetter(event: WorkflowEvent): void {
    if (this.deadLetterQueue.length >= this.config.maxDeadLetterSize!) {
      this.deadLetterQueue.shift();
    }
    this.deadLetterQueue.push(event);
    this.emit('dlq:event_added', { event_id: event.run_id, timestamp: new Date().toISOString() });
  }

  getDeadLetterQueue(): WorkflowEvent[] {
    return [...this.deadLetterQueue];
  }

  replayFromDeadLetter(eventId: string): void {
    const index = this.deadLetterQueue.findIndex((e) => e.run_id === eventId);
    if (index === -1) {
      throw new Error(`Event ${eventId} not found in DLQ`);
    }

    const event = this.deadLetterQueue[index];
    this.emit('dlq:replaying', { event_id: eventId, timestamp: new Date().toISOString() });
    this.deadLetterQueue.splice(index, 1);
  }

  // ============ Alerting ============

  async createAlert(runId: string, error: Error, nextAction: Alert['next_action']): Promise<Alert> {
    const run = this.runs.get(runId);
    if (!run) {
      throw new Error(`Run ${runId} not found`);
    }

    const alert: Alert = {
      alert_id: nanoid(),
      workflow_id: run.workflow_id,
      run_id: runId,
      error_code: (error as any).code || 'UNKNOWN_ERROR',
      message: error.message,
      severity: run.retry_state.attempt >= run.retry_state.max_retries ? 'critical' : 'high',
      retry_count: run.retry_state.attempt,
      next_action: nextAction,
      timestamp: new Date().toISOString(),
    };

    this.alerts.set(alert.alert_id, alert);
    this.emit('alert:created', alert);

    return alert;
  }

  getAlerts(filter?: { severity?: string; status?: string }): Alert[] {
    let alerts = Array.from(this.alerts.values());
    if (filter?.severity) {
      alerts = alerts.filter((a) => a.severity === filter.severity);
    }
    return alerts;
  }

  // ============ Metrics and Observability ============

  getMetrics() {
    const runs = Array.from(this.runs.values());
    const total = runs.length;
    const successful = runs.filter((r) => r.status === 'success').length;
    const failed = runs.filter((r) => r.status === 'failed').length;
    const recovered = runs.filter((r) => r.status === 'recovered').length;

    return {
      workflow_success_rate: total > 0 ? (successful / total) * 100 : 0,
      mean_time_to_recovery: recovered > 0 ? this.calculateMeanTimeToRecovery() : 0,
      retry_rate: total > 0 ? (Array.from(this.runs.values()).reduce((sum, r) => sum + (r.retry_state.attempt - 1), 0) / total) * 100 : 0,
      dead_letter_count: this.deadLetterQueue.length,
      alert_precision: this.calculateAlertPrecision(),
      stale_run_count: this.detectStaleRuns().length,
      timestamp: new Date().toISOString(),
    };
  }

  // ============ Private Helpers ============

  private async handleExecutionFailure(workflow: WorkflowDefinition, run: WorkflowRun, error: Error): Promise<void> {
    run.retry_state.last_error = error.message;
    this.recordCircuitBreakerFailure(workflow.id);

    if (run.retry_state.attempt < run.retry_state.max_retries) {
      const nextAction = 'retry' as const;
      await this.createAlert(run.run_id, error, nextAction);
    } else {
      run.status = 'failed';
      run.completed_at = new Date().toISOString();

      const nextAction = this.isCircuitBreakerOpen(workflow.id) ? 'pause' : 'alert';
      await this.createAlert(run.run_id, error, nextAction);

      // Add to DLQ for later processing
      this.addToDeadLetter({
        workflow_id: workflow.id,
        run_id: run.run_id,
        event_type: 'failed',
        payload: { error: error.message, ...run.execution_context },
        timestamp: new Date().toISOString(),
        correlation_id: run.correlation_id,
        severity: 'critical',
        retry_state: run.retry_state,
      });
    }
  }

  private async executeWithTimeout(workflow: WorkflowDefinition, run: WorkflowRun): Promise<void> {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Workflow timeout after ${workflow.timeout_seconds}s`)), workflow.timeout_seconds * 1000)
    );

    await Promise.race([this.simulateExecution(workflow, run), timeout]);
  }

  private async simulateExecution(_workflow: WorkflowDefinition, _run: WorkflowRun): Promise<void> {
    // Simulate work
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  private getInitialBackoff(workflow: WorkflowDefinition): number {
    if (workflow.backoff_strategy === 'fixed') return 1000;
    if (workflow.backoff_strategy === 'linear') return 1000;
    return 500; // exponential
  }

  private calculateBackoff(workflow: WorkflowDefinition, attempt: number): number {
    if (workflow.backoff_strategy === 'fixed') return 1000;
    if (workflow.backoff_strategy === 'linear') return 1000 * attempt;
    return 500 * Math.pow(2, attempt - 1); // exponential
  }

  private recordCircuitBreakerFailure(workflowId: string): void {
    const cb = this.circuitBreakers.get(workflowId) || { failures: 0, lastFailure: 0 };
    cb.failures += 1;
    cb.lastFailure = Date.now();
    this.circuitBreakers.set(workflowId, cb);
  }

  private resetCircuitBreaker(workflowId: string): void {
    this.circuitBreakers.delete(workflowId);
  }

  private isCircuitBreakerOpen(workflowId: string): boolean {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow?.circuit_breaker) return false;

    const cb = this.circuitBreakers.get(workflowId);
    if (!cb) return false;

    const timeSinceLastFailure = (Date.now() - cb.lastFailure) / 1000;
    return cb.failures >= workflow.circuit_breaker.failure_threshold && timeSinceLastFailure < workflow.circuit_breaker.timeout_seconds;
  }

  private calculateMeanTimeToRecovery(): number {
    // Placeholder: implement actual MTTR calculation
    return 0;
  }

  private calculateAlertPrecision(): number {
    // Placeholder: implement alert precision calculation
    return 0;
  }

  private detectStaleRuns(): WorkflowRun[] {
    const now = Date.now();
    const staleThreshold = 3600000; // 1 hour

    return Array.from(this.runs.values()).filter((run) => {
      if (run.status !== 'running') return false;
      const age = now - new Date(run.started_at).getTime();
      return age > staleThreshold;
    });
  }
}

export default WorkflowOrchestrator;