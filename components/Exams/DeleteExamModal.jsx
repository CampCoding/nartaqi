import React, { useState } from "react";
import { AlertTriangle, Trash2, UserRoundSearchIcon } from "lucide-react";
import CustomModal from "../layout/Modal";
import { handleDeleteExam, handleGetAllExams } from "../../lib/features/examSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllRoundContent } from "../../lib/features/roundContentSlice";
import { toast } from "react-toastify";

const DeleteExamModal = ({  open, setOpen, rowData, selectedExam, round_id  , page , per_page}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { delete_exam_loading } = useSelector(state => state?.exam)
  function handleDelete() {
     console.log(open?.exam?.id);
    const data_send = {
      id: open?.exam?.id || open?.id || selectedExam?.id,
    }

    dispatch(handleDeleteExam({ body: data_send }))
      .unwrap()
      .then(res => {
        if (res?.data?.status == "success") {
          toast.success(res?.data?.message || "تم حذف الاختبار بنجاح");
          dispatch(handleGetAllExams({page , per_page : 6}))
          dispatch(handleGetAllRoundContent({ body: { round_id } }))
          setOpen(false);
        } else {
          toast.error(res?.error?.response?.data?.message || "هناك خطأ أثناء حذف الاختبار");
        }
      }).catch(e => console.log(e))
      .finally(() => setOpen(false))
  }

  return (
    <CustomModal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="حذف الاختبار"
      size="sm"
    >
      <div className="space-y-4" dir="rtl">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-900">هل أنت متأكد؟</h4>
            <p className="text-sm text-red-700">
              سيتم حذف الاختبار نهائياً ولا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            الاختبار المراد حذفه:
          </p>
          <p className="font-medium text-[#202938] mb-1">
            { open?.title || selectedExam?.title}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={() => {
              // TODO: delete logic
              handleDelete()
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            {delete_exam_loading ? "جاري الحذف...." : <div className="flex gap-2 items-center">
              <Trash2 className="w-4 h-4" />
              حذف الاختبار</div>}
          </button>
        </div>
      </div>
    </CustomModal>
  )
};

export default DeleteExamModal;
