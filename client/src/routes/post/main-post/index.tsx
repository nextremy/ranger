import { useParams } from "react-router-dom";
import { Post } from "../../../components/post";
import { trpc } from "../../../trpc";
import { MoreActionsButton } from "./more-actions-button";
import { ProfileInfo } from "./profile-info";
import { ReplyButton } from "./reply-button";
import { RepostButton } from "./repost-button";
import { StarButton } from "./star-button";
import { Stats } from "./stats";

export function MainPost() {
  const params = useParams();
  const { data: post } = trpc.post.get.useQuery({ id: params.postId! });

  if (!post) return null;
  return (
    <div className="divide-y divide-gray-300 border-b border-gray-300">
      {post.replyingTo ? <Post postId={post.replyingTo.id} /> : null}
      <div className="px-4 pt-4">
        <article>
          <div className="flex justify-between">
            <ProfileInfo />
            <MoreActionsButton />
          </div>
          {post.replyingTo ? (
            <p className="pt-2 text-sm text-gray-600">
              Replying to @{post.replyingTo.author.username}
            </p>
          ) : null}
          <p className="py-4 text-lg">{post.text}</p>
          <p className="text-gray-600">
            {Intl.DateTimeFormat("en-us", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(post.timestamp))}
          </p>
          <div className="h-4" />
          <div
            className={`border-t border-gray-300 ${
              post.repostCount === 0 && post.starCount === 0 ? "hidden" : ""
            }`}
          >
            <Stats />
          </div>
        </article>
        <div className="flex h-16 items-center justify-between border-t border-gray-300">
          <ReplyButton />
          <RepostButton />
          <StarButton />
        </div>
      </div>
    </div>
  );
}
