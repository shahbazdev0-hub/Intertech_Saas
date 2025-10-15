import {
  CreditCard,
  DollarSign,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="card">
        <div className="card-header">
          <div className="w-fit rounded-lg bg-red-500/20 p-2 text-red-500 transition-colors dark:bg-red-600/20 dark:text-red-600">
            <Package size={26} />
          </div>
          <p className="card-title">Today 24 hours Sales</p>
        </div>
        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
          <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
            {stats.sales24Hours}
          </p>
          <span className="flex w-fit items-center gap-x-2 rounded-full border border-red-500 px-2 py-1 font-medium text-red-500 dark:border-red-600 dark:text-red-600">
            <TrendingUp size={18} />
            25%
          </span>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="rounded-lg bg-red-500/20 p-2 text-red-500 transition-colors dark:bg-red-600/20 dark:text-red-600">
            <DollarSign size={26} />
          </div>
          <p className="card-title">Last 7 day Sales</p>
        </div>
        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
          <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
            {stats.sales7Days}
          </p>
          <span className="flex w-fit items-center gap-x-2 rounded-full border border-red-500 px-2 py-1 font-medium text-red-500 dark:border-red-600 dark:text-red-600">
            <TrendingUp size={18} />
            12%
          </span>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="rounded-lg bg-red-500/20 p-2 text-red-500 transition-colors dark:bg-red-600/20 dark:text-red-600">
            <Users size={26} />
          </div>
          <p className="card-title">Last 30 days Sales</p>
        </div>
        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
          <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
            {stats.sales30Days}
          </p>
          <span className="flex w-fit items-center gap-x-2 rounded-full border border-red-500 px-2 py-1 font-medium text-red-500 dark:border-red-600 dark:text-red-600">
            <TrendingUp size={18} />
            15%
          </span>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="rounded-lg bg-red-500/20 p-2 text-red-500 transition-colors dark:bg-red-600/20 dark:text-red-600">
            <CreditCard size={26} />
          </div>
          <p className="card-title">Available Agents</p>
        </div>
        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
          <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
            {stats.totalAgents}
          </p>
          <span className="flex w-fit items-center gap-x-2 rounded-full border border-red-500 px-2 py-1 font-medium text-red-500 dark:border-red-600 dark:text-red-600">
            <TrendingUp size={18} />
            19%
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
