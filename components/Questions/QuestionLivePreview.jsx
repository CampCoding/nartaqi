import React from "react";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import { AlertCircle, CheckCircle2, Eye, PlusIcon } from "lucide-react";

export default function QuestionLivePreview({
  examDuration,
  examName,
  questions,
  setCurrentQuestionIndex,
  examType,
  isExamFormValid,
}) {
  return (
    <div className="space-y-6 sticky top-0" dir="rtl">
      <Card title="معلومات الاختبار" className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#202938]/60">اسم الاختبار</span>
            <span className="font-medium text-[#202938]">
              {examName || "لم يتم التعيين"}
            </span>
          </div>
          {/* <div className="flex items-center justify-between">
            <span className="text-sm text-[#202938]/60">المدة</span>
            <span className="font-medium text-[#202938]">
              {examDuration} دقيقة
            </span>
          </div> */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#202938]/60">النوع</span>
            <span className="font-medium text-[#202938]">
              {examType === "intern" ? "تدريب" : "اختبار محاكي"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#202938]/60">عدد الأسئلة</span>
            <span className="font-medium text-[#0F7490]">
              {questions.length}
            </span>
          </div>
        </div>
      </Card>

      <Card title="إجراءات سريعة" className="p-6">
        <div className="space-y-3">
          <Button
            type="default"
            className="w-full justify-start"
            onClick={() => setCurrentQuestionIndex(-2)}
            disabled={!examName.trim()}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            إضافة سؤال
          </Button>
          <Button
            type="secondary"
            className="w-full justify-start"
            disabled={questions.length === 0}
          >
            <Eye className="w-4 h-4 mr-2" />
            معاينة الاختبار
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-center">
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              isExamFormValid() ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            {isExamFormValid() ? (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <p
            className={`text-sm font-medium ${
              isExamFormValid() ? "text-green-600" : "text-gray-500"
            }`}
          >
            {isExamFormValid() ? "جاهز للحفظ" : "اكمل معلومات الاختبار"}
          </p>
          <p className="text-xs text-[#202938]/50 mt-1">
            {isExamFormValid()
              ? "تم إكمال جميع الحقول المطلوبة"
              : "يجب إضافة اسم الاختبار ومدته وواحد سؤال على الأقل"}
          </p>
        </div>
      </Card>
    </div>
  );
}
