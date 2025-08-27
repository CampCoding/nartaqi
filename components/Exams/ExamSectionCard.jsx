import React from "react";
const SectionCard = ({
  title,
  icon: Icon,
  children,
  extra,
  className = "",
}) => (
  <div
    className={`rounded-3xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
  >
    <div className="flex items-center justify-between border-b bg-gradient-to-r from-gray-50 to-white px-6 py-5 rounded-t-3xl">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 p-2">
            <Icon className="w-5 h-5 text-teal-600" />
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      {extra}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default SectionCard;
