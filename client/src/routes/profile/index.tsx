import { Tab } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { trpc } from "../../trpc";
import { EditProfileButton } from "./edit-profile-button";
import { FollowButton } from "./follow-button";
import { UnfollowButton } from "./unfollow-button";

export function ProfileRoute() {
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
              <p className="text-gray-600">@{user.username}</p>
              {user.isFollowingUser ? (
                <p className="rounded-md bg-gray-200 px-2 font-medium">
                  Follows you
                </p>
              ) : null}
            </div>
          </div>
          <FollowButton />
          <UnfollowButton />
          <EditProfileButton />
        </div>
      </div>
      <Tab.Group>
        <Tab.List className="grid auto-cols-fr grid-flow-col">
          <Tab className="grid h-12 place-items-center font-semibold text-gray-600 duration-200 hover:bg-gray-200 hover:text-gray-900 ui-selected:text-gray-900">
            <div className="grid h-12 place-items-center border-b-4 border-transparent px-2 ui-selected:border-green-700">
              Posts
            </div>
          </Tab>
          <Tab className="grid h-12 place-items-center font-semibold text-gray-600 duration-200 hover:bg-gray-200 hover:text-gray-900 ui-selected:text-gray-900">
            <div className="grid h-12 place-items-center border-b-4 border-transparent px-2 ui-selected:border-green-700">
              Posts & replies
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel></Tab.Panel>
          <Tab.Panel></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <div></div>
    </>
  );
}
