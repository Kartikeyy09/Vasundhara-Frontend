import React from "react";
import { Outlet } from "react-router-dom";
import LoadingSpinner from "../../common/LoadingSpinner";
import Sidebar from "../../AdminPannel/Components/Sidebar";
// import Navbar from "../../Navbar";
import Navbar from "./NavBar";
import ProtectedRoute from "../../common/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
// import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
// import { useAuth } from "../../context/AuthContext";
// import LoadingSpinner from "../../components/common/LoadingSpinner";

function AdminLayoutContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin panel..." />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <ProtectedRoute requiredRole="Admin">
      <AdminLayoutContent />
    </ProtectedRoute>
  );
}