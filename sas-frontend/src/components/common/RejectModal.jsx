import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";

export const RejectModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  entityName = "Lead",
  entityIdentifier,
  customRejectionReasons,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    onConfirm(data);
  };

  const defaultRejectionReasons = [
    { value: "incomplete_information", label: "Incomplete Information" },
    { value: "invalid_contact", label: "Invalid Contact Details" },
    { value: "duplicate_lead", label: "Duplicate Lead" },
    { value: "unqualified", label: "Unqualified Lead" },
    { value: "customer_not_interested", label: "Customer Not Interested" },
    { value: "other", label: "Other" },
  ];

  const rejectionReasons = customRejectionReasons || defaultRejectionReasons;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Reject {entityName}
          </h2>
          <p className="text-gray-600 mt-1">
            {entityIdentifier && `${entityName}: ${entityIdentifier}`}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to reject the {entityName.toLowerCase()}{" "}
            {entityIdentifier && (
              <span className="font-medium">"{entityIdentifier}"</span>
            )}
            ?
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">
                <strong>Action:</strong> Rejecting this lead will change its
                status to "Rejected" and may require agent follow-up.
              </p>
            </div>

            <Select
              label="Primary Rejection Reason"
              options={rejectionReasons}
              {...register("rejectionReason", {
                required: "Rejection reason is required",
              })}
              error={errors.rejectionReason?.message}
            />

            <Input
              label="Detailed Explanation"
              placeholder="Provide comprehensive explanation for rejection..."
              {...register("reason", {
                required: "Detailed explanation is required",
                minLength: {
                  value: 20,
                  message: "Explanation must be at least 20 characters",
                },
              })}
              error={errors.reason?.message}
            />

            <Select
              label="Can this lead be revised?"
              options={[
                { value: "yes", label: "Yes - Agent can fix issues" },
                { value: "no", label: "No - Lead is permanently invalid" },
                { value: "maybe", label: "Maybe - Requires review" },
              ]}
              {...register("canBeRevised", {
                required: "Please specify if lead can be revised",
              })}
              error={errors.canBeRevised?.message}
            />

            <Input
              label="Recommended Actions for Agent"
              placeholder="What should the agent do to improve future leads?"
              {...register("recommendedActions")}
              error={errors.recommendedActions?.message}
            />

            <Input
              label="Additional Notes (Optional)"
              placeholder="Any additional feedback or observations..."
              {...register("notes")}
              error={errors.notes?.message}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? "Processing..." : "Reject Lead"}
              </Button>
            </div>
          </form>
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
