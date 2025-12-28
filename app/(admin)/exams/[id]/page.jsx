"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Clock3,
  Users,
  Star,
  Award,
  Edit3,
  CheckCircle2,
  XCircle,
  ListChecks,
  Search as SearchIcon,
  Lightbulb,
  Calendar,
  BarChart3,
  FileText,
  Hash,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import PageLayout from "../../../../components/layout/PageLayout";
import ExamOverview from "../../../../components/Exams/ExamOverview";
import ExamMainDescription from "../../../../components/Exams/ExamMainDescription";
import EditNewExamModal from "../../../../components/Exams/EditNewExamModal";
import { useDispatch, useSelector } from "react-redux";
import { handleGetExamDetails, handleGetAllExams, handleGetAllExamData, handleGetAllExamByLessonId } from "@/lib/features/examSlice";
import { useParams, useSearchParams } from "next/navigation";

/* ---------- Helper functions to process the data ---------- */
function flattenAllQuestions(sections) {
  if (!Array.isArray(sections)) return [];
  
  const allQuestions = [];
  
  sections?.forEach((section) => {
    // Add standalone MCQs from the section
    if (section.mcq && Array.isArray(section.mcq)) {
      section.mcq.forEach((question) => {
        allQuestions.push({
          ...question,
          sectionTitle: section.title,
          sectionId: section.id,
          question_type: "mcq",
        });
      });
    }
    
    // Add paragraph-based questions
    if (section.questions && Array.isArray(section.questions)) {
      section.questions.forEach((question) => {
        allQuestions.push({
          ...question,
          sectionTitle: section.title,
          sectionId: section.id,
          question_type: question.question_type || "paragraph_mcq",
          paragraph: section.paragraphs?.find(p => p.id === question.paragraph_id) || null,
        });
      });
    }
  });
  
  return allQuestions;
}

function getTotalQuestionCount(sections) {
  if (!Array.isArray(sections)) return 0;
  
  let count = 0;
  sections?.forEach((section) => {
    count += (section.mcq?.length || 0) + (section.questions?.length || 0);
  });
  
  return count;
}

