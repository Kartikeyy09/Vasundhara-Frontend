// src/components/AboutHome.jsx
import React, { useState, useEffect } from "react";
import { getAboutCards } from "./api/public/aboutApi";

// Fallback data if API fails
const FALLBACK_DATA = [
  {
    _id: "fallback-1",
    title: "A Cleantech Organization providing sustainable WASH Solutions.",
    description: "Nirgandh endeavours to provide technology-driven, affordable WASH (Water, Sanitation and Hygiene) solutions for healthy sanitation practices that save lives and conserve water. As part of the Cleantech industry, we provide environment-friendly, easy to deploy and economical solutions for essential sanitation needs.",
    mainImage: "https://www.ecoredux.com/wp-content/uploads/conserve-water.jpg",
    computedImageUrl: "https://www.ecoredux.com/wp-content/uploads/conserve-water.jpg",
  },
  {
    _id: "fallback-2",
    title: "Empowering Communities Through Clean Water",
    description: "We believe access to clean water is a fundamental right. Our initiatives focus on providing sustainable water solutions to underserved communities, ensuring health and hygiene for all.",
    mainImage: "https://picsum.photos/id/1015/800/600",
    computedImageUrl: "https://picsum.photos/id/1015/800/600",
  },
];

export default function AboutHome() {
  const [aboutCards, setAboutCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch about data from API
  useEffect(() => {
    const fetchAboutData = async () => {
      setLoading(true);
      const result = await getAboutCards();

      if (result.success && result.data?.length > 0) {
        setAboutCards(result.data);
        setError(null);
      } else {
        setAboutCards(FALLBACK_DATA);
        setError(result.error);
        console.error("Using fallback data due to API error:", result.error);
      }
      setLoading(false);
    };

    fetchAboutData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        {/* Section Header (Optional) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            About Us
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded-full"></div>
        </div>

        {/* Cards with Alternating Layout */}
        <div className="space-y-16 md:space-y-24">
          {aboutCards.map((card, index) => {
            const isEven = index % 2 === 0;
            const imageUrl = card.computedImageUrl || card.mainImage || FALLBACK_DATA[0].mainImage;

            return (
              <div
                key={card._id}
                className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-8 md:gap-12`}
              >
                {/* Text Section */}
                <div className="md:w-1/2">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-800 leading-snug mb-6">
                    {card.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    {card.description}
                  </p>
                </div>

                {/* Image Section */}
                <div className="md:w-1/2 flex justify-center w-full">
                  <div className="border-2 border-green-500 rounded-[30px] overflow-hidden w-full max-w-md h-64 md:h-80 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        e.target.src = "https://www.ecoredux.com/wp-content/uploads/conserve-water.jpg";
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}