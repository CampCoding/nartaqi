import React from "react";
import dynamic from "next/dynamic";
import Button from "../atoms/Button";

// SSR-safe import for ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function TrueFalseQuestions({
  trueFalseExplanation,
  trueFalseAnswer,
  setTrueFalseAnswer,
  setTrueFalseExplanation,
}) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        الإجابة الصحيحة
      </label>
      <div className="grid grid-cols-2 gap-3">
        <Button
          className={`${trueFalseAnswer ? "!bg-green-600 text-white" : ""}`}
          variant={trueFalseAnswer === true ? "success" : "outline"}
          onClick={() => setTrueFalseAnswer(true)}
        >
          صحيح
        </Button>
        <Button
          className={`${trueFalseAnswer ? "" : "!bg-red-500 text-white"}`}
          variant={trueFalseAnswer === false ? "danger" : "outline"}
          onClick={() => setTrueFalseAnswer(false)}
        >
          خطأ
        </Button>
      </div>

      <label className="block text-sm font-medium text-gray-700 mt-4">
        شرح الإجابة (اختياري)
      </label>
      <ReactQuill
        value={trueFalseExplanation}
        onChange={(value) => setTrueFalseExplanation(value)}
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
        placeholder="أدخل شرح الإجابة"
      />
    </div>
  );
}
