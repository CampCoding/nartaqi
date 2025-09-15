import { PlusIcon, Trash2 } from "lucide-react";
import React from "react";
import Button from "../atoms/Button";
import McqOptions from "./McqOptions";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import { makeBlankQuestion, makeBlankTextPassage } from "./utils";

export default function PassageMcqQuestions({ state, updateAll }) {
  /* ======== Text Passages (multiple) ======== */
  const addTextPassage = () =>
    updateAll({
      ...state,
      textPassages: [...state.textPassages, makeBlankTextPassage()],
    });

  const removeTextPassage = (tpi) => {
    const next = [...state.textPassages];
    next.splice(tpi, 1);
    updateAll({ ...state, textPassages: next });
  };

  const setTextPassage = (tpi, text) => {
    const next = [...state.textPassages];
    next[tpi] = { ...next[tpi], text };
    updateAll({ ...state, textPassages: next });
  };

  const addTPQuestion = (tpi) => {
    const next = [...state.textPassages];
    next[tpi].questions.push(makeBlankQuestion());
    updateAll({ ...state, textPassages: next });
  };

  const removeTPQuestion = (tpi, qi) => {
    const next = [...state.textPassages];
    next[tpi].questions.splice(qi, 1);
    if (!next[tpi].questions.length)
      next[tpi].questions.push(makeBlankQuestion());
    updateAll({ ...state, textPassages: next });
  };

  const updateTPQuestionField = (tpi, qi, field, val) => {
    const next = [...state.textPassages];
    next[tpi].questions[qi] = { ...next[tpi].questions[qi], [field]: val };
    updateAll({ ...state, textPassages: next });
  };

  const addTPOption = (tpi, qi) => {
    const next = [...state.textPassages];
    next[tpi].questions[qi].options.push({
      text: "",
      explanation: "",
      isCorrect: false,
    });
    updateAll({ ...state, textPassages: next });
  };

  const removeTPOption = (tpi, qi, oi) => {
    const next = [...state.textPassages];
    if (next[tpi].questions[qi].options.length <= 2) return;
    next[tpi].questions[qi].options.splice(oi, 1);
    updateAll({ ...state, textPassages: next });
  };

  const updateTPOption = (tpi, qi, oi, field, val) => {
    const next = [...state.textPassages];
    next[tpi].questions[qi].options[oi] = {
      ...next[tpi].questions[qi].options[oi],
      [field]: val,
    };
    updateAll({ ...state, textPassages: next });
  };

  const toggleTPCorrect = (tpi, qi, oi) => {
    const next = [...state.textPassages];
    const allowMulti = next[tpi].questions[qi].allowMultipleCorrect;
    if (allowMulti) {
      next[tpi].questions[qi].options[oi].isCorrect =
        !next[tpi].questions[qi].options[oi].isCorrect;
    } else {
      next[tpi].questions[qi].options = next[tpi].questions[qi].options.map(
        (opt, idx) => ({
          ...opt,
          isCorrect: idx === oi,
        })
      );
    }
    updateAll({ ...state, textPassages: next });
  };

  return (
    <div className="space-y-5">
      {state.textPassages.map((tp, tpi) => (
        <div key={tp.id} className="rounded-xl border p-4 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">قطعة {tpi + 1}</h3>
            <Button
              type="button"
              onClick={() => removeTextPassage(tpi)}
              className="text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> حذف القطعة
            </Button>
          </div>

          <TextArea
            label="نص القطعة"
            placeholder="أدخل نص القطعة هنا..."
            rows={5}
            value={tp.text}
            onChange={(e) => setTextPassage(tpi, e.target.value)}
          />

          {/* Questions inside this passage */}
          <div className="space-y-4">
            {tp.questions.map((q, qi) => (
              <div
                key={q.id}
                className="border rounded-lg p-3 bg-gray-50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">
                    سؤال {qi + 1} داخل القطعة
                  </h4>
                  {tp.questions.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeTPQuestion(tpi, qi)}
                      className="text-red-600 hover:bg-red-100 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> حذف السؤال
                    </Button>
                  )}
                </div>

                <Input
                  placeholder="اكتب نص السؤال..."
                  value={q.text}
                  onChange={(e) =>
                    updateTPQuestionField(tpi, qi, "text", e.target.value)
                  }
                />

                <McqOptions
                  questionType="mcq"
                  options={q.options}
                  allowMultipleCorrect={q.allowMultipleCorrect}
                  updateOption={(oi, field, val) =>
                    updateTPOption(tpi, qi, oi, field, val)
                  }
                  toggleCorrect={(oi) => toggleTPCorrect(tpi, qi, oi)}
                  addOption={() => addTPOption(tpi, qi)}
                  removeOption={(oi) => removeTPOption(tpi, qi, oi)}
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addTPQuestion(tpi)}
              className="inline-flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              إضافة سؤال داخل القطعة
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={addTextPassage}
        className="inline-flex items-center gap-2"
      >
        <PlusIcon className="w-4 h-4" />
        إضافة قطعة جديدة
      </Button>
    </div>
  );
}
