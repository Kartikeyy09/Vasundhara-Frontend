import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowUturnLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Subtle Parallax Logic (Performance Optimized)
    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();

        // Calculate relative position (-1 to 1)
        const x = (e.clientX - left - width / 2) / (width / 2);
        const y = (e.clientY - top - height / 2) / (height / 2);

        // Update state for the graphic transform
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePosition({ x: 0, y: 0 });
    };

    return (
        <section
            className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-hidden p-6 font-sans"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Professional Grid Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                ></div>
                {/* Soft vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
            </div>

            {/* CSS for Animations */}
            <style>{`
        @keyframes scan {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-scan { animation: scan 4s linear infinite; }
        .animate-pulse-ring { animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>

            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Column: Professional Copy */}
                <div className="order-2 lg:order-1 space-y-8 text-center lg:text-left">
                    <div className="opacity-0 animate-fade-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            System Status: 404
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight">
                            Page not found
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            We've searched our system, but the URL you are trying to access doesn't seem to exist. It might have been moved or deleted.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-up delay-100">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                        >
                            <ArrowUturnLeftIcon className="w-5 h-5 text-slate-500" />
                            <span>Go Back</span>
                        </button>

                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all duration-200"
                        >
                            <HomeIcon className="w-5 h-5" />
                            <span>Homepage</span>
                        </Link>
                    </div>

                    {/* Helpful Link Suggestion (Optional Professional Touch) */}
                    <div className="opacity-0 animate-fade-up delay-200 pt-4 border-t border-slate-100 mt-8">
                        <p className="text-sm text-slate-500">Need assistance?</p>
                        <Link to="/contact" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                            Contact our support team &rarr;
                        </Link>
                    </div>
                </div>

                {/* Right Column: Technical Illustration */}
                <div
                    ref={containerRef}
                    className="order-1 lg:order-2 flex items-center justify-center"
                >
                    {/* This container follows the mouse subtly */}
                    <div
                        className="relative w-full max-w-md aspect-square transition-transform duration-100 ease-out"
                        style={{
                            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
                        }}
                    >
                        {/* Background Circle decoration */}
                        <div className="absolute inset-0 bg-emerald-50 rounded-full opacity-50 blur-3xl transform scale-90"></div>

                        {/* Custom Radar SVG */}
                        <RadarIllustration />
                    </div>
                </div>
            </div>
        </section>
    );
};

// A clean, geometric "Radar/Search" illustration using SVG
const RadarIllustration = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
        <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
            </linearGradient>
        </defs>

        {/* Base Circles (The Target) */}
        <circle cx="200" cy="200" r="150" fill="none" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="200" cy="200" r="50" fill="white" stroke="#CBD5E1" strokeWidth="2" />

        {/* Pulse Ring */}
        <circle cx="200" cy="200" r="50" fill="none" stroke="#34D399" strokeWidth="2" className="animate-pulse-ring" />

        {/* 404 Text embedded in the center */}
        <text x="200" y="215" fontSize="40" fontWeight="bold" fill="#0F172A" textAnchor="middle" style={{ fontFamily: 'monospace' }}>
            404
        </text>

        {/* Magnifying Glass Handle */}
        <g transform="translate(220, 220)">
            <path d="M30 30 L 80 80" stroke="#059669" strokeWidth="12" strokeLinecap="round" />
        </g>

        {/* Rotating Radar Scanner */}
        <g className="animate-scan" style={{ transformOrigin: '200px 200px' }}>
            <circle cx="200" cy="200" r="148" fill="url(#radarGradient)" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)' }} opacity="0.5" />
            <line x1="200" y1="200" x2="200" y2="50" stroke="#10B981" strokeWidth="2" />
        </g>

        {/* Floating Data Points (Decorations) */}
        <circle cx="280" cy="120" r="6" fill="#EF4444">
            <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
        </circle>
        <rect x="100" y="120" width="40" height="6" rx="3" fill="#E2E8F0" />
        <rect x="100" y="135" width="20" height="6" rx="3" fill="#E2E8F0" />

        {/* "File not found" icon floating */}
        <g transform="translate(260, 250)">
            <path d="M0 0 h40 v50 h-40 z" fill="white" stroke="#CBD5E1" strokeWidth="2" />
            <path d="M25 15 l10 10" stroke="#EF4444" strokeWidth="2" />
            <path d="M35 15 l-10 10" stroke="#EF4444" strokeWidth="2" />
            <animateTransform
                attributeName="transform"
                type="translate"
                values="260 250; 260 240; 260 250"
                dur="4s"
                repeatCount="indefinite"
            />
        </g>
    </svg>
);

export default NotFoundPage;