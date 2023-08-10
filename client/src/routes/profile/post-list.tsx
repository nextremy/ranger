import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { Post } from "../../components/post";
import { trpc } from "../../trpc";

export function PostList(props: { includeReplies: boolean }) {
  const params = useParams();
  const context = trpc.useContext();
  const userQuery = trpc.user.get.useQuery({ username: params.username! });
  const postsQuery = trpc.user.listPosts.useInfiniteQuery(
    { username: params.username!, includeReplies: props.includeReplies },
    {
      getNextPageParam: (lastPage) => {
        const lastPost = lastPage.at(-1);
        if (!lastPost) return;
        return lastPost.metaId;
      },
    },
  );
  useEffect(() => {
    if (!postsQuery.data) return;
    for (const page of postsQuery.data.pages) {
      for (const post of page) {
        context.post.get.setData({ id: post.id }, () => post);
      }
    }
  }, [context, postsQuery]);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && postsQuery.hasNextPage) {
      void postsQuery.fetchNextPage();
    }
  }, [inView, postsQuery]);

  if (!userQuery.data) return null;
  if (!postsQuery.data) return null;
  return (
    <ul className="divide-y divide-gray-300">
      {postsQuery.data.pages.map((page, i) =>
        page.map((post, j) => (
          <li
            key={JSON.stringify(post.metaId)}
            ref={
              i === postsQuery.data.pages.length - 1 && j === page.length - 1
                ? ref
                : null
            }
          >
            <Post
              postId={post.id}
              repostedByUserDisplayName={
                post.isRepost ? userQuery.data.displayName : undefined
              }
            />
          </li>
        )),
      )}
    </ul>
  );
}
