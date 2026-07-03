/**
 * Health Monitoring System
 * Tracks workflow health, detects failures, and triggers recovery actions
 */

import { EventEmitter } from 'events';
import type { WorkflowRun, Alert, WorkflowEvent } from './orchestrator';

export interface HealthMetrics {
  workflow_success_rate: number;
  mean_time_to_recovery: number;
  retry_rate: number;
  dead_letter_count: number;
  alert_precision: number;
  stale_run_count: number;
  timestamp: string;
}

export interface HealthThreshold {
  metric: keyof HealthMetrics;
  warning: number;
  critical: number;
  direction: 'above' | 'below';
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'critical';
  violations: string[];
  metrics: HealthMetrics;
  recommendations: string[];
}

export class HealthMonitor extends EventEmitter {
  private thresholds: Map<string, HealthThreshold> = new Map();
  private healthHistory: HealthStatus[] = [];
  private maxHistorySize = 1000;

  constructor() {
    super();
    this.initializeThresholds();
  }

  private initializeThresholds(): void {
    // Default thresholds
    this.setThreshold({
      metric: 'workflow_success_rate',
      warning: 95,
      critical: 90,
      direction: 'below',
    });

    this.setThreshold({
      metric: 'retry_rate',
      warning: 5,
      critical: 15,
      direction: 'above',
    });

    this.setThreshold({
      metric: 'dead_letter_count',
      warning: 10,
      critical: 50,
      direction: 'above',
    });

    this.setThreshold({
      metric: 'stale_run_count',
      warning: 5,
      critical: 20,
      direction: 'above',
    });
  }

  setThreshold(threshold: HealthThreshold): void {
    this.thresholds.set(threshold.metric, threshold);
  }

  evaluateHealth(metrics: HealthMetrics): HealthStatus {
    const violations: string[] = [];
    const recommendations: string[] = [];

    // Check each threshold
    for (const [metric, threshold] of this.thresholds) {
      const value = metrics[metric as keyof HealthMetrics];

      if (typeof value === 'number') {
        const isCritical =
          threshold.direction === 'above' ? value >= threshold.critical : value <= threshold.critical;
        const isWarning = threshold.direction === 'above' ? value >= threshold.warning : value <= threshold.warning;

        if (isCritical) {
          violations.push(`CRITICAL: ${metric} = ${value.toFixed(2)} (threshold: ${threshold.critical})`);
        } else if (isWarning) {
          violations.push(`WARNING: ${metric} = ${value.toFixed(2)} (threshold: ${threshold.warning})`);
        }
      }
    }

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (violations.some((v) => v.startsWith('CRITICAL'))) {
      status = 'critical';
    } else if (violations.length > 0) {
      status = 'degraded';
    }

    // Generate recommendations
    recommendations.push(...this.generateRecommendations(metrics, status));

    const health: HealthStatus = {
      status,
      violations,
      metrics,
      recommendations,
    };

    this.recordHealth(health);
    this.emit('health:evaluated', health);

    return health;
  }

  private generateRecommendations(metrics: HealthMetrics, status: string): string[] {
    const recommendations: string[] = [];

    if (status === 'critical') {
      if (metrics.workflow_success_rate < 90) {
        recommendations.push('URGENT: Success rate critical - investigate recent workflow failures');
        recommendations.push('ACTION: Enable detailed logging and check error patterns');
        recommendations.push('ACTION: Consider pausing automation for manual review');
      }

      if (metrics.dead_letter_count > 50) {
        recommendations.push('URGENT: Large DLQ backlog - replay or investigate stuck events');
        recommendations.push('ACTION: Check for dependency failures or timeouts');
      }

      if (metrics.stale_run_count > 20) {
        recommendations.push('URGENT: Many stale runs detected - possible deadlock or resource exhaustion');
        recommendations.push('ACTION: Check system resources and restart affected workers');
      }
    }

    if (metrics.retry_rate > 5) {
      recommendations.push('Review retry patterns - may indicate flaky infrastructure');
      recommendations.push('Consider implementing circuit breakers for dependent services');
    }

    if (metrics.mean_time_to_recovery > 300) {
      recommendations.push('Recovery time is high - optimize retry strategies and alerting');
    }

    if (metrics.alert_precision < 0.8) {
      recommendations.push('Alert precision low - tune alert thresholds to reduce false positives');
    }

    return recommendations;
  }

  private recordHealth(health: HealthStatus): void {
    this.healthHistory.push(health);
    if (this.healthHistory.length > this.maxHistorySize) {
      this.healthHistory.shift();
    }
  }

  getHealthHistory(limit: number = 100): HealthStatus[] {
    return this.healthHistory.slice(-limit);
  }

  getDashboardData() {
    const recent = this.healthHistory.slice(-100);

    return {
      current_health: recent[recent.length - 1],
      health_trend: recent.map((h) => ({
        timestamp: h.metrics.timestamp,
        status: h.status,
        violations_count: h.violations.length,
      })),
      metrics_timeline: recent.map((h) => ({
        timestamp: h.metrics.timestamp,
        success_rate: h.metrics.workflow_success_rate,
        retry_rate: h.metrics.retry_rate,
        dead_letter_count: h.metrics.dead_letter_count,
        stale_run_count: h.metrics.stale_run_count,
      })),
    };
  }

  detectSilentFailures(runs: WorkflowRun[]): WorkflowRun[] {
    const now = Date.now();
    const silentFailureThreshold = 300000; // 5 minutes

    return runs.filter((run) => {
      if (run.status !== 'running') return false;

      const age = now - new Date(run.started_at).getTime();
      return age > silentFailureThreshold;
    });
  }

  generateAlert(health: HealthStatus): Alert | null {
    if (health.status === 'healthy') return null;

    const severity = health.status === 'critical' ? 'critical' : 'high';

    return {
      alert_id: `alert_${Date.now()}`,
      workflow_id: 'system',
      run_id: '',
      error_code: `HEALTH_${health.status.toUpperCase()}`,
      message: `System health status: ${health.status}. Violations: ${health.violations.slice(0, 3).join('; ')}`,
      severity,
      retry_count: 0,
      next_action: health.status === 'critical' ? 'pause' : 'alert',
      timestamp: new Date().toISOString(),
    };
  }
}

export default HealthMonitor;
