import { TRPCError } from "@trpc/server";
import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        select: {
          timestamp: true,
          text: true,
          author: { select: { id: true, username: true, displayName: true } },
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
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        timestamp: post.timestamp,
        text: post.text,
        author: post.author,
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
        text: z.string().min(1).min(300),
        replyingToPostId: z.optional(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.post.create({
        data: {
          text: input.text,
          authorId: ctx.session.userId,
          replyingToId: input.replyingToPostId,
        },
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

      await ctx.db.post.delete({ where: { id: input.postId } });
    }),
  repost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.repost.create({
        data: { userId: ctx.session.userId, postId: input.postId },
      });
    }),
  unrepost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.repost.delete({
        where: {
          userId_postId: { userId: ctx.session.userId, postId: input.postId },
        },
      });
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
