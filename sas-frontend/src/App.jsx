// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import { ThemeProvider } from "./contexts/theme-context";

// import Layout from "./pages/layout";
// import DashboardPage from "./pages/dashboard/page";

// function App() {
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <Layout />,
//       children: [
//         {
//           index: true,
//           element: <DashboardPage />,
//         },
//         {
//           path: "analytics",
//           element: <h1 className="title">Analytics</h1>,
//         },
//         {
//           path: "reports",
//           element: <h1 className="title">Reports</h1>,
//         },
//         {
//           path: "customers",
//           element: <h1 className="title">Customers</h1>,
//         },
//         {
//           path: "new-customer",
//           element: <h1 className="title">New Customer</h1>,
//         },
//         {
//           path: "verified-customers",
//           element: <h1 className="title">Verified Customers</h1>,
//         },
//         {
//           path: "products",
//           element: <h1 className="title">Products</h1>,
//         },
//         {
//           path: "new-product",
//           element: <h1 className="title">New Product</h1>,
//         },
//         {
//           path: "inventory",
//           element: <h1 className="title">Inventory</h1>,
//         },
//         {
//           path: "settings",
//           element: <h1 className="title">Settings</h1>,
//         },
//       ],
//     },
//   ]);

//   return (
//     <ThemeProvider storageKey="theme">
//       <RouterProvider router={router} />
//     </ThemeProvider>
//   );
// }

// export default App;

import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { router } from "./routes/routes";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/theme-context";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="theme">
        <AuthProvider>
          <SidebarProvider>
            <RouterProvider router={router} />
            <Toaster position="top-center" />
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
