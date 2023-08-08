import { Dispatch, SetStateAction, useId } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

type Inputs = {
  displayName: string;
  description: string;
};

export function EditProfileForm(props: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const displayNameInputId = useId();
  const descriptionInputId = useId();
  const session = useSession();
  const context = trpc.useContext();
  const { data: user } = trpc.user.get.useQuery({
    username: session!.username,
  });
  const { mutate: editProfile } = trpc.user.editProfile.useMutation({
    onMutate: (input) => {
      context.user.get.setData({ username: session!.username }, (data) => {
        if (!data) return;
        return { ...data, ...input };
      });
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      displayName: user?.displayName,
      description: user?.description,
    },
  });

  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit((inputs) => editProfile(inputs))(event);
        props.setModalOpen(false);
      }}
    >
      <label
        className="mt-4 text-sm font-semibold tracking-wide"
        htmlFor={displayNameInputId}
      >
        Display name
      </label>
      <input
        className="mt-1 h-12 rounded-md bg-gray-300 px-4"
        id={displayNameInputId}
        type="text"
        {...register("displayName", {
          required: "A display name is required.",
          maxLength: {
            value: 16,
            message: "Display name cannot be longer than than 16 characters",
          },
        })}
      />
      {errors.displayName ? (
        <p className="mt-1 text-sm font-medium tracking-wide text-red-700">
          {errors.displayName.message}
        </p>
      ) : null}
      <label
        className="mt-4 text-sm font-semibold tracking-wide"
        htmlFor={descriptionInputId}
      >
        Description
      </label>
      <textarea
        className="mt-1 h-48 rounded-md bg-gray-300 p-4"
        id={descriptionInputId}
        {...register("description", {
          maxLength: {
            value: 300,
            message: "Description cannot be longer than 300 characters",
          },
        })}
      />
      {errors.description ? (
        <p className="mt-1 text-sm font-medium tracking-wide text-red-700">
          {errors.description.message}
        </p>
      ) : null}
      <button
        className="mt-8 h-12 rounded-md bg-green-700 font-bold text-gray-100 duration-200 hover:bg-green-800"
        type="submit"
      >
        Save changes
      </button>
      <button className="mt-2 h-12 rounded-md bg-gray-200 font-bold duration-200 hover:bg-gray-300">
        Cancel
      </button>
    </form>
  );
}
