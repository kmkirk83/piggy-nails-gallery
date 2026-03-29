import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getUserStudioAccessLevel,
  getStudioFeatures,
  canUserPerformAction,
  getStudioPaywallProducts,
} from "./studio-access";
import {
  createNailDesign,
  getNailDesignById,
  getPublicNailDesigns,
  getUserNailDesigns,
  rateNailDesign,
  addDesignComment,
  addDesignHashtags,
  getHandTemplates,
  getHandTemplateById,
  addProductHashtag,
  getProductHashtags,
  rateProduct,
  getProductRatings,
  getProductAverageRating,
} from "./design-db";

export const designRouter = router({
  // Get all hand templates
  getHandTemplates: publicProcedure.query(async () => {
    try {
      return await getHandTemplates();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch hand templates",
      });
    }
  }),

  // Get specific hand template
  getHandTemplate: publicProcedure
    .input(z.object({ templateId: z.number() }))
    .query(async ({ input }) => {
      try {
        const template = await getHandTemplateById(input.templateId);
        if (!template) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Hand template not found",
          });
        }
        return template;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch hand template",
        });
      }
    }),

  // Create new nail design
  createDesign: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        imageUrl: z.string().url(),
        templateId: z.number().optional(),
        uploadedImageUrl: z.string().url().optional(),
        designData: z.string().optional(),
        isPublic: z.number().default(1),
        hashtags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await createNailDesign({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
          templateId: input.templateId,
          uploadedImageUrl: input.uploadedImageUrl,
          designData: input.designData,
          isPublic: input.isPublic,
        });

        const designId = (result as any).insertId;

        if (input.hashtags && input.hashtags.length > 0) {
          await addDesignHashtags(designId, input.hashtags);
        }

        return { designId, success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create design",
        });
      }
    }),

  // Get public designs with sorting
  getPublicDesigns: publicProcedure
    .input(
      z.object({
        sortBy: z.enum(["recent", "rating", "views"]).default("recent"),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        return await getPublicNailDesigns(input.sortBy, input.limit, input.offset);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch designs",
        });
      }
    }),

  // Get user's designs
  getUserDesigns: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getUserNailDesigns(ctx.user.id);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch your designs",
      });
    }
  }),

  // Get design details
  getDesign: publicProcedure
    .input(z.object({ designId: z.number() }))
    .query(async ({ input }) => {
      try {
        const design = await getNailDesignById(input.designId);
        if (!design) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Design not found",
          });
        }
        return design;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch design",
        });
      }
    }),

  // Rate a design
  rateDesign: protectedProcedure
    .input(
      z.object({
        designId: z.number(),
        rating: z.number().min(1).max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await rateNailDesign(input.designId, ctx.user.id, input.rating);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to rate design",
        });
      }
    }),

  // Add comment to design
  addComment: protectedProcedure
    .input(
      z.object({
        designId: z.number(),
        content: z.string().min(1).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await addDesignComment(input.designId, ctx.user.id, input.content);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add comment",
        });
      }
    }),

  // Add hashtags to product
  addProductHashtags: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        tags: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        for (const tag of input.tags) {
          await addProductHashtag(input.productId, tag);
        }
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add hashtags",
        });
      }
    }),

  // Get product hashtags
  getProductHashtags: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getProductHashtags(input.productId);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch hashtags",
        });
      }
    }),

  // Rate a product
  rateProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1).max(5),
        review: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await rateProduct(
          input.productId,
          ctx.user.id,
          input.rating,
          input.review
        );
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to rate product",
        });
      }
    }),

  // Get product ratings
  getProductRatings: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getProductRatings(input.productId);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch ratings",
        });
      }
    }),

  // Get product average rating
  getProductAverageRating: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      try {
        const avgRating = await getProductAverageRating(input.productId);
        return { averageRating: avgRating };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch average rating",
        });
      }
    }),

  // Get user's studio access level and features
  getStudioAccess: protectedProcedure.query(async ({ ctx }) => {
    try {
      const accessLevel = await getUserStudioAccessLevel(ctx.user.id);
      const features = getStudioFeatures(accessLevel);
      return { accessLevel, features };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch studio access",
      });
    }
  }),

  // Check if user can perform specific action
  canPerformAction: protectedProcedure
    .input(
      z.object({
        action: z.enum([
          "canUploadCustomHand",
          "canUseAdvancedTemplates",
          "canExportDesigns",
          "canAccessAITools",
          "canUseAdvancedFilters",
        ]),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const canPerform = await canUserPerformAction(
          ctx.user.id,
          input.action as any
        );
        return { canPerform };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check action permission",
        });
      }
    }),

  // Get studio paywall products
  getPaywallProducts: publicProcedure.query(async () => {
    try {
      return getStudioPaywallProducts();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch paywall products",
      });
    }
  }),
});
