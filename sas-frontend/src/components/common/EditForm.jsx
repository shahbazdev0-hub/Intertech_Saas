import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { patchSale } from "../../api/saleApi";
import { patchLead } from "../../api/leadApi";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { editAutoSale } from "../../api/autoSaleApi";

export const EditForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { entityType, entity } = location.state || {};

  const isSale = entityType === "sale";
  const isLead = entityType === "lead";
  const isAutoWarranty = isSale && entity?.campaign === "Auto Warranty";
  const isHomeWarranty = isSale && entity?.campaign === "Home Warranty";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: isSale
      ? {
          campaign: entity?.campaign || "Home Warranty",
          dateOfSale: entity?.dateOfSale
            ? new Date(entity.dateOfSale).toISOString().split("T")[0]
            : "",
          customerName: entity?.customerName || "",
          primaryPhone: entity?.primaryPhone || "",
          campaignType: entity?.campaignType || "",
          confirmationNumber: entity?.confirmationNumber || "",
          planName: entity?.planName || "",
          address: entity?.address || "",
          email: entity?.email || "",
          activationFee: entity?.activationFee || "",
          paymentMode: entity?.paymentMode || "Credit Card",
          bankName: entity?.bankName || "",
          chequeOrCardNumber: entity?.chequeOrCardNumber || "",
          cvv: entity?.cvv || "",
          expiryDate: entity?.expiryDate || "",
          merchantName: entity?.merchantName || "",
          checkingAccountNumber: entity?.checkingAccountNumber || "",
          routingNumber: entity?.routingNumber || "",
          alternativePhone: entity?.alternativePhone || "",
          vinNumber: entity?.vinNumber || "",
          vehicleModel: entity?.vehicleModel || "",
          vehicleMileage: entity?.vehicleMileage || "",
          fronterName: entity?.fronterName || "",
          closerName: entity?.closerName || "",
        }
      : {
          customerName: entity?.customerName || "",
          agentName: entity?.agentName || "",
          primaryPhone: entity?.primaryPhone || "",
          email: entity?.email || "",
          address: entity?.address || "",
          dialerName: entity?.dialerName || "",
          vehicleMakeModelVariant: entity?.vehicleMakeModelVariant || "",
          vehicleMileage: entity?.vehicleMileage || "",
          customerAgreedForTransferToSeniorRepresentative:
            entity?.customerAgreedForTransferToSeniorRepresentative || "",
        },
  });

  useEffect(() => {
    if (!entity || !entityType) {
      toast.error("No entity data provided");
      navigate(isSale ? "/home-warranty" : "/auto-warranty-leads");
    }
  }, [entity, entityType, navigate]);

  const mutation = useMutation({
    mutationFn: ({ id, payload }) =>
      isSale
        ? isAutoWarranty
          ? editAutoSale({ id, payload })
          : patchSale({ id, payload })
        : patchLead({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries([isSale ? "sales" : "leads"]);
      toast.success(`${isSale ? "Sale" : "Lead"} updated successfully!`);
      navigate(
        isSale
          ? isAutoWarranty
            ? "/auto-warranty-sales"
            : "/home-warranty"
          : "/auto-warranty-leads",
      );
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg ||
          `Failed to update ${isSale ? "sale" : "lead"}`,
      );
    },
  });

  const onSubmit = (data) => {
    const payload = { ...data };
    if (isSale) {
      if (!isAutoWarranty) {
        delete payload.vinNumber;
        delete payload.vehicleModel;
        delete payload.vehicleMileage;
        delete payload.fronterName;
        delete payload.closerName;
      } else {
        delete payload.campaignType;
        delete payload.planName;
        delete payload.merchantName;
      }
    }
    mutation.mutate({ id: entity._id, payload });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
        Edit{" "}
        {isSale
          ? isAutoWarranty
            ? "Auto Warranty Sale"
            : "Home Warranty Sale"
          : "Auto Warranty Lead"}
      </h2>

      {isSale && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Campaign
            </label>
            <select
              {...register("campaign", { required: "Campaign is required" })}
              className="mt-1 p-2 w-full border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              disabled
            >
              <option value="Home Warranty">Home Warranty</option>
              <option value="Auto Warranty">Auto Warranty</option>
            </select>
            {errors.campaign && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.campaign.message}
              </p>
            )}
          </div>
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
            label="Primary Phone"
            {...register("primaryPhone", {
              required: "Primary phone is required",
              pattern: {
                value: /^\+?[\d\s-]{10,15}$/,
                message: "Invalid phone number",
              },
            })}
            error={errors.primaryPhone?.message}
          />
          {isHomeWarranty && (
            <>
              <Input
                label="Campaign Type"
                {...register("campaignType", {
                  required: "Campaign type is required",
                })}
                error={errors.campaignType?.message}
              />
              <Input
                label="Plan Name"
                {...register("planName", { required: "Plan name is required" })}
                error={errors.planName?.message}
              />
              <Input
                label="Merchant Name"
                {...register("merchantName")}
                error={errors.merchantName?.message}
              />
            </>
          )}
          <Input
            label="Confirmation Number"
            {...register("confirmationNumber")}
            error={errors.confirmationNumber?.message}
          />
          {isAutoWarranty && (
            <>
              <Input
                label="VIN Number"
                {...register("vinNumber", {
                  required: "VIN number is required",
                })}
                error={errors.vinNumber?.message}
              />
              <Input
                label="Vehicle Model"
                {...register("vehicleModel", {
                  required: "Vehicle model is required",
                })}
                error={errors.vehicleModel?.message}
              />
              <Input
                label="Vehicle Mileage"
                type="number"
                {...register("vehicleMileage", {
                  min: {
                    value: 0,
                    message: "Vehicle mileage cannot be negative",
                  },
                })}
                error={errors.vehicleMileage?.message}
              />
              <div>
                <Input
                  label="Plan Name"
                  {...register("planName")}
                  error={errors.planName?.message}
                />
                {/* <select
                  {...register("planDuration", {
                    required: "Plan duration is required",
                  })}
                                className="mt-1 p-2 w-full border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                >
                  <option value="">Select duration</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="5 Years">5 Years</option>
                </select> */}
                {errors.planName && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {errors.planName.message}
                  </p>
                )}
              </div>
              <Input
                label="Fronter Name"
                {...register("fronterName")}
                error={errors.fronterName?.message}
              />
              <Input
                label="Closer Name"
                {...register("closerName")}
                error={errors.closerName?.message}
              />
            </>
          )}
          <Input
            label="Address"
            {...register("address")}
            error={errors.address?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
          />
          <Input
            label="Activation Fee"
            type="number"
            {...register("activationFee", {
              required: "Activation fee is required",
              min: { value: 0, message: "Activation fee cannot be negative" },
            })}
            error={errors.activationFee?.message}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Payment Mode
            </label>
            <select
              {...register("paymentMode", {
                required: "Payment mode is required",
              })}
              className="mt-1 p-2 w-full border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Cheque Book">Cheque Book</option>
            </select>
            {errors.paymentMode && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.paymentMode.message}
              </p>
            )}
          </div>
          <Input
            label="Bank Name"
            {...register("bankName")}
            error={errors.bankName?.message}
          />
          <Input
            label="Check or Card Number"
            {...register("chequeOrCardNumber")}
            error={errors.chequeOrCardNumber?.message}
          />
          <Input label="CVV" {...register("cvv")} error={errors.cvv?.message} />
          <Input
            label="Expiry Date"
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
            label="Alternative Phone"
            {...register("alternativePhone", {
              pattern: {
                value: /^\+?[\d\s-]{10,15}$/,
                message: "Invalid phone number",
              },
            })}
            error={errors.alternativePhone?.message}
          />
        </>
      )}

      {isLead && (
        <>
          <Input
            label="Customer name"
            {...register("customerName", {
              required: "Customer name is required",
            })}
            error={errors.customerName?.message}
          />
          <Input
            label="Agent name"
            {...register("agentName", { required: "Agent name is required" })}
            error={errors.agentName?.message}
          />
          <Input
            label="Primary Phone"
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
            label="Email"
            type="email"
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
          />
          <Input
            label="Address"
            {...register("address")}
            error={errors.address?.message}
          />
          <Input
            label="Vehicle Mileage"
            {...register("vehicleMileage")}
            error={errors.vehicleMileage?.message}
          />
          <Input
            label="Dialer name"
            {...register("dialerName")}
            error={errors.dialerName?.message}
          />
          <Input
            label="Customer Agreed ForTransfer ToSenior Representative"
            {...register("customerAgreedForTransferToSeniorRepresentative")}
            error={
              errors.customerAgreedForTransferToSeniorRepresentative?.message
            }
          />
          <Input
            label="Vehicle Model & Make"
            {...register("vehicleMakeModelVariant")}
            error={errors.vehicleMakeModelVariant?.message}
          />
        </>
      )}

      <div className="flex space-x-4">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? `Updating ${isSale ? "Sale" : "Lead"}...`
            : `Update ${isSale ? "Sale" : "Lead"}`}
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            navigate(
              isSale
                ? isAutoWarranty
                  ? "/auto-warranty-sales"
                  : "/home-warranty"
                : "/auto-warranty-leads",
            )
          }
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
