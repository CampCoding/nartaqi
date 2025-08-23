"use client";

import { useState } from "react";
import PageLayout from "../layout/PageLayout";
import PagesHeader from "../ui/PagesHeader";


export default function TeachersTopic() {
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
      {/* Header */}
      <PagesHeader
        title={videoData.title}
        subtitle={
          <>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {videoData.duration} دقيقة
              </span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {videoData.views} مشاهدة
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {videoData.level}
              </span>
            </div>
          </>
        }
      />

      

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      liked
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={liked ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{liked ? videoData.likes + 1 : videoData.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    <span>Share</span>
                  </button>
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

            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex gap-8 px-6">
                  {[
                    { id: "overview", name: "نظرة عامة", icon: "📋" },
                    { id: "chapters", name: "الفصول", icon: "📚" },
                    { id: "notes", name: "الملاحظات", icon: "📝" },
                    { id: "quiz", name: "الاختبار", icon: "🧠" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* تبويب نظرة عامة */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">
                          15:42
                        </div>
                        <div className="text-blue-600 text-sm">المدة</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">
                          4
                        </div>
                        <div className="text-green-600 text-sm">عدد الفصول</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-700">
                          {videoData.level}
                        </div>
                        <div className="text-purple-600 text-sm">المستوى</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        ماذا ستتعلم
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>إتقان طريقة التعويض لحل الأنظمة الخطية</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>
                            معرفة متى تستخدم التعويض مقابل الطرق الأخرى
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>تجنب الأخطاء الشائعة في التلاعب الجبري</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>التحقق من الحلول وتفسير النتائج</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* تبويب الفصول */}
                {activeTab === "chapters" && (
                  <div className="space-y-3">
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          chapter.current
                            ? "border-blue-500 bg-blue-50"
                            : chapter.completed
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                chapter.current
                                  ? "bg-blue-500 text-white"
                                  : chapter.completed
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {chapter.completed ? "✓" : chapter.id}
                            </div>
                            <div>
                              <h4 className="font-medium">{chapter.title}</h4>
                              <p className="text-sm text-gray-600">
                                {chapter.duration}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {chapter.time}
                          </div>
                        </div>
                        {chapter.current && (
                          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: "65%" }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* تبويب الملاحظات */}
                {activeTab === "notes" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">ملاحظات الفيديو</h3>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        ➕ إضافة ملاحظة
                      </button>
                    </div>
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-blue-600 font-medium text-sm">
                                  {note.time}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  • {note.user}
                                </span>
                              </div>
                              <p className="text-gray-700">{note.text}</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* تبويب الاختبار */}
                {activeTab === "quiz" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">اختبر معلوماتك</h3>
                      <p className="text-gray-600">
                        اختبار سريع لتعزيز ما تعلمته
                      </p>
                    </div>

                    {!showQuiz ? (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">🧠</div>
                        <button
                          onClick={() => setShowQuiz(true)}
                          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                          ابدأ الاختبار
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {quizQuestions.map((question, index) => (
                          <div
                            key={question.id}
                            className="p-6 border border-gray-200 rounded-lg"
                          >
                            <h4 className="font-semibold mb-4">
                              {index + 1}. {question.question}
                            </h4>
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <label
                                  key={optionIndex}
                                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    className="text-blue-600"
                                  />
                                  <span>{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                          إرسال الإجابات
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                إجراءات سريعة
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <span>📋</span>
                  <span>تحميل الملاحظات</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors">
                  <span>💾</span>
                  <span>حفظ لوقت لاحق</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors">
                  <span>🎯</span>
                  <span>تمارين تدريبية</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors">
                  <span>❓</span>
                  <span>طرح سؤال</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
