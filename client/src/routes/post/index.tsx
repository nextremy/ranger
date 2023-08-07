import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";
import { trpc } from "../../trpc";

export function PostRoute() {
  const params = useParams();
  const { data: post } = trpc.post.get.useQuery({ id: params.postId! });

  if (!post) return null;
  return (
    <div className="border-b border-gray-300">
      <article className="p-4">
        <Link
          className="group block w-max"
          to={`/profiles/${post.author.username}`}
        >
          <p className="font-medium group-hover:underline">
            {post.author.displayName}
          </p>
          <p className="text-gray-600">@{post.author.username}</p>
        </Link>
        <p className="mt-4 text-lg">{post.text}</p>
        <p className="mt-4 text-gray-600">
          {Intl.DateTimeFormat("en-us", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(post.timestamp))}
        </p>
      </article>
      <div className="mx-4 flex h-14 items-center gap-4 border-t border-gray-300">
        <p>
          <span className="font-semibold">{post.repostCount}</span> reposts
        </p>
        <p>
          <span className="font-semibold">{post.starCount}</span> stars
        </p>
      </div>
      <div className="mx-4 flex h-16 items-center justify-between border-t border-gray-300">
        <button
          className="grid h-12 w-12 place-items-center rounded-full text-gray-600 duration-200 hover:bg-green-600/10 hover:text-green-600"
          title="Reply"
        >
          <ChatBubbleLeftIcon className="h-5 w-5" />
        </button>
        <button
          className="grid h-12 w-12 place-items-center rounded-full text-gray-600 duration-200 hover:bg-blue-600/10 hover:text-blue-600"
          title="Repost"
        >
          <ArrowPathRoundedSquareIcon className="h-5 w-5" />
        </button>
        <button
          className="grid h-12 w-12 place-items-center rounded-full text-gray-600 duration-200 hover:bg-yellow-600/10 hover:text-yellow-600"
          title="Star"
        >
          <StarIcon className="h-5 w-5" />
        </button>
        <button
          className="grid h-12 w-12 place-items-center rounded-full text-gray-600 duration-200 hover:bg-green-600/10 hover:text-green-600"
          title="Share"
        >
          <ShareIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
