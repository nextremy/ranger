import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { trpc } from "../../trpc";
import { Modal } from "../modal";
import { ReplyForm } from "./reply-form";

export function ReplyButton(props: { postId: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: post } = trpc.post.get.useQuery({ id: props.postId });

  if (!post) return null;
  return (
    <>
      <button
        className="group z-20 flex items-center gap-1 text-gray-500 hover:text-green-500"
        onClick={() => setModalOpen(true)}
        title="Reply"
      >
        <div className="grid h-12 w-12 place-items-center rounded-full duration-150 group-hover:bg-green-500/10">
          <ChatBubbleLeftIcon className="h-5 w-5" />
        </div>
        {post.replyCount}
      </button>
      <Modal onClose={() => setModalOpen(false)} open={modalOpen}>
        <Modal.Title>Reply to post</Modal.Title>
        <Modal.CloseButton onClick={() => setModalOpen(false)} />
        <ReplyForm postId={post.id} setModalOpen={setModalOpen} />
      </Modal>
    </>
  );
}
