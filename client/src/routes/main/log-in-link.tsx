import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useSession } from "../../hooks/use-session";

export function LogInLink() {
  const session = useSession();

  if (session) return null;
  return (
    <Link
      className="flex h-12 items-center justify-center gap-2 rounded-full bg-green-700 font-bold text-gray-100 duration-150 hover:bg-green-800"
      to="/login"
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      Log in
    </Link>
  );
}
