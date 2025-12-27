"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import { Check } from "lucide-react";
import CourseSourceBasicLevel from "../../../components/SaudiCourseSource/CourseSourceBasicLevel";
import CourseSourceLecturesContent from "../../../components/SaudiCourseSource/CourseSourceLecturesContent";
import FreeVideos from "../../../components/RoundContent/FreeVideos/FreeVideos";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllExamByRoundId } from "../../../lib/features/examSlice";
import { Spin } from "antd";
import AssignExamModal from "../../../components/RoundContent/Exams/AssignExamModal";
import dayjs from "dayjs";
import DeleteExamModal from "../../../components/Courses/components/exam/delete";

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
  const [activeTab, setActiveTab] = useState("basic");
  const params = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const id = params.get("id");
  const isSource = params.get("source");
  const router = useRouter();

  const [openExamModal , setOpenExamModal] = useState(false);
  const [openDeleteExamModal , setOpenDeleteExamModal] = useState(false);
  const dispatch= useDispatch();
    const { all_exam_round_loading, all_exam_round_list } = useSelector(state => state?.exam)
  

    useEffect(() =>{
      dispatch(handleGetAllExamByRoundId({
            body: {
              round_id: id,
      
            },
            page: 1,
            per_page: 100000000
          }));
    } ,[id])

  // --- Navigation Logic ---
  const goToNextStep = () => {
    if (currentStep >= STEPS.length) {
      router.push("/saudi_source_course");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };


  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Function to handle step click
  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);

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
          container: "cursor-pointer",
        };
      case "current":
        return {
          dot: "bg-white text-blue-600 border-2 border-blue-600 shadow-md",
          text: "text-gray-900 font-bold",
          line: "bg-gray-300",
          container: "cursor-pointer",
        };
      case "upcoming":
      default:
        return {
          dot: "bg-gray-200 text-gray-500 border-gray-300",
          text: "text-gray-500",
          line: "bg-gray-300",
          container: "cursor-not-allowed opacity-70",
        };
    }
  };

  // ------- Step content -------
  const renderStepContent = () => {
    if (activeTab == "basic") {
      // مرحلة التأسيس
      return <CourseSourceBasicLevel isSource={isSource} id={id} />;
    }

    if (activeTab == "lecture") {
      // المحاضرات
      return <CourseSourceLecturesContent isSource={isSource} id={id} />;
    }

    if (activeTab == "exam") {
      return (
        <div className="p-6 bg-white border border-gray-200 shadow-md rounded-xl">
          <div className="flex justify-between items-center">
            <h2 className="mb-1 text-xl font-bold text-gray-900">
              امتحانات الدورة
            </h2>
            <button
              onClick={() => setOpenExamModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition duration-150"
            >
              <PlusOutlined />
              إضافة اختبار جديد
            </button>
          </div>

          {all_exam_round_loading ? (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          ) : all_exam_round_list?.data?.message?.length > 0 ? (
            <>
              <div className="space-y-4 flex flex-col gap-1 mt-2 mb-8">
                {all_exam_round_list?.data?.message?.map((examGroup, idx) => (
                  <div
                    className="p-4 mb-3  flex-1 min-w-0 border border-orange-100 rounded-lg bg-orange-50/70"
                    key={examGroup?.id}
                  >
                   <div className="flex flex-col gap-2  justify-between">
                     <p className="font-medium text-gray-800 truncate">
                      {examGroup?.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {examGroup?.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      {examGroup?.date && (
                        <span>📅 {dayjs(examGroup.date).format("YYYY/MM/DD")}</span>
                      )}
                      {examGroup?.time && <span>⏱️ {examGroup.time}</span>}
                    </div>

                    <div className="flex mt-2 gap-1 items-center">
                      <button 
                      onClick={() => router.push(`/exams/edit/${examGroup?.id}`)}
                      className="bg-blue-500 text-white p-2 rounded-md">تعديل</button>
                      <button 
                      onClick={() => setOpenDeleteExamModal(examGroup)}
                      className="bg-red-500 text-white p-2 rounded-md">حذف</button>
                    </div>
                   </div>
                  </div>
                 
                ))}
              </div>
            </>
          ) : (
            <div className="py-10 text-center">
              <div className="inline-block p-6 mb-4 bg-orange-100 rounded-full">
                <FileTextOutlined className="text-3xl text-orange-500" />
              </div>
              <p className="mb-2 text-lg font-medium text-gray-700">
                لا توجد امتحانات مضافة لهذه الدورة حتى الآن.
              </p>
              <p className="mb-6 text-gray-600">
                ابدأ بإضافة أول امتحان للدورة لاختبار الطلاب.
              </p>

            </div>
          )}
        </div>
      )
    };

    if (activeTab == "free_explain") {
      return <FreeVideos />
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
          بعد اختيار الملفات ستظهر هنا قائمة بالمصادر المرفوعة مع إمكانية الحذف
          أو التعديل.
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

          <div className="flex !w-full gap-3 p-2 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <button
              onClick={() => setActiveTab("basic")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "basic"
                  ? "bg-green-600 text-white shadow"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
            >
              مرحلة التأسيس
            </button>
            <button
              onClick={() => setActiveTab("lecture")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "lecture"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
            >
              مرحلة المحاضرات
            </button>
           
            <button
              onClick={() => setActiveTab("exam")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "explain"
                  ? "bg-orange-600 text-white shadow"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
            >الاختبارات</button>

            <button
              onClick={() => setActiveTab("free_explain")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "free_explain"
                  ? "bg-fuchsia-600 text-white shadow"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
            >
              الشروحات المجانية
            </button>
          </div>

        </div>

        {/* Content */}
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
          {renderStepContent()}

          <AssignExamModal open={openExamModal} setOpen={setOpenExamModal} round_id={id} />
          <DeleteExamModal open={openDeleteExamModal} setOpen={setOpenDeleteExamModal} round_id={id} />
        </div>
      </div>
    </div>
  );
}