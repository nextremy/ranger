import { useParams } from "react-router-dom";
import { trpc } from "../../trpc";

export function ProfileRoute() {
  const params = useParams();
  const { data: user } = trpc.user.get.useQuery({ username: params.username! });

  if (!user) return null;
  return (
    <div className="p-4">
      <p className="text-lg font-medium leading-tight">{user.displayName}</p>
      <p className="text-gray-600">@{user.username}</p>
    </div>
  );
}
