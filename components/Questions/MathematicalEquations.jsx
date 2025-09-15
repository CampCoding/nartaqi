"use client";
import React, {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import Button from "../atoms/Button";
import { PlusIcon, Trash2 } from "lucide-react";
import McqOptions from "./McqOptions";
import { makeBlankMathPassage } from "./utils";
const MathField = forwardRef(function MathField(
  { value = "", onChange, options, className },
  refForward
) {
  const ref = useRef(null);

  useImperativeHandle(refForward, () => ref.current, []);

  // Register custom element and wait for upgrade
  useEffect(() => {
    let cancel = false;
    (async () => {
      await import("mathlive"); // registers <math-field>
      if (typeof customElements?.whenDefined === "function") {
        await customElements.whenDefined("math-field");
      }
      if (cancel || !ref.current) return;
      const el = ref.current;

      if (options) {
        if (typeof el.setOptions === "function") el.setOptions(options);
        else Object.assign(el, options);
      }
      if (value !== undefined) {
        if (typeof el.setValue === "function")
          el.setValue(value, { silenceNotifications: true });
        else el.value = value;
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  // Keep options in sync
  useEffect(() => {
    const el = ref.current;
    if (!el || !options) return;
    if (typeof el.setOptions === "function") el.setOptions(options);
    else Object.assign(el, options);
  }, [options]);

  // Keep value in sync
  useEffect(() => {
    const el = ref.current;
    if (!el || value === undefined) return;
    if (el.value !== value) {
      if (typeof el.setValue === "function")
        el.setValue(value, { silenceNotifications: true });
      else el.value = value;
    }
  }, [value]);

  // Emit input changes
  useEffect(() => {
    const el = ref.current;
    if (!el || !onChange) return;
    const handler = (ev) => onChange(ev.target.value);
    el.addEventListener("input", handler);
    return () => el.removeEventListener("input", handler);
  }, [onChange]);

  return <math-field ref={ref} className={`${className} !w-full`} />;
});

export default function MathematicalEquations({ updateAll, state }) {
  const mathRefs = useRef({});
  /* ======== Math Passages (multiple) ======== */
  const addMathPassage = () =>
    updateAll({
      ...state,
      mathPassages: [...state?.mathPassages, makeBlankMathPassage()],
    });

  const removeMathPassage = (mpi) => {
    const next = [...state?.mathPassages];
    next.splice(mpi, 1);
    updateAll({
      ...state,
      mathPassages: next.length ? next : [makeBlankMathPassage()],
    });
  };

  const setMathLatex = (mpi, latex) => {
    const next = [...state?.mathPassages];
    next[mpi] = { ...next[mpi], latex };
    updateAll({ ...state, mathPassages: next });
  };

  const setAllowMultipleCorrectMath = (mpi, checked) => {
    const next = [...state?.mathPassages];
    next[mpi] = { ...next[mpi], allowMultipleCorrect: checked };
    updateAll({ ...state, mathPassages: next });
  };

  const addMathOption = (mpi) => {
    const next = [...state?.mathPassages];
    next[mpi].answers.push({ text: "", explanation: "", isCorrect: false });
    updateAll({ ...state, mathPassages: next });
  };

  const removeMathOption = (mpi, oi) => {
    const next = [...state?.mathPassages];
    if (next[mpi].answers.length <= 2) return; // keep min 2
    next[mpi].answers.splice(oi, 1);
    updateAll({ ...state, mathPassages: next });
  };

  const updateMathOption = (mpi, oi, field, val) => {
    const next = [...state?.mathPassages];
    next[mpi].answers[oi] = { ...next[mpi].answers[oi], [field]: val };
    updateAll({ ...state, mathPassages: next });
  };

  const toggleMathCorrect = (mpi, oi) => {
    const next = [...state?.mathPassages];
    const allowMulti = next[mpi].allowMultipleCorrect;
    if (allowMulti) {
      next[mpi].answers[oi].isCorrect = !next[mpi].answers[oi].isCorrect;
    } else {
      next[mpi].answers = next[mpi].answers.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === oi,
      }));
    }
    updateAll({ ...state, mathPassages: next });
  };

  const toggleVK = (id) => {
    const el = mathRefs.current[id];
    el?.executeCommand?.("toggleVirtualKeyboard");
  };
  const hideVK = (id) => {
    const el = mathRefs.current[id];
    el?.executeCommand?.("hideVirtualKeyboard");
  };

  return (
    <div className="space-y-5">
      {state?.mathPassages?.map((mp, mpi) => (
        <div key={mp.id} className="rounded-xl border p-4 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">معادلة {mpi + 1}</h3>
            {state?.mathPassages.length > 1 && (
              <Button
                type="button"
                onClick={() => removeMathPassage(mpi)}
                className="text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> حذف المعادلة
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#202938]">
              LaTeX
            </label>
            <MathField
              ref={(el) => {
                if (el) mathRefs.current[mp.id] = el;
              }}
              value={mp.latex}
              onChange={(latex) => setMathLatex(mpi, latex)}
              options={{
                mathVirtualKeyboardPolicy: "manual",
                smartMode: true,
                smartFence: true,
              }}
              className="border rounded p-3"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => toggleVK(mp.id)}
                className="text-xs"
              >
                إظهار/إخفاء لوحة المفاتيح
              </Button>
              <Button
                type="button"
                onClick={() => hideVK(mp.id)}
                className="text-xs"
              >
                إغلاق اللوحة
              </Button>
            </div>
          </div>

          <McqOptions
            questionType="mcq"
            options={mp.answers}
            allowMultipleCorrect={!!mp.allowMultipleCorrect}
            updateOption={(oi, field, val) =>
              updateMathOption(mpi, oi, field, val)
            }
            toggleCorrect={(oi) => toggleMathCorrect(mpi, oi)}
            addOption={() => addMathOption(mpi)}
            removeOption={(oi) => removeMathOption(mpi, oi)}
          />
        </div>
      ))}

      <Button
        type="button"
        onClick={addMathPassage}
        className="inline-flex items-center gap-2"
      >
        <PlusIcon className="w-4 h-4" />
        إضافة معادلة جديدة
      </Button>
    </div>
  );
}
