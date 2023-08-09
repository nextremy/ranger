import { ArrowPathRoundedSquareIcon } from "@heroicons/react/20/solid";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { trpc } from "../../trpc";
import { MoreActionsButton } from "./more-actions-button";
import { ReplyButton } from "./reply-button";
import { RepostButton } from "./repost-button";
import { StarButton } from "./star-button";
import { toShortTimestamp } from "./to-short-timestamp";

export function Post(props: {
  postId: string;
  repostedByUser?: { username: string; displayName: string };
}) {
  const { data: post } = trpc.post.get.useQuery({ id: props.postId });

  if (!post) return null;
  return (
    <article className="relative flex cursor-pointer p-2 duration-150 hover:bg-gray-200">
      <Link
        className="absolute bottom-0 left-0 right-0 top-0 z-10"
        to={`/posts/${props.postId}`}
      />
      <Link className="z-20" to={`/profiles/${post.author.username}`}>
        <UserCircleIcon
          className={`h-12 w-12 text-gray-300 ${
            props.repostedByUser ? "mt-6" : "mt-2"
          }`}
        />
      </Link>
      <div className="grow">
        <div className="mx-2 mt-2">
          {props.repostedByUser ? (
            <p className="z-20 flex items-center gap-1 text-sm font-medium text-gray-600 hover:underline">
              <ArrowPathRoundedSquareIcon className="h-4 w-4" />
              Reposted by {props.repostedByUser.displayName}
            </p>
          ) : null}
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
              {toShortTimestamp(post.timestamp)}
            </p>
          </div>
          <p className="z-20">{post.text}</p>
        </div>
        <div className="flex items-center justify-between">
          <ReplyButton postId={post.id} />
          <RepostButton postId={post.id} />
          <StarButton postId={post.id} />
          <MoreActionsButton postId={post.id} />
        </div>
      </div>
    </article>
  );
}
