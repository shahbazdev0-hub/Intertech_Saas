import axiosInstance from "./axiosInstance";
export const createAutoSale = async (payload) => {
  const response = await axiosInstance.post(`/auto-sales`, payload);
  return response.data;
};

export const getAutoSales = async () => {
  const response = await axiosInstance.get(`/auto-sales`);
  return response.data;
};

export const editAutoSale = async ({ id, payload }) => {
  const response = await axiosInstance.patch(`/auto-sales/${id}`, payload);
  return response.data;
};

export const deleteAutoSale = async (id) => {
  const response = await axiosInstance.delete(`/auto-sales/${id}`);
  return response.data;
};

export const exportAutoSalesCSV = async () => {
  const response = await axiosInstance.get("/auto-sales/export", {
    responseType: "blob",
  });
  return response.data;
};

export const passSale = async ({ id, payload }) => {
  const response = await axiosInstance.patch(`/auto-sales/${id}/pass`, payload);
  return response.data;
};

export const rejectSale = async ({ id, payload }) => {
  const response = await axiosInstance.patch(
    `/auto-sales/${id}/reject`,
    payload,
  );
  return response.data;
};

export const getAutoSaleHistory = async (id) => {
  const response = await axiosInstance.get(`/sale-history/${id}/history`);
  return response.data;
};

export const addAutoSaleHistory = async ({ payload }) => {
  const response = await axiosInstance.post(`/sale-history/history`, payload);
  return response.data;
};

export const addAutoSaleHistoryComment = async ({ id, payload }) => {
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