/* ---------- Enhanced UI Components ---------- */
const Pill = ({ children, color = "bg-gray-100 text-gray-700 border-gray-200", className = "", icon: Icon }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${color} ${className}`}>
    {Icon && <Icon className="w-3 h-3" />}
    {children}
  </span>
);

const StatCard = ({ icon: Icon, label, value, color = "teal" }) => {
  const colors = {
    teal: "from-teal-500 to-emerald-500",
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-violet-500",
    amber: "from-amber-500 to-orange-500",
  };
  
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity" 
           style={{background: `linear-gradient(135deg, ${colors[color]})`}} />
      
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-gradient-to-br p-2.5 shadow-sm" 
             style={{background: `linear-gradient(135deg, ${colors[color]})`}}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">{value}</div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, children, variant = "secondary", className = "", onClick, size = "md" }) => {
  const base = "inline-flex items-center gap-2 rounded-xl font-semibold transition-all duration-200";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };
  
  const variants = {
    primary: "text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl",
    secondary: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300",
    ghost: "text-gray-600 hover:bg-gray-100",
  };
  
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} onClick={onClick}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

/* ---------- Question Type Badges ---------- */
const QuestionTypeBadge = ({ type }) => {
  const types = {
    mcq: { label: "اختيار من متعدد", color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: Hash },
    paragraph_mcq: { label: "اختيار من متعدد (قطعة)", color: "bg-purple-100 text-purple-800 border-purple-200", icon: FileText },
    tf: { label: "صح / خطأ", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2 },
    written: { label: "سؤال مقالي", color: "bg-amber-100 text-amber-800 border-amber-200", icon: Edit3 },
    fill: { label: "أكمل الفراغ", color: "bg-cyan-100 text-cyan-800 border-cyan-200", icon: Hash },
  };
  
  const config = types[type] || types.mcq;
  const Icon = config.icon;
  
  return (
    <Pill color={config.color} icon={Icon}>
      {config.label}
    </Pill>
  );
};

/* ---------- Enhanced Question Renderers ---------- */
function MCQView({ answers, showCorrectOnly }) {
  const list = showCorrectOnly ? answers.filter((a) => a.is_correct === 1) : answers;
  
  if (list.length === 0) return null;
  
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        <BarChart3 className="w-3.5 h-3.5" />
        الإجابات ({list.length})
      </div>
      {list.map((a) => (
        <div
          key={a.id}
          className={`flex items-start gap-3 rounded-xl border p-3 transition-all duration-200 ${
            a?.is_correct === 1 
              ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 shadow-sm" 
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
            a?.is_correct === 1 ? "bg-emerald-100" : "bg-gray-100"
          }`}>
            {a?.is_correct === 1 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: a?.option_text }}></div>
            {a.question_explanation && a.question_explanation !== "<p></p>" && (
              <div className="mt-2 p-2 bg-gray-50/70 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  شرح الإجابة
                </div>
                <div className="text-xs text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: a?.question_explanation }}></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function TFView({ correct }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            {correct ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700">الإجابة الصحيحة:</div>
            <div className={`text-lg font-bold ${correct ? 'text-emerald-700' : 'text-red-600'}`}>
              {correct ? "صح ✓" : "خطأ ✗"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WrittenView({ sampleAnswer }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
      {sampleAnswer ? (
        <>
          <div className="flex items-center gap-2 text-amber-700 mb-3">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">الإجابة النموذجية</span>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed bg-white/70 rounded-lg p-3 border border-amber-100">
            {sampleAnswer}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3 text-amber-600">
          <Lightbulb className="w-5 h-5" />
          <div>
            <div className="font-medium">سؤال مقالي</div>
            <div className="text-sm">يتم التصحيح يدوياً من قبل المدرسين</div>
          </div>
        </div>
      )}
    </div>
  );
}

function FillView({ gaps, answerText }) {
  const hasGaps = gaps && gaps.length > 0;
  return (
    <div className="space-y-3">
      {hasGaps && (
        <>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Hash className="w-3.5 h-3.5" />
            الإجابات النموذجية:
          </div>
          <div className="flex flex-wrap gap-2">
            {gaps.map((g, i) => (
              <div
                key={i}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-30 blur transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 border border-cyan-200 rounded-full px-4 py-2 font-medium">
                  {String(g)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {Boolean(answerText) && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800">
          <div className="text-xs text-gray-500 mb-1">النص الكامل:</div>
          {answerText}
        </div>
      )}
      {!hasGaps && !answerText && (
        <div className="text-center py-6 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div className="text-sm">لا توجد إجابة نموذجيّة محددة</div>
        </div>
      )}
    </div>
  );
}

/* ---------- Enhanced Questions Panel ---------- */
/* ---------- Enhanced Questions Panel ---------- */
function QuestionsPanel({ sections, query, setQuery, showCorrectOnly, setShowCorrectOnly }) {
  const [expandedSections, setExpandedSections] = useState(new Set());
  const allQuestions = useMemo(() => flattenAllQuestions(sections), [sections]);
  
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };
  
  // Initialize all sections as expanded by default
  useEffect(() => {
    if (sections && sections.length > 0) {
      const initialExpanded = new Set(sections.map(section => section.id));
      setExpandedSections(initialExpanded);
    }
  }, [sections]);
  
  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    if (!q) return allQuestions;
    
    return allQuestions.filter((question) => {
      const inTitle = (question?.question_text || "").toLowerCase().includes(q);
      if (inTitle) return true;
      
      const inInstructions = (question?.instructions || "").toLowerCase().includes(q);
      if (inInstructions) return true;
      
      const inParagraph = question?.paragraph?.paragraph_content?.toLowerCase().includes(q);
      if (inParagraph) return true;
      
      if (question.question_type === "mcq" || question.question_type === "paragraph_mcq") {
        return (question.options || []).some((option) => 
          (option.option_text || "").toLowerCase().includes(q)
        );
      }
      
      return false;
    });
  }, [allQuestions, query]);
  
  // ALWAYS show all sections, even empty ones
  const filteredSections = sections || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Panel Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 p-2">
              <ListChecks className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">أسئلة الاختبار</h2>
              <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  {allQuestions.length} سؤال
                </span>
                <span className="text-gray-300">•</span>
                <span className="inline-flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {sections?.length || 0} قسم
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <SearchIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                placeholder="ابحث في الأسئلة أو الإجابات..."
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showCorrectOnly}
                  onChange={(e) => setShowCorrectOnly(e.target.checked)}
                />
                <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-all ${
                  showCorrectOnly ? 'bg-teal-500' : 'bg-gray-300'
                }`}>
                  <div className={`bg-white rounded-full w-4 h-4 transform transition-transform ${
                    showCorrectOnly ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </div>
              <span className="font-medium">الإجابات الصحيحة فقط</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Questions Content */}
      <div className="p-5">
        {filteredSections?.length > 0 ? (
          <div className="space-y-6">
            {filteredSections.map((section, sectionIndex) => {
              const sectionQuestions = allQuestions.filter(q => q.sectionId === section.id);
              const filteredSectionQuestions = filtered.filter(q => q.sectionId === section.id);
              const isExpanded = expandedSections.has(section.id) || query;
              const hasQuestions = sectionQuestions.length > 0;
              const hasFilteredQuestions = filteredSectionQuestions.length > 0;
              
              return (
                <div key={section.id} className="rounded-xl border border-gray-200 overflow-hidden">
                  {/* Section Header - Clickable */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          hasQuestions 
                            ? "bg-gradient-to-br from-teal-500 to-emerald-500" 
                            : "bg-gradient-to-br from-gray-400 to-gray-500"
                        }`}>
                          {sectionIndex + 1}
                        </div>
                        {hasQuestions && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-white">
                            <div className="w-full h-full rounded-full bg-teal-500 flex items-center justify-center">
                              <span className="text-xs text-white font-bold">{sectionQuestions.length}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-lg" dangerouslySetInnerHTML={{ __html: section.title }} />
                        {section.description && section.description !== "<p></p>" && (
                          <div className="text-sm text-gray-600 mt-1 line-clamp-1" dangerouslySetInnerHTML={{ __html: section.description }} />
                        )}
                        {!hasQuestions && (
                          <div className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            قسم فارغ
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {hasQuestions ? (
                        <Pill className="bg-teal-100 text-teal-800 border-teal-200">
                          {sectionQuestions.length} سؤال
                        </Pill>
                      ) : (
                        <Pill className="bg-gray-100 text-gray-600 border-gray-200">
                          0 سؤال
                        </Pill>
                      )}
                      {!query && (
                        isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )
                      )}
                    </div>
                  </button>
                  
                  {/* Section Content - Show if expanded */}
                  {(isExpanded || query) && (
                    <div className="border-t border-gray-200 p-4 space-y-4">
                      {hasQuestions ? (
                        // Section has questions
                        hasFilteredQuestions || !query ? (
                          // Show questions (either filtered or all)
                          (query ? filteredSectionQuestions : sectionQuestions).map((question, questionIndex) => {
                            // Find the original position in the section for numbering
                            const originalIndex = sectionQuestions.findIndex(q => q.id === question.id);
                            const displayIndex = originalIndex !== -1 ? originalIndex + 1 : questionIndex + 1;
                            
                            return (
                              <div key={question.id} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 transition-all">
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                  <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center">
                                      {displayIndex}
                                    </span>
                                    <QuestionTypeBadge type={question.question_type} />
                                  </div>
                                  {question.paragraph && (
                                    <Pill className="bg-purple-100 text-purple-800 border-purple-200" icon={FileText}>
                                      سؤال قطعة
                                    </Pill>
                                  )}
                                </div>
                                
                                {/* Question Content */}
                                <div className="mb-4">
                                  <div 
                                    className="text-gray-900 font-medium text-lg leading-relaxed mb-3" 
                                    dangerouslySetInnerHTML={{ __html: question.question_text }} 
                                  />
                                  
                                  {question.instructions && question.instructions !== "<p></p>" && (
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 mb-3">
                                      <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-1">
                                        <FileText className="w-3.5 h-3.5" />
                                        التعليمات
                                      </div>
                                      <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: question.instructions }} />
                                    </div>
                                  )}
                                </div>
                                
                                {/* Passage Content */}
                                {question?.paragraph?.paragraph_content && (
                                  <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                      <FileText className="w-4 h-4" />
                                      نص القطعة
                                    </div>
                                    <div 
                                      className="text-gray-700 leading-relaxed" 
                                      dangerouslySetInnerHTML={{ __html: question.paragraph.paragraph_content }} 
                                    />
                                  </div>
                                )}
                                
                                {/* Answers */}
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                  {(question.question_type === "mcq" || question.question_type === "paragraph_mcq") && (
                                    <MCQView answers={question.options || []} showCorrectOnly={showCorrectOnly} />
                                  )}
                                  {question.question_type === "tf" && (
                                    <TFView correct={question.options?.[0]?.is_correct === 1} />
                                  )}
                                  {question.question_type === "written" && (
                                    <WrittenView sampleAnswer={question.answer} />
                                  )}
                                  {question.question_type === "fill" && (
                                    <FillView gaps={question.gaps || []} answerText={question.answer || ""} />
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          // Search query but no matching questions in this section
                          <div className="text-center py-8 bg-amber-50/50 rounded-xl border border-amber-200">
                            <SearchIcon className="w-10 h-10 text-amber-300 mx-auto mb-3" />
                            <div className="text-amber-600">لا توجد أسئلة مطابقة للبحث في هذا القسم</div>
                            <div className="text-amber-500 text-sm mt-1">عدد الأسئلة في القسم: {sectionQuestions.length}</div>
                          </div>
                        )
                      ) : (
                        // Empty section (no questions at all)
                        <div className="text-center py-10 bg-gray-50/30 rounded-xl border-2 border-dashed border-gray-300">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
                            <FileText className="w-7 h-7 text-gray-400" />
                          </div>
                          <div className="text-gray-500 text-lg mb-2">قسم فارغ</div>
                          
                        
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // No sections at all
          <div className="text-center py-12">
            <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">لا توجد أقسام في هذا الاختبار</div>
            <div className="text-gray-400 text-sm">حاول تحديث الصفحة أو تحقق من اتصالك بالإنترنت</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Enhanced Page ---------- */
export default function ExamDetailsPage({ exam: examProp }) {
  const [query, setQuery] = useState("");
  const [showCorrectOnly, setShowCorrectOnly] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const dispatch = useDispatch();
  const examDetailsSelector = useSelector((state) => state.exam.exam_details);
  const params = useParams();
  const [examDetails, setExamDetails] = useState(null);
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const {all_exam_data_list , all_exam_lessons_list, all_exam_lessons_loading , all_exam_data_loading} = useSelector(state => state?.exam)

  useEffect(() =>{
    dispatch(handleGetAllExamByLessonId({
      body : {
        lesson_id: lessonId
      },
    }))
  } ,[lessonId])

  useEffect(() => {
    console.log(all_exam_lessons_list)
  } , [all_exam_lessons_list])

  useEffect(() => {
    dispatch(handleGetAllExams({ page: 1, per_page: 100000000 }));
  }, [dispatch]);

  const { all_exam_loading, all_exam_list } = useSelector(state => state?.exam);
  const [selectedExam, setSelectedExam] = useState({});

  useEffect(() => {
    if (params?.id && !lessonId) {
      const filtered = all_exam_list?.data?.message?.data?.find(item => item?.id == params?.id);
      setSelectedExam(filtered);
    }else if(lessonId) {
      const filtered = all_exam_lessons_list?.data?.message?.find(item => item?.id == params?.id);
      setSelectedExam(filtered);
    }
  }, [params?.id, all_exam_list , lessonId]);

  useEffect(() => {
    if (params?.id) {
      dispatch(handleGetExamDetails({ exam_id: params?.id }));
    }
  }, [params]);

  useEffect(() => {
    if (examDetailsSelector?.data?.message && Array.isArray(examDetailsSelector?.data?.message)) {
      setExamDetails(examDetailsSelector?.data?.message || []);
    }
  }, [examDetailsSelector]);

  const totalQuestions = useMemo(() => {
    return getTotalQuestionCount(examDetails);
  }, [examDetails]);

  const stats = useMemo(() => [
    {
      icon: BookOpen,
      label: "إجمالي الأسئلة",
      value: selectedExam?.questions_count || totalQuestions,
      color: "teal"
    },
    {
      icon: Clock3,
      label: "عدد الأقسام",
      value: examDetails?.length || 0,
      color: "blue"
    },
    {
      icon: Users,
      label: "المشاركون",
      value: "0",
      color: "purple"
    },
    {
      icon: Star,
      label: "التقييم",
      value: "0",
      color: "amber"
    }
  ], [examDetails, totalQuestions, selectedExam]);

  return (
    <PageLayout>
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Enhanced Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-3 shadow-lg">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-white shadow">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">!</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                      {selectedExam?.title || "الاختبار"}
                    </h1>
                    <div className="flex items-center gap-2">
                      <Pill className="bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 border-teal-200" icon={Award}>
                        {selectedExam?.exam_type === "mock" ? "اختبار محاكاة" : "تدريب"}
                      </Pill>
                      {selectedExam?.difficulty && (
                        <Pill className={`${
                          selectedExam.difficulty === "صعب" 
                            ? "bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-red-200"
                            : selectedExam.difficulty === "متوسط"
                            ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200"
                            : "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200"
                        }`}>
                          {selectedExam.difficulty}
                        </Pill>
                      )}
                    </div>
                  </div>
                  
                  {selectedExam?.description && (
                    <div className="text-gray-600 line-clamp-2 max-w-3xl">
                      {selectedExam.description}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                    <span className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                      <Hash className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">{selectedExam?.questions_count || 0} سؤال</span>
                    </span>
                    {selectedExam?.duration && (
                      <span className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-3 py-1.5">
                        <Clock3 className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-700">{selectedExam.duration} دقيقة</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-3 py-1.5">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-700">تم الإنشاء: {new Date().toLocaleDateString('ar-SA')}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {examDetails ? (
                <QuestionsPanel
                  sections={examDetails}
                  query={query}
                  setQuery={setQuery}
                  showCorrectOnly={showCorrectOnly}
                  setShowCorrectOnly={setShowCorrectOnly}
                />
              ) : (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
                  <div className="mt-4 text-gray-500 text-lg">جاري تحميل بيانات الاختبار...</div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
             
              
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-gray-200 !p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                  إحصائيات سريعة
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">متوسط الوقت للسؤال</span>
                    <span className="font-bold text-gray-900">
                      {selectedExam?.duration && selectedExam?.questions_count
                        ? Math.round(selectedExam.duration / selectedExam.questions_count)
                        : 0} دقيقة
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">نسبة النجاح المتوقعة</span>
                    <span className="font-bold text-green-600">75%</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">تاريخ آخر تحديث</span>
                    <span className="font-bold text-gray-900">
                      {new Date().toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <EditNewExamModal open={editModal} setOpen={setEditModal} exam={selectedExam} />
    </PageLayout>
  );
}