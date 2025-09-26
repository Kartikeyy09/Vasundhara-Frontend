 import React from "react";

export default function AnimatedImage() {
  return (
    <section className="py-16 bg-white">
      {/* ✅ Tailwind container (config respect karega) */}
      <div className="container flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Section */}
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 leading-snug mb-6">
            A Cleantech Organization providing sustainable WASH Solutions.
          </h1>
          <p className="text-gray-800 leading-relaxed mb-6">
            Nirgandh endeavours to provide technology-driven, affordable WASH
            (Water, Sanitation and Hygiene) solutions for healthy sanitation
            practices that save lives and conserve water. As part of the
            Cleantech industry, we provide environment-friendly, easy to deploy
            and economical solutions for essential sanitation needs.As part of the
            Cleantech industry, we provide environment-friendly, easy to deploy
            and economical solutions for essential sanitation needs.
          </p>
          
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 flex justify-center">
          <div className="border-2 border-green-500 rounded-[30px] overflow-hidden w-full max-w-md h-64 md:h-80 flex items-center justify-center shadow-sm">
            <img
              src="https://www.ecoredux.com/wp-content/uploads/conserve-water.jpg"
              alt="Cleantech"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
