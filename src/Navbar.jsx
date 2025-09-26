import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const navRef = useRef(null);
  const location = useLocation();

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const toggleMobileDropdown = (menuName) => {
    setMobileDropdown(mobileDropdown === menuName ? null : menuName);
  };

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

  const linkClass = (path) =>
    `relative cursor-pointer flex items-center gap-1 px-2 py-1 transition 
     ${
       location.pathname === path
         ? "text-green-700 font-semibold"
         : "hover:text-green-800"
     }`;

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
              <ChevronDown size={16} />
            </div>
            {openMenu === "about" && (
              <ul className="absolute bg-white shadow-md mt-2 rounded p-2 w-44 z-10">
                <li>
                  <Link
                    to="/about"
                    className="block w-full p-2 hover:bg-green-50 hover:text-green-600 rounded"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vision-mission"
                    className="block w-full p-2 hover:bg-green-50 hover:text-green-600 rounded"
                  >
                    Vision & Mission
                  </Link>
                </li>
                <li>
                  <Link
                    to="/team"
                    className="block w-full p-2 hover:bg-green-50 hover:text-green-600 rounded"
                  >
                    Team
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Our Work dropdown */}
          <li className="relative">
            <div
              className={linkClass("/government")}
              onClick={() => toggleMenu("work")}
            >
              <span>Our Work</span>
              <ChevronDown size={16} />
            </div>
            {openMenu === "work" && (
              <ul className="absolute bg-white shadow-md mt-2 rounded p-2 w-56 z-10">
                <li>
                  <Link
                    to="/government"
                    className="block w-full p-2 hover:bg-green-50 hover:text-green-600 rounded"
                  >
                    Government
                  </Link>
                </li>
                <li>
                  <Link
                    to="/railway"
                    className="block w-full p-2 hover:bg-green-50 hover:text-green-600 rounded"
                  >
                    Railways
                  </Link>
                </li>
                <li>
                  <Link
                    to="/municipal-corporation"
                    className="block w-full p-2 hover:bg-green-50 hover:text-green-600 rounded"
                  >
                    Municipal Corporation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bus-stand"
                    className="block w-full p-2 hover:bg-green-50 hover:text-green-600 rounded"
                  >
                    Bus Stand
                  </Link>
                </li>
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
          className="md:hidden text-green-900"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full p-4 space-y-2">
          {/* Home */}
          <Link
            to="/"
            className="block p-2 font-semibold text-green-900 hover:bg-green-50 rounded"
            onClick={() => setMobileMenu(false)}
          >
            Home
          </Link>

          {/* About Us Mobile Dropdown */}
          <div>
            <button
              className="flex justify-between items-center w-full text-green-900 font-semibold p-2 hover:bg-green-50 rounded"
              onClick={() => toggleMobileDropdown("about")}
            >
              <span>About Us</span>
              <ChevronDown
                size={16}
                className={`${mobileDropdown === "about" ? "rotate-180" : ""}`}
              />
            </button>
            {mobileDropdown === "about" && (
              <ul className="mt-2 space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="block p-2 hover:bg-green-50 rounded"
                    onClick={() => setMobileMenu(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vision-mission"
                    className="block p-2 hover:bg-green-50 rounded"
                    onClick={() => setMobileMenu(false)}
                  >
                    Vision & Mission
                  </Link>
                </li>
                <li>
                  <Link
                    to="/team"
                    className="block p-2 hover:bg-green-50 rounded"
                    onClick={() => setMobileMenu(false)}
                  >
                    Team
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Our Work Mobile Dropdown */}
          <div>
            <button
              className="flex justify-between items-center w-full text-green-900 font-semibold p-2 hover:bg-green-50 rounded"
              onClick={() => toggleMobileDropdown("work")}
            >
              <span>Our Work</span>
              <ChevronDown
                size={16}
                className={`${mobileDropdown === "work" ? "rotate-180" : ""}`}
              />
            </button>
            {mobileDropdown === "work" && (
              <ul className="mt-2 space-y-2">
                <li>
                  <Link
                    to="/government"
                    className="block p-2 hover:bg-green-50 rounded"
                    onClick={() => setMobileMenu(false)}
                  >
                    Government
                  </Link>
                </li>
                <li>
                  <Link
                    to="/railway"
                    className="block p-2 hover:bg-green-50 rounded"
                    onClick={() => setMobileMenu(false)}
                  >
                    Railways
                  </Link>
                </li>
                <li>
                  <Link
                    to="/municipal-corporation"
                    className="block p-2 hover:bg-green-50 rounded"
                    onClick={() => setMobileMenu(false)}
                  >
                    Municipal Corporation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bus-stand"
                    className="block p-2 hover:bg-green-50 rounded"
                    onClick={() => setMobileMenu(false)}
                  >
                    Bus Stand
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Contact Us */}
          <Link
            to="/contact-us"
            className="block p-2 font-semibold text-green-900 hover:bg-green-50 rounded"
            onClick={() => setMobileMenu(false)}
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}
