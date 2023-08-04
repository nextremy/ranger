import { useId } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
        setError("username", {
          type: "server",
          message: "That username is taken.",
        });
        return;
      }
      setError("root", {
        type: "server",
        message: "An unknown error occurred.",
      });
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
      <label
        className="mt-4 text-sm font-semibold tracking-wide"
        htmlFor={usernameInputId}
      >
        Username
      </label>
      <input
        className="mt-1 h-12 rounded-md bg-gray-300 px-4"
        id={usernameInputId}
        type="text"
        {...register("username", {
          required: "This field is required.",
          maxLength: {
            value: 12,
            message: "Your username must contain at most 12 characters.",
          },
          pattern: {
            value: /^[a-z0-9_]*$/,
            message:
              "Your username must contain only lowercase letters, numbers, and underscores.",
          },
        })}
      />
      {errors.username && (
        <p className="mt-1 text-sm font-medium tracking-wide text-red-700">
          {errors.username.message}
        </p>
      )}
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
          required: "This field is required.",
          maxLength: {
            value: 16,
            message: "Your display name must contain at most 16 characters.",
          },
        })}
      />
      {errors.displayName && (
        <p className="mt-1 text-sm font-medium tracking-wide text-red-700">
          {errors.displayName.message}
        </p>
      )}
      <label
        className="mt-4 text-sm font-semibold tracking-wide"
        htmlFor={passwordInputId}
      >
        Password
      </label>
      <input
        className="mt-1 h-12 rounded-md bg-gray-300 px-4"
        id={passwordInputId}
        type="password"
        {...register("password", {
          required: "This field is required.",
          minLength: {
            value: 8,
            message: "Your password must contain at least 8 characters.",
          },
          maxLength: {
            value: 256,
            message: "Your password must contain at most 256 characters.",
          },
        })}
      />
      {errors.password && (
        <p className="mt-1 text-sm font-medium tracking-wide text-red-700">
          {errors.password.message}
        </p>
      )}
      <button
        className="mt-8 h-12 rounded-md bg-green-700 font-bold text-gray-100 duration-150 hover:bg-green-600"
        type="submit"
      >
        Register
      </button>
      {errors.root && (
        <p className="mt-4 text-center text-sm font-medium tracking-wide text-red-700">
          {errors.root.message}
        </p>
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
