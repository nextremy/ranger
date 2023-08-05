import { useLocation } from "react-router-dom";
import { SidebarButton } from "./sidebar-button";

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-16 items-center gap-2 px-2 md:px-4">
      <div className="md:hidden">
        <SidebarButton />
      </div>
      <h1 className="text-lg font-bold">
        {pathname === "/" ? "Home" : ""}
        {pathname.startsWith("/posts") ? "Post" : ""}
        {pathname.startsWith("/users") ? "Profile" : ""}
        {pathname === "/settings" ? "Settings" : ""}
      </h1>
    </div>
  );
}
