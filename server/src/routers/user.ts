import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import z from "zod";
import { env } from "../env";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  create: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .query(async ({ input, ctx }) => {
      const usernameTaken = Boolean(
        await ctx.db.user.findUnique({ where: { username: input.username } })
      );
      if (usernameTaken) {
        throw new TRPCError({ code: "CONFLICT" });
      }

      const passwordHash = await argon2.hash(input.password);
      await ctx.db.user.create({
        data: { username: input.username, passwordHash },
      });
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(1)
          .max(12)
          .regex(/^[a-z0-9_]*/),
        password: z.string().min(8).max(256),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { username: input.username },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const passwordsMatch = await argon2.verify(
        user.passwordHash,
        input.password
      );
      if (!passwordsMatch) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET);
      return token;
    }),
});
