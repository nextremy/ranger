import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Modal } from "../../components/modal";
import { NewPostForm } from "./new-post-form";

export function NewPostButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        className="flex h-16 items-center justify-center gap-2 rounded-full bg-green-700 px-4 text-lg font-bold text-gray-100 duration-150 hover:bg-green-800"
        onClick={() => setModalOpen(true)}
      >
        <PencilSquareIcon className="h-5 w-5" />
        New post
      </button>
      <Modal onClose={() => setModalOpen(false)} open={modalOpen}>
        <Modal.Title>New post</Modal.Title>
        <NewPostForm setModalOpen={setModalOpen} />
      </Modal>
    </>
  );
}
