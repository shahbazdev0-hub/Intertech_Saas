import {
  ChartColumn,
  Home,
  NotepadText,
  Package,
  PackagePlus,
  Settings,
  ShoppingCart,
  UserCheck,
  UserPlus,
  Users,
  Megaphone,
  DollarSign,
  Briefcase,
} from "lucide-react";

import { format } from "date-fns";

export const navbarLinks = [
  {
    title: "Dashboards",
    links: [
      {
        path: "superadmin-dashboard",
        label: "Dashboard",
        icon: Users,
        roles: ["superadmin"],
      },
      {
        path: "admin-dashboard",
        label: "Dashboard",
        icon: Users,
        roles: ["admin"],
      },
      {
        path: "agent-dashboard",
        label: "Dashboard",
        icon: Users,
        roles: ["agent"],
      },
      {
        path: "qa-agent-dashboard",
        label: "Dashboard",
        icon: Users,
        roles: ["qa-agent"],
      },
      {
        path: "qa-manager-dashboard",
        label: "Dashboard",
        icon: Users,
        roles: ["qa-manager"],
      },
      {
        path: "custom-dashboard",
        label: "Dashboard",
        icon: Settings,
        roles: ["custom"],
      },
    ],
  },
  {
    title: "Management",
    links: [
      {
        path: "admins",
        label: "Admins",
        icon: Users,
        roles: ["superadmin"],
      },
      {
        path: "agents",
        label: "Agents",
        icon: Users,
        roles: ["superadmin", "admin"],
      },
      {
        path: "qa-agents",
        label: "Qa Agents",
        icon: Users,
        roles: ["superadmin", "admin", "qa-manager"],
      },
    ],
  },
  {
    title: "Campaigns",
    links: [
      {
        path: "home-warranty",
        label: "Home Warranty",
        icon: DollarSign,
        roles: [
          "superadmin",
          "admin",
          "agent",
          "qa-agent",
          "qa-manager",
          "custom",
        ],
      },
      // {
      //   path: "auto-warranty-leads",
      //   label: "Auto Warranty Leads",
      //   icon: Briefcase,
      //   roles: ["superadmin", "admin", "agent", "qa-agent", "qa-manager", "custom"],
      // },
      {
        path: "auto-warranty-sales",
        label: "Auto Warranty Sales",
        icon: Megaphone,
        roles: [
          "superadmin",
          "admin",
          "agent",
          "qa-agent",
          "qa-manager",
          "custom",
        ],
      },
    ],
  },
];

