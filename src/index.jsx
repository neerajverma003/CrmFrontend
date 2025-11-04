import React from "react";
import { createRoot } from "react-dom/client";
import "@coreui/coreui/dist/css/coreui.min.css";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🧩 Layouts & Components
import ScreenLayout from "./newComponents/ScreenLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// 🧭 Pages
import MainDashboard from "./newComponents/dashboard/MainDashboard.jsx";
import MainLeadManagement from "./newComponents/leadManagement/MainLeadManagement.jsx";
import MainUserManagement from "./newComponents/UserManagement/MainUserManagement.jsx";
import MainAttendance from "./newComponents/attendance/MainAttendance.jsx";
import MainAllCompanies from "./newComponents/allCompanies/MainAllCompanies.jsx";
import MainSettings from "./newComponents/Settings/MainSettings.jsx";
import AddLeadShortcut from "./newComponents/dashboard/AddLeadShortcut.jsx";
import AddUserShortcut from "./newComponents/dashboard/AddUserShortcut.jsx";
import ClockInOutShortcut from "./newComponents/dashboard/ClockInOutShortcut.jsx";
import ViewReportsShortcut from "./newComponents/dashboard/ViewReportsShortcut.jsx";
import ForgotPassword from "./newComponents/loginSection/ForgotPassword.jsx";
import ResetLink from "./newComponents/loginSection/ResetLink.jsx";
import ChangePassword from "./newComponents/loginSection/ChangePassword.jsx";
import EditUser from "./newComponents/UserManagement/EditUser.jsx";
import { LeaveAdmin } from "./views/admin/leaveManagement/LeaveAdmin.jsx";
import { LeavePage } from "./views/employee/LeaveSection/LeavePage.jsx";
import ChequeExpense from "./newComponents/expense/ChequeExpense.jsx";
import DailyExpense from "./newComponents/expense/DailyExpense.jsx";

//  Role groups (for readability)
const roles = {
  all: ["admin", "employee", "superadmin"],
  adminOnly: ["admin", "superadmin"],
  employeeOnly: ["employee"],
};

//  ROUTER CONFIGURATION
const router = createBrowserRouter([
  //  Public Routes
  { path: "/", element: <App /> }, // Login
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetLink /> },
  { path: "/change-password", element: <ChangePassword /> },

  //  Protected Routes (inside ScreenLayout)
  {
    element: (
      <ProtectedRoute>
        <ScreenLayout />
      </ProtectedRoute>
    ),
    children: [
      // ✅ Common (Admin, Employee, SuperAdmin)
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <MainDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/lead-management",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <MainLeadManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/attendance",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <MainAttendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <MainSettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/clock-in-out",
        element: (
          <ProtectedRoute allowedRoles={roles.employeeOnly}>
            <ClockInOutShortcut />
          </ProtectedRoute>
        ),
      },
      {
        path: "/view-reports",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <ViewReportsShortcut />
          </ProtectedRoute>
        ),
      },

      // ✅ Admin + SuperAdmin
      {
        path: "/user-management",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <MainUserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/companies",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <MainAllCompanies />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit/:role/:id",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <EditUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-user",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AddUserShortcut />
          </ProtectedRoute>
        ),
      },
      {
        path: "/leaves",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <LeaveAdmin />
          </ProtectedRoute>
        ),
      },

      // ✅ Employee only
      {
        path: "/leave-apply",
        element: (
          <ProtectedRoute allowedRoles={roles.employeeOnly}>
            <LeavePage />
          </ProtectedRoute>
        ),
      },
      {
        path:"/dailyexpenses",
       element :(
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <DailyExpense />
          </ProtectedRoute>
       ),
      },
        {
        path:"/cheque",
       element :(
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <ChequeExpense/>
          </ProtectedRoute>
       ),
      },

      // ✅ Shared: Dashboard shortcuts
      {
        path: "/add-lead",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <AddLeadShortcut />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

// ✅ ROOT RENDER
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  </React.StrictMode>
);
