import React from "react";
import Button from "../atoms/Button";
import { PlusIcon, Trash2 } from "lucide-react";
import Input from "../atoms/Input";
import McqOptions from "./McqOptions";
import { makeBlankQuestion } from "./utils";

export default function GeneralMcqQuestions({ state, updateAll }) {
  /* ======== General Questions (independent) ======== */
  const addQuestion = () =>
    updateAll({
      ...state,
      questions: [...state?.questions, makeBlankQuestion()],
    });

  const removeQuestion = (qi) =>
    updateAll({
      ...state,
      questions: state?.questions?.filter((_, i) => i !== qi),
    });

  const updateQuestionField = (qi, field, val) => {
    const next = [...state?.questions];
    next[qi] = { ...next[qi], [field]: val };
    updateAll({ ...state, questions: next });
  };

  const addOption = (qi) => {
    const next = [...state?.questions];
    next[qi].options.push({ text: "", explanation: "", isCorrect: false });
    updateAll({ ...state, questions: next });
  };

  const removeOption = (qi, oi) => {
    const next = [...state?.questions];
    if (next[qi].options.length <= 2) return;
    next[qi].options.splice(oi, 1);
    updateAll({ ...state, questions: next });
  };

  const updateOption = (qi, oi, field, val) => {
    const next = [...state?.questions];
    next[qi].options[oi] = { ...next[qi].options[oi], [field]: val };
    updateAll({ ...state, questions: next });
  };

  const toggleCorrect = (qi, oi) => {
    const next = [...state?.questions];
    const allowMulti = next[qi].allowMultipleCorrect;
    if (allowMulti) {
      next[qi].options[oi].isCorrect = !next[qi].options[oi].isCorrect;
    } else {
      next[qi].options = next[qi].options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === oi,
      }));
    }
    updateAll({ ...state, questions: next });
  };
  return (
    <>
      {state?.questions?.map((q, qi) => (
        <div
          key={q.id}
          className="border rounded-xl p-4 bg-white shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">سؤال {qi + 1}</h3>
            {state?.questions?.length > 1 && (
              <Button
                type="button"
                onClick={() => removeQuestion(qi)}
                className="text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> حذف السؤال
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#202938]">
              نص السؤال
            </label>
            <Input
              placeholder="اكتب نص السؤال..."
              value={q.text}
              onChange={(e) => updateQuestionField(qi, "text", e.target.value)}
            />

            <McqOptions
              questionType="mcq"
              options={q.options}
              allowMultipleCorrect={q.allowMultipleCorrect}
              updateOption={(oi, field, val) =>
                updateOption(qi, oi, field, val)
              }
              toggleCorrect={(oi) => toggleCorrect(qi, oi)}
              addOption={() => addOption(qi)}
              removeOption={(oi) => removeOption(qi, oi)}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={addQuestion}
        className="mt-2 inline-flex items-center gap-2"
      >
        <PlusIcon className="w-4 h-4" />
        إضافة سؤال جديد
      </Button>
    </>
  );
}
