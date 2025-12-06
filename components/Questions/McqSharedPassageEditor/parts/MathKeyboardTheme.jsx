"use client";

import { useEffect } from "react";
export default function MathKeyboardTheme({
  fontSize = 11,
  keyHeight = 48,
  keyPaddingV = 8, // Reduced vertical padding for better fit
  keyPaddingH = 8, // Reduced horizontal padding
  keyGap = 6,     // Reduced gap for compactness
}) {
  useEffect(() => {
    const STYLE_ID = "ml-keyboard-theme";
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
:root {
  --vk-bg: #f8fafc;
  --vk-key-bg: #fff;
  --vk-key-border: #e5e7eb;
  --vk-key-shadow: 0 1px 0 rgba(0,0,0,.03), 0 2px 8px rgba(0,0,0,.06);
  --vk-key-radius: 8px; /* Slightly smaller radius */
  --vk-key-gap: ${keyGap}px;
  --vk-font: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Noto Sans Arabic", "Tajawal", "Cairo", sans-serif;
  --vk-z: 1000; /* Reduced z-index to avoid excessive overlap */
  --vk-font-size: ${fontSize}px;
  --vk-key-minh: ${keyHeight}px;
  --vk-key-pv: ${keyPaddingV}px;
  --vk-key-ph: ${keyPaddingH}px;
}

/* الجذر */
math-virtual-keyboard,
.ML__keyboard,
.ML__virtual-keyboard {
 
  border-top: 1px solid #e5e7eb !important;
  box-shadow: 0 -10px 30px rgba(0,0,0,.08) !important;
  font-family: var(--vk-font) !important;
}

/* صفوف ومباعدات */
math-virtual-keyboard .rows,
.ML__keyboard .rows,
.ML__virtual-keyboard .rows {
  padding: 8px 8px calc(8px + env(safe-area-inset-bottom, 0)) !important;
  display: grid !important;
  gap: var(--vk-key-gap) !important;
}
math-virtual-keyboard .row,
.ML__keyboard .row,
.ML__virtual-keyboard .row {
  display: grid !important;
  grid-auto-flow: column !important;
  gap: var(--vk-key-gap) !important;
  align-items: center !important;
}

/* الأزرار */
math-virtual-keyboard button,
math-virtual-keyboard .keycap,
math-virtual-keyboard .key,
.ML__keyboard button,
.ML__keyboard .keycap,
.ML__virtual-keyboard .keycap,
.ML__keyboard .key,
.ML__virtual-keyboard .key {
  border: 1px solid var(--vk-key-border) !important;
  border-radius: var(--vk-key-radius) !important;
  padding: var(--vk-key-pv) var(--vk-key-ph) !important;
  font-size: var(--vk-font-size) !important;
  line-height: 1.2 !important; /* Adjusted for better text fit */
  box-shadow: var(--vk-key-shadow) !important;
  color: #0f172a !important;
  width: auto; /* Removed fixed width to fit content */
  min-width: 100px; /* Minimum width to ensure usability */
}

/* شريط التبويبات */
math-virtual-keyboard .tabbar,
.ML__keyboard .tabbar,
.ML__virtual-keyboard .tabbar {
  background: #fff !important;
  border-bottom: 1px solid #e5e7eb !important;
  padding: 4px 8px !important;
}
math-virtual-keyboard .tabbar .tab,
.ML__keyboard .tabbar .tab,
.ML__virtual-keyboard .tabbar .tab {
  border-radius: 999px !important;
  padding: 4px 8px !important;
  margin-inline: 2px !important;
  border: 1px solid #e5e7eb !important;
  background: #fff !important;
  font-size: 12px !important;
}
math-virtual-keyboard .tabbar .tab[aria-selected="true"],
.ML__keyboard .tabbar .tab[aria-selected="true"],
.ML__virtual-keyboard .tabbar .tab[aria-selected="true"] {
}

/* مفاتيح خاصة */
math-virtual-keyboard .key[data-key="[space]"],
.ML__keyboard .key[data-key="[space]"] {
  grid-column: span 3 !important;
}
math-virtual-keyboard .key[data-key="[backspace]"],
math-virtual-keyboard .key[data-key="[hide-keyboard]"],
.ML__keyboard .key[data-key="[backspace]"],
.ML__keyboard .key[data-key="[hide-keyboard]"] {
  color: #fff !important;
  border-color: #0f172a !important;
  min-width: 60px; /* Adjusted for special keys */
}

/* ديسكتوب: تمركز وتدوير أعلى */
@media (min-width: 1024px) {
  math-virtual-keyboard,
  .ML__keyboard,
  .ML__virtual-keyboard {
    max-width: 800px !important; /* Reduced max-width */
    border-radius: 12px 12px 0 0 !important;
  }
}
`;
  }, [fontSize, keyHeight, keyPaddingV, keyPaddingH, keyGap]);

  return null;
}