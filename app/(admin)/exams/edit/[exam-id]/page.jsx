"use client";
import React, { useEffect, useState } from "react";
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

export default function Page() {
  // شكل مبدئي فيه sections array عشان أي .find / .map تشتغل بأمان
  const [examData, setExamData] = useState({
    id: null,
    name: "",
    duration: "",
    type: "intern", // intern أو mock
    sections: [],
  });

  const [rowData, setRowData] = useState({
    id: null,
    name: "",
    duration: "",
    type: "intern",
    sections: [],
  });

  const params = useParams();
  const [activeTab, setActiveTab] = useState("info");

  // Load exam if exam-id موجود
  useEffect(() => {
    const examId = params["exam-id"];
    if (!examId) return;

    // تأكد إن exams Array
    if (!Array.isArray(exams)) {
      console.warn("exams is not an array:", exams);
      return;
    }

    const found = exams.find(
      (item) => String(item?.id) === String(examId)
    );

    if (found) {
      // نضمن وجود sections كـ array
      const normalized = {
        ...found,
        sections: Array.isArray(found.sections) ? found.sections : [],
      };

      setRowData(normalized);
      setExamData(normalized);
      console.log("Found exam:", normalized);
    } else {
      console.warn("Exam not found for id:", examId);
    }
  }, [params]);

  const addSection = (section) => {
    if (!section) return;

    const isAlreadyAdded = examData?.sections?.some(
      (s) => s.id === section.id
    );
    if (isAlreadyAdded) return;

    const questionsToAdd =
      examData.type === "mock"
        ? section?.questions?.slice(0, 24) || []
        : section?.questions || [];

    const sectionDuration =
      examData.type === "mock" ? 25 : section.time;

    setExamData((prev) => ({
      ...prev,
      sections: [
        ...(prev.sections || []),
        {
          ...section,
          questions: questionsToAdd,
          duration: sectionDuration,
          originalQuestionsCount: section.questions?.length || 0,
        },
      ],
    }));
  };

  return (
    <PageLayout>
      {/* direction يتكتب كـ attribute مش style */}
      <div dir="rtl">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title="تعديل اختبار"
          subtitle="عدل تفاصيل الاختبار الحالي"
        />

        <ExamMainData
          examid={params["exam-id"] || null}
          rowData={rowData}
          setRowData={setRowData}
          examData={examData}
          setExamData={setExamData}
          onAddSection={addSection}
        />
      </div>
    </PageLayout>
  );
}
