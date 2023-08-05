import {
  Cog6ToothIcon as Cog6ToothIconOutline,
  HomeIcon as HomeIconOutline,
} from "@heroicons/react/24/outline";
import {
  Cog6ToothIcon as Cog6ToothIconSolid,
  HomeIcon as HomeIconSolid,
} from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";
import { Profile } from "./profile";

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <>
      <Profile />
      <div className="p-2">
        <Link
          className={`flex h-16 items-center gap-4 rounded-lg px-4 text-lg duration-150 hover:bg-gray-200 ${
            pathname === "/" ? "font-bold" : ""
          }`}
          to="/"
        >
          {pathname === "/" ? (
            <HomeIconSolid className="h-6 w-6" />
          ) : (
            <HomeIconOutline className="h-6 w-6" />
          )}
          Home
        </Link>
        <Link
          className={`flex h-16 items-center gap-4 rounded-lg px-4 text-lg duration-150 hover:bg-gray-200 ${
            pathname === "/settings" ? "font-bold" : ""
          }`}
          to="/settings"
        >
          {pathname === "/settings" ? (
            <Cog6ToothIconSolid className="h-6 w-6" />
          ) : (
            <Cog6ToothIconOutline className="h-6 w-6" />
          )}
          Settings
        </Link>
      </div>
    </>
  );
}
