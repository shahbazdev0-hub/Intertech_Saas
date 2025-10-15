import axiosInstance from "./axiosInstance";
export const createSale = async (payload) => {
  const response = await axiosInstance.post(`/sales`, payload);
  return response.data;
};

export const getSales = async () => {
  const response = await axiosInstance.get(`/sales`);
  return response.data;
};
export const patchSale = async ({ id, payload }) => {
  const response = await axiosInstance.patch(`/sales/${id}`, payload);
  return response.data;
};

export const deleteSale = async (id) => {
  const response = await axiosInstance.delete(`/sales/${id}`);
  return response.data;
};
export const getAgentSalesCounts = async () => {
  const response = await axiosInstance.get(
    "/sales/dashboard/agent-sales-counts",
  );
  return response.data;
};

export const exportSalesCSV = async () => {
  const response = await axiosInstance.get("/sales/export", {
    responseType: "blob",
  });
  return response.data;
};

export const passSale = async ({ id, payload }) => {
  const response = await axiosInstance.patch(`/sales/${id}/pass`, payload);
  return response.data;
};

export const rejectSale = async ({ id, payload }) => {
  const response = await axiosInstance.patch(`/sales/${id}/reject`, payload);
  return response.data;
};

export const getSaleHistory = async (id) => {
  const response = await axiosInstance.get(`/sale-history/${id}/history`);
  return response.data;
};

export const addSaleHistory = async ({ payload }) => {
  const response = await axiosInstance.post(`/sale-history/history`, payload);
  return response.data;
};

export const addSaleHistoryComment = async ({ id, payload }) => {
  const response = await axiosInstance.post(
    `/sale-history/${id}/comments`,
    payload,
  );
  return response.data;
};

export const updateSaleHistoryStatus = async ({ id, payload }) => {
  const response = await axiosInstance.patch(
    `/sale-history/${id}/status`,
    payload,
  );
  return response.data;
};
