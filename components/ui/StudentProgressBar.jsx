  export const StudentProgressBar = ({ value, color = "teal" }) => (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`h-3 rounded-full transition-all duration-700 ease-out ${
          color === "emerald"
            ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
            : color === "amber"
            ? "bg-gradient-to-r from-amber-400 to-amber-600"
            : color === "blue"
            ? "bg-gradient-to-r from-blue-400 to-blue-600"
            : "bg-gradient-to-r from-teal-400 to-teal-600"
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  );