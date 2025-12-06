import React from "react";
import Card from "../atoms/Card";
import Input from "../atoms/Input";
import { Search } from "lucide-react";
import Select from "../atoms/Select";

const QuestionsSearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  selectedSubject,
  setSelectedSubject,
  selectedType,
  setSelectedType,
}) => {
  const subjectOptions = [
    { value: "math", label: "الرياضيات" },
    { value: "science", label: "العلوم" },
    { value: "history", label: "التاريخ" },
    { value: "english", label: "الإنجليزية" },
  ];

  const typeOptions = [
    { value: "mcq", label: "اختيار من متعدد" },
    { value: "truefalse", label: "صواب/خطأ" },
    { value: "essay", label: "مقالي" },
    { value: "fillblanks", label: "إكمال الفراغات" },
  ];

  return (
    <div className="mb-8" dir="rtl">
      {/* البحث والفلاتر */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="ابحث عن الأسئلة..."
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            placeholder="تصفية حسب الدورة"
            options={subjectOptions}
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          />

          <Select
            placeholder="تصفية حسب النوع"
            options={typeOptions}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          />
        </div>
      </Card>
    </div>
  );
};

export default QuestionsSearchAndFilters;
