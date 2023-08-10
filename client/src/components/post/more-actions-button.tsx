import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function MoreActionsButton(props: { postId: string }) {
  const session = useSession();
  const context = trpc.useContext();
  const { data: post } = trpc.post.get.useQuery({ id: props.postId });
  const { mutate: deletePost } = trpc.post.delete.useMutation({
    onSuccess: () => context.post.get.reset({ id: props.postId }),
  });

  if (!post) return null;
  return (
    <Menu as="div" className="relative z-30">
      <Menu.Button
        className="z-20 grid h-12 w-12 place-items-center rounded-full text-gray-500 duration-200 hover:bg-green-500/10 hover:text-green-500"
        title="More actions"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-2 top-2 z-50 flex w-max flex-col rounded-lg border border-gray-300 bg-gray-100">
          <Menu.Item as="div">
            <button
              className="flex h-12 w-full items-center gap-2 px-4 duration-150 hover:bg-gray-200"
              onClick={() =>
                void navigator.clipboard.writeText(
                  `${window.location.origin}/posts/${post.id}`,
                )
              }
            >
              <LinkIcon className="h-5 w-5" />
              Copy link
            </button>
          </Menu.Item>
          {post.author.username === session?.username ? (
            <Menu.Item as="div">
              <button
                className="flex h-12 w-full items-center gap-2 px-4 text-red-700 duration-150 hover:bg-gray-200"
                onClick={() => deletePost({ postId: post.id })}
              >
                <TrashIcon className="h-5 w-5" />
                Delete post
              </button>
            </Menu.Item>
          ) : null}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
