import React from "react";
import Card from "../atoms/Card";
import { BookOpen, Eye, FileText, Users } from "lucide-react";
import StatsCard from "../ui/StatsCard";

const SubjectsStats = ({ subjects }) => {
  const totalStudents = subjects.reduce(
    (sum, subject) => sum + subject.students,
    0
  );
  const totalQuestions = subjects.reduce(
    (sum, subject) => sum + subject.questions,
    0
  );
  const activeSubjects = subjects.filter((s) => s.status === "active").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <StatsCard
        icon={BookOpen}
        value={subjects.length}
        label={"إجمالي المواد"}
      />
      <StatsCard icon={Users} value={totalStudents} label={"إجمالي الطلاب"} />
      <StatsCard
        icon={FileText}
        value={totalQuestions}
        label={"إجمالي الأسئلة"}
      />
      <StatsCard icon={Eye} value={activeSubjects} label={"المواد النشطة"} />
    </div>
  );
};

export default SubjectsStats;
