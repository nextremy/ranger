import { Link, useParams } from "react-router-dom";
import { trpc } from "../../../trpc";

export function ProfileInfo() {
  const params = useParams();
  const { data: post } = trpc.post.get.useQuery({ id: params.postId! });

  if (!post) return null;
  return (
    <Link
      className="group block w-max"
      to={`/profiles/${post.author.username}`}
    >
      <p className="font-medium group-hover:underline">
        {post.author.displayName}
      </p>
      <p className="text-gray-600">@{post.author.username}</p>
    </Link>
  );
}
