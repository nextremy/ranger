import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { User } from "../../components/user";
import { trpc } from "../../trpc";

export function FollowersRoute() {
  const params = useParams();
  const query = trpc.user.listFollowers.useInfiniteQuery(
    { username: params.username! },
    { getNextPageParam: (lastPage) => lastPage.at(-1)?.id },
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
