"use client";
import React, {
  useState,
  useRef,
  useImperativeHandle,
  useEffect,
  forwardRef,
} from "react";
import { PlusIcon, Trash2, ChevronDown, ChevronUp, FileText, Calculator, List } from "lucide-react";
import Button from "../atoms/Button";

const MathField = forwardRef(function MathField(
  { value = "", onChange, options, className },
  refForward
) {
  const ref = useRef(null);
  const [isMathLiveLoaded, setIsMathLiveLoaded] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useImperativeHandle(refForward, () => ref.current, []);

  useEffect(() => {
    let cancel = false;
    
    const loadMathLive = async () => {
      try {
        if (typeof window?.MathfieldElement === 'undefined') {
          await import("mathlive");
          if (typeof customElements?.whenDefined === "function") {
            await customElements.whenDefined("math-field");
          }
        }
        
        if (cancel || !ref.current) return;
        
        const el = ref.current;
        
        if (options && typeof el.setOptions === "function") {
          el.setOptions(options);
        }
        
        if (value !== undefined && typeof el.setValue === "function") {
          el.setValue(value, { silenceNotifications: true });
        }
        
        setIsMathLiveLoaded(true);
        
        // Add event listener for changes
        el.addEventListener('input', (evt) => {
          const newValue = evt.target.value;
          setInternalValue(newValue);
          if (onChange) {
            onChange(newValue);
          }
        });
      } catch (error) {
        console.error("Failed to load MathLive:", error);
      }
    };

    loadMathLive();

    return () => {
      cancel = true;
    };
  }, [options, onChange]); // Remove value from dependencies

  // Only update when value changes from parent (not from internal changes)
  useEffect(() => {
    if (isMathLiveLoaded && ref.current && value !== internalValue) {
      ref.current.setValue(value, { silenceNotifications: true });
      setInternalValue(value);
    }
  }, [value, isMathLiveLoaded, internalValue]);

  return <math-field ref={ref} className={`${className} !w-full`} />;
});

