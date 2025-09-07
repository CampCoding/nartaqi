"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Book,
  Eye,
  MinusIcon,
  PlusIcon,
  SaveIcon,
  Trash2,
  ChevronLeft,
  ChevronRight,
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
  // حالة الاختبار العام
  const [examName, setExamName] = useState("");
  const [examDuration, setExamDuration] = useState(30); // دقيقة
  const [examType, setExamType] = useState("intern");
  
  // حالة إدارة الأسئلة
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 يعني إنشاء اختبار جديد
  
  // حالة السؤال الحالي
  const [questionType, setQuestionType] = useState("mcq");
  const [question, setQuestion] = useState("");
  const [modalAnswer, setModalAnswer] = useState("");
  const [options, setOptions] = useState([
    { text: "", explanation: "", isCorrect: false },
    { text: "", explanation: "", isCorrect: false },
  ]);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);
  const [trueFalseExplanation, setTrueFalseExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [tags, setTags] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [points, setPoints] = useState("1");
  const [completeText, setCompleteText] = useState("");
  const [completeAnswers, setCompleteAnswers] = useState([{ answer: "" }]);
  const [passageText, setPassageText] = useState("");
  const [passageQuestions, setPassageQuestions] = useState([
    { question: "", answer: "" }
  ]);

  const { id, unitId, topicId } = useParams();

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
      newOptions.forEach((option, i) => {
        option.isCorrect = i === index;
      });
    } else {
      newOptions[index][field] = value;
    }
    setOptions(newOptions);
  };

  // Complete question functions
  const addCompleteAnswer = () => {
    setCompleteAnswers([...completeAnswers, { answer: "" }]);
  };

  const removeCompleteAnswer = (index) => {
    if (completeAnswers.length > 1) {
      const newAnswers = completeAnswers.filter((_, i) => i !== index);
      setCompleteAnswers(newAnswers);
    }
  };

  const updateCompleteAnswer = (index, value) => {
    const newAnswers = [...completeAnswers];
    newAnswers[index].answer = value;
    setCompleteAnswers(newAnswers);
  };

  // Passage question functions
  const addPassageQuestion = () => {
    setPassageQuestions([...passageQuestions, { question: "", answer: "" }]);
  };

  const removePassageQuestion = (index) => {
    if (passageQuestions.length > 1) {
      const newQuestions = passageQuestions.filter((_, i) => i !== index);
      setPassageQuestions(newQuestions);
    }
  };

  const updatePassageQuestion = (index, field, value) => {
    const newQuestions = [...passageQuestions];
    newQuestions[index][field] = value;
    setPassageQuestions(newQuestions);
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
    } else if (type === "complete") {
      setCompleteText("");
      setCompleteAnswers([{ answer: "" }]);
    } else if (type === "passage") {
      setPassageText("");
      setPassageQuestions([{ question: "", answer: "" }]);
    } else {
      setOptions([
        { text: "", explanation: "", isCorrect: false },
        { text: "", explanation: "", isCorrect: false },
      ]);
    }
  };

  // إضافة سؤال جديد إلى قائمة الأسئلة
  const addQuestionToExam = () => {
    if (!isFormValid()) return;
    
    const newQuestion = {
      id: Date.now(),
      type: questionType,
      question,
      options: questionType === "mcq" || questionType === "trueFalse" ? [...options] : [],
      trueFalseAnswer,
      trueFalseExplanation,
      modalAnswer,
      completeText,
      completeAnswers: [...completeAnswers],
      passageText,
      passageQuestions: [...passageQuestions],
      difficulty,
      tags,
      timeLimit,
      points
    };
    
    if (currentQuestionIndex >= 0) {
      // تعديل سؤال موجود
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = newQuestion;
      setQuestions(updatedQuestions);
    } else {
      // إضافة سؤال جديد
      setQuestions([...questions, newQuestion]);
    }
    
    // مسح نموذج السؤال الحالي
    resetQuestionForm();
    setCurrentQuestionIndex(-1);
  };

  // تحرير سؤال موجود
  const editQuestion = (index) => {
    const questionToEdit = questions[index];
    setQuestionType(questionToEdit.type);
    setQuestion(questionToEdit.question || "");
    setOptions(questionToEdit.options || []);
    setTrueFalseAnswer(questionToEdit.trueFalseAnswer || null);
    setTrueFalseExplanation(questionToEdit.trueFalseExplanation || "");
    setModalAnswer(questionToEdit.modalAnswer || "");
    setCompleteText(questionToEdit.completeText || "");
    setCompleteAnswers(questionToEdit.completeAnswers || [{ answer: "" }]);
    setPassageText(questionToEdit.passageText || "");
    setPassageQuestions(questionToEdit.passageQuestions || [{ question: "", answer: "" }]);
    setDifficulty(questionToEdit.difficulty || "medium");
    setTags(questionToEdit.tags || "");
    setTimeLimit(questionToEdit.timeLimit || "");
    setPoints(questionToEdit.points || "1");
    
    setCurrentQuestionIndex(index);
  };

  // حذف سؤال
  const deleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  // مسح نموذج السؤال الحالي
  const resetQuestionForm = () => {
    setQuestionType("mcq");
    setQuestion("");
    setOptions([
      { text: "", explanation: "", isCorrect: false },
      { text: "", explanation: "", isCorrect: false },
    ]);
    setTrueFalseAnswer(null);
    setTrueFalseExplanation("");
    setModalAnswer("");
    setCompleteText("");
    setCompleteAnswers([{ answer: "" }]);
    setPassageText("");
    setPassageQuestions([{ question: "", answer: "" }]);
    setDifficulty("medium");
    setTags("");
    setTimeLimit("");
    setPoints("1");
    setCurrentQuestionIndex(-1);
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
    { label: "الاختبارات", href: "#" },
  ];

  // Validation logic
  const isFormValid = () => {
    if (currentQuestionIndex === -1 && (!examName.trim() || !examDuration)) {
      return false;
    }
    
    switch (questionType) {
      case "mcq":
        return (
          question.trim() &&
          options.every((opt) => opt.text.trim()) &&
          options.some((opt) => opt.isCorrect) &&
          difficulty
        );
      case "trueFalse":
        return (
          question.trim() &&
          trueFalseAnswer !== null &&
          difficulty
        );
      case "essay":
        return (
          question.trim() &&
          modalAnswer.trim() &&
          difficulty
        );
      case "complete":
        return (
          completeText.trim() &&
          completeAnswers.every((ans) => ans.answer.trim()) &&
          difficulty
        );
      case "passage":
        return (
          passageText.trim() &&
          passageQuestions.every((q) => q.question.trim() && q.answer.trim()) &&
          difficulty
        );
      default:
        return false;
    }
  };

  const isExamFormValid = () => {
    return examName.trim() && examDuration > 0 && questions.length > 0;
  };

  // Render question preview based on type
  const renderQuestionPreview = (q, index) => {
    return (
      <div key={q.id} className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">السؤال {index + 1}</h4>
          <div className="flex gap-2">
            <Button type="text" onClick={() => editQuestion(index)}>
              تعديل
            </Button>
            <Button 
              type="text" 
              onClick={() => deleteQuestion(index)}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="mb-2">
          <span className="text-sm text-gray-500">النوع: </span>
          <span className="text-sm font-medium">
            {q.type === "mcq" ? "اختيار من متعدد" : 
             q.type === "trueFalse" ? "صح/خطأ" : 
             q.type === "essay" ? "مقالي" : 
             q.type === "complete" ? "أكمل" : "قطعة ثابتة"}
          </span>
        </div>
        
        <div className="mb-2">
          <span className="text-sm text-gray-500">الصعوبة: </span>
          <span className="text-sm font-medium">
            {q.difficulty === "easy" ? "سهل" : 
             q.difficulty === "medium" ? "متوسط" : "صعب"}
          </span>
        </div>
        
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          {q.type === "mcq" && (
            <>
              <p className="font-medium mb-2">{q.question}</p>
              <ul className="list-disc list-inside space-y-1">
                {q.options.map((opt, i) => (
                  <li key={i} className={opt.isCorrect ? "text-green-600 font-medium" : ""}>
                    {opt.text} {opt.isCorrect && "✓"}
                  </li>
                ))}
              </ul>
            </>
          )}
          
          {q.type === "trueFalse" && (
            <p className="font-medium">
              {q.question} - الإجابة: {q.trueFalseAnswer ? "صحيح" : "خطأ"}
            </p>
          )}
          
          {q.type === "essay" && (
            <>
              <p className="font-medium mb-2">{q.question}</p>
              <p className="text-sm text-gray-600">الإجابة النموذجية: {q.modalAnswer}</p>
            </>
          )}
          
          {q.type === "complete" && (
            <>
              <p className="font-medium mb-2">{q.completeText}</p>
              <p className="text-sm text-gray-600">
                عدد الفراغات: {q.completeAnswers.length}
              </p>
            </>
          )}
          
          {q.type === "passage" && (
            <>
              <p className="text-sm font-medium mb-2">نص القطعة:</p>
              <p className="mb-3 text-sm">{q.passageText.substring(0, 100)}...</p>
              <p className="text-sm text-gray-600">
                عدد الأسئلة: {q.passageQuestions.length}
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9FAFC] p-6">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={currentQuestionIndex === -1 ? "إنشاء اختبار جديد" : "إضافة سؤال"}
          subtitle={currentQuestionIndex === -1 ? "صمم اختبار لطلابك" : "أضف سؤال إلى الاختبار"}
          extra={
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  questionType === "mcq"
                    ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                    : questionType === "trueFalse"
                    ? "bg-[#0F7490]/10 text-[#0F7490]"
                    : questionType === "essay"
                    ? "bg-[#C9AE6C]/10 text-[#C9AE6C]"
                    : questionType === "complete"
                    ? "bg-[#10B981]/10 text-[#10B981]"
                    : "bg-[#F59E0B]/10 text-[#F59E0B]"
                }`}
              >
                {questionType === "mcq"
                  ? "الاختيار من متعدد"
                  : questionType === "trueFalse"
                  ? "صح/خطأ"
                  : questionType === "essay"
                  ? "مقالي"
                  : questionType === "complete"
                  ? "أكمل"
                  : "قطعة ثابتة"}
              </div>
            </div>
          }
        />

        {currentQuestionIndex === -1 ? (
          // عرض نموذج إنشاء الاختبار
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* معلومات الاختبار الأساسية */}
              <Card title="معلومات الاختبار" className="p-6" dir="rtl">
                <div className="grid grid-cols-1 mt-5 md:grid-cols-2 gap-6">
                  <Input
                    label="اسم الاختبار"
                    placeholder="أدخل اسم الاختبار"
                    required
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                  />
                  
                  <Input
                    label="مدة الاختبار (دقيقة)"
                    type="number"
                    placeholder="أدخل المدة بالدقائق"
                    required
                    min="1"
                    value={examDuration}
                    onChange={(e) => setExamDuration(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                {/* Question Type Selector */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#202938] mb-3">
                    نوع الاختبار
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setExamType("intern")}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
                        examType === "intern"
                          ? "border-[#0F7490] bg-[#0F7490]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex  !min-w-[16px] !min-h-[16px] w-4 h-4  rounded-full border-2 ${
                            examType === "intern"
                              ? "border-[#8B5CF6] bg-[#8B5CF6]"
                              : "border-gray-300"
                          }`}
                        ></div>
                        <div>
                          <h3 className="font-medium text-[#202938]">تدريب</h3>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setExamType("mock")}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
                        examType === "mock"
                          ? "border-[#0F7490] bg-[#0F7490]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex  !min-w-[16px] !min-h-[16px] w-4 h-4  rounded-full border-2 ${
                            examType === "mock"
                              ? "border-[#8B5CF6] bg-[#8B5CF6]"
                              : "border-gray-300"
                          }`}
                        ></div>
                        <div>
                          <h3 className="font-medium text-[#202938]">
                            اختبار محاكي
                          </h3>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </Card>

              {/* قائمة الأسئلة */}
              <Card title="أسئلة الاختبار" className="p-6" dir="rtl">
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Book className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>لا توجد أسئلة حتى الآن</p>
                    <p className="text-sm">اضغط على زر إضافة سؤال لبدء إنشاء الأسئلة</p>
                  </div>
                ) : (
                  <div>
                    {questions.map(renderQuestionPreview)}
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-600">
                        عدد الأسئلة: {questions.length}
                      </span>
                      <Button 
                        type="primary" 
                        onClick={() => setCurrentQuestionIndex(-2)} // -2 يعني وضع إضافة سؤال جديد
                      >
                        <PlusIcon className="w-4 h-4 ml-2" />
                        إضافة سؤال آخر
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* الشريط الجانبي */}
            <div className="space-y-6 sticky top-0" dir="rtl">
              {/* معلومات الاختبار */}
              <Card title="معلومات الاختبار" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#202938]/60">اسم الاختبار</span>
                    <span className="font-medium text-[#202938]">
                      {examName || "لم يتم التعيين"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#202938]/60">المدة</span>
                    <span className="font-medium text-[#202938]">
                      {examDuration} دقيقة
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#202938]/60">النوع</span>
                    <span className="font-medium text-[#202938]">
                      {examType === "intern" ? "تدريب" : "اختبار محاكي"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#202938]/60">عدد الأسئلة</span>
                    <span className="font-medium text-[#0F7490]">
                      {questions.length}
                    </span>
                  </div>
                </div>
              </Card>

              {/* إجراءات سريعة */}
              <Card title="إجراءات سريعة" className="p-6">
                <div className="space-y-3">
                  <Button 
                    type="default" 
                    className="w-full justify-start"
                    onClick={() => setCurrentQuestionIndex(-2)}
                    disabled={!examName.trim()}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    إضافة سؤال
                  </Button>
                  <Button 
                    type="secondary" 
                    className="w-full justify-start"
                    disabled={questions.length === 0}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    معاينة الاختبار
                  </Button>
                </div>
              </Card>

              {/* حالة النموذج */}
              <Card className="p-6">
                <div className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      isExamFormValid() ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {isExamFormValid() ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      isExamFormValid() ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isExamFormValid() ? "جاهز للحفظ" : "اكمل معلومات الاختبار"}
                  </p>
                  <p className="text-xs text-[#202938]/50 mt-1">
                    {isExamFormValid()
                      ? "تم إكمال جميع الحقول المطلوبة"
                      : "يجب إضافة اسم الاختبار ومدته وواحد سؤال على الأقل"}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          // عرض نموذج إضافة/تحرير سؤال
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Button 
                  type="text" 
                  onClick={() => setCurrentQuestionIndex(-1)}
                  className="flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 ml-1" />
                  العودة إلى الاختبار
                </Button>
                <h3 className="text-lg font-medium">
                  {currentQuestionIndex >= 0 ? "تحرير السؤال" : "إضافة سؤال جديد"}
                </h3>
              </div>

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
                    <div>
                      <h3 className="font-medium text-[#202938]">
                        الاختيار من متعدد
                      </h3>
                      <p className="text-sm text-[#202938]/60">
                        إنشاء أسئلة مع خيارات إجابة متعددة
                      </p>
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
                    <div>
                      <h3 className="font-medium text-[#202938]">صح/خطأ</h3>
                      <p className="text-sm text-[#202938]/60">
                        إنشاء أسئلة صحيحة أو خاطئة بسيطة
                      </p>
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
                    <div>
                      <h3 className="font-medium text-[#202938]">مقالي</h3>
                      <p className="text-sm text-[#202938]/60">
                        إنشاء أسئلة مقالية بسيطة
                      </p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleQuestionTypeChange("complete")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
                      questionType === "complete"
                        ? "border-[#0F7490] bg-[#0F7490]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <h3 className="font-medium text-[#202938]">أكمل</h3>
                      <p className="text-sm text-[#202938]/60">
                        اكمل الجمل أو النصوص الناقصة
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuestionTypeChange("passage")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
                      questionType === "passage"
                        ? "border-[#0F7490] bg-[#0F7490]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <h3 className="font-medium text-[#202938]">قطعة ثابتة</h3>
                      <p className="text-sm text-[#202938]/60">
                        ادخل القطع الثابته مع أسئلة
                      </p>
                    </div>
                  </button>
                </div>
              </Card>

              {/* تفاصيل السؤال */}
              <Card title="تفاصيل السؤال" className="p-6" dir="rtl">
                <div className="space-y-6">
                  {/* Common fields for all question types */}
                  {(questionType === "mcq" || questionType === "trueFalse" || questionType === "essay") && (
                    <TextArea
                      label="السؤال"
                      placeholder="أدخل سؤالك هنا..."
                      required
                      rows={3}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  )}

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

                  {questionType === "complete" && (
                    <>
                      <TextArea
                        label="النص الناقص"
                        placeholder="أدخل النص مع وضع (...) في الأماكن الناقصة"
                        required
                        rows={4}
                        value={completeText}
                        onChange={(e) => setCompleteText(e.target.value)}
                      />
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-[#202938]">
                          الإجابات النموذجية للأماكن الناقصة
                        </label>
                        {completeAnswers.map((answer, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              placeholder={`الإجابة للمكان الناقص ${index + 1}`}
                              value={answer.answer}
                              onChange={(e) => updateCompleteAnswer(index, e.target.value)}
                              className="flex-1"
                            />
                            {completeAnswers.length > 1 && (
                              <Button
                                type="text"
                                onClick={() => removeCompleteAnswer(index)}
                                className="text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="secondary"
                          onClick={addCompleteAnswer}
                          className="mt-2"
                        >
                          <PlusIcon className="w-4 h-4 ml-2" />
                          إضافة إجابة أخرى
                        </Button>
                      </div>
                    </>
                  )}

                  {questionType === "passage" && (
                    <>
                      <TextArea
                        label="النص الثابت"
                        placeholder="أدخل النص الثابت هنا..."
                        required
                        rows={6}
                        value={passageText}
                        onChange={(e) => setPassageText(e.target.value)}
                      />
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-[#202938]">
                          الأسئلة المتعلقة بالنص
                        </label>
                        {passageQuestions.map((q, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-[#202938]">
                                السؤال {index + 1}
                              </span>
                              {passageQuestions.length > 1 && (
                                <Button
                                  type="text"
                                  onClick={() => removePassageQuestion(index)}
                                  className="text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="أدخل السؤال"
                              value={q.question}
                              onChange={(e) => updatePassageQuestion(index, "question", e.target.value)}
                            />
                            <Input                               placeholder="أدخل الإجابة"
                              value={q.answer}
                              onChange={(e) => updatePassageQuestion(index, "answer", e.target.value)}
                            />
                          </div>
                        ))}
                        <Button
                          type="secondary"
                          onClick={addPassageQuestion}
                          className="mt-2"
                        >
                          <PlusIcon className="w-4 h-4 ml-2" />
                          إضافة سؤال آخر
                        </Button>
                      </div>
                    </>
                  )}

                  {/* MCQ Options */}
                  {questionType === "mcq" && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-[#202938]">
                        خيارات الإجابة
                      </label>
                      {options.map((option, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder={`الخيار ${index + 1}`}
                              value={option.text}
                              onChange={(e) =>
                                updateOption(index, "text", e.target.value)
                              }
                            />
                            <Input
                              placeholder="شرح الإجابة (اختياري)"
                              value={option.explanation}
                              onChange={(e) =>
                                updateOption(index, "explanation", e.target.value)
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              type="button"
                              onClick={() => updateOption(index, "isCorrect", true)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                option.isCorrect
                                  ? "border-green-500 bg-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {option.isCorrect && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            {options.length > 2 && (
                              <Button
                                type="text"
                                onClick={() => removeOption(index)}
                                className="text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      <Button
                        type="secondary"
                        onClick={addOption}
                        className="mt-2"
                      >
                        <PlusIcon className="w-4 h-4 ml-2" />
                        إضافة خيار
                      </Button>
                    </div>
                  )}

                  {/* True/False Options */}
                  {questionType === "trueFalse" && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-[#202938]">
                        الإجابة الصحيحة
                      </label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setTrueFalseAnswer(true)}
                          className={`flex-1 p-4 rounded-lg border-2 text-center ${
                            trueFalseAnswer === true
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          صحيح
                        </button>
                        <button
                          onClick={() => setTrueFalseAnswer(false)}
                          className={`flex-1 p-4 rounded-lg border-2 text-center ${
                            trueFalseAnswer === false
                              ? "border-red-500 bg-red-50 text-red-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          خطأ
                        </button>
                      </div>
                      <Input
                        label="شرح الإجابة (اختياري)"
                        placeholder="أدخل شرح الإجابة"
                        value={trueFalseExplanation}
                        onChange={(e) => setTrueFalseExplanation(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Additional Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#202938] mb-2">
                        مستوى الصعوبة
                      </label>
                      <div className="flex gap-2">
                        {difficultyOptions.map((diff) => (
                          <button
                            key={diff.value}
                            onClick={() => setDifficulty(diff.value)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                              difficulty === diff.value
                                ? "bg-gradient-to-r text-white " + diff.color
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {diff.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Input
                      label="النقاط"
                      type="number"
                      placeholder="أدخل عدد النقاط"
                      min="1"
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                    />

                    <Input
                      label="الوقت المخصص (ثانية)"
                      type="number"
                      placeholder="أدخل الوقت بالثواني"
                      min="1"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                    />

                    <Input
                      label="الكلمات المفتاحية"
                      placeholder="أدخل الكلمات المفتاحية مفصولة بفواصل"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 sticky top-0" dir="rtl">
              {/* Question Preview */}
              <Card title="معاينة السؤال" className="p-6">
                <div className="space-y-4">
                  {questionType === "mcq" && (
                    <>
                      <h4 className="font-medium text-[#202938]">{question || "السؤال..."}</h4>
                      <div className="space-y-2">
                        {options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border ${
                              opt.isCorrect
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  opt.isCorrect
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {opt.isCorrect && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <span>{opt.text || `الخيار ${i + 1}`}</span>
                            </div>
                            {opt.explanation && (
                              <p className="text-xs text-gray-500 mt-2 mr-7">
                                {opt.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {questionType === "trueFalse" && (
                    <>
                      <h4 className="font-medium text-[#202938]">{question || "السؤال..."}</h4>
                      <div className="flex gap-4 mt-3">
                        <div
                          className={`flex-1 p-3 rounded-lg border text-center ${
                            trueFalseAnswer === true
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200"
                          }`}
                        >
                          صحيح
                        </div>
                        <div
                          className={`flex-1 p-3 rounded-lg border text-center ${
                            trueFalseAnswer === false
                              ? "border-red-500 bg-red-50 text-red-700"
                              : "border-gray-200"
                          }`}
                        >
                          خطأ
                        </div>
                      </div>
                      {trueFalseExplanation && (
                        <p className="text-sm text-gray-600 mt-3">
                          <strong>الشرح:</strong> {trueFalseExplanation}
                        </p>
                      )}
                    </>
                  )}

                  {questionType === "essay" && (
                    <>
                      <h4 className="font-medium text-[#202938]">{question || "السؤال..."}</h4>
                      <div className="p-3 bg-gray-50 rounded-lg mt-3">
                        <p className="text-sm text-gray-600">
                          <strong>الإجابة النموذجية:</strong> {modalAnswer || "سيظهر هنا..."}
                        </p>
                      </div>
                    </>
                  )}

                  {questionType === "complete" && (
                    <>
                      <h4 className="font-medium text-[#202938]">
                        {completeText
                          ? completeText.replace(/\.\.\./g, "______")
                          : "النص الناقص..."}
                      </h4>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          عدد الفراغات: {completeAnswers.length}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {completeAnswers.map((ans, i) => (
                            <div
                              key={i}
                              className="p-2 bg-gray-100 rounded text-center text-sm"
                            >
                              الإجابة {i + 1}: {ans.answer || "______"}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {questionType === "passage" && (
                    <>
                      <h4 className="font-medium text-[#202938]">نص القطعة</h4>
                      <p className="text-sm text-gray-600 mt-2">
                        {passageText
                          ? passageText.substring(0, 100) + "..."
                          : "سيظهر نص القطعة هنا..."}
                      </p>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          عدد الأسئلة: {passageQuestions.length}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card title="إجراءات سريعة" className="p-6">
                <div className="space-y-3">
                  <Button
                    type="primary"
                    className="w-full justify-center"
                    onClick={addQuestionToExam}
                    disabled={!isFormValid()}
                  >
                    <SaveIcon className="w-4 h-4 ml-2" />
                    {currentQuestionIndex >= 0 ? "تحديث السؤال" : "إضافة إلى الاختبار"}
                  </Button>
                  <Button
                    type="default"
                    className="w-full justify-center"
                    onClick={resetQuestionForm}
                  >
                    مسح النموذج
                  </Button>
                </div>
              </Card>

              {/* Form Status */}
              <Card className="p-6">
                <div className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      isFormValid() ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {isFormValid() ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      isFormValid() ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isFormValid() ? "جاهز للإضافة" : "الحقول المطلوبة غير مكتملة"}
                  </p>
                  <p className="text-xs text-[#202938]/50 mt-1">
                    {isFormValid()
                      ? "تم إكمال جميع الحقول المطلوبة"
                      : "يجب ملء جميع الحقول الإلزامية"}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {currentQuestionIndex === -1 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {questions.length} أسئلة
                </span>
                <span className="text-sm text-gray-600">
                  • المدة الإجمالية: {examDuration} دقيقة
                </span>
              </div>
              <div className="flex gap-3">
                <Button type="default">حفظ كمسودة</Button>
                <Button 
                  type="primary" 
                  disabled={!isExamFormValid()}
                >
                  نشر الاختبار
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuestion;