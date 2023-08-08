import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { Post } from "../../components/post";
import { trpc } from "../../trpc";

export function PostList(props: { includeReplies: boolean }) {
  const params = useParams();
  const context = trpc.useContext();
  const { data: user } = trpc.user.get.useQuery({ username: params.username! });
  const {
    data: infinitePosts,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNewPosts,
  } = trpc.user.listPosts.useInfiniteQuery(
    { username: params.username!, includeReplies: props.includeReplies },
    { getNextPageParam: (lastPage) => lastPage.at(-1)?.id },
  );
  useEffect(() => {
    if (!infinitePosts) return;
    for (const page of infinitePosts.pages) {
      for (const post of page) {
        context.post.get.setData({ id: post.id }, () => post);
      }
    }
  }, [context, infinitePosts]);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNewPosts) {
      void fetchNextPosts();
    }
  }, [inView, hasNewPosts, fetchNextPosts]);

  if (!user) return null;
  if (!infinitePosts) return null;
  return (
    <ul className="divide-y divide-gray-300">
      {infinitePosts.pages.map((page) =>
        page.map((post, i) => (
          <li key={post.id} ref={page.length === i + 1 ? ref : null}>
            <Post
              postId={post.id}
              repostedByUser={
                post.author.username === params.username
                  ? undefined
                  : user
              }
            />
          </li>
        )),
      )}
    </ul>
  );
}
