"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../../../components/layout/PageLayout";
import {
  BarChart3,
  Book,
  Eye,
  EyeOff,
  Layers,
  Star,
  ChevronDown,
  ChevronUp,
  Flag,
  ThumbsUp,
} from "lucide-react";
import BreadcrumbsShowcase from "../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../components/ui/PagesHeader";
import { useParams } from "next/navigation";
import UnitsStats from "../../../../components/Units/UnitStats";
import SubjectDetails from "../../../../components/Subjects/SubjectOverviewSection";
import HorizontalTabs from "../../../../components/ui/Tab";
import SubjectStudentsSection from "../../../../components/Subjects/SubjectStudents";
import ArabicCourseCurriculum from "../../../../components/Courses/ArabicCourseCurriculum";
import { subjects } from "../../../../data/subjects";
import EgyptianCourseDetailsOverview from "../../../../components/EgyptianCourses/EgyptianCourseDetailsOverview/EgyptianCourseDetailsOverview";

const Units = () => {
  const params = useParams();
  const [expandedReviews, setExpandedReviews] = useState({});

  const selectedSubject = useMemo(() => {
    const subject = subjects.find((subject) => subject.code == params["course-id"]);
    return subject;
  }, [params["course-id"]]);

  useEffect(() => {
    console.log(selectedSubject , subjects)
  } , [selectedSubject])

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "الدورات", href: "/egyptian_course", icon: Book },
    { label: selectedSubject?.name, href: "#", current: true },
  ];

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // بيانات تقييمات عينة
  const [sampleReviews, setSampleReviews] = useState([
    {
      id: "r1",
      studentName: "أحمد محمد",
      studentAvatar: "https://i.pravatar.cc/100?img=1",
      rating: 5,
      comment:
        "دورة رائعة ومحتوى ممتاز، شرح الأستاذ واضح وسهل الفهم. أنصح بها بشدة للمبتدئين. المواد المقدمة شاملة وتغطي جميع الجوانب المهمة في الموضوع. الاستاذ يشرح بطريقة ممتعة وجذابة مما يجعل عملية التعلم أسهل وأكثر متعة.",
      date: "2023-10-15",
      likes: 12,
      isVisible: true,
    },
    {
      id: "r2",
      studentName: "سارة عبدالله",
      studentAvatar: "https://i.pravatar.cc/100?img=2",
      rating: 4,
      comment:
        "محتوى الدورة جيد ولكن يحتاج إلى مزيد من الأمثلة العملية. شكراً للجهود المبذولة. التمارين والأنشطة المصاحبة مفيدة لكنها تحتاج إلى مزيد من التنوع. بشكل عام الدورة جيدة وتستحق الوقت والمال.",
      date: "2023-10-10",
      likes: 8,
      isVisible: true,
    },
    {
      id: "r3",
      studentName: "خالد السعدي",
      studentAvatar: "https://i.pravatar.cc/100?img=3",
      rating: 3,
      comment:
        "الدورة متوسطة المستوى، بعض الدروس تحتاج إلى تحديث خاصة الجزء العملي. المحتوى النظري جيد لكن التطبيق العملي محدود. آمل أن يتم تطوير الجزء العملي في المستقبل.",
      date: "2023-10-05",
      likes: 5,
      isVisible: true,
    },
    {
      id: "r4",
      studentName: "فاطمة الزهراء",
      studentAvatar: "https://i.pravatar.cc/100?img=4",
      rating: 5,
      comment:
        "أفضل دورة شاركت فيها على الإطلاق! المحتوى منظم بشكل رائع والتمارين عملية جداً. شكراً لكم على هذه التجربة الرائعة.",
      date: "2023-09-28",
      likes: 15,
      isVisible: true,
    },
  ]);

  const toggleReviewVisibility = (reviewId) => {
    setSampleReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? { ...review, isVisible: !review.isVisible }
          : review
      )
    );
  };

  const showAllReviews = () => {
    setSampleReviews((prevReviews) =>
      prevReviews.map((review) => ({ ...review, isVisible: true }))
    );
  };

  const hideAllReviews = () => {
    setSampleReviews((prevReviews) =>
      prevReviews.map((review) => ({ ...review, isVisible: false }))
    );
  };

  const visibleReviewsCount = sampleReviews.filter(
    (review) => review.isVisible
  ).length;
  const hiddenReviewsCount = sampleReviews.filter(
    (review) => !review.isVisible
  ).length;

  // مكون بطاقة التقييم
  const ReviewCard = ({ review }) => (
    <div className="bg-white rounded-lg shadow p-4 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <img
            src={review.studentAvatar}
            alt={review.studentName}
            className="w-10 h-10 rounded-full ml-3"
          />
          <div>
            <h4 className="font-medium">{review.studentName}</h4>
            <div className="flex items-center">
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
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{review.date}</span>
          <button
            onClick={() => toggleReviewVisibility(review.id)}
            className={`p-1 rounded-full ${
              review.isVisible
                ? "text-blue-600 bg-blue-100"
                : "text-gray-400 bg-gray-100"
            }`}
            title={review.isVisible ? "إخفاء التقييم" : "إظهار التقييم"}
          >
            {review.isVisible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`mt-3 transition-all duration-300 ${
          expandedReviews[review.id] ? "block" : "line-clamp-3"
        }`}
      >
        <p className="text-gray-700">{review.comment}</p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button
            onClick={() => toggleReviewExpansion(review.id)}
            className="text-blue-600 flex items-center text-sm"
          >
            {expandedReviews[review.id] ? (
              <>
                <ChevronUp className="w-4 h-4 ml-1" />
                {review?.isVisible ? "إخفاء" : "إظهار"}
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 ml-1" />
                عرض المزيد
              </>
            )}
          </button>

          <button className="flex items-center text-gray-500 text-sm">
            <ThumbsUp className="w-4 h-4 ml-1" />
            <span>{review.likes}</span>
          </button>
        </div>

        <div className="flex items-center">
          <span
            className={`text-xs px-2 py-1 rounded-full mr-2 ${
              review.isVisible
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {review.isVisible ? "مرئي" : "مخفي"}
          </span>
          <button className="text-gray-400 hover:text-gray-600">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      id: 0,
      label: "نظرة عامة",
      icon: Eye,
      gradient: "from-purple-500 to-pink-500",
      content: <EgyptianCourseDetailsOverview />,
    },
    {
      id: 1,
      label: "مراحل الدورة",
      icon: Layers,
      gradient: "from-blue-500 to-cyan-500",
      content: <ArabicCourseCurriculum />,
    },
    {
      id: 2,
      label: "التقييمات",
      icon: Star,
      gradient: "from-yellow-500 to-orange-500",
      content: (
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">تقييمات الدورة</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {visibleReviewsCount} تقييم مرئي • {hiddenReviewsCount} مخفي
                </span>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={showAllReviews}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md flex items-center"
                  >
                    <Eye className="w-4 h-4 ml-1" />
                    إظهار الكل
                  </button>
                  <button
                    onClick={hideAllReviews}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md flex items-center"
                  >
                    <EyeOff className="w-4 h-4 ml-1" />
                    إخفاء الكل
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <div className="flex items-center ml-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">4.5</span>
              <span className="text-gray-500 mr-2">(25 تقييم)</span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <span className="text-sm w-6">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <div className="h-2 bg-gray-200 rounded-full flex-1 mx-2">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${(rating / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">({rating * 5})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {sampleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
              // review.isVisible && (
              // )
            ))}
          </div>

          {visibleReviewsCount === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <EyeOff className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">لا توجد تقييمات معروضة حالياً</p>
              <button
                onClick={showAllReviews}
                className="mt-2 text-blue-600 font-medium flex items-center justify-center mx-auto"
              >
                <Eye className="w-4 h-4 ml-1" />
                إظهار جميع التقييمات
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 3,
      label: "الطلاب المشتركين في الدورة",
      icon: Layers,
      gradient: "from-blue-500 to-cyan-500",
      content: (
        <SubjectStudentsSection
          subjectName="Biology"
          students={[
            {
              id: 1,
              name: "Amira N.",
              email: "amira@example.com",
              avatarUrl: "https://i.pravatar.cc/100?img=1",
              status: "active",
              grade: "A",
              lastActivity: "2025-08-16T15:22:00Z",
              enrolledAt: "2025-02-01",
              notesCount: 4,
            },
            {
              id: 2,
              name: "Rahma Esm.",
              email: "rahma@example.com",
              avatarUrl: "https://i.pravatar.cc/100?img=1",
              status: "active",
              grade: "B",
              lastActivity: "2025-08-16T15:22:00Z",
              enrolledAt: "2025-02-01",
              notesCount: 4,
            },
            {
              id: 3,
              name: "Mohamed Ahmed.",
              email: "mohamed@example.com",
              avatarUrl: "https://i.pravatar.cc/100?img=1",
              status: "active",
              grade: "B",
              lastActivity: "2025-08-16T15:22:00Z",
              enrolledAt: "2025-02-01",
              notesCount: 4,
            },
          ]}
          onView={(s) => console.log("view", s)}
          onEdit={(s) => console.log("edit", s)}
          onMessage={(ids) => console.log("message ->", ids)}
          onRemove={async (ids) => console.log("remove ->", ids)}
          onAddStudent={() => console.log("add student")}
          onExportCSV={(rows) => console.log("export rows", rows)}
        />
      ),
    },
  ];

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

      {/* Header */}
      <PagesHeader
        title={
          <>
            الدورة:{" "}
            <span className="text-primary">{selectedSubject?.name}</span>
          </>
        }
        subtitle={"نظّم وأدر موادك التعليمية"}
      />

      <UnitsStats units={selectedSubject?.units || []} />
      <HorizontalTabs tabs={tabs} />
    </PageLayout>
  );
};

export default Units;
