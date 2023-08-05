import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import z from "zod";
import { env } from "../env";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
  get: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        select: {
          id: true,
          username: true,
          displayName: true,
          _count: { select: { followers: true, following: true } },
        },
        where: { id: input.userId },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
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
});
