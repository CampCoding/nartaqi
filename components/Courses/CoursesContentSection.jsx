"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  Globe,
  Award,
  Video,
  ArrowRight,
  Play,
  Sparkles,
  Target,
  Heart,
  Star,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

const CoursesContentSection = () => {
  const [yearsCount, setYearsCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const sectionRef = useRef(null);

  const features = [
    {
      icon: Users,
      label: "Expert Instructors",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Video,
      label: "Interactive Lessons",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Calendar,
      label: "Flexible Scheduling",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: Globe,
      label: "Cultural Immersion",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Target,
      label: "Personalized Learning",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Heart,
      label: "Global Community",
      color: "from-pink-500 to-rose-500",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Animate years counter
          let start = 0;
          const end = 15;
          const timer = setInterval(() => {
            start += 1;
            setYearsCount(start);
            if (start === end) clearInterval(timer);
          }, 100);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div
        ref={sectionRef}
        className=" bg-gradient-to-br from-slate-50 via-white to-gray-100 py-20 px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-200/15 to-indigo-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

          {/* Floating Arabic Letters */}
          {["ع", "ر", "ب", "ي"].map((letter, i) => (
            <div
              key={i}
              className="absolute text-6xl font-bold text-teal-200/30 animate-float"
              style={{
                left: `${20 + i * 20}%`,
                top: `${10 + i * 15}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${4 + i}s`,
              }}
            >
              {letter}
            </div>
          ))}

          {/* Geometric Shapes */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 border-4 border-teal-300/40 rounded-lg animate-spin-slow"></div>
          <div className="absolute bottom-1/3 left-1/5 w-12 h-12 bg-gradient-to-r from-cyan-400/30 to-teal-400/30 rounded-full animate-bounce"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div
              className={`space-y-8 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
            >
              {/* Header */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full px-6 py-3 animate-fade-in">
                  <Sparkles className="w-5 h-5 text-teal-600 animate-pulse" />
                  <span className="text-teal-700 font-semibold tracking-wider">
                    🇪🇬 EGYPTIAN ARABIC
                  </span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Egyptian Arabic
                  </span>
                  <br />
                  Courses{" "}
                </h2>
              </div>

              {/* Description */}
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Learn the{" "}
                  <span className="font-semibold text-teal-600">
                    vibrant dialect of Egypt and immerse yourself{" "}
                  </span>
                  in the local culture and daily conversations.{" "}
                </p>
                <p>
                  Our courses are designed to help you speak like a local.
                  Whether you're traveling, working, or simply fascinated by
                  Egyptian life, we make learning both practical and fun.
                </p>
                <p>
                  Through real-life scenarios and cultural context, you'll build
                  conversational confidence and a deeper connection with Egypt's
                  rich heritage.
                </p>
                <p className="text-lg font-medium text-gray-700">
                  Join us and discover the heart of Egyptian life — one phrase
                  at a time.
                </p>
              </div>

              {/* Features Grid */}

              {/* CTA Button */}
              <div
                className={`pt-4 ${
                  isVisible ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ animationDelay: "1s" }}
              >
                <button className="group bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-500 relative overflow-hidden hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Join Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 transform scale-150"></div>
                </button>
              </div>
            </div>

            {/* Right Content - Enhanced Video Call Scene */}
            <div
              className={`relative transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              {/* Experience Badge */}
              <div className="absolute -top-8 -left-8 z-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-6 shadow-2xl animate-bounce">
                <div className="text-center text-white">
                  <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                    <span className="animate-count">{yearsCount}</span>
                    <span className="text-2xl ml-1">+</span>
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Years of Experience
                  </div>
                </div>

                {/* Floating Stars */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-ping"
                    style={{
                      top: `${-10 + i * 5}px`,
                      right: `${-5 + i * 8}px`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    <Star className="w-3 h-3 text-yellow-300" />
                  </div>
                ))}
              </div>

              {/* Main Video Call Interface */}
              <div className="relative bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 shadow-2xl">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 grid grid-cols-6 gap-2">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Video Interface */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
                  {/* Header Bar */}

                  {/* Main Video Area */}

                  {/* Bottom Controls */}
                  <img
                    src="/images/female-teacher-in-headphones-teaching-young-student-girl-online-.jpg"
                    alt=""
                  />
                </div>

                {/* Success Metrics */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-800">98%</div>
                      <div className="text-sm text-gray-500">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={sectionRef}
        className=" bg-gradient-to-br from-slate-50 via-white to-gray-100 py-20 px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-200/15 to-indigo-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

          {/* Floating Arabic Letters */}
          {["ع", "ر", "ب", "ي"].map((letter, i) => (
            <div
              key={i}
              className="absolute text-6xl font-bold text-teal-200/30 animate-float"
              style={{
                left: `${20 + i * 20}%`,
                top: `${10 + i * 15}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${4 + i}s`,
              }}
            >
              {letter}
            </div>
          ))}

          {/* Geometric Shapes */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 border-4 border-teal-300/40 rounded-lg animate-spin-slow"></div>
          <div className="absolute bottom-1/3 left-1/5 w-12 h-12 bg-gradient-to-r from-cyan-400/30 to-teal-400/30 rounded-full animate-bounce"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}

            <div
              className={`relative transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              {/* Experience Badge */}
              <div className="absolute -top-8 -left-8 z-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-6 shadow-2xl animate-bounce">
                <div className="text-center text-white">
                  <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                    <span className="animate-count">{yearsCount}</span>
                    <span className="text-2xl ml-1">+</span>
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Years of Experience
                  </div>
                </div>

                {/* Floating Stars */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-ping"
                    style={{
                      top: `${-10 + i * 5}px`,
                      right: `${-5 + i * 8}px`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    <Star className="w-3 h-3 text-yellow-300" />
                  </div>
                ))}
              </div>

              {/* Main Video Call Interface */}
              <div className="relative bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 shadow-2xl">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 grid grid-cols-6 gap-2">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Video Interface */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
                  {/* Header Bar */}

                  {/* Main Video Area */}

                  {/* Bottom Controls */}
                  <img
                    alt=""
                    src="/images/teacher-and-his-students.jpg"
                  />
                </div>

                {/* Success Metrics */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-800">98%</div>
                      <div className="text-sm text-gray-500">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`space-y-8 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
            >
              {/* Header */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full px-6 py-3 animate-fade-in">
                  <Sparkles className="w-5 h-5 text-teal-600 animate-pulse" />
                  <span className="text-teal-700 font-semibold tracking-wider">
                    MODERN STANDARD ARABIC
                  </span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Modern Standard Arabic{" "}
                  </span>
                  <br />
                  Courses{" "}
                </h2>
              </div>

              {/* Description */}
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Master the{" "}
                  <span className="font-semibold text-teal-600">
                    universal Arabic language used in media, literature,{" "}
                  </span>
                  and formal communication worldwide.{" "}
                </p>
                <p>
                  Our Modern Standard Arabic (MSA) program is perfect for
                  learners aiming to understand news broadcasts, formal texts,
                  academic material, and official documents.
                </p>
                <p>
                  From grammar to vocabulary and reading comprehension, our
                  structured lessons give you a strong foundation in classical
                  Arabic with a modern twist.
                </p>
                <p className="text-lg font-medium text-gray-700">
                  Join us to develop fluency in the formal register of Arabic
                  spoken across the Arab world.
                </p>
              </div>

              {/* Features Grid */}

              {/* CTA Button */}
              <div
                className={`pt-4 ${
                  isVisible ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ animationDelay: "1s" }}
              >
                <button className="group bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-500 relative overflow-hidden hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Join Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 transform scale-150"></div>
                </button>
              </div>
            </div>

            {/* Right Content - Enhanced Video Call Scene */}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) rotate(5deg);
          }
          66% {
            transform: translateY(5px) rotate(-5deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 75%;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }

        .animate-progress {
          animation: progress 2s ease-out 1s both;
        }

        .animate-count {
          display: inline-block;
          animation: countUp 1.5s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CoursesContentSection;
