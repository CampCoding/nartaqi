"use client";

import React from "react";
import NextLink from "next/link";

export default function PreserveSubjectLink({ href, children, ...props }) {
  let finalHref = href;

  if (typeof href === "string") {
    // No need to handle search params anymore
    finalHref = href;
  } else if (href && typeof href === "object") {
    finalHref = {
      ...href,
      query: {
        ...(href.query || {}),
      },
    };
  }

  return (
    <NextLink href={finalHref} {...props}>
      {children}
    </NextLink>
  );
}
