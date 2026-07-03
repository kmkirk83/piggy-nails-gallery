/**
 * Basic Workflow Example
 * Demonstrates how to register and execute a simple workflow
 */

import { createAutomationPlatform } from '../src/automation';

async function runBasicWorkflowExample() {
  // Create platform instance
  const platform = createAutomationPlatform();

  // Register a simple workflow
  platform.register({
    id: 'daily-sync',
    name: 'Daily Data Sync',
    version: '1.0.0',
    triggers: ['schedule'],
    timeout_seconds: 300,
    max_retries: 3,
    backoff_strategy: 'exponential',
    circuit_breaker: {
      failure_threshold: 5,
      timeout_seconds: 300,
    },
  });

  // Execute the workflow
  console.log('Starting workflow...');
  try {
    const run = await platform.execute('daily-sync', {
      sync_type: 'incremental',
      source: 'api',
      destination: 'database',
    });

    console.log(`✅ Workflow completed: ${run.run_id}`);
    console.log(`Status: ${run.status}`);
    console.log(`Duration: ${run.retry_state.attempt} attempt(s)`);
  } catch (error) {
    console.error(`❌ Workflow failed: ${error}`);
  }

  // Check platform health
  const health = platform.getHealth();
  console.log('\n📊 Platform Health:');
  console.log(`Status: ${health.status}`);
  console.log(`Metrics:`, health.metrics);

  // Get dashboard
  const dashboard = platform.getDashboard();
  console.log('\n📈 Dashboard:');
  console.log(JSON.stringify(dashboard, null, 2));
}

runBasicWorkflowExample().catch(console.error);