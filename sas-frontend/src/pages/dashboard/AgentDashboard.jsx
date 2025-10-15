// import { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import toast from "react-hot-toast";

// export const AgentDashboard = () => {
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user && !user.isActive) {
//       toast.error("Your account is deactivated. Please contact an admin.");
//     }
//   }, [user]);

//   if (!user || !user.isActive) {
//     return <Navigate to="/" replace />;
//   }
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Agent Dashboard</h2>
//       <p>Welcome, {user?.name}!</p>
//     </div>
//   );
// };
//dashbaord/AgentDashboard.jsx
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { getAgentSalesCounts } from "../../api/saleApi";

export const AgentDashboard = () => {
  const { user } = useAuth();

  const {
    data: salesCounts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agentSalesCounts", user?.userId],
    queryFn: getAgentSalesCounts,
    enabled: !!user && user.isActive,
    onError: () => {
      toast.error("Failed to fetch sales counts");
    },
  });

  useEffect(() => {
    if (user && !user.isActive) {
      toast.error("Your account is deactivated. Please contact an admin.");
    }
  }, [user]);

  if (!user || !user.isActive) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col gap-y-6 p-4">
      <h2 className="text-2xl font-bold mb-4">Agent Dashboard</h2>
      <p className="text-lg text-slate-700 dark:text-slate-300">
        Welcome, {user?.name}!
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card bg-slate-100 dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Sales Today
          </h3>
          {isLoading ? (
            <div className="animate-pulse h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ) : isError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {salesCounts?.todaySales || 0}
            </p>
          )}
        </div>
        <div className="card bg-slate-100 dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Sales This Week
          </h3>
          {isLoading ? (
            <div className="animate-pulse h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ) : isError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {salesCounts?.lastWeekSales || 0}
            </p>
          )}
        </div>
        <div className="card bg-slate-100 dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Sales This Month
          </h3>
          {isLoading ? (
            <div className="animate-pulse h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ) : isError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {salesCounts?.lastMonthSales || 0}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
