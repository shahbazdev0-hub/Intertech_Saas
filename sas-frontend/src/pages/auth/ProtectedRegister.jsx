import { useLocation } from "react-router-dom";
import { RegisterForm } from "../../components/auth/RegisterForm";

export const ProtectedRegister = () => {
  const location = useLocation();
  // const isCreateAdmin = location.pathname === "/create-admin";
  // const isCreateAgent = location.pathname === "/create-agent";
  const defaultRole = location.pathname.includes("create-admin")
    ? "admin"
    : "agent";
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Create User</h2>
      <RegisterForm
        isProtected={true}
        // defaultRole={isCreateAdmin ? "admin" : isCreateAgent ? "agent" : null}
        defaultRole={defaultRole}
      />
    </div>
  );
};
