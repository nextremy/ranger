import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import { trpc } from "../../../trpc";

export function StarButton() {
  const params = useParams();
  const context = trpc.useContext();
  const { data: post } = trpc.post.get.useQuery({ id: params.postId! });
  const { mutate: star } = trpc.post.star.useMutation({
    onMutate: () => {
      context.post.get.setData({ id: params.postId! }, (data) => {
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
      context.post.get.setData({ id: params.postId! }, (data) => {
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
      className={`grid h-12 w-12 place-items-center rounded-full duration-200 hover:bg-yellow-500/10 hover:text-yellow-500 ${
        post.isStarredByUser ? "text-yellow-500" : "text-gray-500"
      }`}
      onClick={
        post.isStarredByUser
          ? () => unstar({ postId: post.id })
          : () => star({ postId: post.id })
      }
      title="Star"
    >
      {post.isStarredByUser ? (
        <StarIconSolid className="h-5 w-5" />
      ) : (
        <StarIconOutline className="h-5 w-5" />
      )}
    </button>
  );
}
