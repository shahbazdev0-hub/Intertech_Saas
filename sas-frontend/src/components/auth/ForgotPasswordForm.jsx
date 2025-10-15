import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.msg);
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to send reset email");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          error={errors.email?.message}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Remember your password?{" "}
        <Link
          to="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Log In
        </Link>
      </p>
    </>
  );
};
