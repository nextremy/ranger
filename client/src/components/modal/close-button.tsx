import { XMarkIcon } from "@heroicons/react/24/solid";
import { MouseEventHandler } from "react";

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export function CloseButton({ onClick, ...restProps }: Props) {
  return (
    <button
      className="grid h-12 w-12 place-items-center rounded-full duration-150 hover:bg-gray-200"
      onClick={onClick}
      title="Close"
      {...restProps}
    >
      <XMarkIcon className="h-6 w-6" />
    </button>
  );
}
