"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Check } from "lucide-react";
import { Upload, message } from "antd";
import AddCourseSourceBasicInfo from "../../../../../components/SaudiCourseSource/AddCourseSourceBasicInfo";
import Features from "../../../../../components/SaudiCourseSource/Features";
import AddCourseSourceResource from "../../../../../components/SaudiCourseSource/AddCourseSourceResource";
import {
  add_round_data,
  handleGetAllRounds,
  handleGetSourceRound,
} from "../../../../../lib/features/roundsSlice";
import { useDispatch } from "react-redux";

// Helper لتحويل الصورة لـ base64 (للمعاينة)
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

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
];

export default function Page() {
  const { id } = useParams();
  const params = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [roundId, setRoundId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [fileNames, setFileNames] = useState({});
  const [videos, setVideos] = useState([{ id: 1, name: "", url: "" }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [rowData, setRowData] = useState({});
  const dispatch = useDispatch();

  const page = params.get("page");
  const pageSize = params.get("pageSize");
  const isSource = params.get("isSource");
  const Cat_id = params.get("category_id");

  const router = useRouter();

  useEffect(() => {
    if (!isSource) {
      dispatch(handleGetSourceRound({ page, per_page: 1000000000 }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status === "success") {
            const found = res?.data?.message?.data?.find(
              (item) => String(item?.id) === String(id)
            );
            setRowData(found || null);
            if (found?.id) {
              setRoundId(found.id);
            }
          }
        });
    } else {
      dispatch(
        handleGetAllRounds({
          course_category_id: Cat_id,
          page,
          per_page: 100000000,
        })
      )
        .unwrap()
        .then((res) => {
          if (res?.data?.status === "success") {
            const found = res?.data?.message?.data?.find(
              (item) => String(item?.id) === String(id)
            );
            setRowData(found || null);
            if (found?.id) {
              setRoundId(found.id);
            }
          }
        });
    }
  }, [id, dispatch, page, pageSize]);

  // --- Navigation Logic ---
  const goToNextStep = () => {
    if (currentStep == STEPS.length) {
      if (!isSource) {
        router.push(`/saudi_source_course`);
      } else {
        router.push(`/teachers-courses`);
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const goToPrevStep = () => {
    if (isSource) {
      dispatch(add_round_data(""));
      window.location.reload();
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    } else {
      window.location.reload();
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };
  // -------------------------

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return "complete";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  // ✅ NEW: Go to specific step when clicking on it
  const goToStep = (stepId) => {
    if (stepId === currentStep) return;

    const isFuture = stepId > currentStep;

    // لو رايح لقدّام لخطوة 2 لازم roundId يكون موجود (عشان Features تعتمد عليه)
    if (isFuture && stepId === 2 && !roundId) {
      message.warning(
        "لازم يتم حفظ بيانات الدورة أولاً قبل الدخول لمميزات الدورة."
      );
      return;
    }

    // نفس منطق الرجوع عندك لما isSource
    if (isSource && stepId < currentStep) {
      dispatch(add_round_data(""));
      window.location.reload();
    }

    setCurrentStep(stepId);
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
    return false; // منع الرفع التلقائي
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
          id={id}
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
          rowData={rowData}
          page={page}
          pageSize={pageSize}
          setRowData={setRowData}
          isSource={isSource}
          Cat_id={Cat_id}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <Features
          isSource={isSource}
          roundId={roundId}
          currentStep={currentStep}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
          STEPS={STEPS}
        />
      );
    }

    return (
      <AddCourseSourceResource
        currentStep={currentStep}
        goToPrevStep={goToPrevStep}
        id={roundId}
        STEPS={STEPS}
      />
    );
  };
  // ---------------------------

  const isEditMode = Boolean(id);

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
              {isEditMode ? "تعديل بيانات الدورة" : "إضافة دورة جديدة"}
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

            // ✅ allow click to completed/current steps always
            // ✅ allow click to future step 2 only if roundId exists (handled in goToStep)
            const clickable = step.id <= currentStep || (step.id === 2 && roundId);

            return (
              <React.Fragment key={step.id}>
                <div
                  onClick={() => {
                    if (!clickable) {
                      // نفس رسالة الحماية
                      if (step.id === 2 && !roundId) {
                        message.warning(
                          "لازم يتم حفظ بيانات الدورة أولاً قبل الدخول لمميزات الدورة."
                        );
                      }
                      return;
                    }
                    goToStep(step.id);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      if (!clickable) {
                        if (step.id === 2 && !roundId) {
                          message.warning(
                            "لازم يتم حفظ بيانات الدورة أولاً قبل الدخول لمميزات الدورة."
                          );
                        }
                        return;
                      }
                      goToStep(step.id);
                    }
                  }}
                  className={`flex w-1/4 min-w-0 flex-shrink-0 flex-col items-center ${
                    clickable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                  }`}
                >
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
