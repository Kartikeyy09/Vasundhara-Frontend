import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="container">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* NGO Logo + Description */}
          <div className="flex flex-col items-start">
            <h2 className="text-3xl font-extrabold text-green-500 mb-4">NGO</h2>
            <p className="text-sm text-gray-200 leading-relaxed">
              Nirgandh is a non-profit organization dedicated to improving
              sanitation, hygiene, and community development across India. We
              work hand-in-hand with government bodies and local communities to
              bring sustainable impact. 🌱
            </p>
          </div>

          {/* Take Action */}
          <div>
            <h3 className="font-bold text-lg mb-4">Take Action</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  onClick={scrollToTop}
                  className="block hover:text-green-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/vision-mission"
                  onClick={scrollToTop}
                  className="block hover:text-green-400"
                >
                  Vision & Mission
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  onClick={scrollToTop}
                  className="block hover:text-green-400"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  onClick={scrollToTop}
                  className="block hover:text-green-400"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h3 className="font-bold text-lg mb-4">Programmes</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/government"
                  onClick={scrollToTop}
                  className="block hover:text-green-400"
                >
                  Government
                </Link>
              </li>
              <li>
                <Link
                  to="/railway"
                  onClick={scrollToTop}
                  className="block hover:text-green-400"
                >
                  Railways
                </Link>
              </li>
              <li>
                <Link
                  to="/municipal-corporation"
                  onClick={scrollToTop}
                  className="block hover:text-green-400"
                >
                  Municipal-Corporation
                </Link>
              </li>
              <li>
                <Link
                  to="/bus-stand"
                  onClick={scrollToTop}
                  className="block hover:text-green-400"
                >
                  Bus Stand
                </Link>
              </li>
            </ul>
          </div>

          {/* Join Movement */}
          <div>
            <h3 className="font-bold text-lg mb-4">Join the Movement</h3>
            <p className="mb-3">Subscribe for updates:</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email *"
                className="px-3 py-2 rounded-l-md outline-none text-black w-full"
              />
              <button className="bg-green-500 px-4 py-2 rounded-r-md font-bold hover:bg-green-600 transition">
                JOIN
              </button>
            </div>

            {/* Social Icons */}
            <div className="mt-6">
              <h3 className="font-bold mb-3">Connect</h3>
              <div className="flex gap-4">
                <a href="#">
                  <Facebook className="w-6 h-6 hover:text-gray-200" />
                </a>
                <a href="#">
                  <Twitter className="w-6 h-6 hover:text-gray-200" />
                </a>
                <a href="#">
                  <Instagram className="w-6 h-6 hover:text-gray-200" />
                </a>
                <a href="#">
                  <Youtube className="w-6 h-6 hover:text-gray-200" />
                </a>
                <a href="#">
                  <Mail className="w-6 h-6 hover:text-gray-200" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-white/40 pt-4">
          <p className="text-center w-full text-sm">
            © 2025 Nirgandh NGO | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
