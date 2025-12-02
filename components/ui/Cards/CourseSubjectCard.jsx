"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Edit, Trash2, Copy } from "lucide-react";
import { Modal, Typography, Button } from "antd";
import { ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

const CourseSourceSubjectCard = ({
  subject,
  course_type = "egyptian",
  buttonStyle = "dropdown", // "dropdown" | "normal"
  showActions = true,
  onEdit,
  onDelete,
  onDuplicate,
  onRequestDuplicate,
}) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ state for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    console.log(subject);
  }, [subject]);

  const goToCourse = () => {
    if (course_type === "egyptian") {
      router.push(`/egyptian_course/${subject?.code}`);
    } else {
      router.push(`/subjects/${subject?.code}/units`);
    }
  };

  const handleEdit = (e) => {
    e?.stopPropagation?.();
    setShowDropdown(false);
    router.push(`/teachers-courses/edit/${subject?.code}`);
    onEdit?.(subject);
  };

  // ✅ open modal instead of deleting directly
  const openDeleteModal = (e) => {
    e?.stopPropagation?.();
    setShowDropdown(false);
    setIsDeleteModalOpen(true);
  };

  // ✅ confirm delete inside modal
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      // لو onDelete بترجع Promise (مثلاً dispatch thunk) نستنى
      await onDelete?.(subject);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicateNewCourse = (e) => {
    e?.stopPropagation?.();
    setShowDropdown(false);
    onRequestDuplicate?.(subject, "new");
  };

  const handleDuplicateExisting = (e) => {
    e?.stopPropagation?.();
    setShowDropdown(false);
    onRequestDuplicate?.(subject, "existing");
  };

  const modalFooter = (
    <div className="flex justify-start space-x-2 space-x-reverse pt-4">
      <Button
        key="submit"
        type="primary"
        danger
        onClick={handleConfirmDelete}
        loading={isDeleting}
        className="rounded-md px-6"
        icon={<DeleteOutlined />}
      >
        حذف نهائي
      </Button>
      <Button
        key="back"
        onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
        disabled={isDeleting}
        className="rounded-md px-6"
      >
        إلغاء
      </Button>
    </div>
  );

  return (
    <div
      dir="rtl"
      className="w-full rounded-[30px] p-[2px] bg-gradient-to-b from-[#3B82F6] to-[#F97316] relative"
    >
      {/* أزرار الإجراءات */}
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
                  <button
                    onClick={handleEdit}
                    className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={14} className="text-blue-600" />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={openDeleteModal}
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
                onClick={openDeleteModal}
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
            backgroundImage: `url('${subject?.image_url || ""}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="px-4 py-2 absolute top-4 right-4 bg-blue-500 rounded-[10px] inline-flex items-center gap-[7px]">
            <div className="text-white text-[10px] font-medium">
              يبدأ: {subject?.start_date?.split("T")[0]}
            </div>
            <div className="text-white text-[10px] font-medium">
              ينتهي: {subject?.end_date?.split("T")[0]}
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
                {subject?.course_categories?.name || "غير مصنف"}
              </div>
            </div>
            <div className="px-9 py-2 bg-blue-500/25 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-500">
              <div className="text-zinc-600 text-xs font-medium">
                {course_type === "teachers" ? "معلمين" : "طلاب"}
              </div>
            </div>
          </div>

          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex items-center gap-[5px]">
              {subject?.capacity && (
                <span className="text-text text-xs font-medium">
                  المقاعد : {subject?.capacity ?? "-"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-[5px]">
              <img
                className="w-6 h-6 rounded-xl"
                src={subject?.teacher?.image_url}
                alt="instructor"
              />
              <div className="text-text text-[10px] font-medium">
                المدرس: {subject?.teacher?.name || "—"}
              </div>
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

      {/* ✅ Delete Modal */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => !isDeleting && setIsDeleteModalOpen(false)}
        footer={modalFooter}
        centered
        title={
          <span style={{ color: "#faad14" }}>
            <ExclamationCircleOutlined style={{ marginLeft: 8 }} /> تأكيد الحذف
          </span>
        }
        wrapClassName="rtl-modal-wrap"
        style={{ direction: "rtl" }}
      >
        <div className="flex flex-col gap-4 mt-4 text-right">
          <Text strong style={{ fontSize: "1.1rem" }} className="text-gray-800">
            هل أنت متأكد من حذف الدورة: <Text mark>{subject?.name}</Text>؟
          </Text>
          <Text type="danger" style={{ fontSize: "0.95rem" }}>
            **تحذير:** لا يمكن التراجع عن هذا الإجراء. سيتم فقدان جميع الدروس
            والفيديوهات المتعلقة بهذا المحتوى.
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default CourseSourceSubjectCard;
