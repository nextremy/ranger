import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import "dotenv/config";
import { createContext } from "./context";
import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

const appRouter = router({
  user: userRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
});

server.listen(4000);
