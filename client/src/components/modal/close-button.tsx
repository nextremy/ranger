import { XMarkIcon } from "@heroicons/react/24/solid";
import { MouseEventHandler } from "react";

export function CloseButton(props: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className="absolute right-2 top-2 grid h-12 w-12 place-items-center rounded-full duration-150 hover:bg-gray-200"
      onClick={props.onClick}
      title="Close"
    >
      <XMarkIcon className="h-6 w-6" />
    </button>
  );
}
