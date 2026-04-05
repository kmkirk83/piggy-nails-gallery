/**
 * Products Router - Nail designs and Printful integration
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { printfulService } from "./printful-service";

export const productsRouter = router({
  // Get all products
  getAll: publicProcedure.query(() => {
    return printfulService.getProductCatalog();
  }),

  // Get product by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return printfulService.getProductById(input.id);
    }),

  // Get products by category
  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(({ input }) => {
      return printfulService.getProductsByCategory(input.category);
    }),

  // Get all categories
  getCategories: publicProcedure.query(() => {
    return printfulService.getAllCategories();
  }),

  // Get featured products (top sellers)
  getFeatured: publicProcedure.query(() => {
    const catalog = printfulService.getProductCatalog();
    // Return first 6 products as featured
    return catalog.slice(0, 6);
  }),

  // Search products
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => {
      const catalog = printfulService.getProductCatalog();
      const query = input.query.toLowerCase();
      return catalog.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }),

  // Get product stats
  getStats: publicProcedure.query(() => {
    const catalog = printfulService.getProductCatalog();
    const categories = printfulService.getAllCategories();

    return {
      totalProducts: catalog.length,
      totalCategories: categories.length,
      priceRange: {
        min: Math.min(...catalog.map((p) => p.price)),
        max: Math.max(...catalog.map((p) => p.price)),
        average:
          catalog.reduce((sum, p) => sum + p.price, 0) / catalog.length,
      },
      profitRange: {
        min: Math.min(...catalog.map((p) => p.price - p.cost)),
        max: Math.max(...catalog.map((p) => p.price - p.cost)),
        average:
          catalog.reduce((sum, p) => sum + (p.price - p.cost), 0) /
          catalog.length,
      },
      categories: categories.sort(),
    };
  }),
});