export const salesColumns = [
  {
    key: "saleId",
    header: "Sale ID",
    render: (_, sale) => (
      <span className="font-mono text-xs dark:text-white text-black dark:bg-gray-800 px-2 py-1 rounded">
        #{sale._id?.slice(-8) || "N/A"}
      </span>
    ),
  },
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
  {
    key: "status",
    header: "Current Status",
    render: (value, sale) => {
      const status =
        sale?.history?.[sale?.history?.length - 1]?.status || "pending";
      const statusStyles = {
        pending: "bg-yellow-100 text-yellow-800",
        under_review: "bg-blue-100 text-blue-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        requires_revision: "bg-orange-100 text-orange-800",
        escalated: "bg-purple-100 text-purple-800",
      };
      return (
        <div className="space-y-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusStyles[status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {status.replace("_", " ").toUpperCase()}
          </span>
          {sale?.history?.[sale?.history?.length - 1]?.history?.[0]?.actionBy
            ?.name && (
            <div className="text-xs text-gray-500">
              by{" "}
              {sale?.history?.[sale?.history?.length - 1]?.history?.[0]
                ?.actionBy?.name +
                "( " +
                sale?.history?.[sale?.history?.length - 1]?.history?.[0]
                  ?.actionBy?.role +
                " )" || "Unknown"}
            </div>
          )}
          {sale?.history?.[sale?.history?.length - 1]?.history?.[0]
            ?.timestamp && (
            <div className="text-xs text-gray-400">
              {format(
                new Date(
                  sale?.history?.[
                    sale?.history?.length - 1
                  ]?.history?.[0]?.timestamp
                ),
                "MMM dd, HH:mm"
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    key: "qualityMetrics",
    header: "Quality & Activity",
    render: (_, sale) => {
      const score =
        sale?.history?.[sale?.history?.length - 1]?.history?.[0]
          ?.qualityScore || 0;
      const scoreColor =
        score >= 8
          ? "text-green-600"
          : score >= 6
          ? "text-yellow-600"
          : "text-red-600";
      const actionsCount = sale?.history?.length || 0;
      const commentsCount = sale?.history?.length || 0;
      return (
        <div className="space-y-1 text-sm">
          <div className={`font-medium ${scoreColor}`}>
            Score: {score > 0 ? `${score}/10` : "Not Rated"}
          </div>
          <div className="flex space-x-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
              {actionsCount} action{actionsCount !== 1 ? "s" : ""}
            </span>
            <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
              {commentsCount} comment{commentsCount !== 1 ? "s" : ""}
            </span>
          </div>
          <span
            className={`text-xs px-1 rounded ${
              sale.priority === "high"
                ? "bg-red-100 text-red-800"
                : sale.priority === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {sale?.priority?.toUpperCase() || "NORMAL"} PRIORITY
          </span>
        </div>
      );
    },
  },
];

export const autoWarrantySalesColumns = [
  {
    key: "saleId",
    header: "Sale ID",
    render: (_, sale) => (
      <span className="font-mono text-xs dark:bg-gray-800 px-2 py-1 rounded">
        #{sale._id?.slice(-8) || "N/A"}
      </span>
    ),
  },
  { key: "customerName", header: "Customer" },
  { key: "primaryPhone", header: "Primary Phone" },
  { key: "vinNumber", header: "VIN Number" },
  {
    key: "agentName",
    header: "Agent",
    render: (_, sale) => sale.agent?.name || sale.agentName || "-",
  },
  {
    key: "confirmationNumber",
    header: "Confirmation Number",
    render: (value) => value || "-",
  },
  { key: "vehicleModel", header: "Vehicle Model" },
  { key: "address", header: "Address", render: (value) => value || "-" },
  { key: "email", header: "Email", render: (value) => value || "-" },
  {
    key: "activationFee",
    header: "Activation Fee",
    render: (value) => (value ? `$${value.toFixed(2)}` : "-"),
  },
  {
    key: "paymentMode",
    header: "Payment Mode",
    render: (value) => value || "-",
  },
  { key: "bankName", header: "Bank Name", render: (value) => value || "-" },
  {
    key: "chequeOrCardNumber",
    header: "Check or Card Number",
    render: (value) => value || "-",
  },
  { key: "cvv", header: "CVV", render: (value) => value || "-" },
  {
    key: "expiryDate",
    header: "Expiry Date",
    render: (value) => value || "-",
  },
  {
    key: "vehicleMileage",
    header: "Vehicle Mileage",
    render: (value) => (value ? `${value.toLocaleString()} miles` : "-"),
  },
  {
    key: "planName",
    header: "Plan Name",
    render: (value) => value || "-",
  },
  {
    key: "fronterName",
    header: "Fronter Name",
    render: (value) => value || "-",
  },
  {
    key: "closerName",
    header: "Closer Name",
    render: (value) => value || "-",
  },
  {
    key: "checkingAccountNumber",
    header: "Checking Account Number",
    render: (value) => value || "-",
  },
  {
    key: "routingNumber",
    header: "Routing Number",
    render: (value) => value || "-",
  },
  {
    key: "alternativePhone",
    header: "Alternative Phone",
    render: (value) => value || "-",
  },
  {
    key: "dateOfSale",
    header: "Date of Sale",
    render: (value) => (value ? format(new Date(value), "PP") : "-"),
  },
  {
    key: "status",
    header: "Current Status",
    render: (value, sale) => {
      console.log(sale, "googlo");
      const status =
        sale?.history?.[sale?.history?.length - 1]?.status || "pending";
      const statusStyles = {
        pending: "bg-yellow-100 text-yellow-800",
        under_review: "bg-blue-100 text-blue-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        requires_revision: "bg-orange-100 text-orange-800",
        escalated: "bg-purple-100 text-purple-800",
      };
      return (
        <div className="space-y-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusStyles[status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {status.replace("_", " ").toUpperCase()}
          </span>
          {sale?.history?.[sale?.history?.length - 1]?.history?.[0]?.actionBy
            ?.name && (
            <div className="text-xs text-gray-500">
              by{" "}
              {sale?.history?.[sale?.history?.length - 1]?.history?.[0]
                ?.actionBy?.name +
                "( " +
                sale?.history?.[sale?.history?.length - 1]?.history?.[0]
                  ?.actionBy?.role +
                " )" || "Unknown"}
            </div>
          )}
          {sale?.history?.[sale?.history?.length - 1]?.history?.[0]
            ?.timestamp && (
            <div className="text-xs text-gray-400">
              {format(
                new Date(
                  sale?.history?.[
                    sale?.history?.length - 1
                  ]?.history?.[0]?.timestamp
                ),
                "MMM dd, HH:mm"
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    key: "qualityMetrics",
    header: "Quality & Activity",
    render: (_, sale) => {
      const score =
        sale?.history?.[sale?.history?.length - 1]?.history?.[0]
          ?.qualityScore || 0;
      const scoreColor =
        score >= 8
          ? "text-green-600"
          : score >= 6
          ? "text-yellow-600"
          : "text-red-600";
      const actionsCount = sale?.history?.length || 0;
      const commentsCount = sale?.history?.length || 0;
      return (
        <div className="space-y-1 text-sm">
          <div className={`font-medium ${scoreColor}`}>
            Score: {score > 0 ? `${score}/10` : "Not Rated"}
          </div>
          <div className="flex space-x-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
              {actionsCount} action{actionsCount !== 1 ? "s" : ""}
            </span>
            <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
              {commentsCount} comment{commentsCount !== 1 ? "s" : ""}
            </span>
          </div>
          <span
            className={`text-xs px-1 rounded ${
              sale.priority === "high"
                ? "bg-red-100 text-red-800"
                : sale.priority === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {sale?.priority?.toUpperCase() || "NORMAL"} PRIORITY
          </span>
        </div>
      );
    },
  },
];

export const leadColumns = [
  {
    key: "leadId",
    header: "Lead ID",
    render: (_, lead) => (
      <span className="font-mono text-xs bg-gray-800 px-2 py-1 rounded">
        #{lead._id?.slice(-8) || "N/A"}
      </span>
    ),
  },
  {
    key: "dateOfSale",
    header: "Date of Sale",
    render: (value) => (value ? format(new Date(value), "PP") : "-"),
  },
  { key: "customerName", header: "Customer Name" },
  {
    key: "agentInfo",
    header: "Agent Details",
    render: (_, lead) => {
      const agent = lead.agent || {};
      const agentName = agent.name || lead.agentName || "Unknown";
      const agentRole = agent.role || "agent";
      const agentId = agent._id || agent.id || "N/A";
      return (
        <div className="space-y-1">
          <div className="font-medium text-sm">{agentName}</div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                agentRole === "agent"
                  ? "bg-blue-100 text-blue-800"
                  : agentRole === "senior-agent"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {agentRole.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              #{agentId.slice(-6)}
            </span>
          </div>
        </div>
      );
    },
  },
  { key: "primaryPhone", header: "Primary Phone" },
  {
    key: "vehicleInfo",
    header: "Vehicle Details",
    render: (_, lead) => (
      <div className="space-y-1 text-sm">
        <div>
          <strong>Model:</strong> {lead.vehicleMakeModelVariant || "N/A"}
        </div>
        <div>
          <strong>Mileage:</strong>{" "}
          {lead.vehicleMileage
            ? `${lead.vehicleMileage.toLocaleString()} miles`
            : "N/A"}
        </div>
      </div>
    ),
  },
  {
    key: "extendedWarranty",
    header: "Warranty Interest",
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "yes"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {value === "yes" ? "INTERESTED" : "NOT INTERESTED"}
      </span>
    ),
  },
  {
    key: "customerAgreedForTransferToSeniorRepresentative",
    header: "Transfer Agreement",
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "yes"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {value === "yes" ? "AGREED" : "DECLINED"}
      </span>
    ),
  },
  {
    key: "contactInfo",
    header: "Contact Details",
    render: (_, lead) => (
      <div className="space-y-1 text-sm">
        <div>
          <strong>Email:</strong> {lead.email || "N/A"}
        </div>
        <div>
          <strong>Address:</strong>{" "}
          {lead.address ? lead.address.substring(0, 25) + "..." : "N/A"}
        </div>
      </div>
    ),
  },
  {
    key: "systemInfo",
    header: "System Details",
    render: (_, lead) => (
      <div className="space-y-1 text-sm">
        <div>
          <strong>Dialer:</strong> {lead.dialerName || "N/A"}
        </div>
        <div>
          <strong>Created:</strong>{" "}
          {lead.createdAt
            ? format(new Date(lead.createdAt), "MMM dd, yyyy")
            : "N/A"}
        </div>
        <div>
          <strong>Source:</strong> {lead.source || "Web Form"}
        </div>
      </div>
    ),
  },
  {
    key: "status",
    header: "Current Status",
    render: (value, lead) => {
      const status = lead?.history?.[0]?.status || "pending";
      const statusStyles = {
        pending: "bg-yellow-100 text-yellow-800",
        under_review: "bg-blue-100 text-blue-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        requires_revision: "bg-orange-100 text-orange-800",
        escalated: "bg-purple-100 text-purple-800",
      };
      return (
        <div className="space-y-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusStyles[status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {status.replace("_", " ").toUpperCase()}
          </span>
          {lead?.history?.[0]?.history?.[0].actionBy?.name && (
            <div className="text-xs text-gray-100">
              by{" "}
              {lead?.history?.[0]?.history?.[0].actionBy?.name +
                "( " +
                lead?.history?.[0]?.history?.[0].actionBy?.role +
                " )" || "Unknown"}
            </div>
          )}
          {lead?.history?.[0]?.history?.[0].timestamp && (
            <div className="text-xs text-gray-400">
              {format(
                new Date(lead?.history?.[0]?.history?.[0].timestamp),
                "MMM dd, HH:mm"
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    key: "qualityMetrics",
    header: "Quality & Activity",
    render: (_, lead) => {
      const score = lead?.history?.[0]?.history?.[0]?.qualityScore || 0;
      // const comments = [];
      // lead?.history?.forEach((element) => {
      //   comments?.push(element?.comments?.[0]);
      // });

      const scoreColor =
        score >= 8
          ? "text-green-600"
          : score >= 6
          ? "text-yellow-600"
          : "text-red-600";
      const actionsCount = lead?.history?.length || 0;
      const commentsCount = lead?.history?.length || 0;
      return (
        <div className="space-y-1 text-sm">
          <div className={`font-medium ${scoreColor}`}>
            Score: {score > 0 ? `${score}/10` : "Not Rated"}
          </div>
          <div className="flex space-x-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
              {actionsCount} action{actionsCount !== 1 ? "s" : ""}
            </span>
            <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
              {commentsCount} comment{commentsCount !== 1 ? "s" : ""}
            </span>
          </div>
          <span
            className={`text-xs px-1 rounded ${
              lead.priority === "high"
                ? "bg-red-100 text-red-800"
                : lead.priority === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {lead?.priority?.toUpperCase() || "NORMAL"} PRIORITY
          </span>
        </div>
      );
    },
  },
];
