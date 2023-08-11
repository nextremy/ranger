import { Link, useParams } from "react-router-dom";
import { trpc } from "../../../trpc";

export function Stats() {
  const params = useParams();
  const { data: post } = trpc.post.get.useQuery({ id: params.postId! });

  if (!post) return null;
  return (
    <div className="flex h-14 items-center gap-4">
      <Link
        className={`${post.repostCount === 0 ? "hidden" : ""}`}
        to={`/posts/${post.id}/reposts`}
      >
        <span className="font-semibold">{post.repostCount}</span>{" "}
        {post.repostCount === 1 ? "repost" : "reposts"}
      </Link>
      <Link
        className={`${post.starCount === 0 ? "hidden" : ""}`}
        to={`/posts/${post.id}/stars`}
      >
        <span className="font-semibold">{post.starCount}</span>{" "}
        {post.starCount === 1 ? "star" : "stars"}
      </Link>
    </div>
  );
}
