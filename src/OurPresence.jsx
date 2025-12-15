// src/components/OurPresence.jsx
import { useState, useEffect } from "react";
import { getStats } from "./api/public/statsApi";
// import { getStats } from "../api/public/statsApi";

// Fallback data if API fails
const FALLBACK_STATS = [
  { _id: "1", number: 1687829, label: "Household Toilets", icon: "🚽", color: "#22C55E" },
  { _id: "2", number: 10746, label: "Public Toilets", icon: "🚻", color: "#22C55E" },
  { _id: "3", number: 20207, label: "School Toilets", icon: "🏫", color: "#22C55E" },
  { _id: "4", number: 2454, label: "Slum Community Toilets", icon: "👥", color: "#22C55E" },
  { _id: "5", number: 12, label: "Modern Rural Villages", icon: "🏘️", color: "#22C55E" },
  { _id: "6", number: 200000, label: "Manual Scavengers Liberated", icon: "👨‍👩‍👧‍👦", color: "#22C55E" },
  { _id: "7", number: 310, label: "Urban Slum Campaigns", icon: "📢", color: "#22C55E", sub: "About Health, Sanitation & Safe Drinking Water" },
  { _id: "8", number: 12099, label: "Women Volunteers", icon: "👩‍🦰", color: "#22C55E", sub: "Trained for Health & Sanitation in Urban Slums" },
];

function StatCounter({ number, label, icon, color, sub }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger when component becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`stat-${label}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [label]);

  // Counter animation
  useEffect(() => {
    if (!isVisible || !number) return;

    let start = 0;
    const duration = 2000;
    const increment = Math.ceil(number / (duration / 30));

    const counter = setInterval(() => {
      start += increment;
      if (start >= number) {
        setCount(number);
        clearInterval(counter);
      } else {
        setCount(start);
      }
    }, 30);

    return () => clearInterval(counter);
  }, [number, isVisible]);

  return (
    <div
      id={`stat-${label}`}
      className="relative flex flex-col items-center text-center p-6 
                 bg-green-50 rounded-xl shadow-sm border border-green-400
                 hover:shadow-xl hover:border-green-700 hover:scale-105
                 transition duration-300 ease-in-out group overflow-hidden"
    >
      {/* Overlay effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-100/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

      {/* Bottom line animation */}
      <span
        className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
        style={{ backgroundColor: color || "#166534" }}
      ></span>

      {/* Icon circle */}
      <div
        className="relative z-10 w-16 h-16 flex items-center justify-center 
                   rounded-full text-2xl mb-4 text-white 
                   transition duration-300 transform group-hover:scale-110 group-hover:rotate-6 shadow-md"
        style={{
          background: color
            ? `linear-gradient(to right, ${color}, ${adjustColor(color, -20)})`
            : "linear-gradient(to right, #166534, #15803d)"
        }}
      >
        {icon || "📊"}
      </div>

      {/* Count */}
      <h2 className="relative z-10 text-2xl font-bold text-green-900">
        {count.toLocaleString()}+
      </h2>

      {/* Label */}
      <p className="relative z-10 text-green-900 font-medium">{label}</p>

      {/* Subtext */}
      {sub && (
        <p className="relative z-10 text-sm text-green-800 mt-1">{sub}</p>
      )}
    </div>
  );
}

// Helper function to darken/lighten color
function adjustColor(hex, amount) {
  if (!hex) return "#166534";

  let color = hex.replace("#", "");
  if (color.length === 3) {
    color = color.split("").map((c) => c + c).join("");
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default function OurPresence() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const result = await getStats();

      if (result.success && result.data?.length > 0) {
        setStats(result.data);
        setError(null);
      } else {
        setStats(FALLBACK_STATS);
        setError(result.error);
        console.error("Using fallback stats due to API error:", result.error);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-green-900">
              Our Presence
            </h1>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-green-900">
            Our Presence
          </h1>
          <p className="text-lg md:text-xl text-green-800 mt-3">
            Over 20 Million People in India Use Our Toilets Everyday
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {stats.map((stat) => (
            <StatCounter
              key={stat._id}
              number={stat.number}
              label={stat.label}
              icon={stat.icon}
              color={stat.color}
              sub={stat.sub}
            />
          ))}
        </div>
      </div>
    </section>
  );
}