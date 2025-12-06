import React from "react";
import { questionTypes } from "./utils";

const QuestionTypeSelector = ({ questionType , colorMap, onTypeChange }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {questionTypes.map((type) => {
      const Icon = type.icon;
      const isSelected = questionType === type.id;
      const palette = colorMap[type.color];

      return (
        <button
          key={type.id}
          onClick={() => onTypeChange(type.id)}
          className={`p-4 rounded-xl border-2 transition-all duration-200 text-center group ${
            isSelected
              ? palette.cardSelected
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Icon
            className={`h-6 w-6 mx-auto mb-2 ${
              isSelected
                ? palette.icon
                : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
          <p className="text-sm font-medium">{type.label}</p>
        </button>
      );
    })}
  </div>
);

export default QuestionTypeSelector;
