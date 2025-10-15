import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { publicRegister, protectedRegister } from "../../api/authApi";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

export const RegisterForm = ({ isProtected, defaultRole }) => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: defaultRole || "agent",
    },
  });

  const mutation = useMutation({
    mutationFn: isProtected ? protectedRegister : publicRegister,
    onSuccess: (data) => {
      if (!isProtected) {
        login(data.user, data.token);
      }
      toast.success("Registration successful!");
      const role = data?.user?.role;
      const dashboardPath = role ? `/${role}-dashboard` : "/";
      navigate(dashboardPath);
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Registration failed");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  const availableRoles = defaultRole
    ? [defaultRole]
    : isProtected
      ? user?.role === "superadmin"
        ? ["admin", "agent"]
        : ["agent"]
      : ["superadmin", "agent", "qa-agent"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Name"
        {...register("name", { required: "Name is required" })}
        error={errors.name?.message}
      />
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
      <Input
        label="Password"
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
      {/* <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          {...register("role", { required: "Role is required" })}
          className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          {isProtected ? (
            <>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
            </>
          ) : (
            <>
              <option value="superadmin">Superadmin</option>
              <option value="agent">Agent</option>
            </>
          )}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
        )}
      </div> */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Role
        </label>
        <select
          {...register("role", { required: "Role is required" })}
          className="mt-1 p-2 w-full border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          disabled={!!defaultRole}
        >
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">
            {errors.role.message}
          </p>
        )}
      </div>
      <p className="text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Login
        </Link>
      </p>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};
