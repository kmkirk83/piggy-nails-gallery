/**
 * Recovery & Retry Workflow Example
 * Demonstrates failure handling, retries, and recovery
 */

import { createAutomationPlatform } from '../src/automation';

async function runRecoveryWorkflowExample() {
  const platform = createAutomationPlatform();

  // Register a workflow with retry strategy
  platform.register({
    id: 'api-integration',
    name: 'API Integration',
    version: '1.0.0',
    triggers: ['webhook'],
    timeout_seconds: 60,
    max_retries: 5,
    backoff_strategy: 'exponential',
    circuit_breaker: {
      failure_threshold: 3,
      timeout_seconds: 600,
    },
  });

  // Listen for workflow events
  platform.on('run:started', (event) => {
    console.log(`▶️  Workflow started: ${event.run_id}`);
  });

  platform.on('run:retrying', (event) => {
    console.log(`🔄 Retrying: attempt ${event.attempt}, next retry: ${event.next_retry}`);
  });

  platform.on('run:recovered', (event) => {
    console.log(`✅ Recovered: ${event.run_id} after ${event.attempt} attempts`);
  });

  platform.on('alert:created', (alert) => {
    console.log(`🚨 Alert: [${alert.severity}] ${alert.message}`);
  });

  // Execute workflow
  console.log('Executing workflow with retry strategy...\n');
  try {
    const run = await platform.execute('api-integration', {
      endpoint: 'https://api.example.com/data',
      method: 'POST',
    });

    console.log(`\n✅ Final Status: ${run.status}`);
    console.log(`Total Attempts: ${run.retry_state.attempt}`);
  } catch (error) {
    console.error(`❌ Failed: ${error}`);
  }

  // Check dead-letter queue
  const dlq = platform.orchestrator.getDeadLetterQueue();
  if (dlq.length > 0) {
    console.log(`\n⚠️  Dead Letter Queue: ${dlq.length} events`);
    dlq.slice(0, 3).forEach((event) => {
      console.log(`  - ${event.event_type}: ${event.payload}`);
    });
  }
}

runRecoveryWorkflowExample().catch(console.error);