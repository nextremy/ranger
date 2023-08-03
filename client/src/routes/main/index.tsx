import { Outlet } from "react-router-dom";
import { TopBar } from "./top-bar";

export function MainRoute() {
  return (
    <div className="h-screen">
      <TopBar />
      <Outlet />
    </div>
  );
}
