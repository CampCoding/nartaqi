"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Edit, Trash2, Copy, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllCoursesCategories } from "../../../lib/features/categoriesSlice";
import { Badge } from "antd";

const CourseSourceSubjectCard = ({
  subject,
  course_type = "egyptian",
  buttonStyle = "dropdown", // "dropdown" | "normal"
  showActions = true,
  onEdit,
  onDelete,
  onDuplicate,
  onRequestDuplicate, // يفتح مودال النسخ في الأب
  onActive, // يستدعي مودال التفعيل في الأب
  page,
  page_size
}) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();

  const { all_courses_categories_list } = useSelector(
    (state) => state?.categories
  );
  const [currentCategory, setCurrentCategory] = useState({});

  useEffect(() => {
    dispatch(handleGetAllCoursesCategories());
  }, [dispatch]);

  useEffect(() => {
    setCurrentCategory(
      all_courses_categories_list?.data?.message?.data?.find(
        (item) => item?.id == subject?.course_category_id
      )
    );
  }, [all_courses_categories_list, subject?.course_category_id]);

  const goToCourse = () => {
    router.push(`/subjects/${subject?.id}/units`);
  };

  const handleEdit = (e) => {
    e?.stopPropagation?.();
    setShowDropdown(false);
    router.push(`/saudi_source_course/edit/${subject?.id}?page=${page}&pageSize=${page_size}`);
    onEdit?.(subject);
  };

  const handleDelete = (e) => {
    e?.stopPropagation?.();
    setShowDropdown(false);
    onDelete?.(subject);
  };

  const handleDuplicateNewCourse = (e) => {
    e?.stopPropagation?.();
    setShowDropdown(false);
    onRequestDuplicate?.(subject, "new");
  };

  const startDate = subject?.start_date
    ? subject.start_date.split("T")[0]
    : "";
  const endDate = subject?.end_date ? subject.end_date.split("T")[0] : "";

  // ✅ determine active state from subject.active
  const isActive =
    subject?.active === "1" ||
    subject?.active === 1 ||
    subject?.active === true;

  const {teachers_loading , teachers_list} = useSelector(state => state?.teachers)
  const [selectedTeacher , setSelectedTeacher] = useState({});


  

  return (
    <div
      dir="rtl"
      className="w-full rounded-[30px] p-[2px] bg-gradient-to-b from-[#3B82F6] to-[#F97316] relative"
    >
      {showActions && (
        <div
          className="absolute top-4 left-4 z-10"
          onClick={(e) => e.stopPropagation()}
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
                  {/* تفعيل / إلغاء تفعيل – يفتح مودال في الأب */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
                      onActive?.(subject);
                    }}
                    className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    {isActive ? (
                      <EyeOff size={14} className="text-emerald-600" />
                    ) : (
                      <Eye size={14} className="text-emerald-600" />
                    )}
                    <span>{isActive ? "غير نشط" : "نشط"}</span>
                  </button>

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
                    onClick={() => router.push(`/round_content?id=${subject?.id}`)}
                    className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={14} className="text-blue-600" />
                    <span>تعديل المحتوي</span>
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
            <div className="flex gap-2">
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

      <div
        onClick={goToCourse}
        className="bg-white cursor-pointer pb-8 h-full rounded-[28px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start gap-2"
      >
        <div
          className="self-stretch h-48 pt-[24px] px-[16px] relative bg-black/25 rounded-tl-[20px] rounded-tr-[20px] overflow-hidden"
          style={{
            backgroundImage: `url('${subject?.image_url || ""}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* فترة البداية والنهاية */}
          <div className="px-4 py-2 absolute top-4 right-4 bg-blue-500 rounded-[10px] inline-flex items-center gap-[7px]">
            <div className="text-white text-[10px] font-medium">
              يبدأ: {startDate}
            </div>
            <div className="text-white text-[10px] font-medium">
              ينتهي: {endDate}
            </div>
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
              <div className="text-text text-xs font-medium">
                {currentCategory?.name || "غير مصنف"}
              </div>
            </div>
            <div className="px-9 py-2 bg-blue-500/25 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-500">
              <div className="text-zinc-600 text-xs font-medium">
                {subject?.gender}
              </div>
            </div>
          </div>

          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-[5px]">
              <div className="text-text text-[10px] font-medium">
                المقاعد: {subject?.capacity || "—"}
              </div>
            </div>

            <div className="flex items-center gap-[5px]">
             {subject?.teachers[0]?.image &&  <img
                className="w-6 h-6 rounded-xl"
                src={subject?.teachers[0]?.image}
                alt="instructor"
              />}
              <div className="text-text text-[10px] font-medium">
                المدرس: {subject?.teachers[0]?.name || "—"}
              </div>

              {subject?.teachers?.length > 1 && <div className="w-7 h-7 !text-sm font-bold rounded-full flex justify-center items-center bg-orange-400/50 text-orange-600">
                  {subject?.teachers?.length - 1}+
                </div>}
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
