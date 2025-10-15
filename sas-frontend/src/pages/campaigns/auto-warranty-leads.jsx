import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createLead,
  deleteLead,
  getLeads,
  passLead,
  rejectLead,
  updateHistoryStatus,
} from "../../api/leadApi";
import { Input } from "../../components/common/Input";
import { RadioGroup } from "../../components/common/RadioGroup";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { Table } from "../../components/common/Table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteModal } from "../../components/common/DeleteModal";
import { PassModal } from "../../components/common/PassModal";
import { RejectModal } from "../../components/common/RejectModal";
import { LeadHistoryModal } from "../../components/common/LeadHistoryModal";

import { leadColumns } from "../../constants";
import useAuth from "../../hooks/useAuth";

export const AutoWarrantyLeads = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const [leadToPass, setLeadToPass] = useState(null);
  const [leadToReject, setLeadToReject] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      toast.success("Auto Warranty Lead created successfully!");
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to create lead");
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["leads"],
    queryFn: getLeads,
    enabled: ["admin", "superadmin", "qa-agent"].includes(user.role),
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
      toast.success("Lead deleted successfully!");
      setDeleteModalOpen(false);
      setLeadToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to delete lead");
    },
  });

  const passMutation = useMutation({
    mutationFn: passLead,
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
      toast.success("Lead approved successfully!");
      setPassModalOpen(false);
      setLeadToPass(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to approve lead");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectLead,
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
      toast.success("Lead rejected successfully!");
      setRejectModalOpen(false);
      setLeadToReject(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to reject lead");
    },
  });

  const statusUpdateMutation = useMutation({
    mutationFn: updateHistoryStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
      toast.success("Lead status updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to update lead status");
    },
  });

  const handleEditLead = (lead) => {
    navigate(`/edit/lead/${lead._id}`, {
      state: { entityType: "lead", entity: lead },
    });
  };

  const handleDeleteLead = (lead) => {
    setLeadToDelete(lead);
    setDeleteModalOpen(true);
  };

  const handlePassLead = (lead) => {
    setLeadToPass(lead);
    setPassModalOpen(true);
  };

  const handleRejectLead = (lead) => {
    setLeadToReject(lead);
    setRejectModalOpen(true);
  };

  const handleViewHistory = (lead) => {
    setSelectedLead(lead);
    setHistoryModalOpen(true);
  };

  const confirmDelete = () => {
    if (leadToDelete) {
      deleteMutation.mutate(leadToDelete._id);
    }
  };

  const confirmPass = (formData) => {
    if (leadToPass) {
      passMutation.mutate({ id: leadToPass._id, payload: formData });
    }
  };

  const confirmReject = (formData) => {
    if (leadToReject) {
      rejectMutation.mutate({ id: leadToReject._id, payload: formData });
    }
  };

  const dialerNameOptions = [
    {
      value: "VICIdial Dialer",
      label: "VICIdial Dialer",
    },
    { value: "Omni Dialer", label: "Omni Dialer" },
  ];

  const extendedWarrantyOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const customerAgreedForTransferToSeniorRepresentativeOptions = [
    {
      value: "yes",
      label: "Yes",
    },
    { value: "no", label: "No" },
  ];

  const renderActions = (lead) => {
    const currentStatus = lead?.history?.[0]?.status || "pending";
    const canApprove = ["admin", "superadmin", "qa-agent"].includes(user?.role);
    const canEdit = ["admin", "superadmin"].includes(user?.role);

    return (
      <div className="flex space-x-1 flex-wrap gap-1 min-w-sm">
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleViewHistory(lead)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          QA History
        </Button>
        {/* 
        {currentStatus !== "approved" && canApprove && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handlePassLead(lead)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Pass
          </Button>
        )}

        {currentStatus !== "rejected" && canApprove && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleRejectLead(lead)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Reject
          </Button>
        )} */}

        {canEdit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditLead(lead)}
          >
            Edit
          </Button>
        )}

        {canEdit && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteLead(lead)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Delete
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Auto Warranty Lead Form</h2>

      {user.role === "agent" ? (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date of Sale"
              type="date"
              {...register("dateOfSale", {
                required: "Date of sale is required",
              })}
              error={errors.dateOfSale?.message}
            />
            <Input
              label="Customer Name"
              {...register("customerName", {
                required: "Customer name is required",
              })}
              error={errors.customerName?.message}
            />
            <Input
              label="Agent name"
              {...register("agentName", {
                required: "Agent name is required",
              })}
              error={errors.customerName?.message}
            />
            <Input
              label="Primary Phone Number"
              type="tel"
              {...register("primaryPhone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\+?[\d\s-]{10,15}$/,
                  message: "Invalid phone number",
                },
              })}
              error={errors.primaryPhone?.message}
            />
            <Input
              label="Vehicle Mileage"
              {...register("vehicleMileage", {
                required: "Vehicle Mileage is required",
              })}
              error={errors.vehicleMileage?.message}
            />
            <Select
              label="Extended Warranty Options"
              options={extendedWarrantyOptions}
              {...register("extendedWarranty", {
                required: "Extended Warranty is required",
              })}
              error={errors.extendedWarranty?.message}
            />
            <Select
              label="Customer Agreed for Transfer to Senior Representative"
              options={customerAgreedForTransferToSeniorRepresentativeOptions}
              {...register("customerAgreedForTransferToSeniorRepresentative", {
                required: "Customer agreed or not is required",
              })}
              error={errors.extendedWarranty?.message}
            />
            <Input
              label="Email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              error={errors.email?.message}
            />
            <Input
              label="Vehicle Make Model & Variant?"
              {...register("vehicleMakeModelVariant")}
              error={errors.vehicleMakeModelVariant?.message}
            />
            <Input
              label="Address"
              {...register("address", { required: "Address is required" })}
              error={errors.address?.message}
            />
            {/* Full-width fields */}
            <div className="col-span-1 md:col-span-2">
              <RadioGroup
                label="Dialer name"
                name="dialerName"
                options={dialerNameOptions}
                {...register("dialerName", {
                  required: "Dialer name is required",
                })}
                error={errors.dialerName?.message}
              />
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit Lead"}
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">
            Auto Warranty Leads Data
          </h3>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : isError ? (
            <p className="text-red-500">
              Error: {error.response?.data?.msg || "Failed to load leads"}
            </p>
          ) : data?.leads?.length > 0 ? (
            <div className="overflow-x-auto">
              <Table
                columns={leadColumns}
                data={data?.leads || []}
                actions={
                  ["admin", "superadmin", "qa-agent"].includes(user?.role)
                    ? renderActions
                    : null
                }
                rowKey="_id"
              />
            </div>
          ) : (
            <p className="text-gray-500">No leads found.</p>
          )}
        </div>
      )}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        entityName="Lead"
        entityIdentifier={leadToDelete?.customerName}
      />
      <PassModal
        isOpen={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        onConfirm={confirmPass}
        isPending={passMutation.isPending}
        entityName="Lead"
        entityIdentifier={leadToPass?.customerName}
      />
      <RejectModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={confirmReject}
        isPending={rejectMutation.isPending}
        entityName="Lead"
        entityIdentifier={leadToReject?.customerName}
      />
      <LeadHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        leadId={selectedLead?._id}
        leadIdentifier={selectedLead?.customerName}
      />
    </div>
  );
};
