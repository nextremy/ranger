import { useLocation } from "react-router-dom";
import { BackButton } from "./back-button";
import { SidebarButton } from "./sidebar-button";

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <>
      <div
        className={`absolute inset-0 z-50 flex h-16 items-center gap-2 border-b border-gray-300 bg-gray-100 px-2 ${
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
          {(() => {
            if (pathname === "/") {
              return "Home";
            }
            if (pathname.startsWith("/posts")) {
              if (pathname.endsWith("/reposts")) {
                return "Reposts";
              }
              if (pathname.endsWith("/stars")) {
                return "Stars";
              }
              return "Post";
            }
            if (pathname === "/search") {
              return "Search";
            }
            if (pathname.startsWith("/profiles")) {
              if (pathname.endsWith("/followers")) {
                return "Followers";
              }
              if (pathname.endsWith("/following")) {
                return "Following";
              }
              return "Profile";
            }
            if (pathname === "/settings") {
              return "Settings";
            }
            return null;
          })()}
        </h1>
      </div>
      <div className="h-16" />
    </>
  );
}
