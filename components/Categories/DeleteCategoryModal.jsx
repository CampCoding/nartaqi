import { Modal } from "antd";
import React from "react";
import Button from "../atoms/Button";
import { X } from "lucide-react";

export default function DeleteCategoryModal({
  deleteModal,
  selectedCategory,
  cancelDelete,
  confirmDelete,
  confirmLoading,
}) {
  return (
    <Modal
      title="تأكيد الحذف"
      open={deleteModal}
      onCancel={cancelDelete}
      footer={[
        <Button key="cancel" type="secondary" onClick={cancelDelete}>
          إلغاء
        </Button>,
        <Button
          key="delete"
          type="danger"
          loading={confirmLoading}
          onClick={confirmDelete}
        >
          حذف
        </Button>,
      ]}
      closeIcon={<X className="w-5 h-5" />}
    >
      <div className="py-4">
        <p className="text-gray-600">
          هل أنت متأكد من أنك تريد حذف الفئة "{selectedCategory?.title}"؟
        </p>
        <p className="text-sm text-gray-500 mt-2">
          لا يمكن التراجع عن هذا الإجراء.
        </p>
      </div>
    </Modal>
  );
}
