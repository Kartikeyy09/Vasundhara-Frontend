// src/components/WhoWeWorkWith.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { getOurWorkSummary } from "./api/public/ourWorkApi";

// Fallback data if API fails
const FALLBACK_DATA = [
  {
    id: "1",
    title: "Government",
    coverImageUrl: "https://media.istockphoto.com/id/184085544/photo/indian-parliament-in-new-delhi-the-politic-government-of-india.jpg?s=612x612&w=0&k=20&c=jgnuN5ofwNGMaoVoMoXOLF-2OzRVj3QhD0IZD3HIUSg=",
    computedImageUrl: "https://media.istockphoto.com/id/184085544/photo/indian-parliament-in-new-delhi-the-politic-government-of-india.jpg?s=612x612&w=0&k=20&c=jgnuN5ofwNGMaoVoMoXOLF-2OzRVj3QhD0IZD3HIUSg=",
    link: "/government",
  },
  {
    id: "2",
    title: "Railway",
    coverImageUrl: "https://www.rajasthanindiatourdriver.com/img/traintour-train.jpg",
    computedImageUrl: "https://www.rajasthanindiatourdriver.com/img/traintour-train.jpg",
    link: "/railway",
  },
  {
    id: "3",
    title: "Nagar Nigam",
    coverImageUrl: "https://housing.com/news/wp-content/uploads/2024/04/Key-facts-about-Nagar-Nigam-in-India-f.jpg",
    computedImageUrl: "https://housing.com/news/wp-content/uploads/2024/04/Key-facts-about-Nagar-Nigam-in-India-f.jpg",
    link: "/municipal-corporation",
  },
  {
    id: "4",
    title: "Bus Stand",
    coverImageUrl: "https://images.hindustantimes.com/img/2024/07/10/1600x900/The-old-bus-stand--above--in-Ghaziabad--which-is-s_1720632940837.jpg",
    computedImageUrl: "https://images.hindustantimes.com/img/2024/07/10/1600x900/The-old-bus-stand--above--in-Ghaziabad--which-is-s_1720632940837.jpg",
    link: "/bus-stand",
  },
];

export default function WhoWeWorkWith() {
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef(null);

  // Items to show at a time based on screen size
  const [itemsToShow, setItemsToShow] = useState(4);

  // Update items to show based on screen size
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 768) {
        setItemsToShow(2);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3);
      } else {
        setItemsToShow(4);
      }
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  // Fetch work items from API
  useEffect(() => {
    const fetchWorkItems = async () => {
      setLoading(true);
      const result = await getOurWorkSummary();

      if (result.success && result.data?.length > 0) {
        setWorkItems(result.data);
      } else {
        setWorkItems(FALLBACK_DATA);
        console.error("Using fallback data due to API error:", result.error);
      }
      setLoading(false);
    };

    fetchWorkItems();
  }, []);

  // Calculate max index
  const maxIndex = Math.max(0, workItems.length - itemsToShow);

  // Go to next slide
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Go to previous slide
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || isHovered || workItems.length <= itemsToShow) return;

    autoScrollRef.current = setInterval(goToNext, 3000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused, isHovered, goToNext, workItems.length, itemsToShow]);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-12">
            Who We Work With
          </h2>
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
            Our Partners
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-green-800">
            Who We Work With
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            We collaborate with various organizations to create lasting impact.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Buttons */}
          {workItems.length > itemsToShow && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-green-800 hover:bg-green-50 transition-colors duration-300 border border-green-200"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-green-800 hover:bg-green-50 transition-colors duration-300 border border-green-200"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden py-3" ref={scrollContainerRef}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
              }}
            >
              {workItems.map((item, index) => (
                <div
                  key={item.id || item._id || index}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <Link
                    to={item.link || `/our-work/${item.id || item._id}`}
                    className="block border rounded-xl overflow-hidden shadow-md  transform hover:scale-105 transition duration-300 bg-white group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.computedImageUrl || item.coverImageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                        }}
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-green-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-lg md:text-xl font-semibold text-green-900 group-hover:text-green-700 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls & Indicators */}
        {workItems.length > itemsToShow && (
          <div className="flex items-center justify-center mt-8 gap-4">
            {/* Dot Indicators */}
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                    ? "w-8 bg-green-600"
                    : "w-2 bg-green-300 hover:bg-green-400"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 bg-green-100 rounded-full text-green-800 hover:bg-green-200 transition-colors"
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}