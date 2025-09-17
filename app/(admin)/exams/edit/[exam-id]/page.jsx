"use client";
import React, { useEffect, useState } from "react";
import { BarChart3, SaveIcon, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import PageLayout from "../../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../components/ui/PagesHeader";
import ExamMainData from "../../../../../components/Questions/ExamMainData";
import Card from "../../../../../components/Questions/ExamCard";
import Button from "../../../../../components/atoms/Button";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "الاختبارات", href: "#", current: true },
];

export default function page() {
  const [examData, setExamData] = useState({
    name: "",
    duration: "",
    type: "intern",
    sections: [],
  });
  const params = useParams();
  const [activeTab, setActiveTab] = useState("info"); // "info" or "questions"

  // Fetch the exam data if editing
  useEffect(() => {
    if (params["exam-id"]) {
      // Simulate fetching exam data for editing, e.g., from an API or global state
      const fetchedExamData = {
        name: "Mock Exam",
        duration: "60",
        type: "mock",
        sections: [
          /* existing sections data */
        ],
      };
      setExamData(fetchedExamData);
    }
  }, [params["exam-id"]]);

  const handleAddExam = () => {
    console.log(examData);
  };

  const addSection = (section) => {
    const isAlreadyAdded = examData?.sections?.some((s) => s.id === section.id);
    if (!isAlreadyAdded) {
      // للاختبار المحاكي: نأخذ فقط 24 سؤال من كل قسم
      const questionsToAdd =
        examData.type === "mock"
          ? section?.questions?.slice(0, 24) // 24 سؤال فقط للاختبار المحاكي
          : section?.questions; // جميع الأسئلة للتدريب

      // للاختبار المحاكي: مدة كل قسم ثابتة (25 دقيقة)
      const sectionDuration =
        examData.type === "mock"
          ? 25 // 25 دقيقة للاختبار المحاكي
          : section.time; // المدة الأصلية للتدريب

      setExamData({
        ...examData,
        sections: [
          ...examData.sections,
          {
            ...section,
            questions: questionsToAdd,
            duration: sectionDuration,
            originalQuestionsCount: section.questions?.length || 0, // حفظ العدد الأصلي للأسئلة
          },
        ],
      });
    }
  };

  return (
    <PageLayout>
      <div style={{ dir: "rtl" }}>
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title="تعديل اختبار"
          subtitle={"عدل تفاصيل الاختبار الحالي"}
        />

        <ExamMainData
          examData={examData}
          setExamData={setExamData}
          onAddSection={addSection}
        />
      </div>
    </PageLayout>
  );
}
