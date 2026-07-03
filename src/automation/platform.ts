/**
 * Unified Automation Platform
 * Integrates orchestration, monitoring, and recovery into a cohesive system
 */

import WorkflowOrchestrator, { type WorkflowDefinition, type WorkflowRun } from './orchestrator';
import HealthMonitor, { type HealthStatus } from './health-monitor';
import { EventEmitter } from 'events';

export interface AutomationPlatform {
  orchestrator: WorkflowOrchestrator;
  monitor: HealthMonitor;
  register: (definition: WorkflowDefinition) => void;
  execute: (workflowId: string, context?: Record<string, unknown>, idempotencyKey?: string) => Promise<WorkflowRun>;
  getHealth: () => HealthStatus;
  getDashboard: () => unknown;
  pause: (workflowId?: string) => void;
  resume: (workflowId?: string) => void;
  forceReplay: (runId: string) => Promise<WorkflowRun>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
}

export function createAutomationPlatform(): AutomationPlatform {
  const orchestrator = new WorkflowOrchestrator({ maxDeadLetterSize: 1000 });
  const monitor = new HealthMonitor();
  const paused = new Set<string>();

  const platform: AutomationPlatform = {
    orchestrator,
    monitor,

    register(definition: WorkflowDefinition): void {
      orchestrator.registerWorkflow(definition);
    },

    async execute(
      workflowId: string,
      context: Record<string, unknown> = {},
      idempotencyKey?: string
    ): Promise<WorkflowRun> {
      if (paused.has(workflowId) || paused.has('*')) {
        throw new Error(`Workflow ${workflowId} is paused`);
      }
      return orchestrator.executeWorkflow(workflowId, context, idempotencyKey);
    },

    getHealth(): HealthStatus {
      const metrics = orchestrator.getMetrics();
      return monitor.evaluateHealth(metrics);
    },

    getDashboard(): unknown {
      const health = this.getHealth();
      const dashboardData = monitor.getDashboardData();

      return {
        system_health: health,
        dashboard: dashboardData,
        workflows: orchestrator.listWorkflows().map((w) => ({
          id: w.id,
          name: w.name,
          version: w.version,
        })),
      };
    },

    pause(workflowId?: string): void {
      if (!workflowId) {
        paused.add('*');
        orchestrator.emit('platform:paused', { timestamp: new Date().toISOString() });
      } else {
        paused.add(workflowId);
        orchestrator.emit('workflow:paused', { workflow_id: workflowId, timestamp: new Date().toISOString() });
      }
    },

    resume(workflowId?: string): void {
      if (!workflowId) {
        paused.delete('*');
        orchestrator.emit('platform:resumed', { timestamp: new Date().toISOString() });
      } else {
        paused.delete(workflowId);
        orchestrator.emit('workflow:resumed', { workflow_id: workflowId, timestamp: new Date().toISOString() });
      }
    },

    async forceReplay(runId: string): Promise<WorkflowRun> {
      return orchestrator.retryWorkflow(runId);
    },

    on(event: string, handler: (...args: unknown[]) => void): void {
      orchestrator.on(event, handler);
      monitor.on(event, handler);
    },
  };

  // Automatically monitor health periodically
  setInterval(() => {
    platform.getHealth();
  }, 60000); // Every minute

  return platform;
}

export default createAutomationPlatform;