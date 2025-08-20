import React from "react";
import { BookOpen, Eye, FileText, Users, Video, Star, MessageSquare } from "lucide-react";
import StatsCard from "./../ui/StatsCard";

const UnitsStats = ({ units }) => {
  const totalStudents = units.reduce((sum, unit) => sum + unit.students, 0);
  const totalQuestions = units.reduce((sum, unit) => sum + unit.questions, 0);
  const totalVideos = units.reduce((sum, unit) => sum + unit.videos, 0);

  // new
  const totalRatings = units.reduce((sum, unit) => sum + (unit.ratings || 0), 0);
  const totalComments = units.reduce((sum, unit) => sum + (unit.comments || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6" dir="rtl">
      <StatsCard
        icon={BookOpen}
        value={units.length}
        label={"مراحل الدورة"}
      />
      <StatsCard icon={Users} value={totalStudents} label={"إجمالي الطلاب"} />
      <StatsCard
        icon={FileText}
        value={totalQuestions}
        label={"إجمالي الأسئلة"}
      />
      <StatsCard icon={Star} value={totalRatings} label={"إجمالي التقييمات"} />
      <StatsCard icon={MessageSquare} value={totalComments} label={"إجمالي التعليقات"} />
    </div>
  );
};

export default UnitsStats;
