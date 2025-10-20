"use client";

import { useEffect } from "react";
import "mathlive"; // JS only. Put CSS in app/globals.css (see note at bottom).

export default function useMathliveArabicSetupOnce() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__ML_AR_SETUP_DONE__) return;
    window.__ML_AR_SETUP_DONE__ = true;

    try {
      document?.documentElement?.setAttribute("dir", "rtl");
      document?.documentElement?.setAttribute("lang", "ar");

      if (window.MathfieldElement) {
        const MFE = window.MathfieldElement;
        MFE.locale = "ar";
        MFE.decimalSeparator = ",";
        MFE.fractionNavigationOrder = "denominator-numerator";
        MFE.strings = {
          ...MFE.strings,
          ar: {
            "tooltip.undo": "تراجع",
            "tooltip.redo": "إعادة",
            "tooltip.copy": "نسخ",
            "tooltip.paste": "لصق",
            "tooltip.cut": "قص",
            "tooltip.selectAll": "تحديد الكل",
            "tooltip.virtualKeyboard": "لوحة المفاتيح",
            "tooltip.hideKeypad": "إخفاء اللوحة",
            "menu.settings": "الإعدادات",
            "menu.math": "رياضيات",
            "menu.text": "نص",
          },
        };
      }

      const kb = window.mathVirtualKeyboard;
      if (kb) {
        try {
          kb.setKeycap?.("[.]", { label: "،", insert: "{,}" });
          kb.setKeycap?.("[,]", { label: "٬", insert: "{,}" });
        } catch {}

        kb.layouts = [
          {
            label: "١٢٣",
            id: "numeric-ar",
            rows: [
              ["١", "٢", "٣", "+", "−", "×", "÷", "="],
              ["٤", "٥", "٦", "(", ")", "[", "]", "%"],
              ["٧", "٨", "٩", "،", ".", ",", "^"],
              ["٠", "[backspace]", "[hide-keyboard]"],
            ],
          },
          {
            label: "رموز",
            id: "symbols-ar",
            rows: [
              [
                { latex: "+", label: "جمع" },
                { latex: "−", label: "طرح" },
                { latex: "×", label: "ضرب" },
                { latex: "÷", label: "قسمة" },
                { latex: "=", label: "يساوي" },
                { latex: "≈", label: "تقريب" },
                { latex: "≠", label: "لا يساوي" },
              ],
              [
                { latex: "(", label: "(" },
                { latex: ")", label: ")" },
                { latex: "[", label: "[" },
                { latex: "]", label: "]" },
                { latex: "{", label: "{" },
                { latex: "}", label: "}" },
              ],
              [
                { latex: "\\pi", label: "π" },
                { latex: "\\sqrt{#0}", label: "جذر", insert: "\\sqrt{#0}" },
                { latex: "\\frac{#0}{#?}", label: "كسر", insert: "\\frac{#0}{#?}" },
                { latex: "\\int", label: "تكامل" },
                { latex: "\\sum", label: "مجموع" },
                { latex: "\\infty", label: "مالانهاية" },
              ],
              [
                { latex: "\\log", label: "لوغاريتم", class: "vk-log" },
                { latex: "\\ln", label: "لوغاريتم طبيعي", class: "vk-log" },
                { latex: "\\log_{#0}{#?}", label: "لوغاريتم أساس", insert: "\\log_{#0}{#?}", class: "vk-log" },
                { latex: "e^{#0}", label: "س^رقم", insert: "e^{#0}", class: "vk-log" },
              ],
              [
                { latex: "ax^{2}+bx+c=0", label: "معادلة تربيعية", insert: "ax^{2}+bx+c=0", class: "vk-log" },
                { latex: "y=mx+b", label: "معادلة خطية", insert: "y=mx+b", class: "vk-log" },
              ],
              ["[space]", "[backspace]", "[hide-keyboard]"],
            ],
          },
          {
            label: "AR",
            id: "arabic",
            rows: [
              ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"],
              ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط"],
              ["ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ"],
              ["[hide-keyboard]", "[space]", "[backspace]"],
            ],
          },
        ];

        // kb.zIndex = 99999; // keep on top
        // kb.floating = false;
        // kb.overlay = false;
      }
    } catch {}
  }, []);
}
