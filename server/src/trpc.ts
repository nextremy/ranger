import { TRPCError, initTRPC } from "@trpc/server";
import { createContext } from "./context";

const trpc = initTRPC.context<typeof createContext>().create();

const authenticationMiddleware = trpc.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { session: ctx.session, db: ctx.db } });
});

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
export const protectedProcedure = trpc.procedure.use(authenticationMiddleware);
