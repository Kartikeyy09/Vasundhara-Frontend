import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  UserCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
} from "lucide-react";
import { useToast } from "../../common/ToastContainer";
import { useAuth } from "../../context/AuthContext";
// import { useAuth } from "../../context/AuthContext";
// import { useToast } from "../../components/common/ToastContainer";

// Hook to detect clicks outside an element
function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "New Donation",
      message: "Received ₹5,000 from an anonymous donor.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "Event Reminder",
      message: "Health camp starts tomorrow at 9 AM.",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Report Pending",
      message: "Monthly report submission is due in 2 days.",
      time: "2 days ago",
      read: true,
    },
  ]);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();

  // Close dropdowns if clicked outside
  useOutsideAlerter(notificationRef, () => setNotificationOpen(false));
  useOutsideAlerter(userMenuRef, () => setUserMenuOpen(false));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.warning("Please enter a search term");
      return;
    }
    toast.info(`Searching for: ${searchQuery}`);
    setSearchQuery("");
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      setShowLogoutModal(false);
      setUserMenuOpen(false);
      toast.success("Successfully logged out.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "warning":
        return <AlertCircle size={16} className="text-yellow-500" />;
      case "info":
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm flex items-center justify-between px-4 lg:px-6 py-3 sticky top-0 z-30">
        {/* Left: NGO Name */}
        <div className="ml-12 lg:ml-0">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
            Vasundhara NGO
          </h1>

        </div>

        {/* Right: Search + Icons */}
        <div className="flex items-center gap-2 lg:gap-6">
          {/* Search - Hidden on mobile */}


          {/* Mobile Search Button */}


          {/* Notifications */}
          {/* <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition rounded-lg hover:bg-gray-100"
            >
              <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-medium">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 lg:w-96 bg-white rounded-xl shadow-xl border overflow-hidden z-50 animate-fadeIn">
                <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-800">Notifications</h3>
                    <p className="text-xs text-gray-500">
                      {unreadCount} unread messages
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <ul className="divide-y">
                      {notifications.map((notification) => (
                        <li
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition ${!notification.read ? "bg-blue-50/50" : ""
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>

                <div className="p-3 text-center border-t bg-gray-50">
                  <NavLink
                    to="/admin/notifications"
                    onClick={() => setNotificationOpen(false)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all notifications →
                  </NavLink>
                </div>
              </div>
            )}
          </div> */}

          {/* User Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">{user?.role || "Administrator"}</p>
              </div>
              <ChevronDown
                size={16}
                className={`hidden lg:block text-gray-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border py-2 z-50 animate-fadeIn">
                {/* User Info */}
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || "admin@example.com"}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {user?.role || "Admin"}
                  </span>
                </div>

                <div className="py-1">
                  <NavLink
                    to="/admin/adminprofile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <UserCircle size={18} />
                    <span>My Profile</span>
                  </NavLink>
                  <NavLink
                    to="/admin/change-password"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <UserCircle size={18} />
                    <span>Change Password</span>
                  </NavLink>
                  {/* <NavLink
                    to="/admin/adminsettings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </NavLink> */}
                </div>

                <div className="border-t pt-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !isLoggingOut && setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <LogOut size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Logout
                </h3>
              </div>
              <button
                onClick={() => !isLoggingOut && setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to log out of your account?
            </p>

            {user && (
              <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-gray-300 font-medium hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 transition"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}