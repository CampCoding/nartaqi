"use client";
import React, { use, useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { useParams } from "next/navigation";
import PageLayout from "../../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../components/ui/PagesHeader";
import ExamMainData from "../../../../../components/Questions/ExamMainData";
import exams from "../../../../../data/exams";

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
  const [rowData , setRowData] = useState({});

  // Fetch the exam data if editing
  useEffect(() => {
    if (params["exam-id"]) {
      console.log(exams?.find(item => item?.id == params["exam-id"]))
      setRowData(exams?.find(item => item?.id == params["exam-id"]))
    }
  }, [params["exam-id"]]);

  useEffect(() => {
    setExamData(rowData)
  } , [rowData])

  useEffect(() => {
    console.log(examData)
  } , [examData])

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
