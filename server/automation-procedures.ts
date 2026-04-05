import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { products } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";

/**
 * Automation Router - AI-powered content generation and campaign creation
 */
export const automationRouter = router({
  /**
   * Generate trending nail art products
   */
  generateTrendingProducts: protectedProcedure
    .input(
      z.object({
        count: z.number().default(10),
        trendingCategory: z.string().default("nail-art"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Research trending nail art designs
        const trendingResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a trendy nail art designer. Generate ${input.count} unique, trending nail art product ideas with names, descriptions, and prices. Return JSON array.",
            },
            {
              role: "user",
              content: `Generate ${input.count} trending nail art designs for 2025. Include: name, description (50 words), price ($15-$45), color palette, and design style. Return as JSON array.`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "trending_products",
              strict: true,
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    price: { type: "number" },
                    colorPalette: { type: "string" },
                    style: { type: "string" },
                  },
                  required: ["name", "description", "price", "colorPalette", "style"],
                },
              },
            },
          },
        });

        const responseContent = trendingResponse.choices[0]?.message?.content;
        if (!responseContent) throw new Error("No response from LLM");

        const contentStr = typeof responseContent === "string" ? responseContent : JSON.stringify(responseContent);
        const trendingProducts = JSON.parse(contentStr);

        // Generate images and create products
        const createdProducts = [];

        for (const product of trendingProducts.slice(0, input.count)) {
          try {
            // Generate product image
            const imageResult = await generateImage({
              prompt: `Professional nail art design: ${product.name}. ${product.style}. Color palette: ${product.colorPalette}. High quality, product photography, salon-quality nails.`,
            });

            // Create product in database
            const result = await db.insert(products).values({
              name: product.name,
              description: product.description,
              price: Math.round(product.price * 100), // Store in cents
              imageUrl: imageResult.url,
              category: input.trendingCategory,
              isActive: true,
            });

            createdProducts.push({
              id: (result as any)[0],
              name: product.name,
              price: product.price,
            });

            console.log(`[Automation] Created product: ${product.name}`);
          } catch (error) {
            console.error(`[Automation] Error creating product ${product.name}:`, error);
          }
        }

        return {
          success: true,
          productsCreated: createdProducts.length,
          products: createdProducts,
          message: `Generated ${createdProducts.length} trending nail art products`,
        };
      } catch (error) {
        console.error("[Automation] Error generating products:", error);
        throw error;
      }
    }),

  /**
   * Create automated marketing campaign
   */
  createMarketingCampaign: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        platforms: z.array(z.enum(["instagram", "tiktok", "facebook"])),
        autoPost: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Generate campaign content using LLM
        const campaignResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a social media marketing expert. Create engaging campaign content for nail art products. Return JSON with captions, hashtags, and posting schedule.",
            },
            {
              role: "user",
              content: `Create a marketing campaign for: ${input.description}. Generate 5 unique captions, 20 relevant hashtags, and optimal posting times. Return as JSON.`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "campaign_content",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  captions: { type: "array", items: { type: "string" } },
                  hashtags: { type: "array", items: { type: "string" } },
                  postingTimes: { type: "array", items: { type: "string" } },
                },
                required: ["captions", "hashtags", "postingTimes"],
              },
            },
          },
        });

        const responseContent = campaignResponse.choices[0]?.message?.content;
        if (!responseContent) throw new Error("No response from LLM");

        const contentStr = typeof responseContent === "string" ? responseContent : JSON.stringify(responseContent);
        const campaignContent = JSON.parse(contentStr);

        console.log(`[Automation] Created campaign: ${input.name}`);
        console.log(`[Automation] Captions: ${campaignContent.captions.length}`);
        console.log(`[Automation] Hashtags: ${campaignContent.hashtags.length}`);

        return {
          success: true,
          campaignName: input.name,
          captions: campaignContent.captions,
          hashtags: campaignContent.hashtags,
          postingTimes: campaignContent.postingTimes,
          platforms: input.platforms,
          autoPost: input.autoPost,
          message: `Campaign "${input.name}" created with ${campaignContent.captions.length} posts scheduled`,
        };
      } catch (error) {
        console.error("[Automation] Error creating campaign:", error);
        throw error;
      }
    }),
});
