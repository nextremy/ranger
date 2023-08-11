import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Post } from "../../components/post";
import { trpc } from "../../trpc";

type Props = {
  searchQuery: string;
};

export function PostSearchResults(props: Props) {
  const postsQuery = trpc.post.listSearch.useInfiniteQuery(
    { query: props.searchQuery },
    {
      enabled: props.searchQuery !== "",
      getNextPageParam: (lastPage) => {
        const lastPost = lastPage.at(-1);
        if (!lastPost) return;
        return lastPost.id;
      },
    },
  );
  const lastPost = useInView();
  useEffect(() => {
    if (lastPost.inView && postsQuery.hasNextPage) {
      void postsQuery.fetchNextPage();
    }
  }, [lastPost, postsQuery]);

  if (!postsQuery.data) return null;
  if (postsQuery.data.pages[0].length === 0) {
    return <p className="p-4 text-center text-gray-500">No posts found</p>;
  }
  return (
    <ul>
      {postsQuery.data.pages.map((page, pageIndex) =>
        page.map((post, postIndex) => (
          <li
            key={post.id}
            ref={
              pageIndex === postsQuery.data.pages.length - 1 &&
              postIndex === page.length - 1
                ? lastPost.ref
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
