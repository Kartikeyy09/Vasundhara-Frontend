// src/components/Footer.jsx
import { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Linkedin,
  Phone,
  MapPin,
  Globe,
  Loader2,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { getPublicProfile } from "./api/admin/profileAdminApi";
import { getOurWorkSummary } from "./api/public/ourWorkApi";
import { IMAGES } from "./utils/constants";
// import { getPublicProfile } from "../api/admin/profileAdminApi";
// import { getOurWorkSummary } from "../api/public/ourWorkApi";
// import { IMAGES } from "../utils/constants";

// Fallback data for Our Work if API fails
const FALLBACK_WORK_ITEMS = [
  { id: "government", title: "Government", link: "/our-work/government" },
  { id: "railway", title: "Railways", link: "/our-work/railway" },
  { id: "municipal", title: "Municipal Corporation", link: "/our-work/municipal-corporation" },
  { id: "bus-stand", title: "Bus Stand", link: "/our-work/bus-stand" },
];

export default function Footer() {
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [workItems, setWorkItems] = useState([]);
  const [isWorkLoading, setIsWorkLoading] = useState(true);

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getPublicProfile();
        if (response.success && response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch Our Work Summary Data
  useEffect(() => {
    const fetchWorkItems = async () => {
      setIsWorkLoading(true);
      try {
        const result = await getOurWorkSummary();

        if (result.success && result.data?.length > 0) {
          // Transform API data to include proper links
          const transformedItems = result.data.map(item => ({
            id: item.id || item._id,
            title: item.title,
            link: `/our-work/${item.id || item._id}`,
            image: item.computedImageUrl || IMAGES.url(item.coverImageUrl),
          }));
          setWorkItems(transformedItems);
        } else {
          setWorkItems(FALLBACK_WORK_ITEMS);
          console.error("Using fallback work items:", result.error);
        }
      } catch (error) {
        console.error("Error fetching work items:", error);
        setWorkItems(FALLBACK_WORK_ITEMS);
      } finally {
        setIsWorkLoading(false);
      }
    };

    fetchWorkItems();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get profile picture URL
  const getProfilePicture = () => {
    if (!profile?.profilePicture) return null;
    return profile.computedProfilePicture || IMAGES.url(profile.profilePicture);
  };

  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ===== Column 1: NGO Logo + Description + Contact ===== */}
          <div className="flex flex-col items-start">
            {isProfileLoading ? (
              <div className="flex items-center gap-2 mb-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm text-gray-300">Loading...</span>
              </div>
            ) : (
              <>
                {/* Logo/Profile Picture */}
                <div className="flex items-center gap-3 mb-4">

                  <h4 className="text-xl md:text-2xl font-extrabold text-green-400 uppercase leading-tight">
                    {profile?.ngoName || "VSSS NGO"}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-200 leading-relaxed mb-4">
                  {profile?.description ||
                    "VSSS is a non-profit organization dedicated to improving sanitation, hygiene, and community development across India. We work hand-in-hand with government bodies and local communities to bring sustainable impact. 🌱"}
                </p>

                {/* Contact Info */}

              </>
            )}
          </div>

          {/* ===== Column 2: Take Action / Quick Links ===== */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-green-400 flex items-center gap-2">
              <ChevronRight className="w-5 h-5" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="flex items-center gap-2 hover:text-green-400 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={scrollToTop}
                  className="flex items-center gap-2 hover:text-green-400 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/vision-mission"
                  onClick={scrollToTop}
                  className="flex items-center gap-2 hover:text-green-400 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Vision & Mission</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  onClick={scrollToTop}
                  className="flex items-center gap-2 hover:text-green-400 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ===== Column 3: Our Work / Programmes (Dynamic from API) ===== */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-green-400 flex items-center gap-2">
              <ChevronRight className="w-5 h-5" />
              Our Work
            </h3>

            {isWorkLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-300">Loading programmes...</span>
              </div>
            ) : (
              <ul className="space-y-2">
                {workItems.length > 0 ? (
                  workItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={item.link}
                        onClick={scrollToTop}
                        className="flex items-center gap-2 hover:text-green-400 transition-colors group"
                      >
                        {/* Optional: Show thumbnail */}
                        {/* {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-6 h-6 rounded object-cover flex-shrink-0 border border-green-700"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )} */}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 text-sm">No programmes available</li>
                )}

                {/* View All Link */}
                {/* {workItems.length > 0 && (
                  <li className="pt-2">
                    <Link
                      to="/our-work"
                      onClick={scrollToTop}
                      className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors text-sm font-medium"
                    >
                      <span>View All Programmes</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </li>
                )} */}
              </ul>
            )}
          </div>

          {/* ===== Column 4: Join Movement + Social Links ===== */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-green-400 flex items-center gap-2">
              <ChevronRight className="w-5 h-5" />
              Join the Movement
            </h3>
            <div className="space-y-2 text-sm">
              {profile?.mobileNo && (
                <a
                  href={`tel:${profile.mobileNo.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-gray-200 hover:text-green-400 transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{profile.mobileNo}</span>
                </a>
              )}

              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-gray-200 hover:text-green-400 transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>{profile.email}</span>
                </a>
              )}

              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-200 hover:text-green-400 transition-colors"
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}

              {profile?.address && (
                <div className="flex items-start gap-2 text-gray-200">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-xs leading-relaxed">{profile.address}</span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="mt-6">
              <h4 className="font-bold mb-3 text-green-400 text-sm">Connect With Us</h4>
              <div className="flex flex-wrap gap-3">
                {/* Facebook */}
                <a
                  href={profile?.socialLinks?.facebook || "#"}
                  target={profile?.socialLinks?.facebook ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="p-2 bg-green-800 rounded-full hover:bg-blue-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>

                {/* Twitter */}
                <a
                  href={profile?.socialLinks?.twitter || "#"}
                  target={profile?.socialLinks?.twitter ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="p-2 bg-green-800 rounded-full hover:bg-sky-500 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>

                {/* Instagram */}
                <a
                  href={profile?.socialLinks?.instagram || "#"}
                  target={profile?.socialLinks?.instagram ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="p-2 bg-green-800 rounded-full hover:bg-pink-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                {/* YouTube */}
                <a
                  href={profile?.socialLinks?.youtube || "#"}
                  target={profile?.socialLinks?.youtube ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="p-2 bg-green-800 rounded-full hover:bg-red-600 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>

                {/* LinkedIn */}
                <a
                  href={profile?.socialLinks?.linkedin || "#"}
                  target={profile?.socialLinks?.linkedin ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="p-2 bg-green-800 rounded-full hover:bg-blue-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                {/* Email */}
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="p-2 bg-green-800 rounded-full hover:bg-yellow-600 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Bottom Bar ===== */}
        <div className="mt-10 border-t border-white/30 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-center text-sm text-gray-300">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-green-400">
                {profile?.ngoName || "VSSS NGO"}
              </span>{" "}
              | All Rights Reserved
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
              <Link
                to="/privacy-policy"
                onClick={scrollToTop}
                className="hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </Link>

            </div>
          </div>

          {/* Developer Credit (Optional) */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Designed & Developed with 💚 for a better tomorrow
          </p>
        </div>
      </div>
    </footer>
  );
}