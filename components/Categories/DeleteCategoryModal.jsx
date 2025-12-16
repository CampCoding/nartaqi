import { Modal } from "antd";
import React from "react";
import Button from "../atoms/Button";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { handleDeleteCategory, handleGetAllCoursesCategories } from "../../lib/features/categoriesSlice";
import { toast } from "react-toastify";

export default function DeleteCategoryModal({
  deleteModal,
  selectedCategory,
  cancelDelete,
  confirmDelete,
  confirmLoading,
  per_page , 
  page
}) {
  const dispatch = useDispatch();
  const {delete_course_category_loading} = useSelector(state => state?.categories);

  function handleSubmit() {
    console.log(selectedCategory)
    const formData = new FormData();
    formData.append("id" , selectedCategory?.id)
    dispatch(handleDeleteCategory({body : formData}))
    .unwrap()
    .then(res => {
      console.log(res)
      if(res?.data?.status == "success") {
        cancelDelete();
        toast.success(res?.data?.message);
        dispatch(handleGetAllCoursesCategories({per_page}))
      }else {
         toast.error(res?.error?.response?.data?.message || "هناك خطأ اثناء حذف  الفئة")
      }
    }).catch(e => console.log(e))
  }

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
          loading={delete_course_category_loading}
          onClick={handleSubmit}
        >
          {delete_course_category_loading ? "جاري الحذف....." : "حذف"}
        </Button>,
      ]}
      closeIcon={<X className="w-5 h-5" />}
    >
      <div className="py-4">
        <p className="text-gray-600">
          هل أنت متأكد من أنك تريد حذف الفئة "{selectedCategory?.name}"؟
        </p>
        <p className="text-sm text-gray-500 mt-2">
          لا يمكن التراجع عن هذا الإجراء.
        </p>
      </div>
    </Modal>
  );
}
