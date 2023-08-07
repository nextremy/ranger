import { UserPlusIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function FollowButton() {
  const session = useSession();
  const params = useParams();
  const context = trpc.useContext();
  const { data: user } = trpc.user.get.useQuery({ username: params.username! });
  const { mutate: follow } = trpc.user.follow.useMutation({
    onMutate: () => {
      if (!session) return;
      context.user.get.setData({ username: session.username }, (data) => {
        if (!data) return;
        return { ...data, followingCount: data.followingCount + 1 };
      });
      context.user.get.setData({ username: params.username! }, (data) => {
        if (!data) return;
        return { ...data, isFollowedByUser: true };
      });
    },
  });

  if (!user || user.id === session?.userId || user.isFollowedByUser) {
    return null;
  }
  return (
    <button
      className="flex h-12 items-center gap-2 rounded-full bg-green-700 px-6 font-bold text-gray-100 duration-200 hover:bg-green-800"
      onClick={() => follow({ userId: user.id })}
    >
      <UserPlusIcon className="h-5 w-5" />
      Follow
    </button>
  );
}
