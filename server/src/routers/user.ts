import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import z from "zod";
import { env } from "../env";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { username: input.username },
      });
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const passwordsMatch = await argon2.verify(
        user.passwordHash,
        input.password
      );
      if (!passwordsMatch) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET);
      return { token, userId: user.id, username: user.username };
    }),
  get: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        select: {
          id: true,
          username: true,
          displayName: true,
          description: true,
          followers: { where: { id: ctx.session?.userId } },
          following: { where: { id: ctx.session?.userId } },
          _count: { select: { followers: true, following: true } },
        },
        where: { username: input.username },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        description: user.description,
        isFollowedByUser: user.followers.length === 1,
        isFollowingUser: user.following.length === 1,
        followerCount: user._count.followers,
        followingCount: user._count.following,
      };
    }),
  create: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(1)
          .max(12)
          .regex(/^[a-z0-9_]*/),
        password: z.string().min(8).max(256),
        displayName: z.string().min(1).max(16),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const usernameTaken = Boolean(
        await ctx.db.user.findUnique({ where: { username: input.username } })
      );
      if (usernameTaken) {
        throw new TRPCError({ code: "CONFLICT" });
      }

      const passwordHash = await argon2.hash(input.password);
      await ctx.db.user.create({
        data: {
          username: input.username,
          passwordHash,
          displayName: input.displayName,
        },
      });
    }),
  editProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).max(16),
        description: z.string().max(300),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.update({
        data: {
          displayName: input.displayName,
          description: input.description,
        },
        where: { id: ctx.session.userId },
      });
    }),
  follow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.update({
        data: { following: { connect: { id: input.userId } } },
        where: { id: ctx.session.userId },
      });
    }),
  unfollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.update({
        data: { following: { disconnect: { id: input.userId } } },
        where: { id: ctx.session.userId },
      });
    }),
  listPosts: publicProcedure
    .input(
      z.object({
        username: z.string(),
        cursor: z.optional(z.string()),
        includeReplies: z.boolean(),
      })
    )
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        select: {
          id: true,
          timestamp: true,
          text: true,
          author: { select: { id: true, username: true, displayName: true } },
          replyingTo: {
            select: {
              id: true,
              timestamp: true,
              text: true,
              author: {
                select: { id: true, username: true, displayName: true },
              },
              reposts: { where: { userId: ctx.session?.userId } },
              stars: { where: { userId: ctx.session?.userId } },
              _count: { select: { replies: true, reposts: true, stars: true } },
            },
          },
          reposts: { where: { userId: ctx.session?.userId } },
          stars: { where: { userId: ctx.session?.userId } },
          _count: { select: { replies: true, reposts: true, stars: true } },
        },
        where: {
          author: { username: input.username },
          replyingToId: input.includeReplies ? undefined : null,
        },
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
              replyCount: post._count.replies,
              repostCount: post._count.reposts,
              starCount: post._count.stars,
            }
          : null,
        isRepostedByUser: post.reposts.length === 1,
        isStarredByUser: post.stars.length === 1,
        replyCount: post._count.replies,
        repostCount: post._count.reposts,
        starCount: post._count.stars,
      }));
    }),
});
