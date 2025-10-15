import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAgentById, getSalesByAgent } from "../api/authApi";
import { SALES_FILTERS } from "../constants";

export const useAgentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState(SALES_FILTERS.ALL);

  const {
    data: agentData,
    isLoading: isAgentLoading,
    isError: isAgentError,
  } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => getAgentById(id),
    enabled: !!id,
    onError: (err) => {
      toast.error(err.response?.data?.msg || "Failed to fetch agent details");
    },
  });

  const {
    data: salesData,
    isLoading: isSalesLoading,
    isError: isSalesError,
  } = useQuery({
    queryKey: ["sales", id, filter],
    queryFn: () => getSalesByAgent({ agent: id, filter }),
    enabled: !!id,
    onError: (err) => {
      toast.error(err.response?.data?.msg || "Failed to fetch sales data");
    },
  });

  const navigateBack = () => navigate("/agents");

  return {
    agentData,
    salesData,
    isAgentLoading,
    isSalesLoading,
    isAgentError,
    isSalesError,
    filter,
    setFilter,
    navigateBack,
  };
};
