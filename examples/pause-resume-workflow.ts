/**
 * Pause, Resume & Manual Replay Example
 * Demonstrates admin controls for managing automation
 */

import { createAutomationPlatform } from '../src/automation';

async function runPauseResumeExample() {
  const platform = createAutomationPlatform();

  // Register workflows
  platform.register({
    id: 'critical-sync',
    name: 'Critical Data Sync',
    version: '1.0.0',
    triggers: ['schedule'],
    timeout_seconds: 120,
    max_retries: 3,
    backoff_strategy: 'exponential',
  });

  platform.register({
    id: 'backup-job',
    name: 'Database Backup',
    version: '1.0.0',
    triggers: ['schedule'],
    timeout_seconds: 600,
    max_retries: 2,
    backoff_strategy: 'linear',
  });

  console.log('📋 Admin Control Example\n');

  // Execute initial run
  console.log('1️⃣  Executing critical-sync...');
  const run1 = await platform.execute('critical-sync');
  console.log(`   Result: ${run1.status} (run_id: ${run1.run_id})\n`);

  // Pause specific workflow
  console.log('2️⃣  Pausing critical-sync...');
  platform.pause('critical-sync');
  console.log('   Paused\n');

  try {
    console.log('3️⃣  Attempting to execute paused workflow...');
    await platform.execute('critical-sync');
  } catch (error) {
    console.log(`   Blocked: ${error}\n`);
  }

  // Pause all automation
  console.log('4️⃣  Pausing all automation...');
  platform.pause();
  console.log('   All workflows paused\n');

  try {
    console.log('5️⃣  Attempting to execute backup-job (all paused)...');
    await platform.execute('backup-job');
  } catch (error) {
    console.log(`   Blocked: ${error}\n`);
  }

  // Resume specific workflow
  console.log('6️⃣  Resuming critical-sync only...');
  platform.resume('critical-sync');
  console.log('   critical-sync resumed (others still paused)\n');

  console.log('7️⃣  Executing critical-sync (now allowed)...');
  const run2 = await platform.execute('critical-sync');
  console.log(`   Result: ${run2.status}\n`);

  // Resume all
  console.log('8️⃣  Resuming all automation...');
  platform.resume();
  console.log('   All workflows resumed\n');

  // Force replay
  console.log('9️⃣  Force replaying run: ' + run1.run_id);
  try {
    const replayed = await platform.forceReplay(run1.run_id);
    console.log(`   Replayed successfully (new status: ${replayed.status})\n`);
  } catch (error) {
    console.log(`   Replay failed: ${error}\n`);
  }
}

runPauseResumeExample().catch(console.error);