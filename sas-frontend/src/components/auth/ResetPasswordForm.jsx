import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";

export const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data.msg);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to reset password");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ token, password: data.password });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="New Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={errors.password?.message}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
      <p className="mt-4 text-right text-sm text-slate-600 dark:text-slate-400">
        <Link
          to="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </>
  );
};
