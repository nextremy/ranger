import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";

export function MoreActionsButton() {
  return (
    <button
      className="grid h-12 w-12 place-items-center rounded-full text-gray-500 duration-200 hover:bg-green-500/10 hover:text-green-500"
      title="More actions"
    >
      <EllipsisHorizontalIcon className="h-5 w-5" />
    </button>
  );
}
