import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import { ToastProvider } from "./components/common/ToastContainer";
// import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Public Layout & Pages
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import About from "./Pages/About";
import OurWorkDetails from "./OurWork/OurWorkDetails";
import MunicipalCorporation from "./OurWork/MunicipalCorporation";
import BusStand from "./OurWork/BusStand";
import Railway from "./OurWork/Railway";
import VisionMission from "./About/VisionMission";
import Team from "./About/Team";
import ContactUs from "./Pages/ContactUs";

// Admin Imports
import AdminLayout from "./Pages/layout/AdminLayout";
import Dashboard from "./AdminPannel/Components/Dashboard";
import Login from "./AdminPannel/Components/Login";
import AdminHome from "./AdminPannel/AdminHome";
import AdminAbout from "./AdminPannel/AdminAbout";
import AdminVisionMission from "./AdminPannel/AdminVisionMission";
import AdminTeam from "./AdminPannel/AdminTeam";
import AdminOurWork from "./AdminPannel/AdminOurWork";
import AdminContact from "./AdminPannel/AdminContactUs";
import AdminSettings from "./AdminPannel/AdminSettings";
import AdminProfile from "./AdminPannel/AdminProfile";
import AdminReceipt from "./AdminPannel/AdminReceipt";

// Common Pages
import NotFoundPage from "./common/NotFoundPage";
import UnauthorizedPage from "./common/UnauthorizedPage";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./common/ToastContainer";
import ErrorBoundary from "./common/ErrorBoundary";
import ForgotPassword from "./AdminPannel/Components/ForgotPassword";
import ResetPassword from "./AdminPannel/Components/ResetPassword";
import ChangePassword from "./AdminPannel/Components/ChangePassword";
import PrivacyPolicy from "./PrivacyPolicy";

// Root layout that provides context to all routes
const RootLayout = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // 🌐 Public Routes
      {
        path: "/",
        element: <Layout />,
        errorElement: <NotFoundPage />,
        children: [
          { index: true, element: <Home /> },
          { path: "about", element: <About /> },
          { path: "our-work/:id", element: <OurWorkDetails /> },
          // { path: "municipal-corporation", element: <MunicipalCorporation /> },
          { path: "bus-stand", element: <BusStand /> },
          { path: "railway", element: <Railway /> },
          { path: "vision-mission", element: <VisionMission /> },
          { path: "team", element: <Team /> },
          { path: "contact-us", element: <ContactUs /> },
          {path:"privacy-policy",element:<PrivacyPolicy/>},
        ],
      },

      // 🔐 Auth Routes
      { path: "/login", element: <Login /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/unauthorized", element: <UnauthorizedPage /> },

      // 🔒 Admin Routes (Protected)
      {
        path: "/admin",
        element: <AdminLayout />,
        errorElement: <NotFoundPage />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "adminprofile", element: <AdminProfile /> },
          { path: "adminhome", element: <AdminHome /> },
          { path: "adminabout", element: <AdminAbout /> },
          { path: "adminvisionmission", element: <AdminVisionMission /> },
          // { path: "adminteam", element: <AdminTeam /> },
          { path: "adminourwork", element: <AdminOurWork /> },
          { path: "admincontact", element: <AdminContact /> },
          // { path: "adminsettings", element: <AdminSettings /> },
          { path: "adminReceipt", element: <AdminReceipt /> },
          { path: "change-password", element: <ChangePassword /> },
        ],
      },

      // 404 Route
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}