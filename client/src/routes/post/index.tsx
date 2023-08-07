import { useParams } from "react-router-dom";
import { trpc } from "../../trpc";
import { MainPost } from "./main-post";

export function PostRoute() {
  const params = useParams();
  const { data: post } = trpc.post.get.useQuery({ id: params.postId! });

  if (!post) return null;
  return (
    <div className="border-b border-gray-300">
      <MainPost />
    </div>
  );
}