const McqOptions = ({
  options,
  updateOption,
  toggleCorrect,
  addOption,
  removeOption,
  allowMultipleCorrect = false,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        خيارات الإجابة
      </label>
      {options?.map((option, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type={allowMultipleCorrect ? "checkbox" : "radio"}
            checked={option.isCorrect}
            onChange={() => toggleCorrect(index)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <input
            type="text"
            value={option.text}
            onChange={(e) => updateOption(index, "text", e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`الخيار ${index + 1}`}
          />
          {options.length > 2 && (
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="p-2 text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <Button
        type="button"
        onClick={addOption}
        variant="outline"
        icon={<PlusIcon size={16} />}
        className="text-sm"
      >
        إضافة خيار
      </Button>
    </div>
  );
};

const QuestionEditor = ({ 
  question, 
  index, 
  updateQuestion, 
  removeQuestion, 
  canRemove 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateOption = (optionIndex, field, value) => {
    const updatedOptions = [...question.answers];
    updatedOptions[optionIndex][field] = value;
    updateQuestion({ ...question, answers: updatedOptions });
  };

  const toggleCorrect = (optionIndex) => {
    const updatedOptions = question.answers.map((opt, idx) => ({
      ...opt,
      isCorrect: question.allowMultipleCorrect 
        ? idx === optionIndex ? !opt.isCorrect : opt.isCorrect
        : idx === optionIndex
    }));
    updateQuestion({ ...question, answers: updatedOptions });
  };

  const addOption = () => {
    updateQuestion({
      ...question,
      answers: [...question.answers, { text: "", isCorrect: false }]
    });
  };

  const removeOption = (optionIndex) => {
    if (question.answers.length > 1) {
      const updatedOptions = question.answers.filter((_, idx) => idx !== optionIndex);
      updateQuestion({ ...question, answers: updatedOptions });
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mb-4">
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">سؤال {index + 1}</span>
          {!isExpanded && question.text && (
            <span className="text-sm text-gray-500 truncate max-w-xs">
              {question.text}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeQuestion();
              }}
              variant="ghost"
              className="text-red-600 hover:bg-red-50 p-1"
            >
              <Trash2 size={16} />
            </Button>
          )}
          <Button
            variant="ghost"
            className="p-1"
            icon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نص السؤال
            </label>
            <input
              type="text"
              value={question.text}
              onChange={(e) => updateQuestion({ ...question, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل نص السؤال هنا"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`multiple-correct-${index}`}
              checked={question.allowMultipleCorrect || false}
              onChange={(e) => updateQuestion({ 
                ...question, 
                allowMultipleCorrect: e.target.checked 
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`multiple-correct-${index}`} className="text-sm text-gray-700">
              السماح بإجابات متعددة صحيحة
            </label>
          </div>
          
          <McqOptions
            options={question.answers}
            allowMultipleCorrect={question.allowMultipleCorrect}
            updateOption={updateOption}
            toggleCorrect={toggleCorrect}
            addOption={addOption}
            removeOption={removeOption}
          />
        </div>
      )}
    </div>
  );
};

const McqSharedPassageEditor = ({
  mcqSubType,
  onPassagesChange,
  initialData = [],
}) => {
  const [activeTab, setActiveTab] = useState(mcqSubType || "chemical");
  const [passages, setPassages] = useState(initialData);

  // Update parent whenever passages change
  useEffect(() => {
    onPassagesChange(passages);
  }, [passages, onPassagesChange]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Unified functions for all passage types
  const addPassage = () => {
    const newPassage = {
      id: Date.now(),
      title: `${
        activeTab === "chemical" ? "المعادلة" : 
        activeTab === "general" ? "القطعة" : "القطعة الثابتة"
      } ${passages.length + 1}`,
      ...(activeTab === "chemical" ? { latex: "" } : { content: "" }),
      questions: [
        {
          id: Date.now(),
          text: "",
          answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
          allowMultipleCorrect: false,
        },
      ],
    };
    
    setPassages(prev => [...prev, newPassage]);
  };

  const removePassage = (index) => {
    setPassages(prev => prev.filter((_, i) => i !== index));
  };

  const updatePassage = (index, updatedPassage) => {
    setPassages(prev => {
      const updated = [...prev];
      updated[index] = updatedPassage;
      return updated;
    });
  };

  const addQuestion = (passageIndex) => {
    setPassages(prev => {
      const updated = [...prev];
      updated[passageIndex].questions.push({
        id: Date.now(),
        text: "",
        answers: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        allowMultipleCorrect: false,
      });
      return updated;
    });
  };

  const removeQuestion = (passageIndex, questionIndex) => {
    setPassages(prev => {
      const updated = [...prev];
      if (updated[passageIndex].questions.length > 1) {
        updated[passageIndex].questions = updated[passageIndex].questions.filter(
          (_, i) => i !== questionIndex
        );
      }
      return updated;
    });
  };

  const renderTabContent = () => {
    return (
      <div className="space-y-6">
        {passages.map((passage, passageIndex) => (
          <div key={passage.id} className="rounded-xl border border-gray-200 p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                <input
                  type="text"
                  value={passage.title}
                  onChange={(e) => updatePassage(passageIndex, {
                    ...passage,
                    title: e.target.value
                  })}
                  className="bg-transparent font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded"
                />
              </h3>
              {passages.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removePassage(passageIndex)}
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
                >
                  <Trash2 size={16} /> 
                  {activeTab === "chemical" ? "حذف المعادلة" : "حذف القطعة"}
                </Button>
              )}
            </div>
            
            {activeTab === "chemical" && (
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  المعادلة الرياضية (LaTeX)
                </label>
                <MathField
                  value={passage.latex}
                  onChange={(latex) => updatePassage(passageIndex, {
                    ...passage,
                    latex
                  })}
                  options={{
                    mathVirtualKeyboardPolicy: "manual",
                    smartMode: true,
                    smartFence: true,
                  }}
                  className="border rounded p-3"
                />
              </div>
            )}
            
            {(activeTab === "general" || activeTab === "passage") && (
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  محتوى القطعة
                </label>
                <textarea
                  value={passage.content}
                  onChange={(e) => updatePassage(passageIndex, {
                    ...passage,
                    content: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="أدخل محتوى القطعة هنا..."
                />
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">
                  {activeTab === "chemical" ? "أسئلة هذه المعادلة" : "أسئلة هذه القطعة"}
                </h4>
                <Button
                  type="button"
                  onClick={() => addQuestion(passageIndex)}
                  variant="outline"
                  icon={<PlusIcon size={16} />}
                  className="text-sm"
                >
                  إضافة سؤال
                </Button>
              </div>
              
              {passage.questions.map((question, questionIndex) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  index={questionIndex}
                  updateQuestion={(updatedQuestion) => {
                    const updatedQuestions = [...passage.questions];
                    updatedQuestions[questionIndex] = updatedQuestion;
                    updatePassage(passageIndex, {
                      ...passage,
                      questions: updatedQuestions
                    });
                  }}
                  removeQuestion={() => removeQuestion(passageIndex, questionIndex)}
                  canRemove={passage.questions.length > 1}
                />
              ))}
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          onClick={addPassage}
          variant="outline"
          icon={<PlusIcon size={16} />}
          className="w-full"
        >
          {activeTab === "chemical" ? "إضافة معادلة جديدة" : "إضافة قطعة جديدة"}
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => handleTabChange("chemical")}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === "chemical"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calculator size={18} />
          المعادلات الرياضية
        </button>
        <button
          onClick={() => handleTabChange("general")}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === "general"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <List size={18} />
          أسئلة عامة
        </button>
        <button
          onClick={() => handleTabChange("passage")}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === "passage"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FileText size={18} />
          قطعة ثابتة
        </button>
      </div>
      
      <div className="pt-2">{renderTabContent()}</div>
    </div>
  );
};
export default McqSharedPassageEditor;