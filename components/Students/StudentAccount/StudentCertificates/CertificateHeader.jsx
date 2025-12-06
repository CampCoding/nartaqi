import { Grid, List, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllCertificates } from "../../../../lib/features/certificateSlice";

export default function CertificateHeader({
  certificates,
  setIsAdding,
  setViewMode,
  viewMode,
}) {
  

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          شهاداتي المعتمدة
        </h2>
        <p className="text-gray-600">
          مجموعة الشهادات والإنجازات الأكاديمية ({certificates.length} شهادة)
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Add new */}
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium"
        >
          <Plus size={16} />
          إضافة شهادة
        </button>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
