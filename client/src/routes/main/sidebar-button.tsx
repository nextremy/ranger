import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Sidebar } from "./sidebar";

export function SidebarButton() {
  return (
    <Popover>
      <Popover.Button
        className="grid h-12 w-12 place-items-center rounded-full duration-150 hover:bg-gray-200"
        title="Menu"
      >
        <Bars3Icon className="h-6 w-6" />
      </Popover.Button>
      <Transition
        enter="duration-300 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="duration-300 ease-in"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Overlay className="fixed inset-0 bg-gray-900/50" />
      </Transition>
      <div className="absolute left-0 top-0 w-full">
        <Transition
          enter="duration-300 ease-out"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="duration-300 ease-in"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Popover.Panel className="h-screen w-full max-w-xs bg-gray-100">
            <Sidebar />
          </Popover.Panel>
        </Transition>
      </div>
    </Popover>
  );
}
