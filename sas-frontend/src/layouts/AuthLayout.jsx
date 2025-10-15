import { Link, Outlet } from "react-router-dom";
import { ThemeToggle } from "../components/common/ThemeToggle";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors relative">
      {/* Theme toggle positioned in top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle showLabel={true} className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700" />
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-md transition-colors">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-slate-100">
          Customer Relation Management
        </h1>
        <Outlet />
      </div>
    </div>
  );
};
