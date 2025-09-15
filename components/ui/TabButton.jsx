const TabButton = ({ id, setActiveTab , activeTab, icon: Icon, children, count }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`group relative px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 flex items-center gap-3 min-w-fit
        ${
          activeTab === id
            ? "bg-gradient-to-r from-[#3B82F6]  to-[#F97316]   text-white shadow-lg scale-105"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
        }`}
  >
    <Icon size={18} />
    {children}
    {typeof count === "number" && (
      <span
        className={`px-2 py-1 rounded-full text-xs font-bold ${
          activeTab === id
            ? "bg-white/20 text-white"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

export default TabButton;
