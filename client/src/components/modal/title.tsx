import { Dialog } from "@headlessui/react";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export function Title(props: Props) {
  return (
    <Dialog.Title className="text-lg font-bold">{props.children}</Dialog.Title>
  );
}
