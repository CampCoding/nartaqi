import React from "react";

const ProgressBar = ({ current, total, label }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-medium">
        {current}/{total}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{
          width: `${Math.min((current / Math.max(total, 1)) * 100, 100)}%`,
        }}
      />
    </div>
  </div>
);

export default ProgressBar;
