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
        cursor: z.optional(
          z.object({
            isRepost: z.boolean(),
            userId: z.string(),
            postId: z.string(),
          })
        ),
        includeReplies: z.boolean(),
      })
    )
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.metaPost.findMany({
        select: { isRepost: true, userId: true, postId: true },
        where: input.includeReplies
          ? { user: { username: input.username }, post: { deleted: false } }
          : {
              user: { username: input.username },
              post: { deleted: false, replyingTo: null },
            },
        take: 25,
        orderBy: { timestamp: "desc" },
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor
          ? { isRepost_userId_postId: input.cursor }
          : undefined,
      });

      return post;
    }),
});
