import { Tab } from "@headlessui/react";
import { Link, useParams } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";
import { EditProfileButton } from "./edit-profile-button";
import { FollowButton } from "./follow-button";
import { PostList } from "./post-list";
import { UnfollowButton } from "./unfollow-button";

export function ProfileRoute() {
  const session = useSession();
  const params = useParams();
  const { data: user } = trpc.user.get.useQuery({ username: params.username! });

  if (!user) return null;
  return (
    <>
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <p className="text-lg font-medium leading-tight">
              {user.displayName}
            </p>
            <div className="flex gap-2">
              <p className="text-gray-700">@{user.username}</p>
              {user.isFollowingUser ? (
                <p className="rounded-md bg-gray-200 px-2 font-medium">
                  Follows you
                </p>
              ) : null}
            </div>
          </div>
          {user.isFollowedByUser && session?.username !== params.username ? (
            <UnfollowButton />
          ) : null}
          {!user.isFollowedByUser && session?.username !== params.username ? (
            <FollowButton />
          ) : null}
          {session?.username === params.username ? <EditProfileButton /> : null}
        </div>
        <div className="mt-4 flex gap-4">
          <Link to="followers">
            <span className="font-semibold">{user.followerCount}</span>{" "}
            <span className="text-gray-700">followers</span>
          </Link>
          <Link to="following">
            <span className="font-semibold">{user.followingCount}</span>{" "}
            <span className="text-gray-700">following</span>
          </Link>
        </div>
        <p className="mt-4 whitespace-pre">{user.description}</p>
      </div>
      <Tab.Group>
        <Tab.List className="grid auto-cols-fr grid-flow-col">
          <Tab className="grid h-12 place-items-center font-semibold text-gray-600 duration-200 hover:bg-gray-200 hover:text-gray-900 ui-selected:text-gray-900">
            <div className="grid h-12 place-items-center border-b-4 border-transparent px-2 ui-selected:border-gray-700">
              Posts
            </div>
          </Tab>
          <Tab className="grid h-12 place-items-center font-semibold text-gray-600 duration-200 hover:bg-gray-200 hover:text-gray-900 ui-selected:text-gray-900">
            <div className="grid h-12 place-items-center border-b-4 border-transparent px-2 ui-selected:border-gray-700">
              Posts & replies
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels className="border-t border-gray-300">
          <Tab.Panel>
            <PostList includeReplies={false} />
          </Tab.Panel>
          <Tab.Panel>
            <PostList includeReplies />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
