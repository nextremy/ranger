import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { Post } from "../../components/post";
import { trpc } from "../../trpc";

export function PostList(props: { includeReplies: boolean }) {
  const params = useParams();
  const userQuery = trpc.user.get.useQuery({ username: params.username! });
  const postsQuery = trpc.user.listPosts.useInfiniteQuery(
    { username: params.username!, includeReplies: props.includeReplies },
    {
      getNextPageParam: (lastPage) => {
        const lastPost = lastPage.at(-1);
        if (!lastPost) return;
        return {
          isRepost: lastPost.isRepost,
          userId: lastPost.user.id,
          postId: lastPost.postId,
        };
      },
    },
  );
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
      {postsQuery.data.pages.map((page) =>
        page.map((post, i) => (
          <li
            key={`${post.isRepost}-${post.postId}-${post.user.id}`}
            ref={page.length === i + 1 ? ref : null}
          >
            <Post
              postId={post.postId}
              repostedByUserDisplayName={
                post.isRepost ? post.user.displayName : undefined
              }
            />
          </li>
        )),
      )}
    </ul>
  );
}
