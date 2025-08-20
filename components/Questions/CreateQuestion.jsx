"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Book,
  Eye,
  MinusIcon,
  PlusIcon,
  SaveIcon,
} from "lucide-react";
import BreadcrumbsShowcase from "../ui/BreadCrumbs";
import Button from "../atoms/Button";
import TextArea from "../atoms/TextArea";
import Card from "../atoms/Card";
import PagesHeader from "../ui/PagesHeader";
import { useParams } from "next/navigation";
import { subjects } from "../../data/subjects";

const Settings = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const AlertCircle = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01"
    />
  </svg>
);

const CheckCircle2 = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Input = ({
  placeholder,
  className = "",
  label,
  required = false,
  error,
  ...props
}) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-[#202938]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      className={`block w-full rounded-lg border ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
          : "border-gray-200 focus:border-[#0F7490] focus:ring-[#0F7490]"
      } bg-white px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${className}`}
      placeholder={placeholder}
      {...props}
    />
    {error && (
      <div className="flex items-center gap-1 text-red-500 text-xs">
        <AlertCircle className="w-3 h-3" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const CreateQuestion = () => {
  const [questionType, setQuestionType] = useState("mcq"); // "mcq" or "trueFalse"
  const [question, setQuestion] = useState("");
  const [modalAnswer, setModalAnswer] = useState("");
  const [options, setOptions] = useState([
    { text: "", explanation: "", isCorrect: false },
    { text: "", explanation: "", isCorrect: false },
  ]);

  const { id, unitId, topicId } = useParams();

  const [trueFalseAnswer, setTrueFalseAnswer] = useState(null); // true, false, or null
  const [trueFalseExplanation, setTrueFalseExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [tags, setTags] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [points, setPoints] = useState("1");

  const addOption = () => {
    setOptions([...options, { text: "", explanation: "", isCorrect: false }]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    if (field === "isCorrect" && value) {
      // If marking this option as correct, mark all others as incorrect
      newOptions.forEach((option, i) => {
        option.isCorrect = i === index;
      });
    } else {
      newOptions[index][field] = value;
    }
    setOptions(newOptions);
  };

  const handleQuestionTypeChange = (type) => {
    setQuestionType(type);
    // Reset form when switching types
    if (type === "trueFalse") {
      setTrueFalseAnswer(null);
      setTrueFalseExplanation("");
      setOptions([
        { text: "", explanation: "", isCorrect: false },
        { text: "", explanation: "", isCorrect: false },
      ]);
    } else {
      setOptions([
        { text: "", explanation: "", isCorrect: false },
        { text: "", explanation: "", isCorrect: false },
      ]);
    }
  };

  const colors = {
    primary: "#0F7490",
    secondary: "#C9AE6C",
    accent: "#8B5CF6",
    background: "#F9FAFC",
    text: "#202938",
  };

  const difficultyOptions = [
    { value: "easy", label: "سهل", color: "from-green-400 to-green-500" },
    {
      value: "medium",
      label: "متوسط",
      color: "from-yellow-400 to-yellow-500",
    },
    { value: "hard", label: "صعب", color: "from-red-400 to-red-500" },
  ];

  // Mock params for demonstration
  const selectedSubjectAndUnitWithTopic = useMemo(() => {
    const subject = subjects.find((subject) => subject.code === id);
    const unit = subject?.units.find(
      (unit) => unit.name == decodeURIComponent(unitId)
    );
    const topic = unit?.topics.find(
      (topic) => topic.name == decodeURIComponent(topicId)
    );
    return { subject, unit, topic };
  }, [id, unitId, topicId]);

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "الدورات", href: "/subjects", icon: Book },
    { label: selectedSubjectAndUnitWithTopic?.subject?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.unit?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.topic?.name, href: "#" },
    { label: "بنك الأسئلة", href: "#" },
    { label: "إضافة سؤال جديد", href: "#", current: true },
  ];

  // Validation logic
  const isFormValid =
    questionType === "mcq" || questionType === "trueFalse"
      ? question.trim() &&
        options.every((opt) => opt.text.trim()) &&
        options.some((opt) => opt.isCorrect) &&
        difficulty
      : question.trim() !== null && modalAnswer && difficulty;

  return (
    <div className="min-h-screen bg-[#F9FAFC] p-6">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={"إضافة سؤال جديد"}
          subtitle={"صمم أسئلة لطلابك"}
          extra={
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  questionType === "mcq"
                    ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                    : "bg-[#0F7490]/10 text-[#0F7490]"
                }`}
              >
                {questionType === "mcq"
                  ? "الاختيار من متعدد"
                  : questionType === "trueFalse"
                  ? "صح/خطأ"
                  : "مقالي"}
              </div>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Type Selector */}
            <Card title="نوع السؤال" className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleQuestionTypeChange("mcq")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
                    questionType === "mcq"
                      ? "border-[#0F7490] bg-[#0F7490]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* <div className={`flex  !min-w-[16px] !min-h-[16px] w-4 h-4  rounded-full border-2 ${
                      questionType === "mcq" ? "border-[#8B5CF6] bg-[#8B5CF6]" : "border-gray-300"
                    }`}>
                     
                    </div> */}
                    <div>
                      <h3 className="font-medium text-[#202938]">
                        الاختيار من متعدد
                      </h3>
                      <p className="text-sm text-[#202938]/60">
                        إنشاء أسئلة مع خيارات إجابة متعددة
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuestionTypeChange("trueFalse")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
                    questionType === "trueFalse"
                      ? "border-[#0F7490] bg-[#0F7490]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* <div className={`min-w-[16px] w-4 h-4 min-h-[16px] relative rounded-full border-2 ${
                      questionType === "trueFalse" ? "border-[#0F7490] bg-[#0F7490]" : "border-gray-300"
                    }`}>
                      
                    </div> */}
                    <div>
                      <h3 className="font-medium text-[#202938]">صح/خطأ</h3>
                      <p className="text-sm text-[#202938]/60">
                        إنشاء أسئلة صحيحة أو خاطئة بسيطة
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleQuestionTypeChange("essay")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
                    questionType === "essay"
                      ? "border-[#0F7490] bg-[#0F7490]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* <div className={` min-w-[16px] w-4 h-4 min-h-[16px] relative rounded-full border-2 ${
                      questionType === "essay" ? "border-[#0F7490] bg-[#0F7490]" : "border-gray-300"
                    }`}>
                      
                    </div> */}
                    <div>
                      <h3 className="font-medium text-[#202938]">مقالي</h3>
                      <p className="text-sm text-[#202938]/60">
                        إنشاء أسئلة مقالية بسيطة
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </Card>

            {/* تفاصيل السؤال */}
            <Card title="تفاصيل السؤال" className="p-6" dir="rtl">
              <div className="space-y-6">
                <TextArea
                  label="السؤال"
                  placeholder="أدخل سؤالك هنا..."
                  required
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                {questionType === "essay" && (
                  <TextArea
                    label="الإجابة النموذجية"
                    placeholder="أدخل الإجابة النموذجية هنا..."
                    required
                    rows={3}
                    value={modalAnswer}
                    onChange={(e) => setModalAnswer(e.target.value)}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="mt-6">
                    <label
                      className="block text-sm font-medium mb-3"
                      style={{ color: colors.text }}
                    >
                      مستوى الصعوبة
                    </label>
                    <div className="flex gap-3">
                      {difficultyOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setDifficulty(option.value)}
                          className={`flex-1 p-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                            difficulty === option.value
                              ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Input
                  label="الكلمات المفتاحية"
                  placeholder="أدخل كلمات مفتاحية مفصولة بفواصل (مثال: جبر، معادلات)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </Card>

            {/* Conditional Answer Section */}
            {/* قسم الإجابات المشروطة */}
            {questionType === "mcq" || questionType === "trueFalse" ? (
              // خيارات الإجابة للاختيارات المتعددة أو الصح والخطأ
              <Card
                title="خيارات الإجابة والتفسيرات"
                extra={
                  questionType === "mcq" && (
                    <Button
                      type="text"
                      onClick={addOption}
                      className="text-[#0F7490] hover:bg-[#0F7490]/10"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      إضافة خيار
                    </Button>
                  )
                }
                className="p-6"
                dir="rtl"
              >
                <div className="space-y-6">
                  <p className="text-sm text-[#202938]/60 mb-4">
                    أدخل خيارات الإجابة وقم بتحديد الإجابة الصحيحة. أضف تفسيرات
                    لمساعدة الطلاب على الفهم.
                  </p>
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        option.isCorrect
                          ? "border-[#0F7490] bg-[#0F7490]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        {/* زر التحديد */}
                        <div className="relative mt-3">
                          <input
                            type="radio"
                            checked={option.isCorrect}
                            onChange={() =>
                              updateOption(
                                index,
                                "isCorrect",
                                !option.isCorrect
                              )
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                              option.isCorrect
                                ? "border-[#0F7490] bg-[#0F7490]"
                                : "border-gray-300"
                            }`}
                            onClick={() =>
                              updateOption(index, "isCorrect", true)
                            }
                          >
                            {option.isCorrect && (
                              <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                            )}
                          </div>
                        </div>

                        {/* نص الخيار */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-[#202938]">
                              الخيار {index + 1}
                            </span>
                            {option.isCorrect && (
                              <span className="bg-[#0F7490] text-white text-xs px-2 py-1 rounded-full">
                                الإجابة الصحيحة
                              </span>
                            )}
                          </div>
                          <Input
                            placeholder={`أدخل نص الخيار ${index + 1}`}
                            value={option.text}
                            onChange={(e) =>
                              updateOption(index, "text", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>

                        {/* زر الحذف */}
                        {options.length > 2 && (
                          <Button
                            type="text"
                            onClick={() => removeOption(index)}
                            className="text-red-500 hover:bg-red-50 mt-8"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {/* التفسير */}
                      <div className="ml-8">
                        <TextArea
                          label={`تفسير الخيار ${index + 1}`}
                          placeholder="اشرح لماذا هذه الإجابة صحيحة أو خاطئة (اختياري)"
                          rows={2}
                          value={option.explanation}
                          onChange={(e) =>
                            updateOption(index, "explanation", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6 sticky top-0" dir="rtl">
            {/* إجراءات سريعة */}
            <Card title="إجراءات سريعة" className="p-6">
              <div className="space-y-3">
                <Button type="default" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  معاينة السؤال
                </Button>
                <Button type="secondary" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  الإعدادات المتقدمة
                </Button>
              </div>
            </Card>

            {/* معلومات السؤال */}
            <Card title="معلومات السؤال" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#202938]/60">النوع</span>
                  <span className="font-medium text-[#202938]">
                    {questionType === "mcq"
                      ? "اختيار من متعدد"
                      : questionType == "essay"
                      ? "مقال"
                      : "صح / خطأ"}
                  </span>
                </div>
                {questionType === "mcq" || questionType === "trueFalse" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#202938]/60">
                        عدد الخيارات
                      </span>
                      <span className="font-medium text-[#202938]">
                        {options.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#202938]/60">
                        الإجابة الصحيحة
                      </span>
                      <span className="font-medium text-[#0F7490]">
                        {options.findIndex((opt) => opt.isCorrect) !== -1
                          ? `الخيار ${
                              options.findIndex((opt) => opt.isCorrect) + 1
                            }`
                          : "لم يتم التحديد"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#202938]/60">
                        تحتوي على تفسير
                      </span>
                      <span className="font-medium text-[#8B5CF6]">
                        {options.filter((opt) => opt.explanation.trim()).length}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#202938]/60">
                        نموذج الإجابة
                      </span>
                      <span className="font-medium text-[#0F7490]">
                        {modalAnswer.trim().length > 0
                          ? "تم الإدخال"
                          : "لم يتم الإدخال"}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#202938]/60">عدد الحروف</span>
                  <span className="font-medium text-[#202938]">
                    {question.length}
                  </span>
                </div>
              </div>
            </Card>

            {/* حالة النموذج */}
            <Card className="p-6">
              <div className="text-center">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isFormValid ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {isFormValid ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <p
                  className={`text-sm font-medium ${
                    isFormValid ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {isFormValid ? "جاهز للحفظ" : "يرجى إكمال الحقول المطلوبة"}
                </p>
                <p className="text-xs text-[#202938]/50 mt-1">
                  {isFormValid
                    ? "تم إكمال جميع الحقول المطلوبة"
                    : questionType === "mcq"
                    ? "يجب إدخال السؤال والخيارات وتحديد الإجابة الصحيحة"
                    : "يجب إدخال السؤال والإجابة النموذجية"}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="mt-8 flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          dir="rtl"
        >
          <div className="flex items-center gap-4">
            <Button type="text">إلغاء</Button>
            <Button type="default">حفظ كمسودة</Button>
          </div>
          <Button type="primary" size="large" disabled={!isFormValid}>
            <SaveIcon className="w-4 h-4 ml-2" />
            حفظ السؤال
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;
