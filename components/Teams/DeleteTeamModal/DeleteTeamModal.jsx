"use client";
import React, { useState } from "react";
import { AlertTriangle, EyeOff, Eye } from "lucide-react"; // Using Eye and EyeOff icons to represent hide/show
import CustomModal from "../../layout/Modal";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllTeams, handleShowHideTeamMember } from "../../../lib/features/teamSlice";
import { toast } from "react-toastify";

const ShowHideTeamModal = ({ open, setOpen, rowData }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { show_hide_team_loading } = useSelector((state) => state?.team);

  // Handle the action of hiding or showing the team member
  const handleToggleVisibility = async () => {
    const data_send = {
      id: rowData?.id,
      hidden: rowData?.hidden === "1" ? 0 : 1, // Toggle the hidden status
    };

    setLoading(true);
    try {
      const res = await dispatch(handleShowHideTeamMember({ body: data_send })).unwrap();
      console.log(res);
      if(res?.data?.status == 'success') {
        toast.success(res?.data?.message);
        dispatch(handleGetAllTeams())
        setOpen(false); //  Close modal after action
      }
    } catch (error) {
      console.error("Error toggling visibility", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      isOpen={!!open}
      onClose={() => setOpen(false)}
      title={rowData?.hidden === "1" ? "إظهار المستخدم" : "إخفاء المستخدم"} // Dynamic title
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-900">هل أنت متأكد؟</h4>
            <p className="text-sm text-yellow-700">
              هذا الإجراء {rowData?.hidden == "1" ? "سوف يظهر" : "سوف يخفي"} المستخدم.
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">المستخدم الذي سيتم تعديل حالته:</p>
          <p className="font-medium text-[#202938]">{rowData?.name}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setOpen(null)}
            className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleToggleVisibility}
            disabled={loading}
            className={`px-4 py-2 ${loading ? "bg-gray-400" : "bg-yellow-600"} text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2`}
          >
            {loading ? (
              "جاري المعالجة..."
            ) : (
              <>
                {rowData?.hidden == "1" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {rowData?.hidden == "1" ? "إظهار" : "إخفاء"}
              </>
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ShowHideTeamModal;
