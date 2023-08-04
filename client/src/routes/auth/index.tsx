import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../../hooks/use-session";

export function AuthRoute() {
  const session = useSession();

  if (session) {
    return <Navigate to="/" />;
  }
  return (
    <div className="grid h-screen place-items-center p-2">
      <div className="w-full max-w-sm rounded-xl border border-gray-300 p-4">
        <Outlet />
      </div>
    </div>
  );
}
