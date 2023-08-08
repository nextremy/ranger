import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import { trpc } from "../../../trpc";

export function ProfileInfo() {
  const params = useParams();
  const { data: post } = trpc.post.get.useQuery({ id: params.postId! });

  if (!post) return null;
  return (
    <Link
      className="group flex w-max gap-2"
      to={`/profiles/${post.author.username}`}
    >
      <UserCircleIcon className="-ml-2 h-12 w-12 text-gray-300" />
      <div>
        <p className="font-medium group-hover:underline">
          {post.author.displayName}
        </p>
        <p className="text-gray-600">@{post.author.username}</p>
      </div>
    </Link>
  );
}
