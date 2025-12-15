// src/components/HeroSection.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHeroSlides } from "./api/public/heroApi";
// import { getHeroSlides } from "../api/public/heroApi";

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Fallback data
  const fallbackSlides = [
    {
      computedImageUrl: "https://picsum.photos/id/1015/1600/600",
      title: "Welcome to Our NGO - World's Leading Volunteering Organization",
      subtitle: "Volunteer. Lead. Inspire",
      duration: 3,
    },
  ];

  // 🔹 Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      const result = await getHeroSlides();
      if (result.success && result.data?.length > 0) {
        setSlides(result.data);
      } else {
        setSlides(fallbackSlides);
      }
    };
    fetchData();
  }, []);

  // 🔹 Preload images
  useEffect(() => {
    if (slides.length === 0) return;

    let loadedCount = 0;
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.computedImageUrl || slide.imageUrl;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === slides.length) setLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === slides.length) setLoaded(true);
      };
    });
  }, [slides]);

  // 🔹 Auto-slide
  useEffect(() => {
    if (!loaded || slides.length <= 1) return;

    const duration = (slides[currentIndex]?.duration || 3) * 1000;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, duration);

    return () => clearInterval(interval);
  }, [slides, loaded, currentIndex]);

  // Current slide data
  const current = slides[currentIndex] || {};

  if (slides.length === 0) {
    return (
      <section className="relative h-[100vh] flex items-center justify-center bg-gray-900 text-white">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section
      className="relative h-[100vh] flex items-center text-white transition-all duration-1000"
      style={{
        backgroundImage: `url(${current.computedImageUrl || current.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <p className="text-lg md:text-xl mb-4">
            {current.subtitle || "Volunteer. Lead. Inspire"}
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {current.title || "Welcome to Our NGO"}
          </h1>
        </div>
      </div>
    </section>
  );
}