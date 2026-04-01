import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import { recordTransaction, getFinancialMetrics, getDailyFinancials } from "./financial-service";
import { transactions } from "../drizzle/schema";
import { and, eq } from "drizzle-orm";

describe("Financial Service", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      console.warn("Database not available for tests");
    }
  });

  it("should record revenue transaction", async () => {
    if (!db) {
      console.warn("Skipping test - database not available");
      return;
    }

    const testCategory = `product_sale_${Date.now()}`;
    await recordTransaction("revenue", 5000, testCategory, undefined, "Test sale");
    
    const result = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.category, testCategory),
          eq(transactions.type, "revenue")
        )
      );
    
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].type).toBe("revenue");
    expect(result[0].amount).toBe(5000);
  });

  it("should record cost transaction", async () => {
    if (!db) {
      console.warn("Skipping test - database not available");
      return;
    }

    const testCategory = `product_cost_${Date.now()}`;
    await recordTransaction("cost", 1500, testCategory, undefined, "Product purchase");
    
    const result = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.category, testCategory),
          eq(transactions.type, "cost")
        )
      );
    
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].type).toBe("cost");
    expect(result[0].amount).toBe(1500);
  });

  it("should calculate financial metrics", async () => {
    if (!db) {
      console.warn("Skipping test - database not available");
      return;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    const metrics = await getFinancialMetrics(startDate, endDate);

    expect(metrics).toBeDefined();
    expect(metrics.totalRevenue).toBeGreaterThanOrEqual(0);
    expect(metrics.totalCosts).toBeGreaterThanOrEqual(0);
    expect(metrics.netProfit).toBeDefined();
    expect(metrics.profitMargin).toBeDefined();
    expect(metrics.orderCount).toBeGreaterThanOrEqual(0);
  });

  it("should calculate daily financials", async () => {
    if (!db) {
      console.warn("Skipping test - database not available");
      return;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();

    const daily = await getDailyFinancials(startDate, endDate);

    expect(Array.isArray(daily)).toBe(true);
    if (daily.length > 0) {
      expect(daily[0]).toHaveProperty("date");
      expect(daily[0]).toHaveProperty("revenue");
      expect(daily[0]).toHaveProperty("costs");
      expect(daily[0]).toHaveProperty("profit");
      expect(daily[0]).toHaveProperty("orderCount");
    }
  });

  it("should calculate profit margin correctly", async () => {
    if (!db) {
      console.warn("Skipping test - database not available");
      return;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    const metrics = await getFinancialMetrics(startDate, endDate);

    if (metrics.totalRevenue > 0) {
      const expectedMargin = (metrics.netProfit / metrics.totalRevenue) * 100;
      expect(Math.abs(metrics.profitMargin - expectedMargin)).toBeLessThan(0.01);
    }
  });

  it("should handle empty date ranges", async () => {
    if (!db) {
      console.warn("Skipping test - database not available");
      return;
    }

    const startDate = new Date("2000-01-01");
    const endDate = new Date("2000-01-02");

    const metrics = await getFinancialMetrics(startDate, endDate);

    expect(metrics.totalRevenue).toBe(0);
    expect(metrics.totalCosts).toBe(0);
    expect(metrics.netProfit).toBe(0);
    expect(metrics.profitMargin).toBe(0);
  });
});
