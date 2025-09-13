"use client";
import { Save, Trash2, X } from "lucide-react";
import { useState } from "react";

function EditCertificateModal({ initial, onClose, onSave }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [issueDate, setIssueDate] = useState(initial?.issueDate || "");
  const [thumbUrl, setThumbUrl] = useState(initial?.thumbnailUrl || "");

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setThumbUrl(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !issueDate) return;

    onSave({
      ...initial,
      title,
      issueDate,
      thumbnailUrl: thumbUrl,
    });
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
          <h3 className="text-xl font-bold text-gray-800">تعديل الشهادة</h3>
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
              صورة الشهادة
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="rounded-xl border border-gray-300 px-4 py-2"
              />
              {thumbUrl && (
                <button
                  type="button"
                  onClick={() => setThumbUrl("")}
                  className="px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                >
                  إزالة الصورة
                </button>
              )}
            </div>
            {thumbUrl && (
              <img
                src={thumbUrl}
                alt="preview"
                className="mt-2 w-28 h-20 object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => {
              onClose();
              }}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
              إلغاء
            </button>

            <div className="flex items-center gap-3">
            
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg"
              >
                <Save size={16} /> حفظ التعديلات
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCertificateModal;
