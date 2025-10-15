import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAgents, toggleAgentActive } from "../../api/authApi";
import { Button } from "../../components/common/Button";
import { format } from "date-fns";
import { Table } from "../../components/common/Table";
import { useAuth } from "../../contexts/AuthContext";
import { DeleteModal } from "../../components/common/DeleteModal";
import { useState } from "react";

export const Agents = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
    onError: (err) => {
      toast.error(err.response?.data?.msg || "Failed to fetch agents");
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: toggleAgentActive,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["agents"]);
      toast.success(data.msg);
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to toggle agent status");
    },
  });
  const handleViewAgent = (agent) => {
    navigate(`/agents/${agent._id}`);
  };
  const handleToggleActive = (agent) => {
    toggleActiveMutation.mutate(agent._id);
  };

  const handleCreateAgent = () => {
    navigate("/create-agent");
  };
  const agentColumns = [
    { key: "name", header: "Name" },
    {
      key: "email",
      header: "Email",
    },
    { key: "role", header: "Role" },
    {
      key: "createdAt",
      header: "Created at",
      render: (value) => (value ? format(new Date(value), "PP") : "-"),
    },
    {
      key: "isActive",
      header: "Status",
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
            value
              ? "text-green-600 bg-green-100"
              : "text-yellow-600 bg-yellow-100"
          }`}
        >
          {value ? "Active" : "Deactivated"}
        </span>
      ),
    },
  ];
  const renderActions = (agent) => (
    <div className="flex space-x-2">
      <Button
        variant={agent.isActive ? "destructive" : "secondary"}
        size="sm"
        onClick={() => handleToggleActive(agent)}
        disabled={toggleActiveMutation.isPending}
      >
        {agent.isActive ? "Deactivate" : "Activate"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleViewAgent(agent)}
      >
        View
      </Button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Agents</h2>
        <Button onClick={handleCreateAgent}>Create Agent</Button>
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {isError && (
        <p className="text-red-500">
          Error: {error.response?.data?.msg || "Failed to load agents"}
        </p>
      )}

      {data?.agents?.length > 0 ? (
        <div className="overflow-x-auto">
          <Table
            columns={agentColumns}
            data={data?.agents || []}
            actions={
              ["admin", "superadmin", "qa-agent"].includes(user?.role)
                ? renderActions
                : null
            }
            rowKey="_id"
          />
        </div>
      ) : !isLoading && !isError ? (
        <p className="text-gray-500">No agents found.</p>
      ) : null}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {}}
        isPending={false}
        entityName="Agent"
        entityIdentifier={agentToDelete?.name}
      />
    </div>
  );
};
