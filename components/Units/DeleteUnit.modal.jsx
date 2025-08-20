import React from "react";
import CustomModal from "../layout/Modal";
import { AlertTriangle, Trash2 } from "lucide-react";

const DeleteUnitModal = ({ open, setOpne, data }) => {
  return (
    <CustomModal
      isOpen={open}
      onClose={() => setOpne(null)}
      title="حذف مرحلة"
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
          <p className="text-sm text-gray-600 mb-2">المرحلة التي سيتم حذفها:</p>
          <p className="font-medium text-[#202938]">{data?.name}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setOpne(null)}
            className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={() => null}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            حذف المرحلة
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteUnitModal;
