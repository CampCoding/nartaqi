import React from "react";
import Card from "../atoms/Card";
import { BookOpen, Eye, FileText, Users, Video } from "lucide-react";
import StatsCard from "./../ui/StatsCard";
import LineMatchingGame from "../drafts/Connect.draft";
import WordArrangementPuzzle from "../drafts/Drag.draft";

const TopicsStats = ({ topics }) => {
  const totalQuestions = topics.reduce((sum, units) => sum + units.questions, 0);
  const totalVideos = topics.reduce((sum, units) => sum + units.videos, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <StatsCard icon={BookOpen} value={topics.length} label={"الدروس"} />
      <StatsCard
        icon={FileText}
        value={totalQuestions}
        label={"إجمالي الأسئلة"}
      />
    
    </div>
  );
};

export default TopicsStats;
