import { useState } from "react";
// Mock framer-motion for this environment - in a real app you'd import from 'framer-motion'
const motion = {
  div: ({
    children,
    className,
    initial,
    animate,
    transition,
    whileHover,
    whileTap,
    layoutId,
    ...props
  }) => (
    <div
      className={`${className} transition-all duration-300 ${
        whileHover ? "hover:scale-105" : ""
      }`}
      {...props}
    >
      {children}
    </div>
  ),
  button: ({ children, className, whileHover, whileTap, ...props }) => (
    <button
      className={`${className} transition-all duration-300 transform hover:scale-105`}
      {...props}
    >
      {children}
    </button>
  ),
  span: ({ children, className, layoutId, ...props }) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
};

const AnimatePresence = ({ children }) => children;

export default function HorizontalTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
   
  console.log(activeTab , tabs[activeTab]);
  return (
    <div className="overflow-hidden">
      {/* Tab Navigation */}
      <motion.div
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-white/40 mb-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-2 overflow-x-auto scrollbar-hide relative">
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 whitespace-nowrap min-w-fit relative ${
                  isActive
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-xl`
                    : "text-gray-600 hover:bg-white/70 hover:text-gray-800"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.span
                    className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-2xl`}
                    layoutId="activeTab"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <motion.div className="relative z-10 flex items-center gap-3">
                  <IconComponent
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? "scale-110" : ""
                    }`}
                  />
                  <span className="font-medium">{tab.label}</span>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        className="backdrop-blur-xl rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {tabs[activeTab]?.content}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Floating Decorative Elements */}
      <motion.div
        className="fixed top-20 left-10 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 blur-sm"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed bottom-20 right-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 blur-sm"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="fixed top-1/2 right-20 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 blur-sm"
        animate={{
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}
