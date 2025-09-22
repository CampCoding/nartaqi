import React from "react";
import dynamic from "next/dynamic";

// SSR-safe import for ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EssayQuestions({ modalAnswer, setModalAnswer }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">الإجابة النموذجية</label>
      <ReactQuill
        value={modalAnswer}
        onChange={(value) => setModalAnswer(value)}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ direction: "rtl" }, { align: [] }],
            ["link", "clean"],
          ],
        }}
        formats={["header", "bold", "italic", "underline", "strike", "list", "bullet", "direction", "align", "link"]}
        placeholder="أدخل الإجابة النموذجية هنا..."
      />
    </div>
  );
}
