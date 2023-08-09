import { useId } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "../../components/form";
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
      localStorage.setItem("username", data.username);
      navigate("/");
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        setError("root", { message: "Invalid username or password" });
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
        void handleSubmit((inputs) => login(inputs))(event);
      }}
    >
      <h1 className="text-center text-xl font-bold">Log in</h1>
      <Form.Label className="mt-4" htmlFor={usernameInputId}>
        Username
      </Form.Label>
      <Form.TextInput
        className="mt-1"
        id={usernameInputId}
        {...register("username", { required: "Username is required" })}
      />
      {errors.username ? (
        <Form.Error className="mt-1">{errors.username.message}</Form.Error>
      ) : null}
      <Form.Label className="mt-4" htmlFor={passwordInputId}>
        Password
      </Form.Label>
      <Form.TextInput
        className="mt-1"
        id={passwordInputId}
        type="password"
        {...register("password", { required: "Password is required" })}
      />
      {errors.password ? (
        <Form.Error className="mt-1">{errors.password.message}</Form.Error>
      ) : null}
      <button
        className="mt-8 h-12 rounded-md bg-green-700 font-bold text-gray-100 duration-150 hover:bg-green-600"
        type="submit"
      >
        Log in
      </button>
      {errors.root ? (
        <Form.Error className="mt-4 text-center">
          {errors.root.message}
        </Form.Error>
      ) : null}
      <p className="mt-4 text-center">
        Don{"'"}t have an account?{" "}
        <Link className="text-blue-700" to="/register">
          Register here.
        </Link>
      </p>
    </form>
  );
}
