// utils/quillConfig.js
import { useMemo } from "react";

/**
 * Shared Quill config:
 * - color & background palette
 * - sub/superscript
 * - RTL + align
 * - optional image handler (opens your file picker)
 */
export function useQuillConfig({ allowImages = true, onImageRequest } = {}) {
  return useMemo(() => {
    const toolbar = [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],   // ⬅️ sub/sup
      [{ list: "ordered" }, { list: "bullet" }],
      [{ direction: "rtl" }, { align: [] }],
      [{ color: [] }, { background: [] }],        // ⬅️ color & bg
      ["link", ...(allowImages ? ["image"] : []), "clean"],
    ];

    const modules =
      allowImages && onImageRequest
        ? {
            toolbar: { container: toolbar, handlers: { image: onImageRequest } },
            clipboard: { matchVisual: false },
          }
        : { toolbar, clipboard: { matchVisual: false } };

    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "script",        // ⬅️ enable sub/sup
      "list",
      "bullet",
      "direction",
      "align",
      "color",         // ⬅️ enable text color
      "background",    // ⬅️ enable bg color
      "link",
      ...(allowImages ? ["image"] : []),
    ];

    return { modules, formats };
  }, [allowImages, onImageRequest]);
}
