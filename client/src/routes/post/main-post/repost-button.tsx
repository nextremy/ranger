import { ArrowPathIcon as ArrowPathRoundedSquareIconOutline } from "@heroicons/react/24/outline";
import { ArrowPathIcon as ArrowPathRoundedSquareIconSolid } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import { trpc } from "../../../trpc";

export function RepostButton() {
  const params = useParams();
  const context = trpc.useContext();
  const { data: post } = trpc.post.get.useQuery({ id: params.postId! });
  const { mutate: repost } = trpc.post.repost.useMutation({
    onMutate: () => {
      context.post.get.setData({ id: params.postId! }, (data) => {
        if (!data) return;
        return {
          ...data,
          isRepostedByUser: true,
          repostCount: data.repostCount + 1,
        };
      });
    },
  });
  const { mutate: unrepost } = trpc.post.unrepost.useMutation({
    onMutate: () => {
      context.post.get.setData({ id: params.postId! }, (data) => {
        if (!data) return;
        return {
          ...data,
          isRepostedByUser: false,
          repostCount: data.repostCount - 1,
        };
      });
    },
  });

  if (!post) return null;
  return (
    <button
      className={`grid h-12 w-12 place-items-center rounded-full duration-200 hover:bg-blue-500/10 hover:text-blue-500 ${
        post.isRepostedByUser ? "text-blue-500" : "text-gray-500"
      }`}
      onClick={
        post.isRepostedByUser
          ? () => unrepost({ postId: post.id })
          : () => repost({ postId: post.id })
      }
      title="Repost"
    >
      {post.isRepostedByUser ? (
        <ArrowPathRoundedSquareIconSolid className="h-5 w-5" />
      ) : (
        <ArrowPathRoundedSquareIconOutline className="h-5 w-5" />
      )}
    </button>
  );
}
