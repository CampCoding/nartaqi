"use client";

import { useEffect, useRef } from "react";
import useMathliveArabicSetupOnce from "../hooks/useMathliveArabicSetupOnce";
import MathKeyboardTheme from "./MathKeyboardTheme";

/** Simple wrapper for the <math-field> web component with RTL + onfocus keyboard */
export default function MathFieldInput({
  value = "",
  onChange,
  className = "",
  placeholder = "أدخل المعادلة (LaTeX)…",
  options = { virtualKeyboardMode: "onfocus" },
}) {
  useMathliveArabicSetupOnce();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute("dir", "rtl");
    el.style.textAlign = "right";
    if (placeholder) el.setAttribute("aria-label", placeholder);
    if (options?.virtualKeyboardMode) el.setAttribute("virtual-keyboard-mode", options.virtualKeyboardMode);

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
    const el = ref.current;
    if (!el) return;
    if (String(el.value || "") !== String(value || "")) el.value = value || "";
  }, [value]);

  return (
    <>
      {/* <MathKeyboardTheme />fontSize={11} keyHeight={56} keyPaddingV={12} keyPaddingH={14} /> */}

      <math-field
        ref={ref}
        dir="rtl"
        style={{ fontSize: "14px", minHeight: "48px",border:"1px solid #555",borderRadius :"4px", width: "100%", textAlign: "right" }}
        class={className}
      />
    </>
  );
}
