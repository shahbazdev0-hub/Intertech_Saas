import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }
  if (!user.isActive) {
    // toast.error("Your account is deactivated. Please contact an admin.");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    toast.error("You do not have permission to access this page");
    return <Navigate to={`${user?.role}-dashboard`} replace />;
  }

  return <Outlet />;
};
