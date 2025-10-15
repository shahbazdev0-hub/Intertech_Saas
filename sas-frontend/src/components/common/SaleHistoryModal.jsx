import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { getSaleHistory, addSaleHistory } from "../../api/saleApi";
import useAuth from "../../hooks/useAuth";
import { useSidebar } from "../../contexts/SidebarContext";
import { cn } from "../../utils/cn";

export const SaleHistoryModal = ({
  isOpen,
  onClose,
  saleId,
  saleIdentifier,
}) => {
  const [activeTab, setActiveTab] = useState("history");
  const { user } = useAuth();
  const { collapsed, sidebarWidth } = useSidebar();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const statusValue = watch("status");

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["saleHistory", saleId],
    queryFn: () => getSaleHistory(saleId),
    enabled: isOpen && !!saleId,
  });

  const historyMutation = useMutation({
    mutationFn: addSaleHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(["saleHistory", saleId]);
      queryClient.invalidateQueries(["sales"]);
      toast.success("Sale history updated!");
      reset();
      setActiveTab("history");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to update sale history");
    },
  });

  const onFormSubmit = (data) => {
    const payload = {
      sale: saleId,
      identifier: saleIdentifier,
      history: [
        {
          action: "Status Update",
          status: data.status,
          reason: data.reason,
          rejectionReason: data.rejectionReason || "",
          notes: data.notes || "",
          nextAction: data.nextAction || "",
          qualityScore: data.qualityScore
            ? Number(data.qualityScore)
            : undefined,
          systemData: {
            browser: navigator.userAgent,
            device: /Mobi|Android/i.test(navigator.userAgent)
              ? "Mobile"
              : "Desktop",
          },
        },
      ],
      comments: data.comment
        ? [
            {
              comment: data.comment,
              systemData: {
                browser: navigator.userAgent,
                device: /Mobi|Android/i.test(navigator.userAgent)
                  ? "Mobile"
                  : "Desktop",
              },
            },
          ]
        : [],
    };

    historyMutation.mutate({ id: saleId, payload });
  };

  const handleClose = () => {
    reset();
    setActiveTab("history");
    onClose();
  };

  const statusOptions = [
    { value: "pending", label: "Pending Review" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "red_flag", label: "Red Flag" },
    { value: "escalated", label: "Escalated" },
  ];

  const rejectionOptions = [
    { value: "activation_fee_missing", label: "Activation fee missing" },
    { value: "monthly_charges_missing", label: "Monthly charges missing" },
    {
      value: "activation_and_monthly_charges_both_missing",
      label: "Activation and monthly charges both missing",
    },
    { value: "home_warranty_missing", label: "Home warranty missing" },
    {
      value: "direct_sale_no_information_verified",
      label: "Direct sale(no information verified)",
    },
    {
      value: "pushed_sale_confused_customer",
      label: "Pushed sale ( confused customer )",
    },
    { value: "abusive_language", label: "Abusive language" },
    { value: "electricity_pitch_used", label: "Electricity pitch Used" },
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      under_review: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      requires_revision: "bg-orange-100 text-orange-800",
      escalated: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status ? status.replace("_", " ").toUpperCase() : "UNKNOWN"}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      agent: "bg-blue-100 text-blue-800",
      admin: "bg-purple-100 text-purple-800",
      superadmin: "bg-red-100 text-red-800",
      "qa-agent": "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          roleStyles[role] || "bg-gray-100 text-gray-800"
        }`}
      >
        {role ? role.toUpperCase() : "UNKNOWN"}
      </span>
    );
  };

  const canUpdateStatus = () => {
    return ["admin", "superadmin", "qa-agent", "qa-manager"].includes(
      user?.role
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={cn(
          "bg-white dark:bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col transition-all duration-300",
          // Position modal to respect sidebar width on desktop
          "md:ml-4 md:mr-4"
        )}
        style={{
          marginLeft:
            window.innerWidth >= 768 ? `${sidebarWidth + 16}px` : "16px",
          maxWidth:
            window.innerWidth >= 768
              ? `calc(100vw - ${sidebarWidth + 32}px)`
              : "calc(100vw - 32px)",
        }}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Sale History & Management
          </h2>
          <p className="text-gray-600 mt-1">
            {saleIdentifier && `Sale: ${saleIdentifier}`}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "history"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("history")}
          >
            History & Timeline
          </button>
          {canUpdateStatus() && (
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "status"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("status")}
            >
              Add Comment / Update Status
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "history" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">
                Status History & Comments
              </h3>
              {historyLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : historyData?.history?.length > 0 ? (
                <div className="space-y-4">
                  {historyData.history?.map((entry, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                              {(entry?.history?.[0]?.actionBy?.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="font-medium text-gray-900">
                                {entry?.history?.[0]?.actionBy?.name ||
                                  "Unknown User"}
                              </div>
                              {getRoleBadge(
                                entry?.history?.[0]?.actionBy?.role
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(entry.status)}
                              {entry?._id && (
                                <span className="text-xs text-gray-500 font-mono">
                                  #{entry?._id.slice(-6)}
                                </span>
                              )}
                            </div>
                            {entry?.history?.[0]?.actionBy?.role && (
                              <div className="text-xs text-gray-500 mt-1">
                                {entry?.history?.[0]?.actionBy?.role}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">
                            {entry?.history?.[0]?.timestamp
                              ? format(
                                  new Date(entry?.history?.[0]?.timestamp),
                                  "PPp"
                                )
                              : "Unknown time"}
                          </span>
                          {entry?.history?.[0]?.ipAddress && (
                            <div className="text-xs text-gray-700 mt-1">
                              IP: {entry?.history?.[0]?.ipAddress}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        {entry?.history?.[0]?.action && (
                          <div className="text-sm text-gray-700">
                            <strong className="text-blue-600">Action:</strong>{" "}
                            {entry?.history?.[0]?.action}
                          </div>
                        )}
                        {entry?.history?.[0]?.reason && (
                          <div className="text-sm text-gray-700">
                            <strong className="text-green-600">Reason:</strong>{" "}
                            {entry?.history?.[0]?.reason}
                          </div>
                        )}
                        {entry?.history?.[0]?.rejectionReason && (
                          <div className="text-sm text-gray-700">
                            <strong className="text-red-600">Rejection:</strong>{" "}
                            {entry?.history?.[0]?.rejectionReason.replace(
                              "_",
                              " "
                            )}
                          </div>
                        )}
                        {entry?.history?.[0]?.notes && (
                          <div className="text-sm text-gray-700">
                            <strong className="text-gray-600">Notes:</strong>{" "}
                            {entry?.history?.[0]?.notes}
                          </div>
                        )}
                        {entry?.history?.[0]?.comment && (
                          <div className="text-sm text-gray-700">
                            <strong className="text-indigo-600">
                              Comment:
                            </strong>{" "}
                            {entry?.history?.[0]?.comment}
                          </div>
                        )}
                        {entry?.history?.[0]?.systemData && (
                          <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded mt-2">
                            <strong>System Info:</strong> Browser:{" "}
                            {entry?.history?.[0]?.systemData.browser ||
                              "Unknown"}
                            , Device:{" "}
                            {entry?.history?.[0]?.systemData.device ||
                              "Unknown"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No history available for this sale.
                </p>
              )}
            </div>
          )}

          {activeTab === "status" && canUpdateStatus() && (
            <div>
              <h3 className="text-lg font-medium mb-4">
                Update Sale Status & Add Comment
              </h3>
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <Select
                  label="New Status"
                  options={statusOptions}
                  {...register("status", {
                    required: "Status is required",
                  })}
                  error={errors.status?.message}
                />

                <Input
                  label="Reason for Status Change (Optional)"
                  placeholder="Why are you changing the status?"
                  {...register("reason")}
                  error={errors.reason?.message}
                />

                {statusValue === "rejected" && (
                  <Select
                    label="Rejection Category"
                    options={rejectionOptions}
                    {...register("rejectionReason")}
                    error={errors.rejectionReason?.message}
                  />
                )}

                <Input
                  label="Next Action (Optional)"
                  placeholder="What to do next?"
                  {...register("nextAction")}
                  error={errors.nextAction?.message}
                />

                <Input
                  label="Quality Score (0-10)"
                  type="number"
                  min={0}
                  max={10}
                  {...register("qualityScore", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Minimum is 0" },
                    max: { value: 10, message: "Maximum is 10" },
                  })}
                  error={errors.qualityScore?.message}
                />

                <Input
                  label="Comment"
                  placeholder="Write your comment..."
                  {...register("comment", {
                    minLength: {
                      value: 5,
                      message: "Comment must be at least 5 characters",
                    },
                  })}
                  error={errors.comment?.message}
                />

                <Input
                  label="Additional Notes (Optional)"
                  placeholder="Add any additional notes..."
                  {...register("notes")}
                  error={errors.notes?.message}
                />

                <div className="flex justify-end space-x-3">
                  <Button type="submit" disabled={historyMutation.isPending}>
                    {historyMutation.isPending ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
