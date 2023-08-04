import { useId } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { trpc } from "../../trpc";

type Inputs = {
  username: string;
  password: string;
};

export function LoginRoute() {
  const usernameInputId = useId();
  const passwordInputId = useId();
  const navigate = useNavigate();
  const { mutate: login } = trpc.user.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      navigate("/");
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        setError("root", {
          type: "server",
          message: "Invalid username or password.",
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
        void handleSubmit((inputs) => login(inputs))(event);
      }}
    >
      <h1 className="text-center text-xl font-bold">Log in</h1>
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
        {...register("username", { required: "This field is required." })}
      />
      <div className="h-8 pt-1">
        {errors.username && (
          <p className="text-sm font-medium tracking-wide text-red-700">
            {errors.username.message}
          </p>
        )}
      </div>
      <label
        className="text-sm font-semibold tracking-wide"
        htmlFor={passwordInputId}
      >
        Password
      </label>
      <input
        className="mt-1 h-12 rounded-md bg-gray-300 px-4"
        id={passwordInputId}
        type="password"
        {...register("password", { required: "This field is required." })}
      />
      <div className="h-10 pt-1">
        {errors.password && (
          <p className="text-sm font-medium tracking-wide text-red-700">
            {errors.password.message}
          </p>
        )}
      </div>
      <button
        className="h-12 rounded-md bg-green-700 font-bold text-gray-100 duration-150 hover:bg-green-600"
        type="submit"
      >
        Log in
      </button>
      <div className="h-8 pt-4">
        {errors.root && (
          <p className="text-center text-sm font-medium tracking-wide text-red-700">
            {errors.root.message}
          </p>
        )}
      </div>
      <p className="mt-4 text-center">
        Don{"'"}t have an account?{" "}
        <Link className="text-blue-700" to="register">
          Register here.
        </Link>
      </p>
    </form>
  );
}
