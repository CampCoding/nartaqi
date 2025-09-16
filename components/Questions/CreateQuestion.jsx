"use client";
import React, { useEffect, useState } from 'react'
import PageLayout from '../layout/PageLayout';
import BreadcrumbsShowcase from '../ui/BreadCrumbs';
import { BarChart3, PlusIcon, SaveIcon, Trash2 } from 'lucide-react';
import PagesHeader from '../ui/PagesHeader';
import ExamMainData from './ExamMainData';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

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

  const [activeTab, setActiveTab] = useState("info"); // "info" أو "questions"

  // إضافة قسم جديد مع التحقق من عدد الأسئلة للاختبار المحاكي
  const addSection = (section) => {
    const isAlreadyAdded = examData?.sections?.some(s => s.id === section.id);
    if (!isAlreadyAdded) {
      // للاختبار المحاكي: نأخذ فقط 24 سؤال من كل قسم
      const questionsToAdd = examData.type === "mock" 
        ? section?.questions?.slice(0, 24) // 24 سؤال فقط للاختبار المحاكي
        : section?.questions; // جميع الأسئلة للتدريب
      
      // للاختبار المحاكي: مدة كل قسم ثابتة (25 دقيقة)
      const sectionDuration = examData.type === "mock" 
        ? 25 // 25 دقيقة للاختبار المحاكي
        : section.time; // المدة الأصلية للتدريب

      setExamData({
        ...examData,
        sections: [...examData.sections, {
          ...section,
          questions: questionsToAdd,
          duration: sectionDuration,
          originalQuestionsCount: section.questions?.length || 0 // حفظ العدد الأصلي للأسئلة
        }]
      });
    }
  };

 
  function handleAddExam() {
    console.log(examData);
    // هنا يمكنك إضافة منطق حفظ الاختبار
  }

  useEffect(() => {
    console.log(examData)
  } , [examData])

  return (
    <PageLayout>
      <div style={{dir:"rtl"}}>
        <BreadcrumbsShowcase variant='pill' items={breadcrumbs}/>

        <PagesHeader 
          title="إنشاء اختبار جديد"
          subtitle={"صمم اختبار لطلابك"}
        />

        {/* تبويبات الصفحة */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "info" ? "border-b-2 border-[#0F7490] text-[#0F7490]" : "text-gray-500"}`}
            onClick={() => setActiveTab("info")}
          >
            معلومات الاختبار
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "questions" ? "border-b-2 border-[#0F7490] text-[#0F7490]" : "text-gray-500"}`}
            onClick={() => setActiveTab("questions")}
            disabled={examData?.sections?.length === 0}
          >
            معاينة الأسئلة ({examData?.sections?.length})
          </button>
        </div>

        {activeTab === "info" ? (
          <>
            <ExamMainData 
              examData={examData} 
              setExamData={setExamData}
              onAddSection={addSection}
            />
                      </>
        ) : (
          <Card title="معاينة الأسئلة" className="p-6">
            <div className="space-y-6">
              {examData?.sections?.map(section => (
                <div key={section?.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{section?.name}</h3>
                    <div className="text-sm text-gray-500">
                      {section.questions?.length} سؤال • {section.duration} دقيقة
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {section?.questions?.map((question, index) => (
                      <div key={question?.id || index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <span className="font-medium">{index + 1}.</span>
                          <div className="flex-1">
                            <p className="font-medium">{question?.text}</p>
                            <span className="text-sm text-gray-500 mt-1">
                              نوع السؤال: {question?.type === "mcq" ? "اختيار من متعدد" : "مقالي"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between mt-6">
                <Button type="default" onClick={() => setActiveTab("info")}>
                  العودة إلى المعلومات
                </Button>
                <Button type="primary" onClick={handleAddExam}>
                  <SaveIcon className="w-4 h-4 ml-2" />
                  حفظ الاختبار
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}