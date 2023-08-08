import { CheckIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function UnfollowButton() {
  const session = useSession();
  const params = useParams();
  const context = trpc.useContext();
  const { data: user } = trpc.user.get.useQuery({ username: params.username! });
  const { mutate: unfollow } = trpc.user.unfollow.useMutation({
    onMutate: () => {
      if (!session) return;
      context.user.get.setData({ username: session.username }, (data) => {
        if (!data) return;
        return { ...data, followingCount: data.followingCount - 1 };
      });
      context.user.get.setData({ username: params.username! }, (data) => {
        if (!data) return;
        return {
          ...data,
          isFollowedByUser: false,
          followerCount: data.followerCount - 1,
        };
      });
    },
  });

  if (!user || user.id === session?.userId || !user.isFollowedByUser) {
    return null;
  }
  return (
    <button
      className="flex h-12 items-center gap-2 rounded-full bg-gray-200 px-6 font-bold duration-200 hover:bg-gray-300"
      onClick={() => unfollow({ userId: user.id })}
    >
      <CheckIcon className="h-5 w-5" />
      Following
    </button>
  );
}
