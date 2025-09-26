import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ScrollToTop/>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
