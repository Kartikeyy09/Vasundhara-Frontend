 import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AboutContent() {
  const images = [
    "https://plus.unsplash.com/premium_photo-1682092585257-58d1c813d9b4?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0",
    "https://t3.ftcdn.net/jpg/07/32/70/14/240_F_732701472_PvndBF0Q1MpjNQgyMd5tRAng0Rkfz1BE.jpg",
    "https://img.freepik.com/free-photo/adorable-kid-lifestyle_23-2151799955.jpg?semt=ais_hybrid&w=740&q=80",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  // preload
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // auto change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Images Layer */}
        <div className="absolute inset-0">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url('${img}')` }}
            >
              {/* Black fade effect */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white container">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            BETTER LIFE FOR FUTURE
          </h1>
          <button className="bg-green-900 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-md shadow-lg transition duration-300">
            <Link to="/volunteer-now" className="hover:text-green-200">
            Volunteer Now    </Link>
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            <h4 className="text-green-800 font-semibold text-lg mb-2">
              Who We Are
            </h4>
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-6">
              About NGO
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We believe in providing technology driven affordable sanitation
              products and services to help stop open defecation, Conserve Water
              Resources and Reduce/Stop Water Resource Contamination and Stop
              Manual Scavenging.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We aim to provide security, comfort, and safety during defecation,
              motivate the use of in-house toilet with our high-quality
              products. These eco-friendly toilets are easy to install, use, and
              maintain and require minimal water consumption.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Nirgandh, a social impact organization is determined to changing
              lives significantly by increasing productivity, health, and
              happiness quotient. We hope to reach this goal by providing
              high-quality affordable sanitation and water conservation products
              and services to one and all.
            </p>
            
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src="https://sankeshfoundation.org/wp-content/uploads/2023/08/Impact-of-an-NGO-in-India-to-Clean-Water-and-Sanitation-Sankesh-Global-Foundation-1160x654.jpg"
              alt="Sanitation Awareness"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
