import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { trpc } from "../../../trpc";
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
    <div className="px-4 pt-4">
      <article>
        <ProfileInfo />
        <p className="py-4 text-lg">{post.text}</p>
        <p className="text-gray-600">
          {Intl.DateTimeFormat("en-us", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(post.timestamp))}
        </p>
        <div className="mt-4 border-t border-gray-300">
          <Stats />
        </div>
      </article>
      <div className="flex h-16 items-center justify-between border-t border-gray-300">
        <ReplyButton />
        <RepostButton />
        <StarButton />
        <button
          className="grid h-12 w-12 place-items-center rounded-full text-gray-500 duration-200 hover:bg-green-500/10 hover:text-green-500"
          title="More options"
        >
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
