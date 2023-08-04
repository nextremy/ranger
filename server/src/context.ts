import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import z from "zod";
import { prisma } from "../prisma/client";
import { env } from "./env";

export function createContext({ req }: CreateHTTPContextOptions) {
  const session = getSession(req);
  return { session, db: prisma };
}

function getSession(req: IncomingMessage) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === undefined) return null;
  const { userId } = z
    .object({ userId: z.string() })
    .parse(jwt.verify(token, env.JWT_SECRET));
  return { token, userId };
}
