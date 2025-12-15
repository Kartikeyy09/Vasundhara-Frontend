import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  ChevronDown,
  Home,
  Info,
  Briefcase,
  Mail,
  LogOut,
  X,
  ShieldAlert,
  User,
  Menu,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../common/ToastContainer";
// import { useAuth } from "../../context/AuthContext";
// import { useToast } from "../../components/common/ToastContainer";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const toast = useToast();

  const links = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Profile", path: "/admin/adminprofile", icon: <User size={20} /> },
    { name: "Home", path: "/admin/adminhome", icon: <Home size={20} /> },
    {
      name: "About",
      icon: <Info size={20} />,
      subLinks: [
        { name: "About Us", path: "/admin/adminabout" },
        { name: "Vision & Mission", path: "/admin/adminvisionmission" },
        // { name: "Team", path: "/admin/adminteam" },
      ],
    },
    { name: "Receipts", path: "/admin/adminReceipt", icon: <Briefcase size={20} /> },
    { name: "Our Work", path: "/admin/adminourwork", icon: <Briefcase size={20} /> },
    { name: "Contact Us", path: "/admin/admincontact", icon: <Mail size={20} /> },
  ];

  const handleMenuToggle = (menuName) => {
    setOpenMenu(openMenu === menuName ? "" : menuName);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      toast.success("Logged out successfully!");
      setLogoutOpen(false);
      navigate("/login", { replace: true });
    } catch (e) {
      console.error("Logout failed:", e);
      toast.error("Logout failed. Please try again.");
      setLogoutOpen(false);
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Handle escape key to close modals
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (logoutOpen) setLogoutOpen(false);
        if (isMobileOpen) setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [logoutOpen, isMobileOpen]);

  // Auto-expand menu if current path is in sublinks
  useEffect(() => {
    links.forEach((link) => {
      if (link.subLinks?.some((sub) => location.pathname === sub.path)) {
        setOpenMenu(link.name);
      }
    });
  }, [location.pathname]);

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">VSSS</h1>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>
        {user && (
          <div className="mt-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
              {user.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name || "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) =>
          link.subLinks ? (
            <div key={link.name}>
              <button
                onClick={() => handleMenuToggle(link.name)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition font-medium ${link.subLinks.some((sub) => location.pathname === sub.path)
                  ? "bg-yellow-500 text-gray-900"
                  : "hover:bg-gray-800"
                  }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span>{link.name}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${openMenu === link.name ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${openMenu === link.name ? "max-h-40 mt-1" : "max-h-0"
                  }`}
              >
                <div className="pl-4 space-y-1">
                  {link.subLinks.map((subLink) => (
                    <NavLink
                      key={subLink.path}
                      to={subLink.path}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm font-medium ${isActive
                          ? "bg-yellow-500 text-gray-900"
                          : "hover:bg-gray-800 text-gray-300"
                        }`
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {subLink.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition font-medium ${isActive
                  ? "bg-yellow-500 text-gray-900"
                  : "hover:bg-gray-800"
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          )
        )}
      </nav>

      {/* Settings + Logout */}
      <div className="border-t border-gray-700 p-4 space-y-1">
        {/* <NavLink
          to="/admin/adminsettings"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition font-medium ${isActive
              ? "bg-yellow-500 text-gray-900"
              : "hover:bg-gray-800"
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink> */}

        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition text-gray-300"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <Menu size={16} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-gray-900 text-white flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarContent />
      </div>

      {/* Logout Confirmation Modal */}
      {logoutOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4"
          onClick={() => !isLoggingOut && setLogoutOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 rounded-full">
                  <LogOut className="text-red-600" size={24} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Confirm Logout
                </h2>
              </div>
              <button
                type="button"
                onClick={() => !isLoggingOut && setLogoutOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                disabled={isLoggingOut}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-gray-600 mt-4">
              Are you sure you want to log out from the admin portal?
            </p>

            {user && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    Logout
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
              <ShieldAlert size={14} />
              <span>
                For security, close the browser on shared devices after logout.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}