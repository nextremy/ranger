import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Post } from "../../components/post";
import { trpc } from "../../trpc";

export function Feed() {
  const feedQuery = trpc.post.listFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => {
        const lastPost = lastPage.at(-1);
        if (!lastPost) return;
        return lastPost.id;
      },
    },
  );
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && feedQuery.hasNextPage) {
      void feedQuery.fetchNextPage();
    }
  }, [inView, feedQuery]);

  if (!feedQuery.data) return null;
  if (feedQuery.data.pages[0].length === 0) {
    return <p className="p-4 text-center text-gray-600">No posts to show</p>;
  }
  return (
    <ul className="divide-y divide-gray-300">
      {feedQuery.data.pages.map((page, i) =>
        page.map((post, j) => (
          <li
            key={post.id}
            ref={
              i === feedQuery.data.pages.length - 1 && j === page.length - 1
                ? ref
                : null
            }
          >
            <Post postId={post.id} />
          </li>
        )),
      )}
    </ul>
  );
}
