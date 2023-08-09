import { Dispatch, SetStateAction, useId } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../../components/form";
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
        void handleSubmit((inputs) => {
          editProfile(inputs);
          props.setModalOpen(false);
        })(event);
      }}
    >
      <Form.Label className="mt-4" htmlFor={displayNameInputId}>
        Display name
      </Form.Label>
      <Form.TextInput
        className="mt-1"
        id={displayNameInputId}
        {...register("displayName", {
          required: "Display name is required",
          maxLength: {
            value: 16,
            message: "Display name cannot be more than 16 characters long",
          },
        })}
      />
      {errors.displayName ? (
        <Form.Error className="mt-1">{errors.displayName.message}</Form.Error>
      ) : null}
      <Form.Label className="mt-4" htmlFor={descriptionInputId}>
        Description
      </Form.Label>
      <Form.TextArea
        className="mt-1"
        id={descriptionInputId}
        {...register("description", {
          maxLength: {
            value: 300,
            message: "Description cannot be more than 300 characters long",
          },
        })}
      />
      {errors.description ? (
        <Form.Error className="mt-1">{errors.description.message}</Form.Error>
      ) : null}
      <button
        className="mt-4 h-12 rounded-md bg-green-700 font-bold text-gray-100 duration-200 hover:bg-green-800"
        type="submit"
      >
        Save changes
      </button>
    </form>
  );
}
