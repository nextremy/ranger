import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { trpc } from "../../trpc";

export function StarButton(props: { postId: string }) {
  const context = trpc.useContext();
  const { data: post } = trpc.post.get.useQuery({ id: props.postId });
  const { mutate: star } = trpc.post.star.useMutation({
    onMutate: () => {
      context.post.get.setData({ id: props.postId }, (data) => {
        if (!data) return;
        return {
          ...data,
          isStarredByUser: true,
          starCount: data.starCount + 1,
        };
      });
    },
  });
  const { mutate: unstar } = trpc.post.unstar.useMutation({
    onMutate: () => {
      context.post.get.setData({ id: props.postId }, (data) => {
        if (!data) return;
        return {
          ...data,
          isStarredByUser: false,
          starCount: data.starCount - 1,
        };
      });
    },
  });

  if (!post) return null;
  return (
    <button
      className={`group z-20 flex items-center gap-1 hover:text-yellow-500 ${
        post.isStarredByUser ? "text-yellow-500" : "text-gray-500"
      }`}
      onClick={
        post.isStarredByUser
          ? () => unstar({ postId: post.id })
          : () => star({ postId: post.id })
      }
      title="Star"
    >
      <div className="grid h-12 w-12 place-items-center rounded-full duration-150 group-hover:bg-yellow-500/10">
        {post.isStarredByUser ? (
          <StarIconSolid className="h-5 w-5" />
        ) : (
          <StarIconOutline className="h-5 w-5" />
        )}
      </div>
      {post.starCount}
    </button>
  );
}
