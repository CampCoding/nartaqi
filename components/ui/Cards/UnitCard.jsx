"use client";
import React from "react";
import {
  BookOpen,
  Calendar,
  CircleQuestionMark,
  Edit3,
  FileText,
  HelpCircle,
  Settings,
  Trash2,
  TrendingUp,
  Video,
} from "lucide-react";
import Link from "next/link";
import Button from "../../atoms/Button";
import PreserveSubjectLink from "../../PreserveSubjectLink";
import { useRouter } from "next/navigation";

const UnitCard = ({ unit, onDeleteClick = () => null, onEditUnit = () => null }) => {
  const router = useRouter();

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group cursor-pointer"
      style={{ backgroundColor: "white" }}
    >
      {/* Decorative Elements */}
      <div
        className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{ backgroundColor: "#8B5CF6" }}
      ></div>
      <div
        className="absolute -bottom-5 -left-5 w-16 h-16 rounded-full opacity-5 group-hover:opacity-15 transition-opacity duration-300"
        style={{ backgroundColor: "#0F7490" }}
      ></div>

      {/* Content */}
      <div className="relative p-8">
        <Link
          href={`units/${unit.name}/topics`}
          className="w-full mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: "#0F7490" }}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ color: "#202938" }}
              >
                {unit.name}
              </h2>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Questions Card */}
            <div className="group/stat">
              <div
                className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 border border-opacity-10"
                style={{
                  backgroundColor: "rgba(139, 92, 246, 0.02)",
                  borderColor: "#8B5CF6",
                }}
              >
                <div className="mb-3">
                  <span
                    className="text-4xl font-bold bg-gradient-to-r from-current to-opacity-80 bg-clip-text"
                    style={{ color: "#8B5CF6" }}
                  >
                    55
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FileText
                    className="w-4 h-4 opacity-60"
                    style={{ color: "#8B5CF6" }}
                  />
                  <span
                    className="text-sm font-medium opacity-70"
                    style={{ color: "#202938" }}
                  >
                    درس
                  </span>
                </div>
              </div>
            </div>

            {/* Topics Card */}
            <div className="group/stat">
              <div
                className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 border border-opacity-10"
                style={{
                  backgroundColor: "rgba(15, 116, 144, 0.02)",
                  borderColor: "#0F7490",
                }}
              >
                <div className="mb-3">
                  <span
                    className="text-4xl font-bold bg-gradient-to-r from-current to-opacity-80 bg-clip-text"
                    style={{ color: "#0F7490" }}
                  >
                    {unit?.questions}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CircleQuestionMark
                    className="w-4 h-4 opacity-60"
                    style={{ color: "#0F7490" }}
                  />
                  <span
                    className="text-sm font-medium opacity-70"
                    style={{ color: "#202938" }}
                  >
                    سؤال
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Controles Management */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-[#202938]/60">
            <Calendar className="w-3 h-3" />
            <span>{unit.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="text"
              size="small"
              className="text-[#0F7490] hover:bg-[#0F7490]/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              type="text"
              size="small"
              className="text-[#C9AE6C] hover:bg-[#C9AE6C]/10"
              onClick={(e)=> onEditUnit(e, unit)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              onClick={(e) => onDeleteClick(e, unit)}
              type="text"
              size="small"
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCard;
