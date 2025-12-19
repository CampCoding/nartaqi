"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Check } from "lucide-react";
import AddCourseSourceBasicInfo from "../../../../components/SaudiCourseSource/AddCourseSourceBasicInfo";
import AddCourseSourceResource from "../../../../components/SaudiCourseSource/AddCourseSourceResource";
import Features from "../../../../components/SaudiCourseSource/Features";

// Define the steps data
const STEPS = [
  {
    id: 1,
    title: "بيانات الدورة",
    description: "إضافة أقسام، دروس، ومواد تعليمية.",
  },
  {
    id: 2,
    title: "مميزات الدورة",
    description: "إضافة أقسام، دروس، ومواد تعليمية.",
  },
  {
    id: 3,
    title: "المصادر والملفات",
    description: "رفع الملفات والروابط المساندة ومراجعة الدورة.",
  },
];

export default function Page() {
  const params = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [roundId, setRoundId] = useState(null);
  const [source , setSource] = useState(0);
  
  // --- Shared state for all steps ---
  const [formData, setFormData] = useState({
    step1: {}, // Data for step 1 (basic info)
    step2: {}, // Data for step 2 (features)
    step3: {}, // Data for step 3 (resources)
  });
  
  const [fileList, setFileList] = useState([]);
  const [fileNames, setFileNames] = useState({});
  const [videos, setVideos] = useState([{ id: 1, name: "", url: "" }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const isSource = params?.get("source");

  // Save form data when navigating away from a step
  const saveStepData = (stepNumber, data) => {
    setFormData(prev => ({
      ...prev,
      [`step${stepNumber}`]: data
    }));
    console.log(`Saved step ${stepNumber} data:`, data);
  };

  // Get saved data for a step
  const getStepData = (stepNumber) => {
    return formData[`step${stepNumber}`];
  };

  // --- Navigation Logic ---
  const goToNextStep = () => {
    // Save current step data before moving
    // This should be called from each child component before navigation
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Clear all form data (if needed)
  const clearFormData = () => {
    setFormData({
      step1: {},
      step2: {},
      step3: {},
    });
    setFileList([]);
    setImagePreview(null);
    setSelectedCategory(null);
  };

  // Handle final submission
  const handleFinalSubmit = () => {
    console.log("Final form data:", formData);
    // Here you can combine all step data and submit
    // const finalData = {
    //   basicInfo: formData.step1,
    //   features: formData.step2,
    //   resources: formData.step3,
    // };
    // Submit to API...
  };
  // -------------------------

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return "complete";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  const beforeUpload = async (file) => {
    const isImage = file.type?.startsWith("image/");
    if (!isImage) {
      message.error("من فضلك ارفع ملف صورة فقط.");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("حجم الصورة يجب أن يكون أقل من 5MB.");
      return Upload.LIST_IGNORE;
    }

    const preview = await getBase64(file);
    setImagePreview(preview);
    setFileList([
      {
        uid: file.uid || file.name,
        name: file.name,
        status: "done",
        originFileObj: file,
      },
    ]);
    return false;
  };

  const onFilesChange = ({ fileList }) => {
    setFileList(fileList);
    setFileNames((prev) => {
      const next = { ...prev };
      fileList.forEach((f) => {
        if (f.uid && !next[f.uid])
          next[f.uid] = f.name?.replace(/\.[^.]+$/, "") || "";
      });
      // remove stale uids
      Object.keys(next).forEach((uid) => {
        if (!fileList.find((f) => f.uid === uid)) delete next[uid];
      });
      return next;
    });
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
      return (
        <AddCourseSourceBasicInfo
          isSource={isSource}
          beforeUpload={beforeUpload}
          fileList={fileList}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setFileList={setFileList}
          setImagePreview={setImagePreview}
          currentStep={currentStep}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
          setRoundId={setRoundId}
          setSource={setSource}
          // Pass save function and initial data
          saveStepData={saveStepData}
          initialData={getStepData(1)}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <Features 
          roundId={roundId}
          currentStep={currentStep}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
          STEPS={STEPS}
          // Pass save function and initial data
          saveStepData={saveStepData}
          initialData={getStepData(2)}
        />
      );
    }

    return (
      <AddCourseSourceResource 
        currentStep={currentStep}
        goToPrevStep={goToPrevStep}
        id={roundId}
        STEPS={STEPS}
        // Pass save function and initial data
        saveStepData={saveStepData}
        initialData={getStepData(3)}
        source={isSource}
        handleFinalSubmit={handleFinalSubmit}
      />
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
              إضافة دورة جديدة
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
            const { dot, text, line } = getStatusClasses(status);
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
        </div>
      </div>
    </div>
  );
}