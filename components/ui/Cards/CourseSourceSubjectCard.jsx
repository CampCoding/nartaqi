"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Edit, Trash2, Copy } from "lucide-react";

const CourseSourceSubjectCard = ({
  subject,
  course_type = "egyptian",
  buttonStyle = "dropdown", // "dropdown" | "normal"
  showActions = true,
  // من الأب
  onEdit,
  onDelete,
  onDuplicate,               // (اختياري) لو عندك تدفق نسخ إلى دورات موجودة
  onRequestDuplicate,        // ✅ يفتح مودال النسخ في الأب (نمرّر له الـ mode)
}) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const goToCourse = () => {
      router.push(`/subjects/${subject?.code}/units`);
  };

  const handleEdit = (e) => {
    e?.stopPropagation?.();
    setShowDropdown(false);
      router.push(`/saudi_source_course/edit/${subject?.code}`);
    onEdit?.(subject);
  };

  const handleDelete = (e) => {
    e?.stopPropagation?.();
    setShowDropdown(false);
    onDelete?.(subject);
  };

  // ✅ يفتح نفس مودال الصفحة مع وضع "new" (دورة كاملة جديدة)
  const handleDuplicateNewCourse = (e) => {
    e?.stopPropagation?.();
    setShowDropdown(false);
    onRequestDuplicate?.(subject, "new");
  };

  // ✅ يفتح نفس مودال الصفحة مع وضع "existing" (إلى دورات موجودة)
  const handleDuplicateExisting = (e) => {
    e?.stopPropagation?.();
    setShowDropdown(false);
    onRequestDuplicate?.(subject, "existing");
  };

  return (
    <div
      dir="rtl"
      className="w-full rounded-[30px] p-[2px] bg-gradient-to-b from-[#3B82F6] to-[#F97316] relative"
    >
      {/* أزرار الإجراءات */}
      {showActions && (
        <div
          className="absolute top-4 left-4 z-10"
          onClick={(e) => e.stopPropagation()} // لا نسمح بالـ routing عند الضغط على القائمة
        >
          {buttonStyle === "dropdown" ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown((v) => !v)}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center hover:bg-white transition-colors"
                title="خيارات"
              >
                <MoreVertical size={16} className="text-gray-600" />
              </button>

              {showDropdown && (
                <div
                  className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border py-1 min-w-[220px] z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* ✅ يفتح المودال على وضع "دورة كاملة جديدة" */}
                  <button
                    onClick={handleDuplicateNewCourse}
                    className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy size={14} className="text-emerald-600" />
                    <span>نسخ إلى دورة جديدة</span>
                  </button>
                  
                  <button
                    onClick={handleEdit}
                    className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={14} className="text-blue-600" />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // أزرار مباشرة (بدون قائمة)
            <div className="flex gap-2">
              {/* ✅ زر نسخ إلى دورة جديدة */}
              <button
                onClick={handleDuplicateNewCourse}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center hover:bg-white transition-colors"
                title="نسخ إلى دورة جديدة"
              >
                <Copy size={14} className="text-emerald-600" />
              </button>
              
              <button
                onClick={handleEdit}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center hover:bg-white transition-colors"
                title="تعديل"
              >
                <Edit size={14} className="text-blue-600" />
              </button>
              <button
                onClick={handleDelete}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center hover:bg-white transition-colors"
                title="حذف"
              >
                <Trash2 size={14} className="text-red-600" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* جسم البطاقة */}
      <div
        onClick={goToCourse}
        className="bg-white cursor-pointer pb-8 h-full rounded-[28px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start gap-2"
      >
        <div
          className="self-stretch h-48 pt-[24px] px-[16px] relative bg-black/25 rounded-tl-[20px] rounded-tr-[20px] overflow-hidden"
          style={{
            backgroundImage: `url('${subject?.imageUrl || ""}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="px-4 py-2 absolute top-4 right-4 bg-blue-500 rounded-[10px] inline-flex items-center gap-[7px]">
            <div className="text-white text-[10px] font-medium">يبدأ: {subject?.date}</div>
            <div className="text-white text-[10px] font-medium">ينتهي: {subject?.lastUpdated}</div>
          </div>
        </div>

        <div className="self-stretch px-3 flex flex-col justify-start items-start gap-1">
          <div className="self-stretch text-right text-text text-base font-bold">
            {subject?.name}
          </div>
          <div className="self-stretch w-[250px] truncate text-right text-zinc-600 text-sm">
            {subject?.description}
          </div>
        </div>

        <div className="text-black self-stretch p-3 flex flex-col justify-start items-start gap-3">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="px-2.5 py-3 bg-blue-200 rounded-[10px]">
              <div className="text-text text-xs font-medium">{subject?.category || "غير مصنف"}</div>
            </div>
            <div className="px-9 py-2 bg-blue-500/25 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-500">
              <div className="text-zinc-600 text-xs font-medium">
                {course_type === "teachers" ? "معلمين" : "طلاب"}
              </div>
            </div>
          </div>

          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex items-center gap-[5px]">
              <span className="text-text text-xs font-medium">المقاعد : {subject?.capacity ?? "-"}</span>
            </div>
            <div className="flex items-center gap-[5px]">
              <img className="w-6 h-6 rounded-xl" src={"/images/Image-24.png"} alt="instructor" />
              <div className="text-text text-[10px] font-medium">المدرس: {subject?.instructor || "—"}</div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <p className="text-primary text-xl font-bold">السعر :</p>
            <h4 className="text-primary text-xl font-bold">
              <span className="font-mono">{subject?.price ?? "-"}</span> ر.س
            </h4>
          </div>
        </div>
      </div>

      {/* غطاء لإغلاق القائمة عند الضغط خارجها */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-[5]"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default CourseSourceSubjectCard;