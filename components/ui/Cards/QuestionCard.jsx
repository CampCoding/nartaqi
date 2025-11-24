import React from "react";
import Button from "../../atoms/Button";
import {
  Eye,
  Edit3,
  Trash2,
  BookOpen,
  Users,
  FileText,
} from "lucide-react";
import Card from "../../atoms/Card";
import { useRouter } from "next/navigation";

const ExamCard = ({
  exam,
  prevModal,
  setPrevModal,
  selectedExam,
  setSelectedExam,
  deleteModal,
  setDeleteModal,
  viewMode,
}) => {
  const router = useRouter();

  return (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 pointer-events-none" />

      {/* Status Indicator */}
      <div
        className={`absolute top-0 right-0 w-20 h-20 transform rotate-45 translate-x-8 -translate-y-8 
      ${
        exam.status === "active" || exam.status === "نشط"
          ? "bg-gradient-to-br from-green-400 to-green-500"
          : exam.status === "draft" || exam.status === "مسودة"
          ? "bg-gradient-to-br from-yellow-400 to-yellow-500"
          : exam.status === "completed" || exam.status === "مكتمل"
          ? "bg-gradient-to-br from-blue-400 to-blue-500"
          : "bg-gradient-to-br from-red-400 to-red-500"
      }
      `}
      />

      <div className="relative p-6 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                exam.status === "active" || exam.status === "نشط"
                  ? "bg-gradient-to-br from-green-100 to-green-200"
                  : exam.status === "draft" || exam.status === "مسودة"
                  ? "bg-gradient-to-br from-yellow-100 to-yellow-200"
                  : exam.status === "completed" || exam.status === "مكتمل"
                  ? "bg-gradient-to-br from-blue-100 to-blue-200"
                  : "bg-gradient-to-br from-red-100 to-red-200"
              }`}
            >
              <BookOpen
                className={`w-6 h-6 ${
                  exam.status === "active" || exam.status === "نشط"
                    ? "text-green-600"
                    : exam.status === "draft" || exam.status === "مسودة"
                    ? "text-yellow-600"
                    : exam.status === "completed" || exam.status === "مكتمل"
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {exam.type === "mock" ? "اختبار محاكي" : "تدريب"}
              </span>
              {exam.date && (
                <span className="text-[11px] text-gray-500">
                  {exam.date}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Exam Title */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#1a202c] mb-3 line-clamp-2 leading-tight">
            {exam.name || exam.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {exam.description}
          </p>
        </div>

        {/* Exam Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">عدد الأسئلة</p>
                <p className="text-lg font-bold text-gray-800">
                  {exam.questionsCount || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">المشاركون</p>
                <p className="text-lg font-bold text-gray-800">
                  {exam.participantsCount || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                router.push(`/exams/${exam?.id}`);
              }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <Eye className="w-4 h-4 ml-1" />
              معاينة
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={() => router.push(`/exams/edit/${exam?.id}`)}
              className="text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-lg p-2 transition-all duration-300 transform hover:scale-105"
              aria-label="تعديل"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                setDeleteModal(!deleteModal);
                setSelectedExam(exam);
              }}
              className="text-red-500 hover:bg-red-50 border border-red-200 rounded-lg p-2 transition-all duration-300 transform hover:scale-105"
              aria-label="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExamCard;
