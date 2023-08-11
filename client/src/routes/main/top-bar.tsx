import { useLocation } from "react-router-dom";
import { BackButton } from "./back-button";
import { SidebarButton } from "./sidebar-button";

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <>
      <div
        className={`fixed z-50 flex h-16 w-full items-center gap-2 border-b border-gray-300 bg-gray-100 px-2 ${
          pathname === "/" ? "md:px-4" : ""
        }`}
      >
        {pathname === "/" ? (
          <div className="md:hidden">
            <SidebarButton />
          </div>
        ) : (
          <BackButton />
        )}
        <h1 className="text-lg font-bold">
          {pathname === "/" ? "Home" : ""}
          {pathname.startsWith("/posts") ? "Post" : ""}
          {pathname.startsWith("/search") ? "Search" : ""}
          {pathname.startsWith("/profiles") ? "Profile" : ""}
          {pathname === "/settings" ? "Settings" : ""}
        </h1>
      </div>
      <div className="h-16" />
    </>
  );
}
