import { ArrowPathRoundedSquareIcon as ArrowPathRoundedSquareIconOutline } from "@heroicons/react/24/outline";
import { ArrowPathRoundedSquareIcon as ArrowPathRoundedSquareIconSolid } from "@heroicons/react/24/solid";
import { trpc } from "../../trpc";

export function RepostButton(props: { postId: string }) {
  const context = trpc.useContext();
  const { data: post } = trpc.post.get.useQuery({ id: props.postId });
  const { mutate: repost } = trpc.post.repost.useMutation({
    onMutate: () => {
      context.post.get.setData({ id: props.postId }, (data) => {
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
      context.post.get.setData({ id: props.postId }, (data) => {
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
      className={`group z-20 flex items-center gap-1 pr-4 hover:text-blue-500 ${
        post.isRepostedByUser ? "text-blue-500" : "text-gray-500"
      }`}
      onClick={
        post.isRepostedByUser
          ? () => unrepost({ postId: post.id })
          : () => repost({ postId: post.id })
      }
      title="Repost"
    >
      <div className="grid h-12 w-12 place-items-center rounded-full duration-150 group-hover:bg-blue-500/10">
        {post.isRepostedByUser ? (
          <ArrowPathRoundedSquareIconOutline className="h-5 w-5" />
        ) : (
          <ArrowPathRoundedSquareIconSolid className="h-5 w-5" />
        )}
      </div>
      {post.repostCount}
    </button>
  );
}
