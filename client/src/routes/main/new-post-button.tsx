import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../../components/form";
import { Modal } from "../../components/modal";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

type Inputs = {
  postText: string;
};

export function NewPostButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const postTextInputId = useId();
  const session = useSession();
  const { mutate: createPost } = trpc.post.create.useMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  if (!session) return null;
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
        <form
          className="flex flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit((inputs) => {
              createPost({ text: inputs.postText });
              setModalOpen(false);
              setTimeout(() => reset(), 150);
            })(event);
          }}
        >
          <Modal.TopBar>
            <Modal.CloseButton onClick={() => setModalOpen(false)} />
            <Modal.Title>New post</Modal.Title>
            <div className="grow" />
            <button
              className="h-12 rounded-full bg-green-700 px-4 font-bold text-gray-100 duration-150 hover:bg-green-800"
              type="submit"
            >
              Post
            </button>
          </Modal.TopBar>
          <label className="sr-only" htmlFor={postTextInputId}>
            New post
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
