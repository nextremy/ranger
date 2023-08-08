import { Dialog } from "@headlessui/react";
import { ReactNode } from "react";

export function Title(props: { children: ReactNode }) {
  return (
    <Dialog.Title className="text-center text-lg font-bold">
      {props.children}
    </Dialog.Title>
  );
}
