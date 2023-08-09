import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../../trpc";
import { Form } from "../form";
import { Modal } from "../modal";

type Inputs = {
  postText: string;
};

export function ReplyButton(props: { postId: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const postTextInputId = useId();
  const context = trpc.useContext();
  const { data: post } = trpc.post.get.useQuery({ id: props.postId });
  const { mutate: createPost } = trpc.post.create.useMutation({
    onMutate: () => {
      context.post.get.setData({ id: props.postId }, (data) => {
        if (!data) return;
        return { ...data, replyCount: data.replyCount + 1 };
      });
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

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
        <form
          className="flex flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit((inputs) => {
              createPost({ text: inputs.postText, replyingToPostId: post.id });
              setModalOpen(false);
              setTimeout(() => reset(), 150);
            })(event);
          }}
        >
          <Modal.TopBar>
            <Modal.CloseButton onClick={() => setModalOpen(false)} />
            <Modal.Title>New reply</Modal.Title>
            <div className="grow" />
            <button
              className="h-12 rounded-full bg-green-700 px-4 font-bold text-gray-100 duration-150 hover:bg-green-800"
              type="submit"
            >
              Post
            </button>
          </Modal.TopBar>
          <label className="sr-only" htmlFor={postTextInputId}>
            New reply
          </label>
          <textarea
            className="h-48 bg-transparent p-4 placeholder:text-gray-600 "
            id={postTextInputId}
            placeholder="What's up?"
            {...register("postText", {
              required: "Post cannot be empty",
              maxLength: {
                value: 300,
                message: "Post cannot be longer than 300 characters",
              },
            })}
          />
          {errors.postText ? (
            <Form.Error className="text-center">
              {errors.postText.message}
            </Form.Error>
          ) : null}
        </form>
      </Modal>
    </>
  );
}
