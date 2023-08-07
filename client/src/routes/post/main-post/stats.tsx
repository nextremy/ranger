import { useParams } from "react-router-dom";
import { trpc } from "../../../trpc";

export function Stats() {
  const params = useParams();
  const { data: post } = trpc.post.get.useQuery({ id: params.postId! });

  if (!post) return null;
  return (
    <div className="flex h-14 items-center gap-4">
      <p>
        <span className="font-semibold">{post.repostCount}</span> reposts
      </p>
      <p>
        <span className="font-semibold">{post.starCount}</span> stars
      </p>
    </div>
  );
}
