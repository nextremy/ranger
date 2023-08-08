import { useState } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../../components/modal";
import { useSession } from "../../hooks/use-session";
import { EditProfileForm } from "./edit-profile-form";

export function EditProfileButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const params = useParams();
  const session = useSession();

  if (params.username !== session?.username) return null;
  return (
    <>
      <button
        className="flex h-12 items-center gap-2 rounded-full bg-gray-200 px-6 font-bold duration-200 hover:bg-gray-300"
        onClick={() => setModalOpen(true)}
      >
        Edit profile
      </button>
      <Modal onClose={() => setModalOpen(false)} open={modalOpen}>
        <Modal.Title>Edit profile</Modal.Title>
        <Modal.CloseButton onClick={() => setModalOpen(false)} />
        <EditProfileForm setModalOpen={setModalOpen} />
      </Modal>
    </>
  );
}
