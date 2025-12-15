// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getOurWorkSummary } from "./api/public/ourWorkApi";

// Fallback data if API fails
const FALLBACK_WORK_ITEMS = [
  { id: "government", title: "Government", link: "/government" },
  { id: "railway", title: "Railways", link: "/railway" },
  { id: "municipal", title: "Municipal Corporation", link: "/municipal-corporation" },
  { id: "bus-stand", title: "Bus Stand", link: "/bus-stand" },
];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [workItems, setWorkItems] = useState([]);
  const [workLoading, setWorkLoading] = useState(true);
  const navRef = useRef(null);
  const location = useLocation();

  // Fetch Our Work items from API
  useEffect(() => {
    const fetchWorkItems = async () => {
      setWorkLoading(true);
      const result = await getOurWorkSummary();

      if (result.success && result.data?.length > 0) {
        // Transform API data to include proper links
        const transformedItems = result.data.map(item => ({
          id: item.id || item._id,
          title: item.title,
          link: `/our-work/${item.id || item._id}`,
          image: item.computedImageUrl || item.coverImageUrl,
        }));
        setWorkItems(transformedItems);
      } else {
        setWorkItems(FALLBACK_WORK_ITEMS);
        console.error("Using fallback work items:", result.error);
      }
      setWorkLoading(false);
    };

    fetchWorkItems();
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const toggleMobileDropdown = (menuName) => {
    setMobileDropdown(mobileDropdown === menuName ? null : menuName);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenu(false);
    setMobileDropdown(null);
    setOpenMenu(null);
  }, [location.pathname]);

  const linkClass = (path) =>
    `relative cursor-pointer flex items-center gap-1 px-2 py-1 transition 
     ${location.pathname === path
      ? "text-green-700 font-semibold"
      : "hover:text-green-800"
    }`;

  // Check if current path is in Our Work section
  const isOurWorkActive = location.pathname.startsWith("/our-work") ||
    workItems.some(item => location.pathname === item.link);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div
        ref={navRef}
        className="container flex justify-between items-center h-16"
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="https://thumbs.dreamstime.com/b/green-leaf-globe-resting-top-design-minimalist-logo-sustainability-focused-ngo-315286237.jpg"
              alt="NGO Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 items-center">
          <li>
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>
          </li>

          {/* About Us dropdown */}
          <li className="relative">
            <div
              className={linkClass("/about")}
              onClick={() => toggleMenu("about")}
            >
              <span>About Us</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${openMenu === "about" ? "rotate-180" : ""
                  }`}
              />
            </div>
            {openMenu === "about" && (
              <ul className="absolute bg-white shadow-lg mt-2 rounded-lg p-2 w-48 z-10 border border-gray-100">
                <li>
                  <Link
                    to="/about"
                    className="block w-full p-2 hover:bg-green-50 hover:text-green-600 rounded transition"
                    onClick={() => setOpenMenu(null)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vision-mission"
                    className="block w-full p-2 hover:bg-green-50 hover:text-green-600 rounded transition"
                    onClick={() => setOpenMenu(null)}
                  >
                    Vision & Mission
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Our Work dropdown - Dynamic from API */}
          <li className="relative">
            <div
              className={`relative cursor-pointer flex items-center gap-1 px-2 py-1 transition ${isOurWorkActive
                  ? "text-green-700 font-semibold"
                  : "hover:text-green-800"
                }`}
              onClick={() => toggleMenu("work")}
            >
              <span>Our Work</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${openMenu === "work" ? "rotate-180" : ""
                  }`}
              />
            </div>
            {openMenu === "work" && (
              <ul className="absolute bg-white shadow-lg mt-2 rounded-lg p-2 w-56 z-10 border border-gray-100 max-h-80 overflow-y-auto">
                {workLoading ? (
                  <li className="flex items-center justify-center p-4">
                    <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                    <span className="ml-2 text-sm text-gray-500">Loading...</span>
                  </li>
                ) : workItems.length > 0 ? (
                  workItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={item.link}
                        className={`block w-full p-2 hover:bg-green-50 hover:text-green-600 rounded transition ${location.pathname === item.link
                            ? "bg-green-50 text-green-700 font-medium"
                            : ""
                          }`}
                        onClick={() => setOpenMenu(null)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 text-sm text-center">
                    No items found
                  </li>
                )}
              </ul>
            )}
          </li>

          {/* Contact Us */}
          <li>
            <Link to="/contact-us" className={linkClass("/contact-us")}>
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger Menu */}
        <button
          className="md:hidden text-green-900 p-2"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label={mobileMenu ? "Close menu" : "Open menu"}
        >
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full p-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Home */}
          <Link
            to="/"
            className={`block p-2 font-semibold rounded transition ${location.pathname === "/"
                ? "text-green-700 bg-green-50"
                : "text-green-900 hover:bg-green-50"
              }`}
            onClick={() => setMobileMenu(false)}
          >
            Home
          </Link>

          {/* About Us Mobile Dropdown */}
          <div>
            <button
              className={`flex justify-between items-center w-full font-semibold p-2 rounded transition ${location.pathname === "/about" || location.pathname === "/vision-mission"
                  ? "text-green-700 bg-green-50"
                  : "text-green-900 hover:bg-green-50"
                }`}
              onClick={() => toggleMobileDropdown("about")}
            >
              <span>About Us</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${mobileDropdown === "about" ? "rotate-180" : ""
                  }`}
              />
            </button>
            {mobileDropdown === "about" && (
              <ul className="mt-2 ml-4 space-y-1 border-l-2 border-green-200 pl-4">
                <li>
                  <Link
                    to="/about"
                    className={`block p-2 rounded transition ${location.pathname === "/about"
                        ? "text-green-700 bg-green-50 font-medium"
                        : "hover:bg-green-50"
                      }`}
                    onClick={() => setMobileMenu(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vision-mission"
                    className={`block p-2 rounded transition ${location.pathname === "/vision-mission"
                        ? "text-green-700 bg-green-50 font-medium"
                        : "hover:bg-green-50"
                      }`}
                    onClick={() => setMobileMenu(false)}
                  >
                    Vision & Mission
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Our Work Mobile Dropdown - Dynamic from API */}
          <div>
            <button
              className={`flex justify-between items-center w-full font-semibold p-2 rounded transition ${isOurWorkActive
                  ? "text-green-700 bg-green-50"
                  : "text-green-900 hover:bg-green-50"
                }`}
              onClick={() => toggleMobileDropdown("work")}
            >
              <span>Our Work</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${mobileDropdown === "work" ? "rotate-180" : ""
                  }`}
              />
            </button>
            {mobileDropdown === "work" && (
              <ul className="mt-2 ml-4 space-y-1 border-l-2 border-green-200 pl-4">
                {workLoading ? (
                  <li className="flex items-center p-2">
                    <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                    <span className="ml-2 text-sm text-gray-500">Loading...</span>
                  </li>
                ) : workItems.length > 0 ? (
                  workItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={item.link}
                        className={`block p-2 rounded transition ${location.pathname === item.link
                            ? "text-green-700 bg-green-50 font-medium"
                            : "hover:bg-green-50"
                          }`}
                        onClick={() => setMobileMenu(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 text-sm">No items found</li>
                )}
              </ul>
            )}
          </div>

          {/* Contact Us */}
          <Link
            to="/contact-us"
            className={`block p-2 font-semibold rounded transition ${location.pathname === "/contact-us"
                ? "text-green-700 bg-green-50"
                : "text-green-900 hover:bg-green-50"
              }`}
            onClick={() => setMobileMenu(false)}
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}