import { Dialog, Transition } from "@headlessui/react";
import { ComponentProps, Fragment, ReactNode } from "react";
import { CloseButton } from "./close-button";
import { Title } from "./title";

export function Modal(props: {
  onClose: ComponentProps<typeof Dialog>["onClose"];
  open: ComponentProps<typeof Dialog>["open"];
  children: ReactNode;
}) {
  return (
    <Transition as={Fragment} show={props.open}>
      <Dialog className="relative z-50" onClose={props.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50" />
        </Transition.Child>
        <div className="fixed inset-0 grid place-items-center p-2">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-xl bg-gray-100 p-4">
              {props.children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

Modal.CloseButton = CloseButton;
Modal.Title = Title;
