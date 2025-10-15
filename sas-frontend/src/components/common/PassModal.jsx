import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./Button";
import { Input } from "./Input";

export const PassModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  entityName = "Lead",
  entityIdentifier,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white  rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Pass {entityName}
          </h2>
          <p className="text-gray-600 mt-1">
            {entityIdentifier && `${entityName}: ${entityIdentifier}`}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to pass the {entityName.toLowerCase()}{" "}
            {entityIdentifier && (
              <span className="font-medium">"{entityIdentifier}"</span>
            )}
            ?
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 text-sm">
                <strong>Action:</strong> Approving this lead will change its
                status to "Approved" and notify relevant stakeholders.
              </p>
            </div>

            <Input
              label="Reason for Approval"
              placeholder="Enter detailed reason for approving this lead..."
              {...register("reason", {
                required: "Reason is required",
                minLength: {
                  value: 15,
                  message: "Reason must be at least 15 characters",
                },
              })}
              error={errors.reason?.message}
            />

            <Input
              label="Quality Score (1-10)"
              type="number"
              min="1"
              max="10"
              placeholder="Rate the lead quality (1-10)"
              {...register("qualityScore", {
                required: "Quality score is required",
                min: { value: 1, message: "Minimum score is 1" },
                max: { value: 10, message: "Maximum score is 10" },
              })}
              error={errors.qualityScore?.message}
            />

            <Input
              label="Next Action Required"
              placeholder="What should happen next with this lead?"
              {...register("nextAction", {
                required: "Next action is required",
              })}
              error={errors.nextAction?.message}
            />

            <Input
              label="Additional Notes (Optional)"
              placeholder="Any additional comments or observations..."
              {...register("notes")}
              error={errors.notes?.message}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {isPending ? "Processing..." : "Pass Lead"}
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
