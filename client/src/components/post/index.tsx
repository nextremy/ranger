import { ArrowPathRoundedSquareIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { trpc } from "../../trpc";
import { MoreActionsButton } from "./more-actions-button";
import { ReplyButton } from "./reply-button";
import { RepostButton } from "./repost-button";
import { StarButton } from "./star-button";
import { toShortTimestamp } from "./to-short-timestamp";

type Props = {
  postId: string;
  repostedByUserDisplayName?: string;
};

export function Post(props: Props) {
  const { data: post } = trpc.post.get.useQuery({ id: props.postId });

  if (!post) return null;
  return (
    <article className="relative flex cursor-pointer flex-col p-0 duration-150 hover:bg-gray-200">
      <Link
        className="absolute bottom-0 left-0 right-0 top-0 z-10"
        title="Post"
        to={`/posts/${props.postId}`}
      />
      <div className="flex grow">
        <div className="grow">
          <div className="px-5 pt-4">
            {props.repostedByUserDisplayName ? (
              <p className="z-20 flex items-center gap-1 pb-1 text-sm font-medium text-gray-600">
                <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                Reposted by {props.repostedByUserDisplayName}
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
            <p className="z-20 mt-1">{post.text}</p>
          </div>
        </div>
        <div className="p-2">
          <MoreActionsButton postId={post.id} />
        </div>
      </div>
      <div className="flex items-center justify-between p-2">
        <ReplyButton postId={post.id} />
        <RepostButton postId={post.id} />
        <StarButton postId={post.id} />
      </div>
    </article>
  );
}
