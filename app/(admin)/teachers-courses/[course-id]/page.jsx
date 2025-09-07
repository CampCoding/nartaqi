
"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PageLayout from "../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Book,
  BookOpen,
  User,
  Star,
  Clock,
  Users,
  CheckCircle,
  Video,
  TrendingUp,
  Target,
  ArrowLeft,
  MessageCircle,
  Download,
  FileText,
  Edit2,
  Trash,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import EditTeacherCourseForm from "../../../../components/TeacherCourses/EditTeacherCourseForm/EditTeacherCourseForm";
import DeleteTeacherCourseForm from "../../../../components/TeacherCourses/DeleteTeacherCourseForm/DeleteTeacherCourseForm";
import TeachersTopic from "../../../../components/Teachers/TeachersTopic";

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Mock course data - in real app, fetch based on courseId
  const courseData = {
    id: courseId,
    title: "الأحياء المتقدم",
    description:
      "مقدمة شاملة في علوم الحياة، علم الوراثة، والبيولوجيا الجزيئية مع التطبيقات العملية",
    instructor: {
      name: "د. أحمد محمد الصالح",
      avatar: "/images/banner.png",
      specialization: "علوم الحاسوب والبرمجة",
      experience: "8 سنوات",
      rating: 4.9,
      studentsCount: 1247,
      coursesCount: 12,
      bio: "دكتور في علوم الحاسوب مع خبرة واسعة في التعليم الإلكتروني وتطوير المناهج التفاعلية",
      email: "ahmed.saleh@school.edu.sa",
      phone: "+966501234567",
    },
    courseDetails: {
      price: 399,
      originalPrice: 599,
      discount: 33,
      duration: "3 شهور",
      hours: 45,
      lessons: 24,
      level: "متوسط",
      language: "العربية",
      certificate: true,
      startDate: "15 فبراير 2024",
      endDate: "15 مايو 2024",
      enrolledStudents: 156,
      availableSeats: 44,
      totalSeats: 200,
      room: "F10/f/4",
      schedule: "الأحد والثلاثاء - 7:00 م",
    },
    rating: {
      average: 4.8,
      totalReviews: 142,
      breakdown: {
        5: 89,
        4: 32,
        3: 15,
        2: 4,
        1: 2,
      },
    },
    features: [
      {
        title: "دروس تفاعلية",
        description: "محتوى تفاعلي مع أمثلة عملية",
        icon: "🎯",
      },
      {
        title: "شهادة معتمدة",
        description: "احصل على شهادة إتمام معتمدة",
        icon: "🏆",
      },
      {
        title: "دعم مباشر",
        description: "دعم فني ومتابعة مستمرة",
        icon: "💬",
      },
      {
        title: "مواد تكميلية",
        description: "كتب وملفات PDF مجانية",
        icon: "📚",
      },
    ],
    curriculum: [
      {
        title: "مقدمة في علم الأحياء",
        duration: "3 ساعات",
        lessons: 4,
        videos: [
          { title: "ما هو علم الأحياء؟", duration: "12:30", isPreview: true },
          { title: "تاريخ علم الأحياء", duration: "15:45", isPreview: false },
          { title: "فروع علم الأحياء", duration: "18:20", isPreview: false },
          { title: "أهمية دراسة الأحياء", duration: "14:15", isPreview: false },
        ],
      },
      {
        title: "الخلية والأنسجة",
        duration: "5 ساعات",
        lessons: 6,
        videos: [
          { title: "بنية الخلية", duration: "22:15", isPreview: false },
          { title: "أنواع الخلايا", duration: "18:30", isPreview: false },
          { title: "الأنسجة النباتية", duration: "16:45", isPreview: false },
          { title: "الأنسجة الحيوانية", duration: "20:10", isPreview: false },
          { title: "وظائف الأنسجة", duration: "17:25", isPreview: false },
          { title: "التطبيقات العملية", duration: "19:40", isPreview: false },
        ],
      },
      {
        title: "الوراثة والجينات",
        duration: "4 ساعات",
        lessons: 5,
        videos: [
          { title: "مبادئ الوراثة", duration: "21:00", isPreview: false },
          { title: "قوانين مندل", duration: "24:15", isPreview: false },
          {
            title: "الكروموسومات والجينات",
            duration: "19:30",
            isPreview: false,
          },
          { title: "الطفرات الوراثية", duration: "16:45", isPreview: false },
          { title: "الهندسة الوراثية", duration: "22:20", isPreview: false },
        ],
      },
    ],
    reviews: [
      {
        id: 1,
        user: {
          name: "فاطمة أحمد",
          avatar: "/images/student1.jpg",
          level: "طالبة متقدمة",
        },
        rating: 5,
        date: "منذ أسبوعين",
        comment:
          "دورة ممتازة جداً! الشرح واضح والمحتوى منظم بشكل رائع. استفدت كثيراً من الأمثلة العملية.",
        helpful: 12,
      },
      {
        id: 2,
        user: {
          name: "محمد علي",
          avatar: "/images/student2.jpg",
          level: "طالب جديد",
        },
        rating: 4,
        date: "منذ شهر",
        comment:
          "محتوى قيم ومفيد، لكن كنت أتمنى وجود المزيد من التمارين التطبيقية.",
        helpful: 8,
      },
    ],
    learningOutcomes: [
      "فهم المفاهيم الأساسية في علم الأحياء",
      "التعرف على بنية ووظائف الخلايا المختلفة",
      "دراسة أنواع الأنسجة وخصائصها",
      "فهم مبادئ الوراثة وقوانين مندل",
      "التعرف على الطفرات الوراثية وتأثيرها",
      "تطبيق المعرفة النظرية في حل المسائل العملية",
    ],
  };

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "دورات المدربين", href: "/teachers-courses", icon: Book },
    { label: courseData.title, href: `#`, icon: BookOpen, current: true },
  ];

  const tabs = [
    { id: "overview", title: "نظرة عامة", icon: Eye },
    { id: "curriculum", title: "المنهج", icon: BookOpen },
    { id: "instructor", title: "المدرب", icon: User },
    { id: "reviews", title: "التقييمات", icon: Star },
  ];

  const handleEnroll = () => {
    setIsEnrolled(true);
    // Handle enrollment logic here
  };

  const StatsCard = ({ icon: Icon, title, value, color = "blue" }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg bg-${color}-50 flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const ReviewCard = ({ review }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{review.user.level}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{review.date}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-700 mb-3">{review.comment}</p>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600">
            <span>مفيد ({review.helpful})</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout>
      <div dir="rtl" className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
          
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className=" text-white bg-gradient-to-br from-primary to-secondary  p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {courseData.courseDetails.level}
                    </span>
                    <span className="bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {courseData.courseDetails.language}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold mb-4">
                    {courseData.title}
                  </h1>
                  <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                    {courseData.description}
                  </p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                      <p className="text-sm text-blue-200">المدة</p>
                      <p className="font-bold">
                        {courseData.courseDetails.duration}
                      </p>
                    </div>
                    <div className="text-center">
                      <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                      <p className="text-sm text-blue-200">الدروس</p>
                      <p className="font-bold">
                        {courseData.courseDetails.lessons}
                      </p>
                    </div>
                    <div className="text-center">
                      <Users className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                      <p className="text-sm text-blue-200">الطلاب</p>
                      <p className="font-bold">
                        {courseData.courseDetails.enrolledStudents}
                      </p>
                    </div>
                    <div className="text-center">
                      <Star className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                      <p className="text-sm text-blue-200">التقييم</p>
                      <p className="font-bold">{courseData.rating.average}</p>
                    </div>
                  </div>
                </div>

                {/* Enrollment Card */}
                <div className="lg:col-span-1">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-3xl font-bold">
                          {courseData.courseDetails.price} ج.م
                        </span>
                        <span className="text-lg text-blue-200 line-through">
                          {courseData.courseDetails.originalPrice} ج.م
                        </span>
                      </div>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        خصم {courseData.courseDetails.discount}%
                      </span>
                    </div>

                    <div className="space-y-3 mb-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-200">تاريخ البداية:</span>
                        <span className="text-white">
                          {courseData.courseDetails.startDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">المواعيد:</span>
                        <span className="text-white">
                          {courseData.courseDetails.schedule}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">القاعة:</span>
                        <span className="text-white">
                          {courseData.courseDetails.room}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">المقاعد المتبقية:</span>
                        <span className="font-bold text-yellow-300">
                          {courseData.courseDetails.availableSeats}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl border border-gray-100 mb-8 overflow-hidden">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Features */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Target className="w-6 h-6 text-blue-600" />
                      مميزات الدورة
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courseData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <span className="text-2xl">{feature.icon}</span>
                          <div>
                            <h4 className="font-semibold mb-1">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Outcomes */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      ماذا ستتعلم؟
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {courseData.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Curriculum Tab */}
              {activeTab === "curriculum" && (
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    محتوى الدورة
                  </h3>
                  <div className="space-y-4">
                    {/* <TeachersTopic /> */}
                    {courseData.curriculum.map((section, index) => (
                      <div 
                      onClick={() => router.push(`/teachers-courses/teacher-lessons/${section?.id}`)}
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 p-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {section.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {section.lessons} دروس • {section.duration}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="p-4 space-y-3">
                          {section.videos.map((video, videoIndex) => (
                            <div
                              key={videoIndex}
                              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <Video className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">
                                  {video.title}
                                </span>
                                {video.isPreview && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    معاينة
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">
                                {video.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructor Tab */}
              {activeTab === "instructor" && (
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-600" />
                    معلومات المدرب
                  </h3>
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-2">
                        {courseData.instructor.name}
                      </h4>
                      <p className="text-blue-600 font-medium mb-3">
                        {courseData.instructor.specialization}
                      </p>
                      <p className="text-gray-700 mb-4">
                        {courseData.instructor.bio}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <StatsCard
                          icon={Star}
                          title="التقييم"
                          value={courseData.instructor.rating}
                          color="yellow"
                        />
                        <StatsCard
                          icon={Users}
                          title="الطلاب"
                          value={courseData.instructor.studentsCount.toLocaleString()}
                          color="green"
                        />
                        <StatsCard
                          icon={BookOpen}
                          title="الدورات"
                          value={courseData.instructor.coursesCount}
                          color="purple"
                        />
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{courseData.instructor.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{courseData.instructor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <GraduationCap className="w-4 h-4" />
                          <span>{courseData.instructor.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Star className="w-6 h-6 text-blue-600" />
                      تقييمات الطلاب
                    </h3>
                    <div className="flex items-center gap-8 mb-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {courseData.rating.average}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(courseData.rating.average)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          {courseData.rating.totalReviews} تقييم
                        </p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {Object.entries(courseData.rating.breakdown)
                          .reverse()
                          .map(([stars, count]) => (
                            <div
                              key={stars}
                              className="flex items-center gap-3"
                            >
                              <span className="text-sm w-8">{stars} ⭐</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{
                                    width: `${
                                      (count / courseData.rating.totalReviews) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {count}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {courseData.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Course Progress (if enrolled) */}
              {isEnrolled && (
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    تقدمك في الدورة
                  </h4>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>مكتمل</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "35%" }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    أنت في تقدم جيد! استمر في العمل!
                  </p>

                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      8 من 24 درس مكتمل
                    </p>
                    <button className="w-full mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      متابعة التعلم
                    </button>
                  </div>
                </div>
              )}

              {/* Enrollment Information */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h4 className="font-bold mb-4">معلومات التسجيل</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">عدد الطلاب المسجلين</span>
                    <span className="font-semibold">
                      {courseData.courseDetails.enrolledStudents}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المقاعد المتاحة</span>
                    <span className="font-semibold text-yellow-500">
                      {courseData.courseDetails.availableSeats} من{" "}
                      {courseData.courseDetails.totalSeats}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">موعد الدورة</span>
                    <span className="font-semibold">
                      {courseData.courseDetails.schedule}
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Stats */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h4 className="font-bold mb-4">إحصائيات الدورة</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الطلاب المسجلين</span>
                    <span className="font-semibold">
                      {courseData.courseDetails.enrolledStudents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">إجمالي الساعات</span>
                    <span className="font-semibold">
                      {courseData.courseDetails.hours} ساعة
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">عدد الدروس</span>
                    <span className="font-semibold">
                      {courseData.courseDetails.lessons}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">شهادة معتمدة</span>
                    <span className="text-green-600 font-semibold">
                      ✓ متوفرة
                    </span>
                  </div>
                </div>
              </div>


              {/* Admin Actions (if user has permissions) */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h4 className="font-bold mb-4">إدارة الدورة</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setOpenEditModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    تعديل الدورة
                  </button>
                  <button
                    onClick={() => setOpenDeleteModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                    حذف الدورة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <EditTeacherCourseForm open={openEditModal} rowData={courseData} setOpen={setOpenEditModal}/>
      <DeleteTeacherCourseForm open={openDeleteModal} setOpen={setOpenDeleteModal} />
    </PageLayout>
  );
}
