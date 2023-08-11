import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function MainRoute() {
  return (
    <div className="mx-auto flex h-screen md:max-w-4xl">
      <div className="hidden w-full max-w-xs md:block">
        <Sidebar />
      </div>
      <div className="relative h-full grow overflow-y-scroll border-x border-gray-300">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}
