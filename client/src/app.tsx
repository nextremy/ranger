import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainRoute } from "./routes/main";
import { trpc } from "./trpc";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:4000",
      headers: async () => {
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
        <Route element={<MainRoute />}>
          <Route element={<div />} index />
          <Route element={<div />} path="settings" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
