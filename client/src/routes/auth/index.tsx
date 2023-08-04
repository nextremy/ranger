import { Outlet } from "react-router-dom";

export function AuthRoute() {
  return (
    <div className="grid h-screen place-items-center p-2">
      <div className="w-full max-w-sm rounded-xl border border-gray-300 p-4">
        <Outlet />
      </div>
    </div>
  );
}
