"use client";

import { useEffect, useRef } from "react";
import useMathliveArabicSetupOnce from "../hooks/useMathliveArabicSetupOnce";
import MathKeyboardTheme from "./MathKeyboardTheme";
import html2canvas from "html2canvas";

/** Simple wrapper for the <math-field> web component with RTL + onfocus keyboard */
export default function MathFieldInput({
  value = "",
  onChange,
  className = "",
  placeholder = "أدخل المعادلة (LaTeX)…",
  options = { virtualKeyboardMode: "onfocus" },
}) {
  useMathliveArabicSetupOnce();
  const fieldRef = useRef(null);
  const captureRef = useRef(null);

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    el.setAttribute("dir", "rtl");
    el.style.textAlign = "right";
    if (placeholder) el.setAttribute("aria-label", placeholder);
    if (options?.virtualKeyboardMode)
      el.setAttribute("virtual-keyboard-mode", options.virtualKeyboardMode);

    const handleInput = (e) => onChange?.(e?.target?.value ?? "");
    const handleFocus = () => {
      try {
        el.executeCommand?.("showVirtualKeyboard");
      } catch {}
    };
    el.addEventListener("input", handleInput);
    el.addEventListener("focus", handleFocus);
    return () => {
      el.removeEventListener("input", handleInput);
      el.removeEventListener("focus", handleFocus);
    };
  }, [onChange, placeholder, options?.virtualKeyboardMode]);

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    if (String(el.value || "") !== String(value || "")) {
      el.value = value || "";
    }
  }, [value]);

  const handleDownloadImage = async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "equation.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to capture equation image:", err);
    }
  };

  return (
    <>
      {/* <MathKeyboardTheme /> */}

      <div className="flex flex-col gap-2">
        {/* الجزء اللي هيتاخد منه سكرين للصورة */}
        <div
          ref={captureRef}
          className="inline-block bg-white px-3 py-2 rounded-md"
          style={{ direction: "rtl" }}
        >
          <math-field
            ref={fieldRef}
            dir="rtl"
            style={{
              fontSize: "14px",
              minHeight: "48px",
              border: "1px solid #555",
              borderRadius: "4px",
              width: "100%",
              textAlign: "right",
            }}
            class={className}
          />
        </div>

        {/* الزرار بتاع تحميل الصورة */}
        <button
          type="button"
          onClick={handleDownloadImage}
          className="self-start rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          تحميل المعادلة كصورة
        </button>
      </div>
    </>
  );
}
