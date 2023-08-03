import { BrowserRouter, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<div />} path="/" />
      </Routes>
    </BrowserRouter>
  );
}
