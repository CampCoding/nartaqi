import React from "react";

export default function StudentRatingHeader({ data }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">التقييمات</h2>
        <p className="text-gray-600">
          مجموعة التقييمات والتميز الأكاديمي ({data.length} تقييم)
        </p>
      </div>
    </div>
  );
}
