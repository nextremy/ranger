import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthRoute } from "./routes/auth";
import { LoginRoute } from "./routes/login";
import { MainRoute } from "./routes/main";
import { RegisterRoute } from "./routes/register";
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
          <Route element={<div />} index />
          <Route element={<div />} path="users/:userId" />
          <Route element={<div />} path="settings" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
