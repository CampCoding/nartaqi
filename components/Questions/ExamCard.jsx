import React from 'react'

const Card = ({ title, children, className = "", icon: Icon, actions }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-5 w-5 text-gray-600" />}
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default Card;