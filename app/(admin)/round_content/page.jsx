"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Check } from "lucide-react";
import CourseSourceBasicLevel from "../../../components/SaudiCourseSource/CourseSourceBasicLevel";
import CourseSourceLecturesContent from "../../../components/SaudiCourseSource/CourseSourceLecturesContent";

// Define the steps data
const STEPS = [
  {
    id: 1,
    title: "مرحلة التأسيس",
    description: "إضافة أقسام، دروس، ومواد تعليمية.",
  },
  {
    id: 2,
    title: "المحاضرات",
    description: "إضافة أقسام، دروس، ومواد تعليمية.",
  },

];

export default function Page() {
  const params = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const id = params.get("id")


  // --- Navigation Logic ---
  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  // -------------------------

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return "complete";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "complete":
        return {
          dot: "bg-blue-600 text-white border-blue-600",
          text: "text-blue-800 font-semibold",
          line: "bg-blue-600",
        };
      case "current":
        return {
          dot: "bg-white text-blue-600 border-2 border-blue-600 shadow-md",
          text: "text-gray-900 font-bold",
          line: "bg-gray-300",
        };
      case "upcoming":
      default:
        return {
          dot: "bg-gray-200 text-gray-500 border-gray-300",
          text: "text-gray-500",
          line: "bg-gray-300",
        };
    }
  };

  // ------- Step content -------
  const renderStepContent = () => {
    if (currentStep === 1) {
      // مرحلة التأسيس
      return (
       <CourseSourceBasicLevel id={id} />
      );
    }

    if (currentStep === 2) {
      // المحاضرات
      return (
       <CourseSourceLecturesContent id={id}/>
      );
    }

    // المصادر والملفات
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            رفع المصادر والملفات
          </h3>
          <p className="text-sm text-gray-500">
            أضف ملفات PDF، عروض تقديمية، أو روابط خارجية لدعم محتوى الدورة.
          </p>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/40 p-6 text-center hover:bg-blue-50">
          <span className="text-sm font-medium text-blue-700">
            اسحب الملفات هنا أو انقر للاختيار
          </span>
          <span className="mt-1 text-xs text-gray-500">
            الصيغ المدعومة: PDF, PPT, DOC, ZIP
          </span>
          <input type="file" multiple className="hidden" />
        </label>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
          لم يتم رفع ملفات بعد.
          <br />
          بعد اختيار الملفات ستظهر هنا قائمة بالمصادر المرفوعة مع إمكانية
          الحذف أو التعديل.
        </div>
      </div>
    );
  };
  // ---------------------------

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-8"
      dir="rtl"
    >
      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-6xl rounded-2xl border-b-4 border-blue-500 bg-white p-6 shadow-xl">
        <div className="absolute top-0 right-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-50" />

        <div className="relative mb-3 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl">
            <PlusOutlined className="text-xl text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-3xl font-extrabold text-transparent">
              إضافة محتوي الدورة 
            </h1>
            <p className="mt-1 text-gray-600">
              إنشاء وتكوين دورة تعليمية شاملة مع الجدولة والمحتوى.
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-6xl">
        {/* Stepper */}
        <div className="mb-10 flex items-start justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
          {STEPS.map((step, index) => {
            const status = getStepStatus(step.id);
            const { dot, text, line } = getStatusClasses(
              status
            );
            const isLast = index === STEPS.length - 1;

            return (
              <React.Fragment key={step.id}>
                <div className="flex w-1/4 min-w-0 flex-shrink-0 flex-col items-center">
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full transition duration-300 ${dot}`}
                  >
                    {status === "complete" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-lg">{step.id}</span>
                    )}
                  </div>

                  <div className="mt-3 min-w-0 text-center">
                    <h3
                      className={`overflow-hidden text-ellipsis whitespace-nowrap text-sm md:text-base leading-tight transition duration-300 ${text}`}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-0.5 hidden text-xs text-gray-500 md:block">
                      {status === "current"
                        ? "الخطوة الحالية"
                        : step.description.split(",")[0]}
                    </p>
                  </div>
                </div>

                {!isLast && (
                  <div className="mx-2 flex flex-grow items-center">
                    <div
                      className={`h-0.5 w-full transition duration-300 ${
                        status === "complete" ? "bg-blue-600" : line
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
          <h2 className="mb-4 border-b pb-2 text-2xl font-bold text-gray-800">
            الخطوة {currentStep}: {STEPS[currentStep - 1].title}
          </h2>

          {renderStepContent()}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between space-x-4 space-x-reverse">
            <button
              onClick={goToPrevStep}
              disabled={currentStep === 1}
              className={`rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition duration-150 hover:bg-gray-50 ${
                currentStep === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              السابق
            </button>
            <button
              onClick={goToNextStep}
              disabled={currentStep === STEPS.length}
              className={`rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition duration-150 hover:bg-blue-700 ${
                currentStep === STEPS.length ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {currentStep === STEPS.length ? "إنهاء ونشر" : "التالي"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
