import { describe, it, expect } from "vitest";

describe("Printful API Integration", () => {
  it("should validate Printful API key by fetching account info", async () => {
    const apiKey = process.env.PRINTFUL_API_KEY;
    
    if (!apiKey) {
      throw new Error("PRINTFUL_API_KEY environment variable not set");
    }

    // Test API connection by fetching account info
    const response = await fetch("https://api.printful.com/account", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty("result");
    expect(data.result).toHaveProperty("id");
    
    console.log("✅ Printful API key validated successfully");
    console.log(`Account ID: ${data.result.id}`);
  });
});
