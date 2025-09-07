"use client";
import {
  Calendar,
  ClipboardPen,
  Clock,
  Delete,
  Edit,
  Edit3,
  Eye,
  FileText,
  MoreVertical,
  Trash,
  Trash2,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import Button from "../atoms/Button";
import EditNewExamModal from "./EditNewExamModal";
import { useRouter } from "next/navigation";
import { Dropdown } from "antd";

export default function ExamsGrid({
  openMenuFor,
  setOpenMenuFor,
  setSearchTerm,
  filteredExams,
  statusColors,
  difficultyColors,
  onView,
  onEdit,
  onDelete,
}) {
  const [editModal, setEditModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const router = useRouter();

  // single handler used by each card’s Dropdown (bound with exam)
  const handleMenuClick = (key, exam, domEvent) => {
    // prevent summary/card handlers
    domEvent?.stopPropagation();

    if (key === "view") {
      if (onView) onView(exam);
      else router.push(`/exams/${exam.id}`);
    } else if (key === "edit") {
      if (onEdit) onEdit(exam);
      else {
        setSelectedExam(exam);
        setEditModal(true);
      }
    } else if (key === "delete") {
      onDelete?.(exam);
    }
    // close this menu
    setOpenMenuFor(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredExams.map((exam) => {
        const items = [
          {
            key: "view",
            label: (
              <div className="flex items-center justify-between gap-2">
                <span>عرض</span>
                <Eye className="w-4 h-4 text-gray-500" />
              </div>
            ),
          },
          { type: "divider" },
          {
            key: "edit",
            label: (
              <div className="flex items-center justify-between gap-2">
                <span>تعديل</span>
                <Edit3 className="w-4 h-4 text-gray-500" />
              </div>
            ),
          },
          {
            key: "delete",
            label: (
              <div className="flex items-center justify-between gap-2 text-red-600">
                <span>حذف</span>
                <Trash2 className="w-4 h-4" />
              </div>
            ),
            danger: true,
          },
        ];

        return (
          <div
            // onClick={() => router.push(`/exams/${exam?.id}`)}
            key={exam.id}
            className="bg-white relative shadow-sm rounded-2xl border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 overflow-hidden group"
          >
            {/* Decorations */}
            <div className="absolute top-3 right-6 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-70" />
            <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-blue-400 animate-ping opacity-80" />
            <div className="absolute w-14 h-14 rounded-full bg-teal-500/40 top-0 -right-5 blur-3xl" />
            <div className="absolute w-14 h-14 rounded-full bg-indigo-500/40 bottom-0 -left-5 blur-3xl" />

            <div className="p-6 pb-4 relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{exam.description}</p>
                </div>
              </div>

              {/* Status & Subject */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                  {exam.subject}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-4">
                <div>
                  <div className="flex items-center justify-center text-gray-400 mb-1">
                    <FileText className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {exam.questions}
                  </p>
                  <p className="text-xs text-gray-500">سؤال</p>
                </div>
                <div>
                  <div className="flex items-center justify-center text-gray-400 mb-1">
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {exam.duration}
                  </p>
                  <p className="text-xs text-gray-500">دقيقة</p>
                </div>
                <div>
                  <div className="flex items-center justify-center text-gray-400 mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {exam.participants}
                  </p>
                  <p className="text-xs text-gray-500">مشارك</p>
                </div>
              </div>

              {/* Last Modified */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {exam.lastModified}
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => {
                      onEdit(exam);
                    }}
                    className="w-10 h-10 rounded-xl p-2 flex justify-center items-center bg-green-100/30 text-green-500"
                  >
                    <ClipboardPen size={20} />
                  </button>

                  <button
                    onClick={() => onDelete(exam)}
                    className="w-10 h-10 rounded-xl p-2 flex justify-center items-center bg-red-100/30 text-red-500"
                  >
                    <Trash size={20} />
                  </button>

                  <button onClick={() => router.push(`/exams/${exam?.id}`)} 
                    className="w-10 h-10 rounded-xl p-2 flex justify-center items-center bg-blue-100/30 text-blue-500"
                    >
                    <Eye size={20}/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {filteredExams.length === 0 && (
        <div className="col-span-full">
          <div className="text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl p-12 bg-gray-50">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              لا توجد اختبارات
            </h3>
            <p className="text-gray-500 mb-4">
              لم يتم العثور على اختبارات مطابقة لمعايير البحث
            </p>
            <Button onClick={() => setSearchTerm("")} type="secondary">
              مسح البحث
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
