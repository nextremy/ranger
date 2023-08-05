import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function Profile() {
  const session = useSession();
  const { data: user } = trpc.user.get.useQuery(
    { userId: session?.userId ?? "" },
    { enabled: session !== null },
  );

  if (!session) return null;
  if (!user) return null;
  return (
    <div className="p-4">
      <p className="text-lg font-medium leading-tight">{user.displayName}</p>
      <p className="text-gray-600">@{user.username}</p>
      <div className="mt-2 flex gap-2">
        <p>
          <span className="font-semibold">{user.followerCount}</span>{" "}
          <span className="text-gray-600">followers</span>
        </p>
        <p>
          <span className="font-semibold">{user.followingCount}</span>{" "}
          <span className="text-gray-600">following</span>
        </p>
      </div>
    </div>
  );
}
