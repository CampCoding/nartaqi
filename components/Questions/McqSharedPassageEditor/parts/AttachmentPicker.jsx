"use client";

import React, { useRef } from "react";
import { Paperclip } from "lucide-react";

export default function AttachmentPicker({
  label = "مرفقات",
  files = [],
  onAddFiles,
  onRemoveFile,
  accept = "application/pdf,image/*",
  multiple = true,
}) {
  const inputRef = useRef(null);
  const handlePick = () => inputRef.current?.click();
  const handleChange = (e) => {
    const list = Array.from(e.target.files || []);
    if (list.length && onAddFiles) onAddFiles(list);
    e.target.value = "";
  };
  const isImage = (f) => (f?.type || "").startsWith("image/");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        <button
          type="button"
          onClick={handlePick}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-gray-50"
        >
          <Paperclip className="h-4 w-4" /> اختر ملفات
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {!!files?.length && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-lg border bg-white p-2">
              {isImage(f) ? (
                <img src={URL.createObjectURL(f)} alt={f.name} className="h-20 w-28 rounded-md object-cover" />
              ) : (
                <div className="flex h-20 w-28 items-center justify-center rounded-md bg-gray-100 p-2 text-center text-[11px] text-gray-600">
                  {f.type === "application/pdf" ? "PDF" : "ملف"}
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemoveFile?.(idx)}
                className="absolute right-1 top-1 hidden rounded bg-red-600 px-1.5 py-0.5 text-[10px] text-white group-hover:block"
              >
                حذف
              </button>
              <div className="mt-1 w-28 truncate text-[11px] text-gray-700" title={f.name}>
                {f.name}
              </div>
            </div>
          ))}
        </div>
      )}
      {!files?.length && <p className="text-xs text-gray-500">مسموح: صور وملفات PDF</p>}
    </div>
  );
}
