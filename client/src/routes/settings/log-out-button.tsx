import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

export function LogOutButton() {
  const navigate = useNavigate();

  return (
    <button
      className="flex h-12 items-center justify-center gap-2 rounded-full bg-red-700 px-6 font-bold text-gray-100 duration-150 hover:bg-red-800"
      onClick={() => {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/login");
      }}
    >
      <ArrowLeftOnRectangleIcon className="h-5 w-5" />
      Log out
    </button>
  );
}
