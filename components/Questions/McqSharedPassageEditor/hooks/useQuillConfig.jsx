"use client";

import { useMemo } from "react";

export default function useQuillConfig({ allowImages = true, onImageRequest } = {}) {
  const modules = useMemo(() => {
    const toolbar = [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }, { direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      ["link", "blockquote", "code-block", "clean"],
    ];
    // if (allowImages) toolbar.push(["image"]);

    return {
      toolbar: toolbar,
      // toolbar: allowImages
      //   ? {
      //       container: toolbar,
      //       handlers: { image: () => typeof onImageRequest === "function" && onImageRequest() },
      //     }
      //   : toolbar,
      clipboard: { matchVisual: false },
      history: { delay: 500, maxStack: 200, userOnly: true },
    };
  }, []);

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "script",
      "list",
      "bullet",
      "align",
      "direction",
      "color",
      "background",
      "link",
      "blockquote",
      "code-block",
      ...([]),
    ],
    []
  );

  return { modules, formats };
}
