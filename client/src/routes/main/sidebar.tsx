import { Cog6ToothIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <div className="p-2">
      <Link
        className="flex h-16 items-center gap-4 rounded-lg px-4 text-lg duration-150 hover:bg-gray-200"
        to="/"
      >
        <HomeIcon className="h-6 w-6" />
        Home
      </Link>
      <Link
        className="flex h-16 items-center gap-4 rounded-lg px-4 text-lg duration-150 hover:bg-gray-200"
        to="/settings"
      >
        <Cog6ToothIcon className="h-6 w-6" />
        Settings
      </Link>
    </div>
  );
}
