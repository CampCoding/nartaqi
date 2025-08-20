"use client";

import { useState } from "react";
import PageLayout from "../layout/PageLayout";
import PagesHeader from "../ui/PagesHeader";

export default function TopicVideo() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState("1x");

  // بيانات تجريبية
  const videoData = {
    title: "المعادلات الخطية: حل الأنظمة بطريقة التعويض",
    duration: "15:42",
    views: "12.5 ألف",
    likes: 1240,
    instructor: "د. سارة جونسون",
    level: "متوسط",
    category: "الرياضيات",
    description:
      "أتقن طريقة التعويض لحل أنظمة المعادلات الخطية. هذا الشرح الشامل يغطي خطوات الحل خطوة بخطوة، الأخطاء الشائعة، وتمارين للتدريب.",
    tags: ["المعادلات الخطية", "التعويض", "الجبر", "الأنظمة", "الرياضيات"],
  };

  const chapters = [
    {
      id: 1,
      title: "مقدمة عن الأنظمة",
      time: "0:00",
      duration: "2:30",
      completed: true,
    },
    {
      id: 2,
      title: "أساسيات طريقة التعويض",
      time: "2:30",
      duration: "4:15",
      completed: true,
    },
    {
      id: 3,
      title: "مثال خطوة بخطوة",
      time: "6:45",
      duration: "5:20",
      completed: false,
      current: true,
    },
    {
      id: 4,
      title: "أنظمة أكثر تعقيدًا",
      time: "12:05",
      duration: "3:37",
      completed: false,
    },
  ];

  const notes = [
    {
      id: 1,
      time: "2:15",
      text: "تذكر: دائمًا اعزل متغيرًا واحدًا أولًا",
      user: "أنت",
    },
    {
      id: 2,
      time: "4:30",
      text: "معلومة مهمة: استبدل بالتعبير، وليس بالمتغير فقط",
      user: "د. جونسون",
    },
    {
      id: 3,
      time: "8:45",
      text: "خطأ شائع: نسيان التحقق من الحل",
      user: "أنت",
    },
  ];

  const relatedVideos = [
    {
      id: 1,
      title: "طريقة الحذف في الأنظمة الخطية",
      duration: "12:30",
      views: "8.2 ألف",
      thumbnail: "🎯",
    },
    {
      id: 2,
      title: "رسم المعادلات الخطية",
      duration: "18:15",
      views: "15.1 ألف",
      thumbnail: "📈",
    },
    {
      id: 3,
      title: "مسائل كلامية على الأنظمة",
      duration: "20:45",
      views: "6.8 ألف",
      thumbnail: "📝",
    },
    {
      id: 4,
      title: "حلول باستخدام المصفوفات",
      duration: "25:12",
      views: "4.3 ألف",
      thumbnail: "🔢",
    },
  ];

  const quizQuestions = [
    {
      id: 1,
      question: "ما هي أول خطوة في طريقة التعويض؟",
      options: [
        "جمع المعادلات",
        "عزل متغير",
        "تمثيل الخطين بيانيًا",
        "الضرب في ثوابت",
      ],
      correct: 1, // (يبقى نفس الفهرس: الخيار الثاني)
    },
    {
      id: 2,
      question: "عند التعويض، تستبدل المتغير بـ:",
      options: ["متغير آخر", "صفر", "التعبير المعزول", "ثابت"],
      correct: 2, // (يبقى نفس الفهرس: الخيار الثالث)
    },
  ];

  const speedOptions = ["0.5x", "0.75x", "1x", "1.25x", "1.5x", "2x"];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const togglePlayback = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleProgressChange = (e) => {
    setProgress(e.target.value);
  };

  return (
    <PageLayout className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">


      

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                {/* Video Placeholder */}
                <div className="text-center text-white">
                  <div className="text-8xl mb-4">🎥</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Linear Equations Tutorial
                  </h3>
                  <p className="text-gray-300">
                    Interactive Video Learning Experience
                  </p>
                </div>

                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlayback}
                    className="bg-white bg-opacity-20 backdrop-blur-md rounded-full p-6 hover:bg-opacity-30 transition-all group-hover:scale-110"
                  >
                    {isVideoPlaying ? (
                      <svg
                        className="w-12 h-12 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-12 h-12 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
                  <div className="flex items-center gap-4 text-white">
                    <button
                      onClick={togglePlayback}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {isVideoPlaying ? "⏸️" : "▶️"}
                    </button>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-sm">6:45</span>
                      <div className="flex-1 bg-gray-600 rounded-full h-1 relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progress}
                          onChange={handleProgressChange}
                          className="absolute inset-0 w-full h-1 bg-transparent appearance-none cursor-pointer"
                        />
                        <div
                          className="bg-blue-500 h-1 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">15:42</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={currentSpeed}
                        onChange={(e) => setCurrentSpeed(e.target.value)}
                        className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                      >
                        {speedOptions.map((speed) => (
                          <option key={speed} value={speed}>
                            {speed}
                          </option>
                        ))}
                      </select>
                      <button className="hover:text-blue-400 transition-colors">
                        🔊
                      </button>
                      <button className="hover:text-blue-400 transition-colors">
                        ⛶
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info & Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    SJ
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {videoData.instructor}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Mathematics Professor
                    </p>
                  </div>
                </div>
                
              </div>

              <p className="text-gray-700 mb-4">{videoData.description}</p>

              <div className="flex flex-wrap gap-2">
                {videoData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

        
        </div>
      </div>
    </PageLayout>
  );
}
