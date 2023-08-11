import { Link } from "react-router-dom";
import { trpc } from "../../trpc";

type Props = {
  username: string;
};

export function User(props: Props) {
  const { data: user } = trpc.user.get.useQuery({ username: props.username });

  if (!user) return null;
  return (
    <div className="relative flex h-16 items-center p-4 duration-150 hover:bg-gray-200">
      <Link
        className="absolute inset-0 z-10"
        title={user.displayName}
        to={`/profiles/${user.username}`}
      />
      <div className="grow text-ellipsis">
        <p className="font-medium tracking-tight">{user.displayName}</p>
        <p className="text-sm text-gray-600">@{user.username}</p>
      </div>
    </div>
  );
}
