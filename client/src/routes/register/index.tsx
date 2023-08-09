import { useId } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "../../components/form";
import { trpc } from "../../trpc";

type Inputs = {
  username: string;
  displayName: string;
  password: string;
};

export function RegisterRoute() {
  const usernameInputId = useId();
  const displayNameInputId = useId();
  const passwordInputId = useId();
  const navigate = useNavigate();
  const { mutate: createUser } = trpc.user.create.useMutation({
    onSuccess: () => navigate("/login"),
    onError: (error) => {
      if (error.data?.code === "CONFLICT") {
        setError("username", { message: "Username is taken" });
        return;
      }
      setError("root", { message: "Unknown error" });
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>();

  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit((inputs) => createUser(inputs))(event);
      }}
    >
      <h1 className="text-center text-xl font-bold">Register</h1>
      <Form.Label htmlFor={usernameInputId}>Username</Form.Label>
      <Form.TextInput
        id={usernameInputId}
        {...register("username", {
          required: "Username is required",
          maxLength: {
            value: 12,
            message: "Username cannot be fewer than 12 characters long",
          },
          pattern: {
            value: /^[a-z0-9_]*$/,
            message:
              "Username can contain only lowercase letters, numbers, and underscores",
          },
        })}
      />
      {errors.username ? (
        <Form.Error className="mt-1">{errors.username.message}</Form.Error>
      ) : null}
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
        <Form.Error className="mt-1 text-sm font-medium tracking-wide text-red-700">
          {errors.displayName.message}
        </Form.Error>
      ) : null}
      <Form.Label className="mt-4" htmlFor={passwordInputId}>
        Password
      </Form.Label>
      <Form.TextInput
        className="mt-1"
        id={passwordInputId}
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password cannot be fewer than 8 characters long",
          },
          maxLength: {
            value: 256,
            message: "Password cannot be more than 256 characters long",
          },
        })}
      />
      {errors.password && (
        <Form.Error className="mt-1">{errors.password.message}</Form.Error>
      )}
      <button
        className="mt-8 h-12 rounded-md bg-green-700 font-bold text-gray-100 duration-150 hover:bg-green-600"
        type="submit"
      >
        Register
      </button>
      {errors.root && (
        <Form.Error className="mt-4 text-center">
          {errors.root.message}
        </Form.Error>
      )}
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link className="text-blue-700" to="/login">
          Log in here.
        </Link>
      </p>
    </form>
  );
}
