"use client";

import React, { useEffect } from "react";
import Input from "./ExamInput";
import { FileText } from "lucide-react";
import Card from "./ExamCard";
import { useParams } from "next/navigation";

export default function ExamMainInfo({
  lessonId = null,
  examInfoData,
  handleBasicDataChange,
  handleExamTypeChange,
  handleSubmitBasicData,
  exam_types,
  add_exam_loading,
  edit_exam_loading,
  addExam
}) {
  const params = useParams();
  const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    console.log(lessonId , examInfoData)
  } ,[lessonId , examInfoData])

  return (
    <Card title="معلومات الاختبار الأساسية" icon={FileText}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="اسم الاختبار"
            placeholder="أدخل اسم الاختبار"
            value={examInfoData?.title || ""}
            onChange={(e) => handleBasicDataChange("title", e.target.value)}
          />

          <Input
            label="الوصف"
            placeholder="أدخل وصف الاختبار"
            value={examInfoData?.description || ""}
            onChange={(e) => handleBasicDataChange("description", e.target.value)}
            multiline
          />

          <Input
            min={currentDate}
            required
            label="التاريخ"
            type="date"
            placeholder=""
            value={examInfoData?.date || ""}
            onChange={(e) => handleBasicDataChange("date", e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">المستوي</label>
            <select
              value={examInfoData?.level || "medium"}
              onChange={(e) => handleBasicDataChange("level", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="normal">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>
          </div>
        </div>

        {/* {!lessonId && (
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              نوع الاختبار
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exam_types?.map((type) => {
                const isSelected = examInfoData?.type == type.value;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleExamTypeChange(type)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-right hover:scale-[1.02] ${
                      isSelected
                        ? "bg-blue-600 !text-white"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          isSelected ? "bg-blue-500" : "bg-gray-100 text-blue-500"
                        }`}
                      >
                        <type.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 text-right">
                        <h3
                          className={
                            isSelected
                              ? "font-semibold text-white mb-2"
                              : "font-semibold text-gray-900 mb-2"
                          }
                        >
                          {type.title}
                        </h3>
                        <p
                          className={
                            isSelected ? "text-lg text-white" : "text-lg text-gray-600"
                          }
                        >
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )} */}

        {(lessonId)  && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Input
                label="الوقت"
                placeholder="ادخل وقت الاختبار"
                type="text"
                name="time"
                
                value={examInfoData?.time || ""}
                onChange={(e) => handleBasicDataChange("time", e.target.value)}
              />
             
            </div>
          </div>
        )}
      </div>

      {!addExam && <button
        type="button"
        className="bg-blue-500 text-white p-3 rounded-md mt-3 disabled:opacity-60"
        onClick={handleSubmitBasicData}
        disabled={addExam || add_exam_loading || edit_exam_loading}
      >
        {add_exam_loading || edit_exam_loading
          ? "جاري الحفظ..."
          : params["exam-id"]
          ? "تعديل"
          : "إضافة"}
      </button>}
    </Card>
  );
}
