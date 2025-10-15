import { RegisterForm } from "../../components/auth/RegisterForm";

export const PublicRegister = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Publically Register yourself here
      </h2>
      <RegisterForm isProtected={false} />
    </div>
  );
};
