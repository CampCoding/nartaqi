"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";

export default function LoadingPage() {
  return (
    <div className="w-full h-[45vh] flex items-center justify-center">
      <DotLottieReact src="/images/SandyLoading.lottie" loop autoplay />
    </div>
  );
}
