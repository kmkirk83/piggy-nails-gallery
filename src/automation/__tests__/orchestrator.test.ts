import { describe, it, expect, beforeEach } from 'vitest';
import WorkflowOrchestrator, { type WorkflowDefinition } from '../orchestrator';

describe('WorkflowOrchestrator', () => {
  let orchestrator: WorkflowOrchestrator;
  let testWorkflow: WorkflowDefinition;

  beforeEach(() => {
    orchestrator = new WorkflowOrchestrator();
    testWorkflow = {
      id: 'test-workflow',
      name: 'Test Workflow',
      version: '1.0.0',
      triggers: ['manual'],
      timeout_seconds: 30,
      max_retries: 3,
      backoff_strategy: 'exponential',
    };
  });

  describe('Workflow Registration', () => {
    it('should register a workflow', () => {
      orchestrator.registerWorkflow(testWorkflow);
      const retrieved = orchestrator.getWorkflow('test-workflow');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Test Workflow');
    });

    it('should prevent duplicate registration', () => {
      orchestrator.registerWorkflow(testWorkflow);
      expect(() => orchestrator.registerWorkflow(testWorkflow)).toThrow('already registered');
    });
  });

  describe('Workflow Execution', () => {
    it('should execute a workflow successfully', async () => {
      orchestrator.registerWorkflow(testWorkflow);
      const run = await orchestrator.executeWorkflow('test-workflow');
      expect(run.status).toBe('success');
      expect(run.run_id).toBeDefined();
    });

    it('should handle idempotency keys', async () => {
      orchestrator.registerWorkflow(testWorkflow);
      const key = 'idempotency-key-123';
      const run1 = await orchestrator.executeWorkflow('test-workflow', {}, key);
      const run2 = await orchestrator.executeWorkflow('test-workflow', {}, key);
      expect(run1.run_id).toBe(run2.run_id);
    });
  });

  describe('Metrics', () => {
    it('should calculate success rate', async () => {
      orchestrator.registerWorkflow(testWorkflow);
      await orchestrator.executeWorkflow('test-workflow');
      const metrics = orchestrator.getMetrics();
      expect(metrics.workflow_success_rate).toBeGreaterThan(0);
    });
  });
});