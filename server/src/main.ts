import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import "dotenv/config";
import { createContext } from "./context";
import { router } from "./trpc";

const appRouter = router({});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
});

server.listen(4000);
