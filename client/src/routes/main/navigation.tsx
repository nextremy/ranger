import {
  Cog6ToothIcon as Cog6ToothIconOutline,
  HomeIcon as HomeIconOutline,
  UserIcon as UserIconOutline,
} from "@heroicons/react/24/outline";
import {
  Cog6ToothIcon as Cog6ToothIconSolid,
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../../hooks/use-session";

export function Navigation() {
  const { pathname } = useLocation();
  const session = useSession();

  return (
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
      {session && (
        <Link
          className={`flex h-16 items-center gap-4 rounded-lg px-4 text-lg duration-150 hover:bg-gray-200 ${
            pathname === `/profiles/${session.username}` ? "font-bold" : ""
          }`}
          to={`/profiles/${session.username}`}
        >
          {pathname === `/profiles/${session.username}` ? (
            <UserIconSolid className="h-6 w-6" />
          ) : (
            <UserIconOutline className="h-6 w-6" />
          )}
          Profile
        </Link>
      )}
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
  );
}
