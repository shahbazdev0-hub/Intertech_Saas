import axiosInstance from "./axiosInstance";

export const publicRegister = async (payload) => {
  const response = await axiosInstance.post("/auth/public-register", payload);
  return response.data;
};

export const protectedRegister = async (payload) => {
  const response = await axiosInstance.post("/auth/register", payload);
  return response.data;
};

export const login = async (payload) => {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
};

export const getAdmins = async () => {
  const response = await axiosInstance.get("/auth/admins");
  return response.data;
};
export const getAgents = async () => {
  const response = await axiosInstance.get("/auth/agents");
  return response.data;
};
export const getAgentById = async (id) => {
  const response = await axiosInstance.get(`/auth/agents/${id}`);
  return response.data;
};

export const forgotPassword = async (payload) => {
  const response = await axiosInstance.post("/auth/forgot-password", payload);
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await axiosInstance.post("/auth/reset-password", payload);
  return response.data;
};

export const toggleAgentActive = async (id) => {
  const response = await axiosInstance.patch(
    `/auth/agents/${id}/toggle-active`
  );
  return response.data;
};

export const getSalesByAgent = async ({ agent, filter }) => {
  const response = await axiosInstance.get("/sales", {
    params: { agent, filter },
  });
  return response.data;
};
export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/auth/dashboard-stats");
  return response.data;
};
export const getDashboardAutoSalesStats = async () => {
  const response = await axiosInstance.get("/auth/dashboard-autosales-stats");
  return response.data;
};
export const getSalesGraph = async () => {
  const response = await axiosInstance.get("/auth/graph-stats");
  return response.data.salesByDate;
};

export const getRecentSales = async () => {
  const response = await axiosInstance.get("/auth/recent-sales");
  return response.data;
};
