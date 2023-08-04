import { initTRPC } from "@trpc/server";
import { createContext } from "./context";

const trpc = initTRPC.context<typeof createContext>().create();

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
