import { Dispatch, SetStateAction, useId } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../../trpc";

type Inputs = {
  postText: string;
};

export function NewPostForm(props: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const postTextInputId = useId();
  const { mutate: createPost } = trpc.post.create.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit((inputs) => {
          createPost({ text: inputs.postText });
          props.setModalOpen(false);
        })(event);
      }}
    >
      <label className="sr-only" htmlFor={postTextInputId}>
        New post
      </label>
      <textarea
        className="mt-4 h-48 rounded-md bg-gray-300 p-4 placeholder:text-gray-500"
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
        <p className="mt-1 text-sm font-medium tracking-wide text-red-700">
          {errors.postText.message}
        </p>
      ) : null}
      <button
        className="mt-4 h-12 rounded-md bg-green-700 font-bold text-gray-100 duration-150 hover:bg-green-800"
        type="submit"
      >
        Post
      </button>
      <button
        className="mt-2 h-12 rounded-md bg-gray-200 font-semibold duration-150 hover:bg-gray-300"
        onClick={(event) => {
          event.preventDefault();
          props.setModalOpen(false);
        }}
      >
        Cancel
      </button>
    </form>
  );
}
