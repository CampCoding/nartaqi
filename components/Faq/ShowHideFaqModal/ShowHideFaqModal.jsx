import React from "react";
import CustomModal from "../../layout/Modal";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { handleShowHideFaq, handleGetAllFaqs } from "@/lib/features/faqSlice";
import { message } from "antd";

const ShowHideFaqModal = ({ open, setOpen, rowData }) => {
  const dispatch = useDispatch();
  const { show_hide_faq_loading } = useSelector((state) => state?.faq);
  const isHidden = Boolean(rowData?.hidden);

  const handleClose = () => {
    setOpen({ open: false, question: null });
  };

  const handleToggle = async () => {
    if (!rowData?.id) {
      message.error("لا يمكن تحديد السؤال");
      return;
    }

    const payload = {
      id: rowData.id,
      hidden: isHidden ? 0 : 1,
    };

    try {
      const res = await dispatch(handleShowHideFaq({ body: payload })).unwrap();
      if (res?.data?.status === "success") {
        message.success(res?.data?.message || "تم تحديث حالة السؤال");
        dispatch(handleGetAllFaqs());
        handleClose();
      } else {
        message.error(res?.data?.message || "حدث خطأ أثناء التحديث");
      }
    } catch (error) {
      console.error("Failed to toggle FAQ visibility:", error);
      message.error("حدث خطأ أثناء التحديث");
    }
  };

  return (
    <CustomModal
      isOpen={!!open}
      onClose={handleClose}
      title={isHidden ? "إظهار السؤال" : "إخفاء السؤال"}
      size="sm"
    >
      <div className="space-y-4">
        <div
          className={`flex items-center gap-3 p-4 rounded-lg border ${
            isHidden
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-orange-50 border-orange-200 text-orange-800"
          }`}
        >
          {isHidden ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          <div>
            <h4 className="font-semibold">{isHidden ? "سيتم إظهار السؤال للمستخدمين" : "سيتم إخفاء السؤال عن المستخدمين"}</h4>
            <p className="text-sm text-gray-600">{rowData?.text}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleToggle}
            disabled={show_hide_faq_loading}
            className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 ${
              show_hide_faq_loading
                ? "bg-gray-400"
                : isHidden
                ? "bg-green-600 hover:bg-green-700"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {show_hide_faq_loading ? "جاري التحديث..." : isHidden ? "إظهار" : "إخفاء"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ShowHideFaqModal;







