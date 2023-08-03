import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainRoute } from "./routes/main";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainRoute />}>
          <Route element={<div />} index />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
