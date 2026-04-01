import { getDb } from "./db";
import { backups, milestones } from "../drizzle/schema";
import crypto from "crypto";

export interface BackupConfig {
  repoName: string;
  owner: string;
  branch: string;
  token: string;
}

/**
 * Execute git command via GitHub CLI
 */
async function execGitCommand(command: string): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const { exec } = require("child_process");
    exec(command, (error: any, stdout: string, stderr: string) => {
      resolve({
        stdout,
        stderr,
        code: error ? error.code : 0,
      });
    });
  });
}

/**
 * Create automated backup commit
 */
export async function createBackupCommit(
  backupType: "inventory" | "financial" | "webhook_logs" | "code",
  message: string,
  filePath: string,
  content: string
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Write file
    const fs = require("fs");
    const path = require("path");
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);

    // Calculate checksum
    const checksum = crypto.createHash("sha256").update(content).digest("hex");

    // Commit file
    const commitCommand = `cd ${process.cwd()} && git add "${filePath}" && git commit -m "[AUTO] ${message}" --quiet 2>&1`;
    const commitResult = await execGitCommand(commitCommand);

    if (commitResult.code !== 0 && !commitResult.stderr.includes("nothing to commit")) {
      console.error("[Backup] Commit failed:", commitResult.stderr);
      return false;
    }

    // Get commit hash
    const hashCommand = `cd ${process.cwd()} && git rev-parse HEAD`;
    const hashResult = await execGitCommand(hashCommand);
    const commitHash = hashResult.stdout.trim();

    // Push to GitHub
    const pushCommand = `cd ${process.cwd()} && git push origin HEAD --quiet 2>&1`;
    const pushResult = await execGitCommand(pushCommand);

    if (pushResult.code !== 0 && !pushResult.stderr.includes("up to date")) {
      console.error("[Backup] Push failed:", pushResult.stderr);
    }

    // Record in database
    await db.insert(backups).values({
      commitHash,
      commitMessage: `[AUTO] ${message}`,
      backupType,
      checksum,
      status: "success",
      createdAt: new Date(),
    });

    console.log(`[Backup] ${backupType} backup created: ${commitHash}`);
    return true;
  } catch (error) {
    console.error("[Backup] Failed to create backup:", error);
    return false;
  }
}

/**
 * Create daily financial backup
 */
export async function createFinancialBackup(financialData: string): Promise<boolean> {
  const date = new Date().toISOString().split("T")[0];
  const filePath = `data/financial-backups/financial-backup-${date}.json`;
  return createBackupCommit("financial", `Financial backup - ${date}`, filePath, financialData);
}

/**
 * Create inventory snapshot backup
 */
export async function createInventoryBackup(inventoryData: string): Promise<boolean> {
  const date = new Date().toISOString().split("T")[0];
  const filePath = `data/inventory-snapshots/inventory-snapshot-${date}.json`;
  return createBackupCommit("inventory", `Inventory sync - ${date}`, filePath, inventoryData);
}

/**
 * Create webhook logs backup
 */
export async function createWebhookLogsBackup(logsData: string): Promise<boolean> {
  const date = new Date().toISOString().split("T")[0];
  const filePath = `logs/webhooks-${date}.log`;
  return createBackupCommit("webhook_logs", `Webhook logs - ${date}`, filePath, logsData);
}

/**
 * Update milestone tracking
 */
export async function updateMilestone(
  name: string,
  status: "pending" | "in_progress" | "completed",
  metrics?: Record<string, any>
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get commit hash
    const { exec } = require("child_process");
    const hashResult = await new Promise<string>((resolve) => {
      exec("git rev-parse HEAD", (error: any, stdout: string) => {
        resolve(stdout.trim());
      });
    });

    const completedAt = status === "completed" ? new Date() : null;

    await db.insert(milestones).values({
      name,
      status,
      metrics: metrics ? JSON.stringify(metrics) : null,
      commitHash: hashResult,
      completedAt,
      createdAt: new Date(),
    });

    console.log(`[Milestone] ${name} updated to ${status}`);
    return true;
  } catch (error) {
    console.error("[Milestone] Failed to update milestone:", error);
    return false;
  }
}

/**
 * Generate MILESTONES.md file
 */
export async function generateMilestonesReport(): Promise<string> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allMilestones = await db.select().from(milestones);

    let report = `# Nail'd Platform - Milestones & Progress\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;

    const completed = allMilestones.filter((m) => m.status === "completed");
    const inProgress = allMilestones.filter((m) => m.status === "in_progress");
    const pending = allMilestones.filter((m) => m.status === "pending");

    report += `## Summary\n`;
    report += `- ✅ Completed: ${completed.length}\n`;
    report += `- 🔄 In Progress: ${inProgress.length}\n`;
    report += `- ⏳ Pending: ${pending.length}\n\n`;

    report += `## Completed Milestones\n`;
    completed.forEach((m) => {
      report += `- ✅ ${m.name}`;
      if (m.completedAt) {
        report += ` (${new Date(m.completedAt).toLocaleDateString()})`;
      }
      report += `\n`;
      if (m.metrics) {
        try {
          const metrics = JSON.parse(m.metrics);
          Object.entries(metrics).forEach(([key, value]) => {
            report += `  - ${key}: ${value}\n`;
          });
        } catch (e) {
          // Skip if metrics not valid JSON
        }
      }
    });

    report += `\n## In Progress\n`;
    inProgress.forEach((m) => {
      report += `- 🔄 ${m.name}\n`;
    });

    report += `\n## Pending\n`;
    pending.forEach((m) => {
      report += `- ⏳ ${m.name}\n`;
    });

    return report;
  } catch (error) {
    console.error("[Milestone] Failed to generate report:", error);
    return "";
  }
}

/**
 * Verify backup integrity
 */
export async function verifyBackupIntegrity(commitHash: string, expectedChecksum: string): Promise<boolean> {
  try {
    const { exec } = require("child_process");
    const fs = require("fs");

    // Get commit details
    const result = await new Promise<string>((resolve) => {
      exec(`git show ${commitHash}:data/financial-backups/* 2>/dev/null | head -1`, (error: any, stdout: string) => {
        resolve(stdout);
      });
    });

    const checksum = crypto.createHash("sha256").update(result).digest("hex");
    return checksum === expectedChecksum;
  } catch (error) {
    console.error("[Backup] Verification failed:", error);
    return false;
  }
}

export default {
  createBackupCommit,
  createFinancialBackup,
  createInventoryBackup,
  createWebhookLogsBackup,
  updateMilestone,
  generateMilestonesReport,
  verifyBackupIntegrity,
};
