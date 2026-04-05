/**
 * Social Media Marketing Procedures
 * Handles content creation, scheduling, posting, and analytics
 */

import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import {
  socialMediaPosts,
  socialMediaMetrics,
  socialMediaAccounts,
} from "../drizzle/schema";
import { eq, and, gte, lte, desc, count } from "drizzle-orm";

export const marketingRouter = router({
  /**
   * Create new social media post
   */
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        imageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        platforms: z.array(z.enum(["instagram", "tiktok", "facebook"])),
        caption: z.string().optional(),
        hashtags: z.array(z.string()).optional(),
        scheduledAt: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const result = await db.insert(socialMediaPosts).values({
          userId: ctx.user!.id,
          title: input.title,
          content: input.content,
          imageUrl: input.imageUrl,
          videoUrl: input.videoUrl,
          platforms: JSON.stringify(input.platforms),
          caption: input.caption,
          hashtags: input.hashtags ? JSON.stringify(input.hashtags) : null,
          scheduledAt: input.scheduledAt,
          status: input.scheduledAt ? "scheduled" : "draft",
        });

        console.log(`[Marketing] Post created: ${result[0]}`);

        return {
          success: true,
          postId: result[0],
          message: "Post created successfully",
        };
      } catch (error) {
        console.error("[Marketing] Error creating post:", error);
        throw error;
      }
    }),

  /**
   * Get user's posts with pagination
   */
  getPosts: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        status: z
          .enum(["draft", "scheduled", "published", "failed"])
          .optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const offset = (input.page - 1) * input.limit;

        let query: any = db
          .select()
          .from(socialMediaPosts)
          .where(eq(socialMediaPosts.userId, ctx.user!.id));

        if (input.status) {
          query = query.where(eq(socialMediaPosts.status, input.status));
        }

        const posts = await query
          .orderBy(desc(socialMediaPosts.createdAt))
          .limit(input.limit)
          .offset(offset);

        const countResult = await (input.status
          ? db
              .select({ count: count() })
              .from(socialMediaPosts)
              .where(
                and(
                  eq(socialMediaPosts.userId, ctx.user!.id),
                  eq(socialMediaPosts.status, input.status)
                )
              )
          : db
              .select({ count: count() })
              .from(socialMediaPosts)
              .where(eq(socialMediaPosts.userId, ctx.user!.id)));

        return {
          posts: posts.map((p: any) => ({
            ...p,
            platforms: JSON.parse(p.platforms || "[]"),
            hashtags: p.hashtags ? JSON.parse(p.hashtags) : [],
          })),
          total: countResult[0]?.count || 0,
          page: input.page,
          limit: input.limit,
        };
      } catch (error) {
        console.error("[Marketing] Error fetching posts:", error);
        throw error;
      }
    }),

  /**
   * Publish post immediately
   */
  publishPost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Verify post ownership
        const post = await db
          .select()
          .from(socialMediaPosts)
          .where(eq(socialMediaPosts.id, input.postId));

        if (!post.length || post[0].userId !== ctx.user!.id) {
          throw new Error("Post not found or unauthorized");
        }

        // Update post status
        await db
          .update(socialMediaPosts)
          .set({
            status: "published",
            publishedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(socialMediaPosts.id, input.postId));

        // TODO: Integrate with actual social media APIs (Instagram, TikTok, Facebook)
        // For now, just mark as published

        console.log(`[Marketing] Post ${input.postId} published`);

        return { success: true, message: "Post published successfully" };
      } catch (error) {
        console.error("[Marketing] Error publishing post:", error);
        throw error;
      }
    }),

  /**
   * Schedule post for later
   */
  schedulePost: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        scheduledAt: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Verify post ownership
        const post = await db
          .select()
          .from(socialMediaPosts)
          .where(eq(socialMediaPosts.id, input.postId));

        if (!post.length || post[0].userId !== ctx.user!.id) {
          throw new Error("Post not found or unauthorized");
        }

        await db
          .update(socialMediaPosts)
          .set({
            scheduledAt: input.scheduledAt,
            status: "scheduled",
            updatedAt: new Date(),
          })
          .where(eq(socialMediaPosts.id, input.postId));

        console.log(`[Marketing] Post ${input.postId} scheduled`);

        return { success: true, message: "Post scheduled successfully" };
      } catch (error) {
        console.error("[Marketing] Error scheduling post:", error);
        throw error;
      }
    }),

  /**
   * Get post metrics
   */
  getPostMetrics: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Verify post ownership
        const post = await db
          .select()
          .from(socialMediaPosts)
          .where(eq(socialMediaPosts.id, input.postId));

        if (!post.length || post[0].userId !== ctx.user!.id) {
          throw new Error("Post not found or unauthorized");
        }

        const metrics = await db
          .select()
          .from(socialMediaMetrics)
          .where(eq(socialMediaMetrics.postId, input.postId));

        return {
          postId: input.postId,
          platforms: metrics.map((m) => ({
            platform: m.platform,
            likes: m.likes,
            comments: m.comments,
            shares: m.shares,
            views: m.views,
            impressions: m.impressions,
            engagement: m.engagement,
            reachCount: m.reachCount,
          })),
          totalEngagement: metrics.reduce((sum, m) => sum + (m.likes || 0) + (m.comments || 0) + (m.shares || 0), 0),
        };
      } catch (error) {
        console.error("[Marketing] Error fetching metrics:", error);
        throw error;
      }
    }),

  /**
   * Get dashboard analytics
   */
  getAnalytics: protectedProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const startDate = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);

        // Get user's posts
        const userPosts = await db
          .select()
          .from(socialMediaPosts)
          .where(
            and(
              eq(socialMediaPosts.userId, ctx.user!.id),
              gte(socialMediaPosts.createdAt, startDate)
            )
          );

        // Get metrics for those posts
        const postIds = userPosts.map((p) => p.id);
        let allMetrics: any[] = [];

        if (postIds.length > 0) {
          allMetrics = await db
            .select()
            .from(socialMediaMetrics)
            .where(
              and(
                eq(socialMediaMetrics.postId, postIds[0]),
                gte(socialMediaMetrics.createdAt, startDate)
              )
            );

          // Fetch metrics for all posts
          for (const postId of postIds.slice(1)) {
            const metrics = await db
              .select()
              .from(socialMediaMetrics)
              .where(eq(socialMediaMetrics.postId, postId));
            allMetrics = [...allMetrics, ...metrics];
          }
        }

        // Aggregate by platform
        const byPlatform = {
          instagram: {
            likes: 0,
            comments: 0,
            shares: 0,
            views: 0,
            impressions: 0,
            engagement: 0,
            reachCount: 0,
          },
          tiktok: {
            likes: 0,
            comments: 0,
            shares: 0,
            views: 0,
            impressions: 0,
            engagement: 0,
            reachCount: 0,
          },
          facebook: {
            likes: 0,
            comments: 0,
            shares: 0,
            views: 0,
            impressions: 0,
            engagement: 0,
            reachCount: 0,
          },
        };

        allMetrics.forEach((m: any) => {
          if (byPlatform[m.platform as keyof typeof byPlatform]) {
            byPlatform[m.platform as keyof typeof byPlatform].likes += m.likes || 0;
            byPlatform[m.platform as keyof typeof byPlatform].comments += m.comments || 0;
            byPlatform[m.platform as keyof typeof byPlatform].shares += m.shares || 0;
            byPlatform[m.platform as keyof typeof byPlatform].views += m.views || 0;
            byPlatform[m.platform as keyof typeof byPlatform].impressions += m.impressions || 0;
            byPlatform[m.platform as keyof typeof byPlatform].reachCount += m.reachCount || 0;
          }
        });

        return {
          totalPosts: userPosts.length,
          publishedPosts: userPosts.filter((p) => p.status === "published").length,
          scheduledPosts: userPosts.filter((p) => p.status === "scheduled").length,
          draftPosts: userPosts.filter((p) => p.status === "draft").length,
          byPlatform,
          totalEngagement: allMetrics.reduce((sum, m) => sum + (m.likes || 0) + (m.comments || 0) + (m.shares || 0), 0),
          totalReach: allMetrics.reduce((sum, m) => sum + (m.reachCount || 0), 0),
        };
      } catch (error) {
        console.error("[Marketing] Error fetching analytics:", error);
        throw error;
      }
    }),

  /**
   * Connect social media account
   */
  connectSocialAccount: protectedProcedure
    .input(
      z.object({
        platform: z.enum(["instagram", "tiktok", "facebook"]),
        accountName: z.string().min(1),
        accessToken: z.string().min(1),
        refreshToken: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const result = await db.insert(socialMediaAccounts).values({
          userId: ctx.user!.id,
          platform: input.platform,
          accountName: input.accountName,
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          isConnected: 1,
          connectedAt: new Date(),
        });

        console.log(`[Marketing] ${input.platform} account connected: ${input.accountName}`);

        return {
          success: true,
          accountId: result[0],
          message: `${input.platform} account connected successfully`,
        };
      } catch (error) {
        console.error("[Marketing] Error connecting account:", error);
        throw error;
      }
    }),

  /**
   * Get user's connected social media accounts
   */
  getSocialAccounts: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const accounts = await db
        .select()
        .from(socialMediaAccounts)
        .where(eq(socialMediaAccounts.userId, ctx.user!.id));

      return accounts;
    } catch (error) {
      console.error("[Marketing] Error fetching accounts:", error);
      throw error;
    }
  }),

  /**
   * Delete post
   */
  deletePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Verify post ownership
        const post = await db
          .select()
          .from(socialMediaPosts)
          .where(eq(socialMediaPosts.id, input.postId));

        if (!post.length || post[0].userId !== ctx.user!.id) {
          throw new Error("Post not found or unauthorized");
        }

        // Delete metrics first
        await db
          .delete(socialMediaMetrics)
          .where(eq(socialMediaMetrics.postId, input.postId));

        // Delete post
        await db
          .delete(socialMediaPosts)
          .where(eq(socialMediaPosts.id, input.postId));

        console.log(`[Marketing] Post ${input.postId} deleted`);

        return { success: true, message: "Post deleted successfully" };
      } catch (error) {
        console.error("[Marketing] Error deleting post:", error);
        throw error;
      }
    }),
});
