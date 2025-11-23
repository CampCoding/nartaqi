import React, { useState } from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import CustomModal from "../../layout/Modal";
import { useDispatch, useSelector } from "react-redux";
import { handleShowHideBlog, handleGetAllBlogs } from "@/lib/features/blogSlice";
import { toast } from "react-toastify";

const ShowHideModal = ({ open, setOpen, rowData }) => {
  const dispatch = useDispatch();
  const { show_hide_blog_loading } = useSelector((state) => state?.blogs);

  // Determine if blog is currently shown or hidden
  // Adjust this based on your API response structure (could be status, is_visible, etc.)
  const isVisible = rowData?.hidden == 1 || rowData?.is_visible === 1 || rowData?.is_visible === true;

  const handleToggle = async () => {
    try {
      const blogId = open?.id || rowData?.id;
      if (!blogId) {
        toast.error("معرف المدونة غير موجود");
        return;
      }

      const res = await dispatch(
        handleShowHideBlog({
          body: {
            id: blogId,
            hidden : rowData?.hidden ? 0 : 1
          },
        })
      ).unwrap();

      if (res?.data?.status === "success") {
        toast.success(res?.data?.message || "تم التحديث بنجاح");
        dispatch(handleGetAllBlogs());
        setOpen(null);
      } else {
        toast.error(res?.data?.message || "حدث خطأ أثناء التحديث");
      }
    } catch (error) {
      console.error("فشل تحديث حالة المدونة:", error);
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  return (
    <CustomModal
      isOpen={!!open}
      onClose={() => setOpen(null)}
      title={!isVisible ? "إخفاء المدونة" : "إظهار المدونة"}
      size="sm"
    >
      <div className="space-y-4">
        <div
          className={`flex items-center gap-3 p-4 border rounded-lg ${
            !isVisible
              ? "bg-orange-50 border-orange-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          {!isVisible ? (
            <EyeOff className="w-6 h-6 text-orange-600 flex-shrink-0" />
          ) : (
            <Eye className="w-6 h-6 text-green-600 flex-shrink-0" />
          )}
          <div>
            <h4 className={`font-medium ${!isVisible ? "text-orange-900" : "text-green-900"}`}>
              هل أنت متأكد؟
            </h4>
            <p className={`text-sm ${!isVisible ? "text-orange-700" : "text-green-700"}`}>
              {!isVisible
                ? "سيتم إخفاء هذه المدونة عن المستخدمين."
                : "سيتم إظهار هذه المدونة للمستخدمين."}
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">المدونة:</p>
          <p className="font-medium text-[#202938]">{rowData?.title}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setOpen(null)}
            className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleToggle}
            disabled={show_hide_blog_loading}
            className={`px-4 py-2 ${
              show_hide_blog_loading
                ? "bg-gray-400"
                : !isVisible
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white rounded-lg transition-colors flex items-center gap-2`}
          >
            {show_hide_blog_loading ? (
              "جاري التحديث..."
            ) : (
              <>
                {!isVisible ? (
                  <>
                    <EyeOff className="w-4 h-4" /> إخفاء
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" /> إظهار
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ShowHideModal;

