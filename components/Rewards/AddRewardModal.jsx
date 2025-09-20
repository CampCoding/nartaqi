import { Modal } from "antd";
import { Camera } from "lucide-react";
import React from "react";

export default function AddRewardModal({
  addForm,
  submitAdd,
  addOpen,
  setAddOpen,
  setAddForm,
  CATEGORY_OPTIONS,
  LEVEL_OPTIONS,
  handleImageUpload,
}) {
  return (
    <Modal
      isOpen={addOpen}
      onClose={() => setAddOpen(false)}
      title="إضافة مكافأة جديدة"
      onSubmit={submitAdd}
      submitText="إضافة المكافأة"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم المكافأة
          </label>
          <input
            type="text"
            value={addForm.name}
            onChange={(e) =>
              setAddForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="أدخل اسم المكافأة"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الفئة
            </label>
            <select
              value={addForm.category}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">اختر الفئة</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المستوى
            </label>
            <select
              value={addForm.level}
              onChange={(e) =>
                setAddForm((prev) => ({ ...prev, level: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">اختر المستوى</option>
              {LEVEL_OPTIONS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عدد النقاط المطلوبة
          </label>
          <input
            type="number"
            value={addForm.points}
            onChange={(e) =>
              setAddForm((prev) => ({ ...prev, points: e.target.value }))
            }
            placeholder="0"
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صورة المكافأة
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "add")}
              className="hidden"
              id="add-image"
            />
            <label
              htmlFor="add-image"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50"
            >
              {addForm.image ? (
                <img
                  src={addForm.image}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <>
                  <Camera className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-gray-600">اضغط لاختيار صورة</p>
                </>
              )}
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}
