import axiosInstance from "./axiosInstance";
export const createLead = async (payload) => {
  const response = await axiosInstance.post(`/leads`, payload);
  return response.data;
};

export const getLeads = async () => {
  const response = await axiosInstance.get(`/leads`);
  return response.data;
};

export const patchLead = async ({ id, payload }) => {
  const response = await axiosInstance.patch(`/leads/${id}`, payload);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await axiosInstance.delete(`/leads/${id}`);
  return response.data;
};

export const passLead = async ({ id, payload }) => {
  const response = await axiosInstance.patch(`/leads/${id}/pass`, payload);
  return response.data;
};

export const rejectLead = async ({ id, payload }) => {
  const response = await axiosInstance.patch(`/leads/${id}/reject`, payload);
  return response.data;
};

export const getLeadHistory = async (id) => {
  const response = await axiosInstance.get(`/sale-history/${id}/history`);
  return response.data;
};
export const addLeadHistory = async ({ payload }) => {
  const response = await axiosInstance.post(`/sale-history/history`, payload);
  return response.data;
};
export const addHistoryComment = async ({ id, payload }) => {
  const response = await axiosInstance.post(
    `/sale-history/${id}/comments`,
    payload
  );
  return response.data;
};

export const updateHistoryStatus = async ({ id, payload }) => {
  const response = await axiosInstance.patch(
    `/sale-history/${id}/status`,
    payload
  );
  return response.data;
};

export const getCustomFields = async (id) => {
  const response = await axiosInstance.get(`/leads/${id}/custom-fields`);
  return response.data;
};

export const addCustomField = async ({ id, payload }) => {
  const response = await axiosInstance.post(
    `/leads/${id}/custom-fields`,
    payload
  );
  return response.data;
};

export const updateCustomField = async ({ id, fieldId, payload }) => {
  const response = await axiosInstance.patch(
    `/leads/${id}/custom-fields/${fieldId}`,
    payload
  );
  return response.data;
};

export const deleteCustomField = async ({ id, fieldId }) => {
  const response = await axiosInstance.delete(
    `/leads/${id}/custom-fields/${fieldId}`
  );
  return response.data;
};
