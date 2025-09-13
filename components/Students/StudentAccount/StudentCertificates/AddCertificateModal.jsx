"use client";
import { Save, X } from "lucide-react";
import React, { useState } from "react";

function AddCertificateModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [thumbUrl, setThumbUrl] = useState("");

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setThumbUrl(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !issueDate) return;

    const newId = Math.max(0, ...certificates.map((c) => c.id)) + 1;
    const newCert = {
      id: newId,
      title, // اسم الشهادة
      courseTitle: "", // اختياري
      issueDate, // تاريخ الإنجاز
      grade: "جيد", // افتراضي
      gradePercentage: 80, // افتراضي
      instructorName: "", // اختياري
      pdfUrl: "#", // اختياري
      certificateId: `CERT-CUST-${Date.now()}`,
      category: "أخرى",
      duration: "—",
      skills: [],
      verified: false,
      shareableLink: "",
      thumbnailUrl: thumbUrl, // الصورة
    };

    onSave(newCert);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">إضافة شهادة جديدة</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم / عنوان الشهادة *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="مثال: شهادة إتمام دورة كذا"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تاريخ الإنجاز *
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              صورة الشهادة (اختياري)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full rounded-xl border border-gray-300 px-4 py-2"
            />
            {thumbUrl && (
              <img
                src={thumbUrl}
                alt="preview"
                className="mt-2 w-28 h-20 object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg"
            >
              <Save size={16} /> حفظ الشهادة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCertificateModal;
