import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../../../components/post";
import { trpc } from "../../../trpc";
import { useInView } from "react-intersection-observer";

export function RepliesList() {
  const params = useParams();
  const context = trpc.useContext();
  const repliesQuery = trpc.post.listReplies.useInfiniteQuery(
    { postId: params.postId! },
    {
      getNextPageParam: (lastPage) => {
        const lastPost = lastPage.at(-1);
        if (!lastPost) return;
        return lastPost.id;
      },
    },
  );
  useEffect(() => {
    if (!repliesQuery.data) return;
    for (const page of repliesQuery.data.pages) {
      for (const post of page) {
        context.post.get.setData({ id: post.id }, () => post);
      }
    }
  }, [context, repliesQuery]);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && repliesQuery.hasNextPage) {
      void repliesQuery.fetchNextPage();
    }
  }, [inView, repliesQuery]);

  if (!repliesQuery.data || repliesQuery.data.pages[0].length === 0) {
    return null;
  }
  return (
    <div className="pt-4">
      <h2 className="px-4 text-lg font-semibold">Replies</h2>
      <ul className="divide-y divide-gray-300">
        {repliesQuery.data.pages.map((page, i) =>
          page.map((post, j) => (
            <li
              key={post.id}
              ref={
                i === repliesQuery.data.pages.length - 1 &&
                j === page.length - 1
                  ? ref
                  : null
              }
            >
              <Post postId={post.id} />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
