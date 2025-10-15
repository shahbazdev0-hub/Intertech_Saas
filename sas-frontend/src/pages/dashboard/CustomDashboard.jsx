import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useTheme } from "../../hooks/use-theme";

import { Footer } from "../../layouts/footer";

import {
  CreditCard,
  DollarSign,
  Package,
  TrendingUp,
  Users,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getRecentSales,
  getSalesGraph,
} from "../../api/authApi";
import avatarImage from "../../assets/avatar.png";

const CustomDashboard = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    sales24Hours: 0,
    sales7Days: 0,
    sales30Days: 0,
    totalAgents: 0,
  });
  const [salesGraph, setSalesGraph] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getDashboardStats();
        const graphData = await getSalesGraph();
        const recent = await getRecentSales();
        const formatted = graphData.map((item) => ({
          name: item._id,
          total: item.total,
        }));
        setStats(data);
        setSalesGraph(formatted);
        setRecentSales(recent);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
        setError(error.message || "Failed to load dashboard data");
        setStats({
          sales24Hours: 0,
          sales7Days: 0,
          sales30Days: 0,
          totalAgents: 0,
        });
        setSalesGraph([]);
        setRecentSales([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-4">
        <h1 className="title">Custom Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          <span className="ml-2 text-slate-600 dark:text-slate-400">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Custom Dashboard</h1>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="text-red-400 dark:text-red-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Connection Error
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error}. Dashboard showing with default values.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="card">
          <div className="card-header">
            <div className="w-fit rounded-lg bg-purple-500/20 p-2 text-purple-500 transition-colors dark:bg-purple-600/20 dark:text-purple-600">
              <Settings size={26} />
            </div>
            <p className="card-title">Today 24 hours Sales</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
              {stats.sales24Hours}
            </p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-purple-500 px-2 py-1 font-medium text-purple-500 dark:border-purple-600 dark:text-purple-600">
              <TrendingUp size={18} />
              25%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-purple-500/20 p-2 text-purple-500 transition-colors dark:bg-purple-600/20 dark:text-purple-600">
              <DollarSign size={26} />
            </div>
            <p className="card-title">Last 7 day Sales</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
              {stats.sales7Days}
            </p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-purple-500 px-2 py-1 font-medium text-purple-500 dark:border-purple-600 dark:text-purple-600">
              <TrendingUp size={18} />
              12%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-purple-500/20 p-2 text-purple-500 transition-colors dark:bg-purple-600/20 dark:text-purple-600">
              <Users size={26} />
            </div>
            <p className="card-title">Last 30 days Sales</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
              {stats.sales30Days}
            </p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-purple-500 px-2 py-1 font-medium text-purple-500 dark:border-purple-600 dark:text-purple-600">
              <TrendingUp size={18} />
              15%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-purple-500/20 p-2 text-purple-500 transition-colors dark:bg-purple-600/20 dark:text-purple-600">
              <CreditCard size={26} />
            </div>
            <p className="card-title">Available Agents</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
              {stats.totalAgents}
            </p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-purple-500 px-2 py-1 font-medium text-purple-500 dark:border-purple-600 dark:text-purple-600">
              <TrendingUp size={18} />
              19%
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="card col-span-1 md:col-span-2 lg:col-span-4">
          <div className="card-header">
            <p className="card-title">Overview</p>
          </div>
          <div className="card-body p-0">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={salesGraph}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorTotalCustom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip cursor={false} formatter={(value) => `$${value}`} />

                <XAxis
                  dataKey="name"
                  strokeWidth={0}
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickMargin={6}
                />
                <YAxis
                  dataKey="total"
                  strokeWidth={0}
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickFormatter={(value) => `$${value}`}
                  tickMargin={6}
                />

                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorTotalCustom)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card col-span-1 md:col-span-2 lg:col-span-3">
          <div className="card-header">
            <p className="card-title">Recent Sales</p>
          </div>
          <div className="card-body h-[300px] overflow-auto p-0">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between gap-x-4 py-2 pr-2"
              >
                <div className="flex items-center gap-x-4">
                  <img
                    src={avatarImage}
                    alt={sale.name}
                    className="size-10 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-y-2">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {sale.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {sale.email}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  {sale.campaignType}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomDashboard;
