import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { PublicRegister } from "../pages/auth/PublicRegister";
import { ProtectedRegister } from "../pages/auth/ProtectedRegister";
import { Login } from "../pages/auth/Login";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { AdminDashboard } from "../pages/dashboard/AdminDashboard";
import { AgentDashboard } from "../pages/dashboard/AgentDashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import { Admins } from "../pages/campaigns/admins";
import { Agents } from "../pages/campaigns/agents";
import { Sales } from "../pages/campaigns/home-warranty";
import { AutoWarrantyLeads } from "../pages/campaigns/auto-warranty-leads";
import { AutoWarrantySales } from "../pages/campaigns/auto-warranty-sales";
import { EditForm } from "../components/common/EditForm";
import SuperadminDashboard from "../pages/dashboard/SuperadminDashboard";
import AgentDetails from "../pages/dashboard/AgentDetails";
import QaDashboard from "../pages/dashboard/QaDashboard";
import QaManagerDashboard from "../pages/dashboard/QaManagerDashboard";
import CustomDashboard from "../pages/dashboard/CustomDashboard";
import { QaAgents } from "../pages/campaigns/qa-agents";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "public-register", element: <PublicRegister /> },
      { path: "/", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
    ],
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      // Superadmin-exclusive routes
      {
        element: <ProtectedRoute allowedRoles={["superadmin"]} />,
        children: [
          { path: "superadmin-dashboard", element: <SuperadminDashboard /> },
          { path: "create-admin", element: <ProtectedRegister /> },
          { path: "admins", element: <Admins /> },
        ],
      },
      //QA manager and superadmin routes
     {
  element: (
    <ProtectedRoute
      allowedRoles={["superadmin", "admin", "qa-manager"]}
    />
  ),
  children: [{ path: "qa-agents", element: <QaAgents /> }],
},
      // Superadmin and Admin shared routes
      {
        element: <ProtectedRoute allowedRoles={["superadmin", "admin"]} />,
        children: [
          { path: "agents", element: <Agents /> },
          { path: "create-agent", element: <ProtectedRegister /> },
          { path: "edit/:entityType/:id", element: <EditForm /> },
          { path: "agents/:id", element: <AgentDetails /> },
        ],
      },
      // Admin-exclusive routes
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [{ path: "admin-dashboard", element: <AdminDashboard /> }],
      },
      // Agent-exclusive routes
      {
        element: <ProtectedRoute allowedRoles={["agent"]} />,
        children: [{ path: "agent-dashboard", element: <AgentDashboard /> }],
      },
      // QA Agent Dashboard
      {
        element: <ProtectedRoute allowedRoles={["qa-agent"]} />,
        children: [{ path: "qa-agent-dashboard", element: <QaDashboard /> }],
      },
      // QA Manager Dashboard
      {
        element: <ProtectedRoute allowedRoles={["qa-manager"]} />,
        children: [
          { path: "qa-manager-dashboard", element: <QaManagerDashboard /> },
        ],
      },
      // Custom Dashboard
      {
        element: <ProtectedRoute allowedRoles={["custom"]} />,
        children: [{ path: "custom-dashboard", element: <CustomDashboard /> }],
      },
      // Routes accessible to all roles
      {
        element: (
          <ProtectedRoute
            allowedRoles={[
              "superadmin",
              "admin",
              "agent",
              "qa-agent",
              "qa-manager",
              "custom",
            ]}
          />
        ),
        children: [
          { path: "home-warranty", element: <Sales /> },
          // { path: "auto-warranty-leads", element: <AutoWarrantyLeads /> },
          { path: "auto-warranty-sales", element: <AutoWarrantySales /> },
        ],
      },
    ],
  },
]);
