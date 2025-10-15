import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Input } from "../../components/common/Input";
import { RadioGroup } from "../../components/common/RadioGroup";
import { Textarea } from "../../components/common/TextArea";
import { Button } from "../../components/common/Button";
import {
  createAutoSale,
  getAutoSales,
  deleteAutoSale,
  exportAutoSalesCSV,
} from "../../api/autoSaleApi";
import { Table } from "../../components/common/Table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteModal } from "../../components/common/DeleteModal";
import { PassModal } from "../../components/common/PassModal";
import { RejectModal } from "../../components/common/RejectModal";
import { AutoSaleHistoryModal } from "../../components/common/AutoSaleHistoryModal";
import { Select } from "../../components/common/Select";
import { autoWarrantySalesColumns } from "../../constants";
import useAuth from "../../hooks/useAuth";
import {
  passSale,
  rejectSale,
  updateSaleHistoryStatus,
} from "../../api/autoSaleApi";

export const AutoWarrantySales = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [saleToPass, setSaleToPass] = useState(null);
  const [saleToReject, setSaleToReject] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
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
    mutationFn: createAutoSale,
    onSuccess: () => {
      toast.success("Sale created successfully!");
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to create sale");
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["auto-sales"],
    queryFn: getAutoSales,
    enabled: ["admin", "superadmin", "qa-agent", "qa-manager", "custom"].includes(user.role),
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  const deleteMutation = useMutation({
    mutationFn: deleteAutoSale,
    onSuccess: () => {
      queryClient.invalidateQueries(["auto-sales"]);
      toast.success("Sale deleted successfully!");
      setDeleteModalOpen(false);
      setSaleToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to delete sale");
    },
  });

  const passMutation = useMutation({
    mutationFn: passSale,
    onSuccess: () => {
      queryClient.invalidateQueries(["auto-sales"]);
      toast.success("Sale approved successfully!");
      setPassModalOpen(false);
      setSaleToPass(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to approve sale");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectSale,
    onSuccess: () => {
      queryClient.invalidateQueries(["auto-sales"]);
      toast.success("Sale rejected successfully!");
      setRejectModalOpen(false);
      setSaleToReject(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to reject sale");
    },
  });

  const statusUpdateMutation = useMutation({
    mutationFn: updateSaleHistoryStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["auto-sales"]);
      toast.success("Sale status updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to update sale status");
    },
  });

  const handleEditSale = (sale) => {
    navigate(`/edit/auto-warranty-sale/${sale._id}`, {
      state: { entityType: "sale", entity: sale },
    });
  };

  const handleDeleteSale = (sale) => {
    setSaleToDelete(sale);
    setDeleteModalOpen(true);
  };

  const handlePassSale = (sale) => {
    setSaleToPass(sale);
    setPassModalOpen(true);
  };

  const handleRejectSale = (sale) => {
    setSaleToReject(sale);
    setRejectModalOpen(true);
  };

  const handleViewHistory = (sale) => {
    setSelectedSale(sale);
    setHistoryModalOpen(true);
  };

  const confirmDelete = () => {
    if (saleToDelete) {
      deleteMutation.mutate(saleToDelete._id);
    }
  };

  const confirmPass = (formData) => {
    if (saleToPass) {
      passMutation.mutate({ id: saleToPass._id, payload: formData });
    }
  };

  const confirmReject = (formData) => {
    if (saleToReject) {
      rejectMutation.mutate({ id: saleToReject._id, payload: formData });
    }
  };

  const campaignTypeOptions = [
    {
      value: "ASMB Auto Care",
      label: "ASMB Auto Care",
    },
    { value: "Auto 2", label: "Auto 2" },
    { value: "Inline auto service", label: "Inline auto service" },
  ];
  const planOptions = [
    { value: "Power Train Plan", label: "Power Train Plan" },
    { value: "Platinum Plan", label: "Platinum Plan" },
  ];
  const paymentOptions = [
    { value: "Credit Card", label: "Credit Card" },
    { value: "Cheque Book", label: "Cheque Book" },
  ];

  const handleExportCSV = async () => {
    try {
      const blob = await exportAutoSalesCSV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "auto_warranty_sales.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Auto Sales CSV downloaded!");
    } catch (err) {
      console.error("CSV Download Error:", err);
      toast.error("Failed to download auto sales as CSV.");
    }
  };

  const renderActions = (sale) => {
    const currentStatus = sale?.history?.[0]?.status || "pending";
    const canApprove = ["admin", "superadmin", "qa-agent"].includes(user?.role);
    const canEdit = ["admin", "superadmin"].includes(user?.role);

    return (
      <div className="flex space-x-1 flex-wrap gap-1">
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleViewHistory(sale)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          QA History
        </Button>

        {canEdit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditSale(sale)}
          >
            Edit
          </Button>
        )}

        {canEdit && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteSale(sale)}
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-6">Auto Warranty Sales Form</h2>
        {!user?.role === "agent" && (
          <Button className="mb-4" onClick={handleExportCSV} variant="primary">
            Export Auto Sales
          </Button>
        )}
      </div>

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
              label="VIN Number"
              {...register("vinNumber", {
                required: "VIN number is required",
              })}
              error={errors.vinNumber?.message}
            />
            <Input
              label="Vehicle Mileage"
              {...register("vehicleMileage", {
                required: "Vehicle Mileage is required",
              })}
              error={errors.vehicleMileage?.message}
            />
            <Input
              label="Vehicle Model"
              {...register("vehicleModel", {
                required: "Vehicle Model is required",
              })}
              error={errors.vehicleModel?.message}
            />
            <Select
              label="Plan name"
              options={planOptions}
              {...register("planName", {
                required: "Plan name is required",
              })}
              error={errors.planNumber?.message}
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
              label="Confirmation Number"
              {...register("confirmationNumber", {
                required: "Confirmation number is required",
              })}
              error={errors.confirmationNumber?.message}
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
              label="Agent name"
              {...register("agentName")}
              error={errors.agentName?.message}
            />
            <Input
              label="Activation Fee"
              type="number"
              step="0.01"
              {...register("activationFee", {
                required: "Activation fee is required",
                min: { value: 0, message: "Activation fee cannot be negative" },
              })}
              error={errors.activationFee?.message}
            />
            <Input
              label="Bank Name"
              {...register("bankName")}
              error={errors.bankName?.message}
            />
            <Input
              label="Cheque or Card number"
              {...register("chequeOrCardNumber")}
              error={errors.chequeOrCardNumber?.message}
            />
            <Input
              label="CVV"
              type="password"
              {...register("cvv")}
              error={errors.cvv?.message}
            />
            <Input
              label="Expiry Date (MM/YY)"
              {...register("expiryDate")}
              error={errors.expiryDate?.message}
            />
            <Input
              label="Checking Account Number"
              {...register("checkingAccountNumber")}
              error={errors.checkingAccountNumber?.message}
            />
            <Input
              label="Routing Number"
              {...register("routingNumber")}
              error={errors.routingNumber?.message}
            />
            <Input
              label="Alternative Phone Number"
              type="tel"
              {...register("alternativePhone", {
                pattern: {
                  value: /^\+?[\d\s-]{10,15}$/,
                  message: "Invalid phone number",
                },
              })}
              error={errors.alternativePhone?.message}
            />
            <Input
              label="Fronter name"
              {...register("fronterName", {
                required: "Frontern name is required",
              })}
              error={errors.fronterName?.message}
            />
            <Input
              label="Closer name"
              {...register("closerName", {
                required: "Closer name is required",
              })}
              error={errors.closerName?.message}
            />
            {/* Full-width fields */}
            <div className="col-span-1 md:col-span-2">
              <Textarea
                label="Address"
                {...register("address", { required: "Address is required" })}
                error={errors.address?.message}
              />
            </div>
            <RadioGroup
              label="Payment Mode"
              name="paymentMode"
              options={paymentOptions}
              {...register("paymentMode", {
                required: "Payment mode is required",
              })}
              error={errors.paymentMode?.message}
            />
            <RadioGroup
              label="Campaign Type"
              name="campaignType"
              options={campaignTypeOptions}
              {...register("campaignType", {
                required: "Campaign type is required",
              })}
              error={errors.campaignType?.message}
            />
          </div>
          <div className="mt-6">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit Sale"}
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">Sales Data</h3>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : isError ? (
            <p className="text-red-500">
              Error: {error.response?.data?.msg || "Failed to load sales"}
            </p>
          ) : data?.sales?.length > 0 ? (
            <Table
              columns={autoWarrantySalesColumns}
              data={data?.sales || []}
              actions={
                ["admin", "superadmin", "qa-agent", "qa-manager", "custom"].includes(user?.role)
                  ? renderActions
                  : null
              }
              rowKey="_id"
            />
          ) : (
            <p className="text-gray-500">No sales found.</p>
          )}
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            isPending={deleteMutation.isPending}
            entityName="Sale"
            entityIdentifier={saleToDelete?.customerName}
          />
          <PassModal
            isOpen={passModalOpen}
            onClose={() => setPassModalOpen(false)}
            onConfirm={confirmPass}
            isPending={passMutation.isPending}
            entityName="Sale"
            entityIdentifier={saleToPass?.customerName}
          />
          <RejectModal
            isOpen={rejectModalOpen}
            onClose={() => setRejectModalOpen(false)}
            onConfirm={confirmReject}
            isPending={rejectMutation.isPending}
            entityName="Sale"
            entityIdentifier={saleToReject?.customerName}
          />
          <AutoSaleHistoryModal
            isOpen={historyModalOpen}
            onClose={() => setHistoryModalOpen(false)}
            saleId={selectedSale?._id}
            saleIdentifier={selectedSale?.customerName}
          />
        </div>
      )}
    </div>
  );
};
