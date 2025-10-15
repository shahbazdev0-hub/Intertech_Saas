import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAgentById, getSalesByAgent } from "../../api/authApi";
import { Button } from "../../components/common/Button";
import { Table } from "../../components/common/Table";
import { format } from "date-fns";

const AgentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const {
    data: agentData,
    isLoading: isAgentLoading,
    isError: isAgentError,
    error: agentError,
  } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => getAgentById(id),
    onError: (err) => {
      toast.error(err.response?.data?.msg || "Failed to fetch agent details");
    },
  });

  const {
    data: salesData,
    isLoading: isSalesLoading,
    isError: isSalesError,
    error: salesError,
  } = useQuery({
    queryKey: ["sales", id, filter],
    queryFn: () => getSalesByAgent({ agent: id, filter }),
    onError: (err) => {
      toast.error(err.response?.data?.msg || "Failed to fetch sales data");
    },
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const salesColumns = [
    { key: "customerName", header: "Customer" },
    { key: "primaryPhone", header: "Primary Phone" },
    { key: "campaignType", header: "Campaign Type" },
    {
      key: "agentName",
      header: "Agent",
      render: (_, sale) => sale.agent?.name || sale.agentName || "-",
    },
    { key: "confirmationNumber", header: "Confirmation Number" },
    { key: "planName", header: "Plan Name" },
    { key: "address", header: "Address" },
    { key: "email", header: "Email" },
    {
      key: "activationFee",
      header: "Activation Fee",
      render: (value) => (value ? `$${value.toFixed(2)}` : "-"),
    },
    { key: "paymentMode", header: "Payment Mode" },
    { key: "bankName", header: "Bank Name" },
    { key: "chequeOrCardNumber", header: "Check or Card Number" },
    { key: "cvv", header: "CVV" },
    { key: "expiryDate", header: "Expiry Date" },
    { key: "merchantName", header: "Merchant Name" },
    { key: "checkingAccountNumber", header: "Checking Account Number" },
    { key: "routingNumber", header: "Routing Number" },
    { key: "alternativePhone", header: "Alternative Phone" },
    {
      key: "dateOfSale",
      header: "Date of Sale",
      render: (value) => (value ? format(new Date(value), "PP") : "-"),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Agent Details</h2>
        <Button onClick={() => navigate("/agents")}>Back to Agents</Button>
      </div>

      {isAgentLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {isAgentError && (
        <p className="text-red-500">
          Error:{" "}
          {agentError.response?.data?.msg || "Failed to load agent details"}
        </p>
      )}

      {agentData?.agent && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">{agentData.agent.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Email:</strong> {agentData.agent.email}
              </p>
              <p>
                <strong>Role:</strong> {agentData.agent.role}
              </p>
            </div>
            <div>
              <p>
                <strong>Status:</strong>
                <span
                  className={`ml-2 inline-block px-2 py-1 rounded-full text-sm font-medium ${
                    agentData.agent.isActive
                      ? "text-green-600 bg-green-100"
                      : "text-yellow-600 bg-yellow-100"
                  }`}
                >
                  {agentData.agent.isActive ? "Active" : "Deactivated"}
                </span>
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {format(new Date(agentData.agent.createdAt), "PP")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Sales</h3>
        <div className="flex space-x-2 mb-4">
          {["all", "24hours", "7days", "30days", "90days"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => handleFilterChange(f)}
            >
              {f === "all"
                ? "All Time"
                : f === "90days"
                ? "Last 90 Days"
                : f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {isSalesLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {isSalesError && (
          <p className="text-red-500">
            Error:{" "}
            {salesError.response?.data?.msg || "Failed to load sales data"}
          </p>
        )}

        {salesData?.sales?.length > 0 ? (
          <div className="overflow-x-auto">
            <Table columns={salesColumns} data={salesData.sales} rowKey="_id" />
          </div>
        ) : !isSalesLoading && !isSalesError ? (
          <p className="text-gray-500">No sales found for this filter.</p>
        ) : null}
      </div>
    </div>
  );
};

export default AgentDetails;
