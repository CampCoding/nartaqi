import React, { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import CustomModal from "../../layout/Modal";

const DeleteBookModal = ({ open, setOpen, rowData }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Implement your deletion logic here, e.g., API call
      // await deleteSubject(selectedSubject.id);
      // Close the modal after successful deletion
      setOpen(false);
    } catch (error) {
      // Handle error (e.g., show a notification)
      console.error("فشل حذف الكتاب:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      isOpen={!!open}
      onClose={() => setOpen(false)}
      title="حذف الكتاب"
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-900">هل أنت متأكد؟</h4>
            <p className="text-sm text-red-700">
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">الكتاب الذي سيتم حذفه:</p>
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
            onClick={handleDelete}
            disabled={loading}
            className={`px-4 py-2 ${
              loading ? "bg-gray-400" : "bg-red-600"
            } text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2`}
          >
            {loading ? (
              "جاري الحذف..."
            ) : (
              <>
                <Trash2 className="w-4 h-4" /> حذف 
              </>
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteBookModal;
