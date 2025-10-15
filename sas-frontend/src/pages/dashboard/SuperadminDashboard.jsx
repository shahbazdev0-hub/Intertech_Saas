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
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getDashboardAutoSalesStats,
  getDashboardStats,
  getRecentSales,
  getSalesGraph,
} from "../../api/authApi";
import avatarImage from "../../assets/avatar.png";
import DashboardStats from "../../components/common/DashboardStats";

const SuperadminDashboardPage = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    sales24Hours: 0,
    sales7Days: 0,
    sales30Days: 0,
    totalAgents: 0,
  });
  const [autoSalesStats, setAutoSalesStats] = useState({
    sales24Hours: 0,
    sales7Days: 0,
    sales30Days: 0,
    totalAgents: 0,
  });
  const [salesGraph, setSalesGraph] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    const fetchHomeWarrantyStats = async () => {
      try {
        const data = await getDashboardStats();
        const autoSalesData = await getDashboardAutoSalesStats();
        const graphData = await getSalesGraph();
        const recent = await getRecentSales();
        const formatted = graphData.map((item) => ({
          name: item._id,
          total: item.total,
        }));
        setStats(data);
        setAutoSalesStats(autoSalesData);
        setSalesGraph(formatted);
        setRecentSales(recent);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };

    fetchHomeWarrantyStats();
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Home Warranty Sales</h1>
      <DashboardStats stats={stats} />
      <h1 className="title">Auto Warranty Sales</h1>
      <DashboardStats stats={autoSalesStats} />
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
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#db0d0f" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#db0d0f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip cursor={false} formatter={(value) => `${value}`} />

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
                  tickFormatter={(value) => `${value}`}
                  tickMargin={6}
                />

                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#db0d0f"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
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

export default SuperadminDashboardPage;
