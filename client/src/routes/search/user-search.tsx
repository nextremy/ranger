import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { User } from "../../components/user";
import { trpc } from "../../trpc";

type Props = {
  searchQuery: string;
};

export function UserSearchResults(props: Props) {
  const usersQuery = trpc.user.listSearch.useInfiniteQuery(
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
  const lastUser = useInView();
  useEffect(() => {
    if (lastUser.inView && usersQuery.hasNextPage) {
      void usersQuery.fetchNextPage();
    }
  }, [lastUser, usersQuery]);

  if (!usersQuery.data) return null;
  if (usersQuery.data.pages[0].length === 0) {
    return <p className="p-4 text-center text-gray-500">No users found</p>;
  }
  return (
    <ul className="divide-y divide-gray-300">
      {usersQuery.data.pages.map((page, pageIndex) =>
        page.map((user, userIndex) => (
          <li
            key={user.id}
            ref={
              pageIndex === usersQuery.data.pages.length - 1 &&
              userIndex === page.length - 1
                ? lastUser.ref
                : null
            }
          >
            <User username={user.username} />
          </li>
        )),
      )}
    </ul>
  );
}
