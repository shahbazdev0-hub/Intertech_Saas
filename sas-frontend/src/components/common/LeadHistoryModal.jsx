// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-hot-toast";
// import { format } from "date-fns";
// import { Button } from "./Button";
// import { Input } from "./Input";
// import { Select } from "./Select";
// import {
//   getLeadHistory,
//   addLeadHistory,
//   addHistoryComment,
//   updateHistoryStatus,
// } from "../../api/leadApi";
// import useAuth from "../../hooks/useAuth";

// export const LeadHistoryModal = ({
//   isOpen,
//   onClose,
//   leadId,
//   leadIdentifier,
// }) => {
//   const [activeTab, setActiveTab] = useState("history");
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const {
//     register: registerComment,
//     handleSubmit: handleCommentSubmit,
//     reset: resetComment,
//     formState: { errors: commentErrors },
//   } = useForm();

//   const {
//     register: registerStatus,
//     handleSubmit: handleStatusSubmit,
//     reset: resetStatus,
//     watch,
//     formState: { errors: statusErrors },
//   } = useForm();

//   const statusValue = watch("status");

//   // Fetch lead history
//   const { data: historyData, isLoading: historyLoading } = useQuery({
//     queryKey: ["leadHistory", leadId],
//     queryFn: () => getLeadHistory(leadId),
//     enabled: isOpen && !!leadId,
//   });

//   // Add comment mutation
//   const commentMutation = useMutation({
//     mutationFn: addHistoryComment,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["leadHistory", leadId]);
//       queryClient.invalidateQueries(["leads"]);
//       toast.success("Comment added successfully!");
//       resetComment();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.msg || "Failed to add comment");
//     },
//   });

//   // Update status mutation
//   const statusMutation = useMutation({
//     mutationFn: updateHistoryStatus,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["leadHistory", leadId]);
//       queryClient.invalidateQueries(["leads"]);
//       toast.success("Lead status updated successfully!");
//       resetStatus();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.msg || "Failed to update status");
//     },
//   });

//   const onCommentSubmit = (data) => {
//     commentMutation.mutate({ id: leadId, payload: data });
//   };

//   const onStatusSubmit = (data) => {
//     statusMutation.mutate({ id: leadId, payload: data });
//   };

//   const handleClose = () => {
//     resetComment();
//     resetStatus();
//     setActiveTab("history");
//     onClose();
//   };

//   const statusOptions = [
//     { value: "pending", label: "Pending Review" },
//     { value: "under_review", label: "Under Review" },
//     { value: "approved", label: "Approved" },
//     { value: "rejected", label: "Rejected" },
//     { value: "requires_revision", label: "Requires Revision" },
//     { value: "escalated", label: "Escalated" },
//   ];

//   const getStatusBadge = (status) => {
//     const statusStyles = {
//       pending: "bg-yellow-100 text-yellow-800",
//       under_review: "bg-blue-100 text-blue-800",
//       approved: "bg-green-100 text-green-800",
//       rejected: "bg-red-100 text-red-800",
//       requires_revision: "bg-orange-100 text-orange-800",
//       escalated: "bg-purple-100 text-purple-800",
//     };

//     return (
//       <span
//         className={`px-2 py-1 rounded-full text-xs font-medium ${
//           statusStyles[status] || "bg-gray-100 text-gray-800"
//         }`}
//       >
//         {status ? status.replace("_", " ").toUpperCase() : "UNKNOWN"}
//       </span>
//     );
//   };

//   const getRoleBadge = (role) => {
//     const roleStyles = {
//       agent: "bg-blue-100 text-blue-800",
//       admin: "bg-purple-100 text-purple-800",
//       superadmin: "bg-red-100 text-red-800",
//       "qa-agent": "bg-green-100 text-green-800",
//     };

//     return (
//       <span
//         className={`px-2 py-1 rounded-full text-xs font-medium ${
//           roleStyles[role] || "bg-gray-100 text-gray-800"
//         }`}
//       >
//         {role ? role.toUpperCase() : "UNKNOWN"}
//       </span>
//     );
//   };

//   const canUpdateStatus = () => {
//     return ["admin", "superadmin", "qa-agent"].includes(user?.role);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-semibold text-gray-900">
//             Lead History & Management
//           </h2>
//           <p className="text-gray-600 mt-1">
//             {leadIdentifier && `Lead: ${leadIdentifier}`}
//           </p>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b">
//           <button
//             className={`px-6 py-3 font-medium ${
//               activeTab === "history"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//             onClick={() => setActiveTab("history")}
//           >
//             History & Timeline
//           </button>
//           <button
//             className={`px-6 py-3 font-medium ${
//               activeTab === "comments"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//             onClick={() => setActiveTab("comments")}
//           >
//             Add Comment
//           </button>
//           {canUpdateStatus() && (
//             <button
//               className={`px-6 py-3 font-medium ${
//                 activeTab === "status"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//               onClick={() => setActiveTab("status")}
//             >
//               Update Status
//             </button>
//           )}
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {activeTab === "history" && (
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium mb-4">
//                 Status History & Comments
//               </h3>
//               {historyLoading ? (
//                 <div className="flex justify-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
//                 </div>
//               ) : historyData?.history?.length > 0 ? (
//                 <div className="space-y-4">
//                   {historyData.history.map((entry, index) => (
//                     <div
//                       key={index}
//                       className="border rounded-lg p-4 bg-white shadow-sm"
//                     >
//                       <div className="flex justify-between items-start mb-3">
//                         <div className="flex items-start space-x-3">
//                           <div className="flex-shrink-0">
//                             <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
//                               {(entry.actionBy?.name || entry.actionBy || "U")
//                                 .charAt(0)
//                                 .toUpperCase()}
//                             </div>
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center space-x-2 mb-1">
//                               <div className="font-medium text-gray-900">
//                                 {entry.actionBy?.name ||
//                                   entry.actionBy ||
//                                   "Unknown User"}
//                               </div>
//                               {getRoleBadge(entry.actionBy?.role || entry.role)}
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               {getStatusBadge(entry.status)}
//                               {entry.actionBy?.id && (
//                                 <span className="text-xs text-gray-500 font-mono">
//                                   #{entry.actionBy.id.slice(-6)}
//                                 </span>
//                               )}
//                             </div>
//                             {entry.actionBy?.email && (
//                               <div className="text-xs text-gray-500 mt-1">
//                                 {entry.actionBy.email}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <span className="text-sm text-gray-500">
//                             {entry.timestamp
//                               ? format(new Date(entry.timestamp), "PPp")
//                               : "Unknown time"}
//                           </span>
//                           {entry.ipAddress && (
//                             <div className="text-xs text-gray-400 mt-1">
//                               IP: {entry.ipAddress}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="bg-gray-50 rounded-lg p-3 space-y-2">
//                         <div className="text-sm text-gray-700">
//                           <strong className="text-blue-600">Action:</strong>{" "}
//                           {entry.action || "Status Update"}
//                         </div>

//                         {entry.reason && (
//                           <div className="text-sm text-gray-700">
//                             <strong className="text-green-600">Reason:</strong>{" "}
//                             {entry.reason}
//                           </div>
//                         )}

//                         {entry.rejectionReason && (
//                           <div className="text-sm text-gray-700">
//                             <strong className="text-red-600">
//                               Rejection Category:
//                             </strong>{" "}
//                             {entry.rejectionReason.replace("_", " ")}
//                           </div>
//                         )}

//                         {entry.qualityScore && (
//                           <div className="text-sm text-gray-700">
//                             <strong className="text-purple-600">
//                               Quality Score:
//                             </strong>{" "}
//                             {entry.qualityScore}/10
//                           </div>
//                         )}

//                         {entry.nextAction && (
//                           <div className="text-sm text-gray-700">
//                             <strong className="text-orange-600">
//                               Next Action:
//                             </strong>{" "}
//                             {entry.nextAction}
//                           </div>
//                         )}

//                         {entry.notes && (
//                           <div className="text-sm text-gray-700">
//                             <strong className="text-gray-600">Notes:</strong>{" "}
//                             {entry.notes}
//                           </div>
//                         )}

//                         {entry.comment && (
//                           <div className="text-sm text-gray-700">
//                             <strong className="text-indigo-600">
//                               Comment:
//                             </strong>{" "}
//                             {entry.comment}
//                           </div>
//                         )}

//                         {entry.systemData && (
//                           <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded mt-2">
//                             <strong>System Info:</strong> Browser:{" "}
//                             {entry.systemData.browser || "Unknown"}, Device:{" "}
//                             {entry.systemData.device || "Unknown"}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">
//                   No history available for this lead.
//                 </p>
//               )}
//             </div>
//           )}

//           {activeTab === "comments" && (
//             <div>
//               <h3 className="text-lg font-medium mb-4">Add Comment</h3>
//               <form
//                 onSubmit={handleCommentSubmit(onCommentSubmit)}
//                 className="space-y-4"
//               >
//                 <Input
//                   label="Comment"
//                   placeholder="Enter your comment about this lead..."
//                   {...registerComment("comment", {
//                     required: "Comment is required",
//                     minLength: {
//                       value: 5,
//                       message: "Comment must be at least 5 characters",
//                     },
//                   })}
//                   error={commentErrors.comment?.message}
//                 />

//                 <div className="flex justify-end space-x-3">
//                   <Button type="submit" disabled={commentMutation.isPending}>
//                     {commentMutation.isPending ? "Adding..." : "Add Comment"}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {activeTab === "status" && canUpdateStatus() && (
//             <div>
//               <h3 className="text-lg font-medium mb-4">Update Lead Status</h3>
//               <form
//                 onSubmit={handleStatusSubmit(onStatusSubmit)}
//                 className="space-y-4"
//               >
//                 <Select
//                   label="New Status"
//                   options={statusOptions}
//                   {...registerStatus("status", {
//                     required: "Status is required",
//                   })}
//                   error={statusErrors.status?.message}
//                 />

//                 <Input
//                   label="Reason for Status Change"
//                   placeholder="Explain why you're changing the status..."
//                   {...registerStatus("reason", {
//                     required: "Reason is required",
//                     minLength: {
//                       value: 10,
//                       message: "Reason must be at least 10 characters",
//                     },
//                   })}
//                   error={statusErrors.reason?.message}
//                 />

//                 {statusValue === "rejected" && (
//                   <Select
//                     label="Rejection Category"
//                     options={[
//                       {
//                         value: "incomplete_information",
//                         label: "Incomplete Information",
//                       },
//                       {
//                         value: "invalid_contact",
//                         label: "Invalid Contact Details",
//                       },
//                       { value: "duplicate_lead", label: "Duplicate Lead" },
//                       { value: "unqualified", label: "Unqualified Lead" },
//                       {
//                         value: "customer_not_interested",
//                         label: "Customer Not Interested",
//                       },
//                       { value: "other", label: "Other" },
//                     ]}
//                     {...registerStatus("rejectionReason")}
//                     error={statusErrors.rejectionReason?.message}
//                   />
//                 )}

//                 <Input
//                   label="Additional Notes (Optional)"
//                   placeholder="Any additional information..."
//                   {...registerStatus("notes")}
//                   error={statusErrors.notes?.message}
//                 />

//                 <div className="flex justify-end space-x-3">
//                   <Button type="submit" disabled={statusMutation.isPending}>
//                     {statusMutation.isPending ? "Updating..." : "Update Status"}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end space-x-3 p-6 border-t">
//           <Button type="button" variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { getLeadHistory, addLeadHistory } from "../../api/leadApi";
import useAuth from "../../hooks/useAuth";
import { useSidebar } from "../../contexts/SidebarContext";
import { cn } from "../../utils/cn";

export const LeadHistoryModal = ({
  isOpen,
  onClose,
  leadId,
  leadIdentifier,
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
    queryKey: ["leadHistory", leadId],
    queryFn: () => getLeadHistory(leadId),
    enabled: isOpen && !!leadId,
  });

  const historyMutation = useMutation({
    mutationFn: addLeadHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(["leadHistory", leadId]);
      queryClient.invalidateQueries(["leads"]);
      toast.success("Lead history updated!");
      reset();
      setActiveTab("history");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Failed to update lead history");
    },
  });
  const onFormSubmit = (data) => {
    const payload = {
      lead: leadId,
      identifier: leadIdentifier,
      history: [
        {
          action: "Status Update", // Or allow user input if you want
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

    historyMutation.mutate({ id: leadId, payload });
  };

  // const onFormSubmit = (data) => {
  //   const payload = {
  //     status: data.status,
  //     reason: data.reason,
  //     rejectionReason: data.rejectionReason || "",
  //     notes: data.notes || "",
  //     comment: data.comment || "",
  //   };

  //   historyMutation.mutate({ id: leadId, payload });
  // };

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
    { value: "requires_revision", label: "Requires Revision" },
    { value: "escalated", label: "Escalated" },
  ];

  const rejectionOptions = [
    { value: "incomplete_information", label: "Incomplete Information" },
    { value: "invalid_contact", label: "Invalid Contact Details" },
    { value: "duplicate_lead", label: "Duplicate Lead" },
    { value: "unqualified", label: "Unqualified Lead" },
    { value: "customer_not_interested", label: "Customer Not Interested" },
    { value: "other", label: "Other" },
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
    return ["admin", "superadmin", "qa-agent"].includes(user?.role);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={cn(
          "bg-white dark:bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col transition-all duration-300",
          // Position modal to respect sidebar width on desktop
          "md:ml-4 md:mr-4",
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
            Lead History & Management
          </h2>
          <p className="text-gray-600 mt-1">
            {leadIdentifier && `Lead: ${leadIdentifier}`}
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
                                entry?.history?.[0]?.actionBy?.role,
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
                                  "PPp",
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
                              " ",
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
                  No history available for this lead.
                </p>
              )}
            </div>
          )}

          {activeTab === "status" && canUpdateStatus() && (
            <div>
              <h3 className="text-lg font-medium mb-4">
                Update Lead Status & Add Comment
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
                  label="Reason for Status Change"
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
