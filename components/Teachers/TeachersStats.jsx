import React from "react";
import { User, CheckCheck, Clock, XCircle } from "lucide-react";
import StatsCard from "./../ui/StatsCard";

const TeacherStats = ({ topics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" dir="rtl">
      <StatsCard icon={User} value={5} label="إجمالي المعلمين" />
      <StatsCard icon={CheckCheck} value={2} label="المعتمدون" />
      <StatsCard icon={Clock} value={2} label="قيد المراجعة" />
      <StatsCard icon={XCircle} value={1} label="المرفوضون" />
    </div>
  );
};

export default TeacherStats;
