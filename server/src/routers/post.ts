import { TRPCError } from "@trpc/server";
import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        select: {
          id: true,
          timestamp: true,
          text: true,
          deleted: true,
          author: { select: { id: true, username: true, displayName: true } },
          replyingTo: {
            select: {
              id: true,
              timestamp: true,
              text: true,
              deleted: true,
              author: {
                select: { id: true, username: true, displayName: true },
              },
              reposts: {
                select: { userId: true },
                where: { userId: ctx.session?.userId },
              },
              stars: {
                select: { userId: true },
                where: { userId: ctx.session?.userId },
              },
              _count: { select: { replies: true, reposts: true, stars: true } },
            },
          },
          reposts: {
            select: { userId: true },
            where: { userId: ctx.session?.userId },
          },
          stars: {
            select: { userId: true },
            where: { userId: ctx.session?.userId },
          },
          _count: { select: { replies: true, reposts: true, stars: true } },
        },
        where: { id: input.id },
      });
      if (!post || post.deleted) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        id: post.id,
        timestamp: post.timestamp,
        text: post.text,
        author: post.author,
        replyingTo: post.replyingTo
          ? {
              id: post.replyingTo.id,
              timestamp: post.replyingTo.timestamp,
              text: post.replyingTo.text,
              author: post.replyingTo.author,
              isRepostedByUser: post.replyingTo.reposts.length === 1,
              isStarredByUser: post.replyingTo.stars.length === 1,
              replyCount: post.replyingTo._count.replies,
              repostCount: post.replyingTo._count.reposts,
              starCount: post.replyingTo._count.stars,
            }
          : null,
        isRepostedByUser: post.reposts.length === 1,
        isStarredByUser: post.stars.length === 1,
        replyCount: post._count.replies,
        repostCount: post._count.reposts,
        starCount: post._count.stars,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1).max(300),
        replyingToPostId: z.optional(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.$transaction(async (db) => {
        const post = await db.post.create({
          data: {
            text: input.text,
            authorId: ctx.session.userId,
            replyingToId: input.replyingToPostId,
          },
        });
        await db.metaPost.create({
          data: {
            isRepost: false,
            userId: ctx.session.userId,
            postId: post.id,
          },
        });
      });
    }),
  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (post.authorId !== ctx.session.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.db.post.update({
        data: { deleted: true },
        where: { id: input.postId },
      });
    }),
  listReplies: publicProcedure
    .input(z.object({ postId: z.string(), cursor: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        select: {
          id: true,
          timestamp: true,
          text: true,
          deleted: true,
          author: { select: { id: true, username: true, displayName: true } },
          replyingTo: {
            select: {
              id: true,
              timestamp: true,
              text: true,
              deleted: true,
              author: {
                select: { id: true, username: true, displayName: true },
              },
              reposts: {
                select: { userId: true },
                where: { userId: ctx.session?.userId },
              },
              stars: {
                select: { userId: true },
                where: { userId: ctx.session?.userId },
              },
              _count: { select: { replies: true, reposts: true, stars: true } },
            },
          },
          reposts: {
            select: { userId: true },
            where: { userId: ctx.session?.userId },
          },
          stars: {
            select: { userId: true },
            where: { userId: ctx.session?.userId },
          },
          _count: { select: { replies: true, reposts: true, stars: true } },
        },
        where: { replyingToId: input.postId },
        take: 25,
        orderBy: { timestamp: "desc" },
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      return posts.map((post) => ({
        id: post.id,
        timestamp: post.timestamp,
        text: post.text,
        author: post.author,
        replyingTo: post.replyingTo
          ? {
              id: post.replyingTo.id,
              timestamp: post.replyingTo.timestamp,
              text: post.replyingTo.text,
              author: post.replyingTo.author,
              isRepostedByUser: post.replyingTo.reposts.length === 1,
              isStarredByUser: post.replyingTo.stars.length === 1,
              replyCount: post.replyingTo._count.replies,
              repostCount: post.replyingTo._count.reposts,
              starCount: post.replyingTo._count.stars,
            }
          : null,
        isRepostedByUser: post.reposts.length === 1,
        isStarredByUser: post.stars.length === 1,
        replyCount: post._count.replies,
        repostCount: post._count.reposts,
        starCount: post._count.stars,
      }));
    }),
  listFeed: publicProcedure
    .input(z.object({ cursor: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        select: {
          id: true,
          timestamp: true,
          text: true,
          deleted: true,
          author: { select: { id: true, username: true, displayName: true } },
          replyingTo: {
            select: {
              id: true,
              timestamp: true,
              text: true,
              deleted: true,
              author: {
                select: { id: true, username: true, displayName: true },
              },
              reposts: {
                select: { userId: true },
                where: { userId: ctx.session?.userId },
              },
              stars: {
                select: { userId: true },
                where: { userId: ctx.session?.userId },
              },
              _count: { select: { replies: true, reposts: true, stars: true } },
            },
          },
          reposts: {
            select: { userId: true },
            where: { userId: ctx.session?.userId },
          },
          stars: {
            select: { userId: true },
            where: { userId: ctx.session?.userId },
          },
          _count: { select: { replies: true, reposts: true, stars: true } },
        },
        where: {
          deleted: false,
          author: ctx.session
            ? { followers: { some: { id: ctx.session.userId } } }
            : undefined,
          replyingTo: null,
        },
        take: 25,
        orderBy: { timestamp: "desc" },
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      return posts;
    }),
  repost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.$transaction([
        ctx.db.metaPost.create({
          data: {
            isRepost: true,
            userId: ctx.session.userId,
            postId: input.postId,
          },
        }),
        ctx.db.repost.create({
          data: { userId: ctx.session.userId, postId: input.postId },
        }),
      ]);
    }),
  unrepost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.$transaction([
        ctx.db.metaPost.delete({
          where: {
            isRepost_userId_postId: {
              isRepost: true,
              userId: ctx.session.userId,
              postId: input.postId,
            },
          },
        }),
        ctx.db.repost.delete({
          where: {
            userId_postId: { userId: ctx.session.userId, postId: input.postId },
          },
        }),
      ]);
    }),
  star: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.star.create({
        data: { userId: ctx.session.userId, postId: input.postId },
      });
    }),
  unstar: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.star.delete({
        where: {
          userId_postId: { userId: ctx.session.userId, postId: input.postId },
        },
      });
    }),
});
