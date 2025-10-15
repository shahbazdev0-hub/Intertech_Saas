import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAdmins } from "../../api/authApi";
import { Button } from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import { format } from "date-fns";

export const Admins = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch admins using TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
    onError: (err) => {
      toast.error(err.response?.data?.msg || "Failed to fetch admins");
    },
  });

  // Navigate to create admin page
  const handleCreateAdmin = () => {
    navigate("/create-admin");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admins</h2>
        <Button onClick={handleCreateAdmin}>Create Admin</Button>
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {isError && (
        <p className="text-red-500">
          Error: {error.response?.data?.msg || "Failed to load admins"}
        </p>
      )}

      {data?.admins?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {data.admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-sm text-gray-900">
                    {admin.name}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-900">
                    {admin.email}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-900 capitalize">
                    {admin.role}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-900">
                    {format(new Date(admin.createdAt), "PPp")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !isLoading && !isError ? (
        <p className="text-gray-500">No admins found.</p>
      ) : null}
    </div>
  );
};
