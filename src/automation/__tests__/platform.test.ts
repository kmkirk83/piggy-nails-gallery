import { describe, it, expect, beforeEach } from 'vitest';
import { createAutomationPlatform } from '../platform';
import type { WorkflowDefinition } from '../orchestrator';

describe('AutomationPlatform', () => {
  let platform = createAutomationPlatform();
  let testWorkflow: WorkflowDefinition;

  beforeEach(() => {
    platform = createAutomationPlatform();
    testWorkflow = {
      id: 'test-wf',
      name: 'Test Workflow',
      version: '1.0.0',
      triggers: ['manual'],
      timeout_seconds: 30,
      max_retries: 2,
      backoff_strategy: 'fixed',
    };
  });

  describe('Pause and Resume', () => {
    it('should pause all workflows', async () => {
      platform.register(testWorkflow);
      platform.pause();
      await expect(platform.execute('test-wf')).rejects.toThrow('paused');
    });

    it('should resume all workflows', async () => {
      platform.register(testWorkflow);
      platform.pause();
      platform.resume();
      const run = await platform.execute('test-wf');
      expect(run.status).toBe('success');
    });

    it('should pause specific workflow', async () => {
      platform.register(testWorkflow);
      platform.pause('test-wf');
      await expect(platform.execute('test-wf')).rejects.toThrow('paused');
    });
  });

  describe('Health Monitoring', () => {
    it('should report healthy status', () => {
      const health = platform.getHealth();
      expect(health.status).toBe('healthy');
    });
  });

  describe('Dashboard', () => {
    it('should generate dashboard data', () => {
      platform.register(testWorkflow);
      const dashboard = platform.getDashboard();
      expect(dashboard).toBeDefined();
      expect(dashboard).toHaveProperty('system_health');
      expect(dashboard).toHaveProperty('dashboard');
    });
  });
});