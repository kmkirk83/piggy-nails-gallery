/**
 * Printful Integration Service
 * Handles automated fulfillment, order routing, and product sync
 */

import { nailProducts } from "./nail-products-data";

interface PrintfulProduct {
  id: string;
  external_id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  cost: number;
}

interface PrintfulOrder {
  id: string;
  external_id: string;
  status: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  shipping_address: {
    name: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export class PrintfulService {
  private apiKey: string;
  private baseUrl = "https://api.printful.com";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Create all nail products in Printful
   */
  async createAllProducts(): Promise<void> {
    console.log("[Printful] Creating 30 nail products...");

    for (const product of nailProducts) {
      try {
        await this.createProduct(product);
        console.log(`[Printful] ✓ Created: ${product.name}`);
      } catch (error) {
        console.error(`[Printful] ✗ Failed to create ${product.name}:`, error);
      }
    }

    console.log("[Printful] Product creation complete");
  }

  /**
   * Create a single product in Printful
   */
  private async createProduct(product: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_id: product.id,
        name: product.name,
        description: product.description,
        image: product.imageCompressed,
        price: product.price,
        cost: product.cost,
      }),
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create order in Printful
   */
  async createOrder(
    orderId: string,
    items: Array<{ productId: string; quantity: number }>,
    shippingAddress: any
  ): Promise<PrintfulOrder> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_id: orderId,
        items: items.map((item) => ({
          external_id: item.productId,
          quantity: item.quantity,
        })),
        recipient: {
          name: shippingAddress.name,
          address1: shippingAddress.address1,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
          country: shippingAddress.country,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create Printful order: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get order status from Printful
   */
  async getOrderStatus(printfulOrderId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/orders/${printfulOrderId}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get order status: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all products from Printful
   */
  async getAllProducts(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/products`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get products: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  /**
   * Sync product with Printful
   */
  async syncProduct(product: any): Promise<void> {
    try {
      await this.createProduct(product);
    } catch (error) {
      console.error(`Failed to sync product ${product.id}:`, error);
      throw error;
    }
  }

  /**
   * Get product catalog for display
   */
  getProductCatalog() {
    return nailProducts;
  }

  /**
   * Get product by ID
   */
  getProductById(id: string) {
    return nailProducts.find((p) => p.id === id);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string) {
    return nailProducts.filter((p) => p.category === category);
  }

  /**
   * Get all categories
   */
  getAllCategories() {
    const categories = new Set(nailProducts.map((p) => p.category));
    return Array.from(categories);
  }
}

// Export singleton instance
export const printfulService = new PrintfulService(
  process.env.PRINTFUL_API_KEY || ""
);
