import { Save, X } from "lucide-react";
import React from "react";

export default function ExamSectionAddNewModal({
  setNewModal,
  setForm,
  resetForm,
  editing,
  tabs,
  form,
  onSave,
  error
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          setNewModal(false);
          resetForm();
        }}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {editing ? "تعديل القسم" : "إضافة قسم جديد"}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {editing
                ? "قم بتعديل بيانات القسم"
                : "أضف قسماً جديداً إلى النظام"}
            </p>
          </div>
          <button
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => {
              setNewModal(false);
              resetForm();
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              الفئة <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = form?.category === tab.id;
                return (
                  <button
                    key={tab?.id}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, category: tab.id }))}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `border-${tab.color}-200 bg-gradient-to-r from-${tab.color}-50 to-${tab.color}-100 text-${tab.color}-700`
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-right flex-1">
                      <div className="font-semibold">{tab.title}</div>
                      <div className="text-xs opacity-75">
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                اسم القسم <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                placeholder="مثال: أساسيات البرمجة"
                value={form?.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الوصف
              </label>
              <textarea
                rows={4}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all resize-none"
                placeholder="وصف مختصر عن محتوى القسم..."
                value={form?.desc}
                onChange={(e) =>
                  setForm((p) => ({ ...p, desc: e.target.value }))
                }
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="text-red-800 text-sm font-medium">{error}</div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => {
              setNewModal(false);
              resetForm();
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            إلغاء
          </button>
          <button
            onClick={onSave}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editing ? "حفظ التعديل" : "حفظ القسم"}
          </button>
        </div>
      </div>
    </div>
  );
}
