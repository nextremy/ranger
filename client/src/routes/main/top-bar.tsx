import { useLocation } from "react-router-dom";
import { DrawerButton } from "./drawer-button";

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-16 items-center gap-2 px-2">
      <DrawerButton />
      <h1 className="text-lg font-medium">
        {pathname === "/" ? "Home" : ""}
        {pathname.startsWith("/posts") ? "Post" : ""}
        {pathname.startsWith("/@") ? "Profile" : ""}
      </h1>
    </div>
  );
}
