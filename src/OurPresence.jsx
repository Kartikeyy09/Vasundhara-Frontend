 import { useState, useEffect } from "react";

const statsData = [
  { value: 1687829, label: "Household Toilets", icon: "🚽" },
  { value: 10746, label: "Public Toilets", icon: "🚻" },
  { value: 20207, label: "School Toilets", icon: "🏫" },
  { value: 2454, label: "Slum Community Toilets", icon: "👥" },
  { value: 12, label: "Modern Rural Villages", icon: "🏘️" },
  { value: 200000, label: "Manual Scavengers Liberated and Rehabilitated", icon: "👨‍👩‍👧‍👦" },
  { value: 310, label: "Urban Slum Campaigns", sub: "About Health, Sanitation & Safe Drinking Water", icon: "📢" },
  { value: 12099, label: "Women Volunteers", sub: "Trained for Health & Sanitation in Urban Slums", icon: "👩‍🦰" },
];

function StatCounter({ value, label, icon, sub }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 sec animation
    const increment = Math.ceil(value / (duration / 30));

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(counter);
      } else {
        setCount(start);
      }
    }, 30);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
      {/* Icon circle */}
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 text-2xl mb-4">
        {icon}
      </div>
      {/* Count */}
      <h2 className="text-2xl font-bold text-indigo-900">
        {count.toLocaleString()}+
      </h2>
      {/* Label */}
      <p className="text-indigo-900 font-medium">{label}</p>
      {/* Subtext */}
      {sub && <p className="text-sm text-indigo-800 mt-1">{sub}</p>}
    </div>
  );
}

export default function OurPresence() {
  return (
    <section className="py-16 bg-gray-50">
      {/* ✅ Tailwind container use kiya */}
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            Our Presence
          </h1>
          <p className="text-lg md:text-xl text-indigo-900 mt-3">
            Over 20 Million People in India Use Our Toilets Everyday
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {statsData.map((stat, index) => (
            <StatCounter key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
