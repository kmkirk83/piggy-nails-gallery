import { getDb } from "./db";
import { transactions } from "../drizzle/schema";
import { eq, gte, lte, and } from "drizzle-orm";

export interface FinancialMetrics {
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  orderCount: number;
  averageOrderValue: number;
  averageProductCost: number;
  processingFees: number;
  shippingCosts: number;
}

export interface DailyFinancials {
  date: string;
  revenue: number;
  costs: number;
  profit: number;
  orderCount: number;
}

/**
 * Calculate financial metrics for a date range
 */
export async function getFinancialMetrics(
  startDate: Date,
  endDate: Date
): Promise<FinancialMetrics> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const txns = await db
      .select()
      .from(transactions)
      .where(
        and(
          gte(transactions.createdAt, startDate),
          lte(transactions.createdAt, endDate)
        )
      );

    const totalRevenue = txns
      .filter((t: typeof transactions.$inferSelect) => t.type === "revenue")
      .reduce((sum: number, t: typeof transactions.$inferSelect) => sum + (t.amount || 0), 0);

    const totalCosts = txns
      .filter((t: typeof transactions.$inferSelect) => t.type === "cost")
      .reduce((sum: number, t: typeof transactions.$inferSelect) => sum + (t.amount || 0), 0);

    const processingFees = txns
      .filter((t: typeof transactions.$inferSelect) => t.category === "processing_fee")
      .reduce((sum: number, t: typeof transactions.$inferSelect) => sum + (t.amount || 0), 0);

    const shippingCosts = txns
      .filter((t: typeof transactions.$inferSelect) => t.category === "shipping")
      .reduce((sum: number, t: typeof transactions.$inferSelect) => sum + (t.amount || 0), 0);

    const grossProfit = totalRevenue - totalCosts;
    const netProfit = grossProfit - processingFees;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const orderCount = txns.filter((t: typeof transactions.$inferSelect) => t.type === "revenue").length;

    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
    const averageProductCost = orderCount > 0 ? totalCosts / orderCount : 0;

    return {
      totalRevenue,
      totalCosts,
      grossProfit,
      netProfit,
      profitMargin,
      orderCount,
      averageOrderValue,
      averageProductCost,
      processingFees,
      shippingCosts,
    };
  } catch (error) {
    console.error("[Financial] Failed to calculate metrics:", error);
    throw error;
  }
}

/**
 * Get daily financial breakdown
 */
export async function getDailyFinancials(
  startDate: Date,
  endDate: Date
): Promise<DailyFinancials[]> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const txns = await db
      .select()
      .from(transactions)
      .where(
        and(
          gte(transactions.createdAt, startDate),
          lte(transactions.createdAt, endDate)
        )
      );

    const dailyMap = new Map<string, DailyFinancials>();

    txns.forEach((txn: typeof transactions.$inferSelect) => {
      const date = new Date(txn.createdAt).toISOString().split("T")[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          revenue: 0,
          costs: 0,
          profit: 0,
          orderCount: 0,
        });
      }

      const daily = dailyMap.get(date)!;
      if (txn.type === "revenue") {
        daily.revenue += txn.amount || 0;
        daily.orderCount += 1;
      } else if (txn.type === "cost") {
        daily.costs += txn.amount || 0;
      }
      daily.profit = daily.revenue - daily.costs;
    });

    return Array.from(dailyMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error("[Financial] Failed to get daily financials:", error);
    throw error;
  }
}

/**
 * Record transaction (revenue or cost)
 */
export async function recordTransaction(
  type: "revenue" | "cost",
  amount: number,
  category: string,
  orderId?: number,
  description?: string
) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    await db.insert(transactions).values({
      type,
      amount,
      category,
      orderId,
      description,
      createdAt: new Date(),
    });

    console.log(`[Financial] Transaction recorded: ${type} ${amount} (${category})`);
  } catch (error) {
    console.error("[Financial] Failed to record transaction:", error);
    throw error;
  }
}

/**
 * Export financial data as JSON
 */
export async function exportFinancialData(
  startDate: Date,
  endDate: Date
): Promise<string> {
  try {
    const metrics = await getFinancialMetrics(startDate, endDate);
    const daily = await getDailyFinancials(startDate, endDate);

    const exportData = {
      exportDate: new Date().toISOString(),
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      metrics,
      dailyBreakdown: daily,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error("[Financial] Failed to export data:", error);
    throw error;
  }
}

export default {
  getFinancialMetrics,
  getDailyFinancials,
  recordTransaction,
  exportFinancialData,
};
