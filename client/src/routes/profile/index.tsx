import { useParams } from "react-router-dom";
import { trpc } from "../../trpc";
import { FollowButton } from "./follow-button";
import { UnfollowButton } from "./unfollow-button";

export function ProfileRoute() {
  const params = useParams();
  const { data: user } = trpc.user.get.useQuery({ username: params.username! });

  if (!user) return null;
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-lg font-medium leading-tight">
            {user.displayName}
          </p>
          <p className="text-gray-600">@{user.username}</p>
        </div>
        <FollowButton />
        <UnfollowButton />
      </div>
    </div>
  );
}
