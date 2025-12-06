"use client";
import React, { useEffect, useState } from "react";
import PageLayout from "../layout/PageLayout";
import BreadcrumbsShowcase from "../ui/BreadCrumbs";
import { BarChart3 } from "lucide-react";
import PagesHeader from "../ui/PagesHeader";
import ExamMainData from "./ExamMainData";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "الاختبارات", href: "#", icon: "", current: true },
];

export default function CreateQuestion() {
  const [examData, setExamData] = useState({
    name: "",
    duration: "",
    type: "intern",
    sections: [],
  });

  // إضافة قسم جديد مع التحقق من عدد الأسئلة للاختبار المحاكي
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

  useEffect(() => {
    console.log(examData);
  }, [examData]);

  return (
    <PageLayout>
      <div style={{ dir: "rtl" }}>
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader title="إنشاء اختبار جديد" subtitle={"صمم اختبار لطلابك"} />
        <>
          <ExamMainData
            examData={examData}
            setExamData={setExamData}
            onAddSection={addSection}
          />
        </>
      </div>
    </PageLayout>
  );
}
