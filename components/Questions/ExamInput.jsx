import { AlertCircle } from "lucide-react";

const Input = ({ label, error, icon: Icon, className = "", ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700">{label}</label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <input
        className={`w-full px-3 py-3 ${
          Icon ? "pl-10" : ""
        } border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
            : ""
        } ${className}`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {error}
      </p>
    )}
  </div>
);

export default Input;
