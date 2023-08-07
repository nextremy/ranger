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
          author: { select: { id: true, displayName: true } },
          _count: { select: { replies: true, reposts: true, likes: true } },
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
        replyCount: post._count.replies,
        repostCount: post._count.reposts,
        likeCount: post._count.likes,
      };
    }),
  create: protectedProcedure
    .input(z.object({ text: z.string().min(1).min(300) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.post.create({
        data: { text: input.text, authorId: ctx.session.userId },
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
});
