import { Link } from "react-router-dom";
import { trpc } from "../../trpc";
import { MoreActionsButton } from "./more-actions-button";
import { ReplyButton } from "./reply-button";
import { RepostButton } from "./repost-button";
import { StarButton } from "./star-button";

export function Post(props: { postId: string }) {
  const { data: post } = trpc.post.get.useQuery({ id: props.postId });

  if (!post) return null;
  return (
    <article className="relative cursor-pointer p-2 duration-150 hover:bg-gray-200">
      <Link
        className="absolute bottom-0 left-0 right-0 top-0 z-10"
        to={`/posts/${props.postId}`}
      />
      <div className="mx-2 mt-2">
        <div className="flex gap-1">
          <Link
            className="group z-20 flex gap-1"
            to={`/profiles/${post.author.username}`}
          >
            <p className="font-medium group-hover:underline">
              {post.author.displayName}
            </p>
            <p className="text-gray-600">@{post.author.username}</p>
          </Link>
          <span className="text-gray-600">·</span>
          <p className="z-20 text-gray-600">
            {Intl.DateTimeFormat("en-us", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(post.timestamp))}
          </p>
        </div>
        <p className="z-20">{post.text}</p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <ReplyButton postId={post.id} />
        <RepostButton postId={post.id} />
        <StarButton postId={post.id} />
        <MoreActionsButton postId={post.id} />
      </div>
    </article>
  );
}
