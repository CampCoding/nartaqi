import React from "react";
import Card from "./ExamCard";
import Input from "./ExamInput";
import { FileText } from "lucide-react";

export default function ExamMainInfo({ examData,colorMap, setExamData , exam_types , getEstimatedDuration}) {
  return (
    <Card title="معلومات الاختبار الأساسية" icon={FileText}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="اسم الاختبار"
            placeholder="أدخل اسم الاختبار"
            value={examData?.name}
            onChange={(e) =>
              setExamData((p) => ({ ...p, name: e.target.value }))
            }
          />

        </div>

        {/* Exam Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            نوع الاختبار
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exam_types.map((type) => {
              const Icon = type.icon;
              const isSelected = examData?.type === type.value;
              const palette = colorMap[type.color];

              return (
                <button
                  key={type.id}
                  onClick={() =>
                    setExamData({
                      name: examData.name,
                      duration: examData.duration,
                      type: type.value,
                      sections: [],
                    })
                  }
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-right hover:scale-[1.02] ${
                    isSelected
                      ? `${palette.cardSelected} shadow-lg`
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        isSelected ? palette?.chip : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          isSelected ? palette?.icon : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {type.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
