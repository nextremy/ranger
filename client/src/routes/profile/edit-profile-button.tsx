import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { EditProfileForm } from "./edit-profile-form";

export function EditProfileButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const params = useParams();
  const session = useSession();

  if (params.username !== session?.username) return null;
  return (
    <>
      <button
        className="flex h-12 items-center gap-2 rounded-full bg-gray-200 px-6 font-bold duration-200 hover:bg-gray-300"
        onClick={() => setDialogOpen(true)}
      >
        Edit profile
      </button>
      <Transition as={Fragment} show={dialogOpen}>
        <Dialog onClose={() => setDialogOpen(false)}>
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
                <Dialog.Title className="text-lg font-bold">
                  Edit profile
                </Dialog.Title>
                <EditProfileForm setDialogOpen={setDialogOpen} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
