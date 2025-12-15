// src/components/WhyChooseUs.jsx
import React, { useState, useEffect } from "react";
import { getVideos } from "./api/public/videoApi";
import { Play } from "lucide-react";

// Fallback data if API fails
const FALLBACK_DATA = [
  {
    _id: "fallback-1",
    videoTitle: "Why Choose Us",
    videoDescription: "We aim to provide security, comfort, and safety during defecation, motivate the use of in-house toilets with our high-quality products. These eco-friendly toilets are easy to install, use, and maintain and require minimal water consumption.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    computedEmbedUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    isYouTube: false,
  },
  {
    _id: "fallback-2",
    videoTitle: "Our Philosophy",
    videoDescription: "We believe in delivering high-quality, sustainable and affordable WASH solutions with complete honesty. Our organization believes in innovating and embracing new technology to evolve, learn and make a positive difference in society.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    computedEmbedUrl: "https://www.w3schools.com/html/movie.mp4",
    isYouTube: false,
  },
];

// Single Video Card Component
function VideoCard({ video, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isEven = index % 2 === 0;

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById(`video-card-${video._id}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [video._id]);

  // Render Video Player based on type
  const renderVideoPlayer = () => {
    if (video.isYouTube) {
      // YouTube Embed
      return (
        <div className="relative w-full h-64 md:h-[22rem] rounded-lg overflow-hidden shadow-lg">
          {!isPlaying ? (
            // Thumbnail with Play Button
            <div
              className="relative w-full h-full cursor-pointer group"
              onClick={() => setIsPlaying(true)}
            >
              {/* YouTube Thumbnail */}
              <img
                src={`https://img.youtube.com/vi/${getYouTubeId(video.videoUrl || video.computedEmbedUrl)}/maxresdefault.jpg`}
                alt={video.videoTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to hqdefault if maxresdefault not available
                  e.target.src = `https://img.youtube.com/vi/${getYouTubeId(video.videoUrl || video.computedEmbedUrl)}/hqdefault.jpg`;
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
          ) : (
            // YouTube iFrame
            <iframe
              src={`${video.computedEmbedUrl}?autoplay=1`}
              title={video.videoTitle}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      );
    } else {
      // Regular Video (MP4, etc.)
      return (
        <video
          controls
          className="w-full h-64 md:h-[22rem] object-cover rounded-lg shadow-lg"
          poster={video.thumbnail}
        >
          <source src={video.videoUrl || video.computedEmbedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  return (
    <div
      id={`video-card-${video._id}`}
      className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"
        } items-center gap-8 md:gap-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {/* Video Section */}
      <div
        className={`w-full md:w-1/2 transition-all duration-700 delay-200 ${isVisible
            ? "opacity-100 translate-x-0"
            : isEven
              ? "opacity-0 -translate-x-10"
              : "opacity-0 translate-x-10"
          }`}
      >
        {renderVideoPlayer()}
      </div>

      {/* Text Section */}
      <div
        className={`w-full md:w-1/2 flex flex-col justify-center transition-all duration-700 delay-300 ${isVisible
            ? "opacity-100 translate-x-0"
            : isEven
              ? "opacity-0 translate-x-10"
              : "opacity-0 -translate-x-10"
          }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
          {video.videoTitle}
        </h2>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
          {video.videoDescription}
        </p>
      </div>
    </div>
  );
}

// Helper function to extract YouTube video ID
function getYouTubeId(url) {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
  return match ? match[1] : '';
}

export default function WhyChooseUs() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const result = await getVideos();

      if (result.success && result.data?.length > 0) {
        setVideos(result.data);
        setError(null);
      } else {
        setVideos(FALLBACK_DATA);
        setError(result.error);
        console.error("Using fallback data due to API error:", result.error);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex flex-col justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-green-800 font-medium">Loading videos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
            Watch & Learn
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our mission, values, and the impact we're making through our video stories.
          </p>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Videos with Alternating Layout */}
        <div className="space-y-16 md:space-y-24">
          {videos.map((video, index) => (
            <VideoCard key={video._id} video={video} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}