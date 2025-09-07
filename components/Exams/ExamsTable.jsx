"use client";
import React, { useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  Eye,
  FileText,
  Trash2,
  Users,
} from "lucide-react";
import Button from "../atoms/Button";
import { useRouter } from "next/navigation";

export default function ExamsTable({
  filteredExams = [],
  statusColors = {},
  difficultyColors = {},
  setSearchTerm,
  onView,
  onEdit,
  onDelete,
}) {
  const router = useRouter();

  // Sorting
  const [sortBy, setSortBy] = useState("title"); // default column
  const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"

  const sortedExams = useMemo(() => {
    const data = [...filteredExams];
    data.sort((a, b) => {
      const A = a?.[sortBy];
      const B = b?.[sortBy];

      // Numeric sort if both numbers
      if (typeof A === "number" && typeof B === "number") {
        return sortDir === "asc" ? A - B : B - A;
      }

      // Fallback to string compare (Arabic aware)
      const sA = (A ?? "").toString();
      const sB = (B ?? "").toString();
      return sortDir === "asc"
        ? sA.localeCompare(sB, "ar")
        : sB.localeCompare(sA, "ar");
    });
    return data;
  }, [filteredExams, sortBy, sortDir]);

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }) =>
    sortBy === col ? (
      sortDir === "asc" ? (
        <ChevronUp className="w-4 h-4 inline-block" />
      ) : (
        <ChevronDown className="w-4 h-4 inline-block" />
      )
    ) : null;

  const handleView = (exam) => {
    if (onView) onView(exam);
    else router.push(`/exams/${exam.id}`);
  };

  const handleEdit = (exam) => {
    onEdit?.(exam);
  };

  const handleDelete = (exam) => {
    onDelete?.(exam);
  };

  return (
    <div dir="rtl" className="w-full">
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr className="[&>th]:py-3 [&>th]:px-3 text-right">
                <th
                  onClick={() => toggleSort("title")}
                  className="cursor-pointer select-none whitespace-nowrap"
                >
                  العنوان <SortIcon col="title" />
                </th>
                <th
                  onClick={() => toggleSort("subject")}
                  className="cursor-pointer select-none whitespace-nowrap"
                >
                  المادة <SortIcon col="subject" />
                </th>
                <th className="whitespace-nowrap">الحالة</th>
                <th
                  onClick={() => toggleSort("difficulty")}
                  className="cursor-pointer select-none whitespace-nowrap"
                >
                  الصعوبة <SortIcon col="difficulty" />
                </th>
                <th
                  onClick={() => toggleSort("questions")}
                  className="cursor-pointer select-none whitespace-nowrap text-center"
                >
                  الأسئلة <SortIcon col="questions" />
                </th>
                <th
                  onClick={() => toggleSort("duration")}
                  className="cursor-pointer select-none whitespace-nowrap text-center"
                >
                  المدة (دقيقة) <SortIcon col="duration" />
                </th>
                
                <th className="text-center whitespace-nowrap">إجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {sortedExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  {/* Title + description */}
                  <td className="py-3 px-3 align-top">
                    <div className="font-semibold text-gray-900">
                      {exam.title}
                    </div>
                    {exam.description ? (
                      <div className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                        {exam.description}
                      </div>
                    ) : null}
                  </td>

                  {/* Subject */}
                  <td className="py-3 px-3 align-top">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
                      {exam.subject || "—"}
                    </span>
                  </td>

                  {/* Questions */}
                  <td className="py-3 px-3 align-top text-center">
                    <div className="flex flex-col items-center">
                      <FileText className="w-4 h-4 text-gray-400 mb-0.5" />
                      <span className="font-semibold text-gray-900">
                        {exam.questions}
                      </span>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-3 align-top text-center">
                    <div className="flex flex-col items-center">
                      <Clock className="w-4 h-4 text-gray-400 mb-0.5" />
                      <span className="font-semibold text-gray-900">
                        {exam.duration}
                      </span>
                    </div>
                  </td>

                  {/* Participants */}
                  <td className="py-3 px-3 align-top text-center">
                    <div className="flex flex-col items-center">
                      <Users className="w-4 h-4 text-gray-400 mb-0.5" />
                      <span className="font-semibold text-gray-900">
                        {exam.participants}
                      </span>
                    </div>
                  </td>

                  {/* Last modified */}
                  <td className="py-3 px-3 align-top">
                    <div className="inline-flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3.5 h-3.5" />
                      {exam.lastModified}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 align-top">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => router.push(`/exams/${exam?.id}`)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border text-gray-600 hover:bg-gray-50"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(exam)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border text-blue-600 hover:bg-blue-50 border-blue-200"
                        title="تعديل"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exam)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border text-red-600 hover:bg-red-50 border-red-200"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {sortedExams.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12">
                    <div className="text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl p-12 bg-gray-50">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        لا توجد اختبارات
                      </h3>
                      <p className="text-gray-500 mb-4">
                        لم يتم العثور على اختبارات مطابقة لمعايير البحث
                      </p>
                      {setSearchTerm && (
                        <Button
                          onClick={() => setSearchTerm("")}
                          type="secondary"
                        >
                          مسح البحث
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
