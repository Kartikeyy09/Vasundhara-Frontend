import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const images = [
    "https://picsum.photos/id/1015/1600/600",
    "https://picsum.photos/id/1016/1600/600",
    "https://picsum.photos/id/1018/1600/600",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // 🔹 Preload all images once
  useEffect(() => {
    let loadedCount = 0;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          setLoaded(true); // all images are ready
        }
      };
    });
  }, [images]);

  // 🔹 Auto-slide only after preload
  useEffect(() => {
    if (!loaded) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length, loaded]);

  return (
    <section
      className="relative h-[100vh] flex items-center text-white transition-all duration-1000"
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay dark shade */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* ✅ Container use kiya for consistent spacing */}
      <div className="container relative z-10">
        <div className="max-w-3xl">
          <p className="text-lg md:text-xl mb-4">Volunteer. Lead. Inspire</p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Welcome to Our NGO - World's Leading Volunteering Organization
          </h1>

          
        </div>
      </div>
    </section>
  );
}
