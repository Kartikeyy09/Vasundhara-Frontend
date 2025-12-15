// src/pages/OurWorkDetails.jsx (or src/OurWork/OurWorkDetails.jsx)
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getOurWorkById } from "../api/public/ourWorkApi";

// Fallback images
const FALLBACK_IMAGE = "https://via.placeholder.com/800x400?text=Image+Not+Found";

export default function OurWorkDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when component mounts or ID changes
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const result = await getOurWorkById(id);

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch data");
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Data not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative h-[400px] md:h-[500px] flex items-center justify-center text-center"
        style={{
          backgroundImage: `url('${data.computedHeroImage || data.computedCoverImage || FALLBACK_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-55"></div>

        {/* Centered Text */}
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {data.title}
          </h1>
          {data.heroTitle && (
            <p className="text-white text-lg md:text-xl lg:text-2xl font-semibold leading-relaxed">
              {data.heroTitle}
            </p>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>
      </section>

      {/* Content Section - Cover Image & Title */}
      <section className="container py-16 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Image */}
        <div className="flex justify-center">
          <img
            src={data.computedCoverImage || FALLBACK_IMAGE}
            alt={data.title}
            className="rounded-2xl shadow-lg w-full max-w-md h-[350px] object-cover"
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE;
            }}
          />
        </div>

        {/* Right Text */}
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-900 mb-6">
            {data.heroTitle || data.title}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base lg:text-lg max-w-2xl">
            {data.whyDescription || "Discover how we're making a difference in communities through our dedicated work and sustainable solutions."}
          </p>

          <Link
            to="/contact-us"
            className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-full shadow-md transition"
          >
            Enquire Now
          </Link>
        </div>
      </section>

      {/* WHY Section */}
      {(data.whyTitle || data.whyDescription) && (
        <section className="bg-gray-50 py-16">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-6">
              {data.whyTitle || "Why This Matters"}
            </h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg max-w-4xl">
              {data.whyDescription}
            </p>
          </div>
        </section>
      )}

      {/* WHAT WE DO Section */}
      {(data.whatTitle || data.whatDescription) && (
        <section className="py-16">
          <div className="container grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Text */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-900 mb-6">
                {data.whatTitle || "What We Do"}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base lg:text-lg max-w-2xl">
                {data.whatDescription}
              </p>
            </div>

            {/* Right Image */}
            <div className="flex justify-center">
              <img
                src={data.computedWhatImage || data.computedCoverImage || FALLBACK_IMAGE}
                alt={data.whatTitle || "What We Do"}
                className="rounded-2xl shadow-lg w-full max-w-md h-[350px] object-cover"
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Solutions Section */}
      {data.solutions && (data.solutions.title || data.solutions.description || data.computedSolutionsImages?.length > 0) && (
        <section className="bg-gray-50 py-16 px-4 md:px-10">
          <div className="container mx-auto flex flex-col md:flex-row items-start gap-10">
            {/* Left Text Section */}
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-green-900 mb-6">
                {data.solutions.title || "Sustainable Solutions"}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {data.solutions.description}
              </p>
            </div>

            {/* Right Image Grid */}
            {data.computedSolutionsImages?.length > 0 && (
              <div className="md:w-1/3 grid grid-cols-2 gap-4">
                {data.computedSolutionsImages.map((img, index) => (
                  <img
                    key={img._id || img.id || index}
                    src={img.computedImageUrl || FALLBACK_IMAGE}
                    alt={`Solution ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Image Gallery Section */}
      {data.computedGalleryImages?.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 text-center mb-12">
              Image Gallery
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.computedGalleryImages.map((img, index) => (
                <div
                  key={img._id || img.id || index}
                  className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 group"
                >
                  <img
                    src={img.computedImageUrl || FALLBACK_IMAGE}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-green-900 py-16">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Want to Learn More?
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Get in touch with us to know more about our initiatives and how you can contribute.
          </p>
          <Link
            to="/contact-us"
            className="inline-block bg-white text-green-900 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-green-50 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}