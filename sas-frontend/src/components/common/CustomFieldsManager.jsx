import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import useAuth from "../../hooks/useAuth";

export const CustomFieldsManager = ({
  isOpen,
  onClose,
  leadId,
  leadIdentifier,
}) => {
  const [activeTab, setActiveTab] = useState("view");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const fieldType = watch("type");

  // Mock API functions (replace with actual API calls)
  const getCustomFields = async (id) => {
    // This would be replaced with actual API call
    return {
      fields: [
        {
          id: "1",
          name: "Lead Source",
          type: "select",
          value: "Facebook Ads",
          options: ["Facebook Ads", "Google Ads", "Cold Call", "Referral"],
          addedBy: { name: "John Admin", role: "admin" },
          addedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Customer Temperature",
          type: "select",
          value: "Hot",
          options: ["Hot", "Warm", "Cold"],
          addedBy: { name: "Jane QA", role: "qa-agent" },
          addedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Follow Up Notes",
          type: "text",
          value:
            "Customer interested but wants to think about it. Schedule follow-up in 3 days.",
          addedBy: { name: "Mike Agent", role: "agent" },
          addedAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Budget Range",
          type: "number",
          value: "2500",
          addedBy: { name: "Sarah Manager", role: "admin" },
          addedAt: new Date().toISOString(),
        },
      ],
    };
  };

  const addCustomField = async ({ id, payload }) => {
    // Mock API call
    console.log("Adding custom field:", payload);
    return { success: true };
  };

  const updateCustomField = async ({ id, fieldId, payload }) => {
    // Mock API call
    console.log("Updating custom field:", payload);
    return { success: true };
  };

  // Fetch custom fields
  const { data: fieldsData, isLoading: fieldsLoading } = useQuery({
    queryKey: ["customFields", leadId],
    queryFn: () => getCustomFields(leadId),
    enabled: isOpen && !!leadId,
  });

  // Add field mutation
  const addFieldMutation = useMutation({
    mutationFn: addCustomField,
    onSuccess: () => {
      queryClient.invalidateQueries(["customFields", leadId]);
      queryClient.invalidateQueries(["leads"]);
      toast.success("Custom field added successfully!");
      reset();
      setActiveTab("view");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to add custom field");
    },
  });

  // Update field mutation
  const updateFieldMutation = useMutation({
    mutationFn: updateCustomField,
    onSuccess: () => {
      queryClient.invalidateQueries(["customFields", leadId]);
      queryClient.invalidateQueries(["leads"]);
      toast.success("Custom field updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to update custom field");
    },
  });

  const onAddField = (data) => {
    const payload = {
      ...data,
      addedBy: user._id,
      leadId: leadId,
    };
    addFieldMutation.mutate({ id: leadId, payload });
  };

  const handleUpdateField = (fieldId, newValue) => {
    const payload = {
      value: newValue,
      updatedBy: user._id,
    };
    updateFieldMutation.mutate({ id: leadId, fieldId, payload });
  };

  const handleClose = () => {
    reset();
    setActiveTab("view");
    onClose();
  };

  const fieldTypes = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "select", label: "Select Options" },
    { value: "date", label: "Date" },
    { value: "boolean", label: "Yes/No" },
  ];

  const canAddFields = ["admin", "superadmin", "qa-agent"].includes(user?.role);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Custom Data Fields
          </h2>
          <p className="text-gray-600 mt-1">
            {leadIdentifier && `Lead: ${leadIdentifier}`}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "view"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("view")}
          >
            View Fields
          </button>
          {canAddFields && (
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "add"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("add")}
            >
              Add Field
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "view" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Custom Data Fields</h3>
              {fieldsLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : fieldsData?.fields?.length > 0 ? (
                <div className="grid gap-4">
                  {fieldsData.fields.map((field) => (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {field.name}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {field.type.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              Added by {field.addedBy?.name} (
                              {field.addedBy?.role})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <strong className="text-sm text-gray-700">
                          Current Value:
                        </strong>
                        <div className="mt-1">
                          {field.type === "select" ? (
                            <select
                              className="w-full p-2 border rounded"
                              defaultValue={field.value}
                              onChange={(e) =>
                                handleUpdateField(field.id, e.target.value)
                              }
                            >
                              {field.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : field.type === "boolean" ? (
                            <select
                              className="w-full p-2 border rounded"
                              defaultValue={field.value}
                              onChange={(e) =>
                                handleUpdateField(field.id, e.target.value)
                              }
                            >
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          ) : (
                            <input
                              type={
                                field.type === "number"
                                  ? "number"
                                  : field.type === "date"
                                    ? "date"
                                    : "text"
                              }
                              className="w-full p-2 border rounded"
                              defaultValue={field.value}
                              onBlur={(e) =>
                                handleUpdateField(field.id, e.target.value)
                              }
                            />
                          )}
                        </div>
                      </div>

                      {field.options && field.type === "select" && (
                        <div className="text-sm text-gray-600">
                          <strong>Available Options:</strong>{" "}
                          {field.options.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No custom fields have been added to this lead yet.
                </p>
              )}
            </div>
          )}

          {activeTab === "add" && canAddFields && (
            <div>
              <h3 className="text-lg font-medium mb-4">Add Custom Field</h3>
              <form onSubmit={handleSubmit(onAddField)} className="space-y-4">
                <Input
                  label="Field Name"
                  placeholder="Enter field name (e.g., Lead Source, Budget Range)"
                  {...register("name", {
                    required: "Field name is required",
                    minLength: {
                      value: 2,
                      message: "Field name must be at least 2 characters",
                    },
                  })}
                  error={errors.name?.message}
                />

                <Select
                  label="Field Type"
                  options={fieldTypes}
                  {...register("type", {
                    required: "Field type is required",
                  })}
                  error={errors.type?.message}
                />

                {fieldType === "select" && (
                  <Input
                    label="Options (comma-separated)"
                    placeholder="Option 1, Option 2, Option 3"
                    {...register("options", {
                      required: "Options are required for select fields",
                    })}
                    error={errors.options?.message}
                  />
                )}

                <Input
                  label="Initial Value (Optional)"
                  placeholder="Enter initial value for this field"
                  {...register("value")}
                  error={errors.value?.message}
                />

                <Input
                  label="Description (Optional)"
                  placeholder="Brief description of what this field represents"
                  {...register("description")}
                  error={errors.description?.message}
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setActiveTab("view")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addFieldMutation.isPending}>
                    {addFieldMutation.isPending ? "Adding..." : "Add Field"}
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
