// src/About/AboutWorkSection.jsx
import React, { useState, useEffect } from "react";
import { getAboutUsAreas } from "../api/public/aboutUsApi";

// Fallback data if API fails
const FALLBACK_AREAS = [
  {
    _id: "fallback-1",
    title: "GOVERNMENT SANITATION (PUBLIC TOILETS)",
    description: "In its 50 years of public service, Sulabh International has worked to achieve equitable sanitation and hygiene for all. It has been in the forefront of Government of India's flagship Swachh Bharat Abhiyan (Clean India Campaign) with a focus on ending open defecation. It has built over 1.6 million household toilets and has been awarded the Gandhi Peace Prize for 2016.",
    computedImageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "fallback-2",
    title: "RAILWAYS SANITATION",
    description: "In its 50 years of public service, Sulabh International has worked to achieve equitable sanitation and hygiene for all. It has been in the forefront of Government of India's flagship Swachh Bharat Abhiyan (Clean India Campaign) with a focus on ending open defecation. It has built over 1.6 million household toilets and has been awarded the Gandhi Peace Prize for 2016.",
    computedImageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "fallback-3",
    title: "MUNICIPAL CORPORATION SANITATION",
    description: "In its 50 years of public service, Sulabh International has worked to achieve equitable sanitation and hygiene for all. It has been in the forefront of Government of India's flagship Swachh Bharat Abhiyan (Clean India Campaign) with a focus on ending open defecation. It has built over 1.6 million household toilets and has been awarded the Gandhi Peace Prize for 2016.",
    computedImageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "fallback-4",
    title: "SULABH SAUCHALAY",
    description: "In its 50 years of public service, Sulabh International has worked to achieve equitable sanitation and hygiene for all. It has been in the forefront of Government of India's flagship Swachh Bharat Abhiyan (Clean India Campaign) with a focus on ending open defecation. It has built over 1.6 million household toilets and has been awarded the Gandhi Peace Prize for 2016.",
    computedImageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  },
];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80";

// Single Area Card Component
function AreaCard({ area, index, isVisible }) {
  const isEven = index % 2 === 0;
  const imageUrl = area.computedImageUrl || area.image || area.imageUrl || FALLBACK_IMAGE;

  return (
    <div
      className={`container grid md:grid-cols-2 gap-12 items-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {/* Conditional Order: Text first for even, Image first for odd */}
      {isEven ? (
        <>
          {/* Left Content */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-extrabold text-green-900 mb-4">
              {area.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {area.description}
            </p>
            {area.highlights && area.highlights.length > 0 && (
              <ul className="mt-4 space-y-2">
                {area.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 mt-1">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt={area.title}
              className="rounded-xl shadow-lg w-full h-auto max-h-80 object-cover"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
            />
          </div>
        </>
      ) : (
        <>
          {/* Left Image */}
          <div className="flex justify-center order-2 md:order-1">
            <img
              src={imageUrl}
              alt={area.title}
              className="rounded-xl shadow-lg w-full h-auto max-h-80 object-cover"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
            />
          </div>

          {/* Right Content */}
          <div className="text-center md:text-left order-1 md:order-2">
            <h3 className="text-2xl font-extrabold text-green-900 mb-4">
              {area.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {area.description}
            </p>
            {area.highlights && area.highlights.length > 0 && (
              <ul className="mt-4 space-y-2">
                {area.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 mt-1">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Area Card with Scroll Animation
function AnimatedAreaCard({ area, index }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`area-card-${area._id || index}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [area._id, index]);

  const isEven = index % 2 === 0;
  const imageUrl = area.computedImageUrl || area.image || area.imageUrl || FALLBACK_IMAGE;

  return (
    <div
      id={`area-card-${area._id || index}`}
      className={`container grid md:grid-cols-2 gap-12 items-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {isEven ? (
        <>
          {/* Left Content */}
          <div
            className={`text-center md:text-left transition-all duration-700 delay-200 ${isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
              }`}
          >
            <h3 className="text-2xl font-extrabold text-green-900 mb-4">
              {area.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {area.description}
            </p>
          </div>

          {/* Right Image */}
          <div
            className={`flex justify-center transition-all duration-700 delay-300 ${isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
              }`}
          >
            <img
              src={imageUrl}
              alt={area.title}
              className="rounded-xl shadow-lg w-full h-auto max-h-80 object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
            />
          </div>
        </>
      ) : (
        <>
          {/* Left Image */}
          <div
            className={`flex justify-center order-2 md:order-1 transition-all duration-700 delay-200 ${isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
              }`}
          >
            <img
              src={imageUrl}
              alt={area.title}
              className="rounded-xl shadow-lg w-full h-auto max-h-80 object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
            />
          </div>

          {/* Right Content */}
          <div
            className={`text-center md:text-left order-1 md:order-2 transition-all duration-700 delay-300 ${isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
              }`}
          >
            <h3 className="text-2xl font-extrabold text-green-900 mb-4">
              {area.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {area.description}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function AboutWorkSection() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch areas data from API
  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      const result = await getAboutUsAreas();

      if (result.success && result.data?.length > 0) {
        setAreas(result.data);
        setError(null);
      } else {
        setAreas(FALLBACK_AREAS);
        setError(result.error);
        console.error("Using fallback areas data:", result.error);
      }
      setLoading(false);
    };

    fetchAreas();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold text-green-900 mb-12">
            Areas We Work
          </h2>
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (areas.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-6">
            Areas We Work
          </h2>
          <p className="text-gray-600">No areas found. Check back later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 overflow-hidden">
      {/* Section Heading */}
      <div className="container mb-12">
        <div className="text-center">
          <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
            Our Focus
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-green-900">
            Areas We Work
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Discover the various sectors where we make a meaningful impact through our initiatives.
          </p>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded-full mt-6"></div>
        </div>
      </div>

      {/* Areas List with Alternating Layout */}
      {areas.map((area, index) => (
        <AnimatedAreaCard
          key={area._id || area.id || index}
          area={area}
          index={index}
        />
      ))}
    </section>
  );
}