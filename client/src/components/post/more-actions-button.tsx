import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { trpc } from "../../trpc";

export function MoreActionsButton(props: { postId: string }) {
  const { data: post } = trpc.post.get.useQuery({ id: props.postId });

  if (!post) return null;
  return (
    <button
      className="z-20 grid h-12 w-12 place-items-center rounded-full text-gray-500 duration-150 hover:bg-green-500/10 hover:text-green-500"
      title="More actions"
    >
      <EllipsisHorizontalIcon className="h-5 w-5" />
    </button>
  );
}
