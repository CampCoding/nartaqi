import React from "react";
import Badge from "../../atoms/Badge";
import Button from "../../atoms/Button";
import {
  Clock,
  Copy,
  Edit3,
  Eye,
  MoreVertical,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import Card from "../../atoms/Card";
import MCQPreview from "../../Previews/MCQ.preview";
import { Modal } from "antd";

const QuestionCard = ({
  question,
  prevModal,
  setPrevModal,
  selectedQuestion,
  setSelectedQuestion,
  deleteModal,
  setDeleteModal,
}) => {
  const [previewModal, setPreviewModal] = React.useState(false);

  const getTypeColor = (type) => {
    switch (type) {
      case "MCQ":
        return "blue";
      case "True/False":
        return "gold";
      case "Essay":
        return "purple";
      default:
        return "default";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "green";
      case "Medium":
        return "gold";
      case "Hard":
        return "red";
      default:
        return "default";
    }
  };

  // تسميات عربية للنوع والصعوبة
  const getTypeLabelAr = (type) => {
    switch (type) {
      case "MCQ":
        return "اختيار من متعدد";
      case "True/False":
        return "صح / خطأ";
      case "Essay":
        return "مقالي";
      default:
        return type || "غير محدد";
    }
  };

  const getDifficultyLabelAr = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "سهل";
      case "Medium":
        return "متوسط";
      case "Hard":
        return "صعب";
      default:
        return difficulty || "غير محدد";
    }
  };

  return (
    <Card
      key={question.id}
      className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
    >
      {/* ممكن يكون للديبج فقط */}
      {/* <h1>{selectedQuestion?.question}</h1> */}

      {/* رأس البطاقة */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge color={getTypeColor(question.type)}>{getTypeLabelAr(question.type)}</Badge>
          <Badge color={getDifficultyColor(question.difficulty)}>
            {getDifficultyLabelAr(question.difficulty)}
          </Badge>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button type="text" size="small" aria-label="المزيد">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* محتوى السؤال */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#202938] mb-2 line-clamp-2">
          {question.question}
        </h3>
        <div className="flex items-center gap-4 text-sm text-[#202938]/60">
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            <span>{question.subject}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{question.usageCount} مرات الاستخدام</span>
          </div>
        </div>
      </div>

      {/* الوسوم */}
      <div className="flex flex-wrap gap-1 mb-4">
        {question.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#8B5CF6]/10 text-[#8B5CF6]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* بيانات إضافية */}
      <div className="flex items-center justify-between text-xs text-[#202938]/50 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>آخر تعديل {question.lastModified}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>تاريخ الإنشاء {question.createdAt}</span>
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setPrevModal(true);
              setSelectedQuestion(question);
            }}
            type="text"
            size="small"
            className="text-[#0F7490] hover:bg-[#0F7490]/10"
          >
            <Eye className="w-4 h-4 ml-1" />
            معاينة
          </Button>
          <Button
            type="text"
            size="small"
            className="text-[#C9AE6C] hover:bg-[#C9AE6C]/10"
          >
            <Copy className="w-4 h-4 ml-1" />
            تكرار
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="text"
            size="small"
            className="text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
            aria-label="تعديل"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              setDeleteModal(!deleteModal);
              setSelectedQuestion(question);
            }}
            type="text"
            size="small"
            className="text-red-500 hover:bg-red-50"
            aria-label="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* نافذة المعاينة (إن احتجتها لاحقاً) */}
      {/* <Modal open={previewModal} onCancel={() => setPreviewModal(false)} footer={null}>
        <MCQPreview question={question} />
      </Modal> */}
    </Card>
  );
};

export default QuestionCard;
