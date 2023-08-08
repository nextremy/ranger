import { Dispatch, SetStateAction, useId } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../../trpc";

type Inputs = {
  postText: string;
};

export function ReplyForm(props: {
  postId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const postTextInputId = useId();
  const context = trpc.useContext();
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
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit((inputs) => {
          createPost({ text: inputs.postText, replyingToPostId: props.postId });
          props.setModalOpen(false);
        })(event);
      }}
    >
      <label className="sr-only" htmlFor={postTextInputId}>
        New post
      </label>
      <textarea
        className="mt-4 h-48 rounded-md bg-gray-300 p-4 placeholder:text-gray-600 "
        id={postTextInputId}
        placeholder="Type your reply"
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
        className="mt-4 h-12 rounded-md bg-green-700 px-4 font-bold text-gray-100 duration-150 hover:bg-green-800"
        type="submit"
      >
        Post
      </button>
    </form>
  );
}
