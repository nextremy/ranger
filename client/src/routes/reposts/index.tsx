import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { User } from "../../components/user";
import { trpc } from "../../trpc";

export function RepostsRoute() {
  const params = useParams();
  const query = trpc.post.listReposts.useInfiniteQuery(
    { postId: params.postId! },
    { getNextPageParam: (lastPage) => lastPage.at(-1)?.cursor },
  );
  const lastUser = useInView();
  useEffect(() => {
    if (lastUser.inView && query.hasNextPage) {
      void query.fetchNextPage();
    }
  }, [lastUser, query]);

  if (!query.data) return null;
  const users = query.data.pages.flat();
  return (
    <ul className="divide-y divide-gray-300">
      {users.map((user, index) => (
        <li
          key={user.id}
          ref={index === users.length - 1 ? lastUser.ref : null}
        >
          <User username={user.username} />
        </li>
      ))}
    </ul>
  );
}
