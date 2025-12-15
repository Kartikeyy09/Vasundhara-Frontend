// src/About/AboutContent.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAboutUsHero, getAboutUsAbout } from "../api/public/aboutUsApi";

// Fallback data for Hero
const FALLBACK_HERO = [
  {
    _id: "fallback-1",
    title: "BETTER LIFE FOR FUTURE",
    computedImageUrl: "https://plus.unsplash.com/premium_photo-1682092585257-58d1c813d9b4?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0",
  },
  {
    _id: "fallback-2",
    title: "BETTER LIFE FOR FUTURE",
    computedImageUrl: "https://t3.ftcdn.net/jpg/07/32/70/14/240_F_732701472_PvndBF0Q1MpjNQgyMd5tRAng0Rkfz1BE.jpg",
  },
  {
    _id: "fallback-3",
    title: "BETTER LIFE FOR FUTURE",
    computedImageUrl: "https://img.freepik.com/free-photo/adorable-kid-lifestyle_23-2151799955.jpg?semt=ais_hybrid&w=740&q=80",
  },
];

// Fallback data for About Section
const FALLBACK_ABOUT = {
  _id: "fallback-about",
  subtitle: "Who We Are",
  title: "About NGO",
  description: `We believe in providing technology driven affordable sanitation products and services to help stop open defecation, Conserve Water Resources and Reduce/Stop Water Resource Contamination and Stop Manual Scavenging.

We aim to provide security, comfort, and safety during defecation, motivate the use of in-house toilet with our high-quality products. These eco-friendly toilets are easy to install, use, and maintain and require minimal water consumption.

Nirgandh, a social impact organization is determined to changing lives significantly by increasing productivity, health, and happiness quotient. We hope to reach this goal by providing high-quality affordable sanitation and water conservation products and services to one and all.`,
  computedImageUrl: "https://sankeshfoundation.org/wp-content/uploads/2023/08/Impact-of-an-NGO-in-India-to-Clean-Water-and-Sanitation-Sankesh-Global-Foundation-1160x654.jpg",
};

export default function AboutContent() {
  // Hero state
  const [heroImages, setHeroImages] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // About state
  const [aboutData, setAboutData] = useState(null);
  const [aboutLoading, setAboutLoading] = useState(true);

  // Fetch Hero data
  useEffect(() => {
    const fetchHeroData = async () => {
      setHeroLoading(true);
      const result = await getAboutUsHero();

      if (result.success && result.data?.length > 0) {
        setHeroImages(result.data);
      } else {
        setHeroImages(FALLBACK_HERO);
        console.error("Using fallback hero data:", result.error);
      }
      setHeroLoading(false);
    };

    fetchHeroData();
  }, []);

  // Fetch About data
  useEffect(() => {
    const fetchAboutData = async () => {
      setAboutLoading(true);
      const result = await getAboutUsAbout();

      if (result.success && result.data) {
        setAboutData(result.data);
      } else {
        setAboutData(FALLBACK_ABOUT);
        console.error("Using fallback about data:", result.error);
      }
      setAboutLoading(false);
    };

    fetchAboutData();
  }, []);

  // Preload hero images
  useEffect(() => {
    if (heroImages.length === 0) return;

    let loadedCount = 0;
    const totalImages = heroImages.length;

    heroImages.forEach((item) => {
      const img = new Image();
      img.src = item.computedImageUrl || item.image || item.imageUrl;

      const handleLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleLoad;
    });

    // Fallback timeout
    const timeout = setTimeout(() => setImagesLoaded(true), 5000);
    return () => clearTimeout(timeout);
  }, [heroImages]);

  // Auto-change hero images
  useEffect(() => {
    if (!imagesLoaded || heroImages.length <= 1) return;

    const currentHero = heroImages[currentImage];
    const duration = (currentHero?.duration || 3) * 1000;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, duration);

    return () => clearInterval(interval);
  }, [imagesLoaded, heroImages, currentImage]);

  // Get current hero data
  const currentHero = heroImages[currentImage] || {};

  // Loading state
  if (heroLoading && aboutLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Images Layer */}
        <div className="absolute inset-0">
          {heroImages.map((item, index) => (
            <div
              key={item._id || item.id || index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              style={{
                backgroundImage: `url('${item.computedImageUrl || item.image || item.imageUrl}')`,
              }}
            >
              {/* Black fade effect */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white container px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            {currentHero.title || "BETTER LIFE FOR FUTURE"}
          </h1>
          {currentHero.subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
              {currentHero.subtitle}
            </p>
          )}
          {currentHero.description && (
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mt-4">
              {currentHero.description}
            </p>
          )}
        </div>

        {/* Slide Indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentImage
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            {aboutLoading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ) : (
              <>
                <h4 className="text-green-800 font-semibold text-lg mb-2">
                  {aboutData?.subtitle || "Who We Are"}
                </h4>
                <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-6">
                  {aboutData?.title || "About NGO"}
                </h2>

                {/* Render description - handle both string and paragraphs */}
                {aboutData?.description ? (
                  aboutData.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <>
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
                  </>
                )}

                {/* Optional: Points/Features list */}
                {aboutData?.points && aboutData.points.length > 0 && (
                  <ul className="mt-6 space-y-2">
                    {aboutData.points.map((point, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600 mt-1">✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Optional: CTA Button */}
                {aboutData?.ctaText && aboutData?.ctaLink && (
                  <Link
                    to={aboutData.ctaLink}
                    className="inline-block mt-6 px-6 py-3 bg-green-700 text-white font-semibold rounded-full hover:bg-green-800 transition"
                  >
                    {aboutData.ctaText}
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            {aboutLoading ? (
              <div className="w-full max-w-lg h-80 bg-gray-200 rounded-xl animate-pulse"></div>
            ) : (
              <img
                src={aboutData?.image || aboutData?.imageUrl || FALLBACK_ABOUT.computedImageUrl}
                alt={aboutData?.title || "About Us"}
                className="rounded-xl shadow-lg w-full max-w-lg h-auto object-cover"
                onError={(e) => {
                  e.target.src = FALLBACK_ABOUT.computedImageUrl;
                }}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}