import { AlertCircle, BookOpen, CheckCircle, PlusIcon } from "lucide-react";
import React from "react";
import Card from "./ExamCard";
import ProgressBar from "./ExamProgressBar";

export default function QuestionSections({
  examData,
  filteredSection,
  onAddSection,
}) {
  return (
    examData?.type && (
      <Card title="إدارة الأقسام" icon={BookOpen}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">
              الأقسام المتاحة
            </h3>
            <ProgressBar
              current={examData?.sections?.length}
              total={filteredSection?.length || 1}
              label="الأقسام المضافة"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSection?.map((section) => {
              const isAdded = examData?.sections?.some(
                (s) => s.id === section.id
              );
              const availableQuestions = section?.questions?.length || 0;
              // In mock mode: allow adding a section only if the source bank has >= 24 items
              const canAdd =
                examData?.type !== "mock" || availableQuestions >= 24;

              return (
                <div
                  key={section?.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    isAdded
                      ? "border-green-200 bg-green-50"
                      : canAdd
                      ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                      : "border-red-200 bg-red-50"
                  }`}
                  onClick={() => !isAdded && canAdd && onAddSection(section)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isAdded
                          ? "bg-green-100"
                          : canAdd
                          ? "bg-blue-100"
                          : "bg-red-100"
                      }`}
                    >
                      {isAdded ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : canAdd ? (
                        <PlusIcon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>

                    <div className="flex-1 text-right">
                      <h4 className="font-medium text-gray-900">
                        {section?.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {section?.desc}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>الأسئلة المتاحة: {availableQuestions}</p>
                        {examData?.type === "mock" && (
                          <p
                            className={
                              availableQuestions < 24
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {availableQuestions < 24
                              ? "غير متاح - يتطلب 24 سؤال"
                              : "متاح للإضافة"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    )
  );
}
