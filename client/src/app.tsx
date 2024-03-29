import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthRoute } from "./routes/auth";
import { FollowersRoute } from "./routes/followers";
import { FollowingRoute } from "./routes/following";
import { HomeRoute } from "./routes/home";
import { LoginRoute } from "./routes/login";
import { MainRoute } from "./routes/main";
import { PostRoute } from "./routes/post";
import { ProfileRoute } from "./routes/profile";
import { RegisterRoute } from "./routes/register";
import { RepostsRoute } from "./routes/reposts";
import { SearchRoute } from "./routes/search";
import { SettingsRoute } from "./routes/settings";
import { StarsRoute } from "./routes/stars";
import { trpc } from "./trpc";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:4000",
      headers: () => {
        const token = localStorage.getItem("token");
        if (token === null) return {};
        return { Authorization: `Bearer ${token}` };
      },
    }),
  ],
});

export function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route element={<LoginRoute />} path="login" />
          <Route element={<RegisterRoute />} path="register" />
        </Route>
        <Route element={<MainRoute />}>
          <Route element={<HomeRoute />} index />
          <Route element={<SearchRoute />} path="search" />
          <Route element={<PostRoute />} path="posts/:postId" />
          <Route element={<RepostsRoute />} path="posts/:postId/reposts" />
          <Route element={<StarsRoute />} path="posts/:postId/stars" />
          <Route element={<ProfileRoute />} path="profiles/:username" />
          <Route
            element={<FollowersRoute />}
            path="profiles/:username/followers"
          />
          <Route
            element={<FollowingRoute />}
            path="profiles/:username/following"
          />
          <Route element={<SettingsRoute />} path="settings" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
