"use client";

import React, { useMemo, useState } from "react";
import {
  Plus,
  BookOpen,
  Trash2,
  BarChart3,
  Book,
  AlertTriangle,
  Eye,
  FileQuestion,
  MessageCircle,
} from "lucide-react";
import BreadcrumbsShowcase from "../../../../../../../../../components/ui/BreadCrumbs";
import { subjects } from "../../../../../../../../../data/subjects";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "../../../../../../../../../components/atoms/Button";
import PagesHeader from "./../../../../../../../../../components/ui/PagesHeader";
import QuestionsSearchAndFilters from "../../../../../../../../../components/Questions/QuestionsSearchAndFilters";
import QuestionCard from "../../../../../../../../../components/ui/Cards/QuestionCard";
import { Modal } from "antd";
import MCQPrev from "../../../../../../../../../components/Previews/MCQ.preview";
import EssayPrev from "../../../../../../../../../components/Previews/Essay.preview";
import CustomModal from "../../../../../../../../../components/layout/Modal";
import PageLayout from "../../../../../../../../../components/layout/PageLayout";
import HorizontalTabs from "../../../../../../../../../components/ui/Tab";
import TopicVideo from "../../../../../../../../../components/Topics/TopicVid";
import SubjectComments from "../../../../../../../../../components/Subjects/SubjectComments";

const TopicQuestions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const { id, unitId, topicId } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState(null);

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

  // أمثلة أسئلة (نصوص مترجمة للعربية)
  const questions = [
    {
      id: 1,
      question: "ما حاصل 2 + 2؟",
      type: "MCQ",
      subject: "الرياضيات",
      difficulty: "Easy",
      createdAt: "2024-08-01",
      lastModified: "2024-08-01",
      usageCount: 15,
      tags: ["أساسيات", "جمع"],
    },
    {
      id: 2,
      question: "الأرض مسطّحة.",
      type: "True/False",
      subject: "العلوم",
      difficulty: "Easy",
      createdAt: "2024-07-28",
      lastModified: "2024-07-30",
      usageCount: 8,
      tags: ["جغرافيا", "حقائق"],
    },
    {
      id: 3,
      question: "اشرح أسباب الحرب العالمية الثانية.",
      type: "Essay",
      subject: "التاريخ",
      difficulty: "Hard",
      createdAt: "2024-07-25",
      lastModified: "2024-07-26",
      usageCount: 12,
      tags: ["حرب عالمية", "تحليل"],
    },
    {
      id: 4,
      question: "احسب مشتقة x² + 3x - 5",
      type: "MCQ",
      subject: "الرياضيات",
      difficulty: "Medium",
      createdAt: "2024-07-22",
      lastModified: "2024-07-23",
      usageCount: 22,
      tags: ["تفاضل", "مشتقات"],
    },
  ];

  const [deleteModal, setDeleteModal] = useState(false);

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "الدورات", href: "/subjects", icon: Book },
    { label: selectedSubjectAndUnitWithTopic?.subject?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.unit?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.topic?.name, href: "#" },
    { label: "بنك الأسئلة", href: "#", current: true },
  ];

  const [prevModal, setPrevModal] = useState(false);

  const handleCreate = async (data) => {
    // POST /api/subjects/:id/comments
    console.log("create", data);
  };
  const handleUpdate = async (id, data) => {
    console.log("update", id, data);
  };
  const handleDelete = async (id) => {
    console.log("delete", id);
  };

  const sampleComments = [
    {
      id: "c1",
      authorId: "u1",
      authorName: "أحمد علي",
      rating: 5,
      contentHtml: "<p>دورة ممتازة ومحتوى واضح 👏</p>",
      createdAt: new Date().toISOString(),
    },
  ];

  const tabs = [
    {
      id: 0,
      label: "عرض الدرس",
      icon: Eye,
      gradient: "from-purple-500 to-pink-500",
      content: (
        <>
          <TopicVideo />
        </>
      ),
    },
    {
      id: 1,
      label: "بنك الأسئلة",
      icon: FileQuestion,
      gradient: "from-blue-500 to-cyan-500",
      content: (
        <>
          <QuestionsSearchAndFilters
            {...{
              searchTerm,
              setSearchTerm,
              selectedSubject,
              setSelectedSubject,
              selectedType,
              setSelectedType,
            }}
          />

          {/* شبكة الأسئلة */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {questions.map((question) => (
              <QuestionCard
                selectedQuestion={selectedQuestion}
                setSelectedQuestion={setSelectedQuestion}
                prevModal={prevModal}
                setPrevModal={setPrevModal}
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                question={question}
                key={question.id}
              />
            ))}
          </div>
        </>
      ),
    },
    {
      id: 2,
      label: "التعليقات على الدرس",
      icon: MessageCircle,
      gradient: "from-blue-500 to-cyan-500",
      content: (
        <>
          <SubjectComments
            subjectId="subj-1"
            comments={sampleComments}
            currentUser={{ id: "u1", isAdmin: false }}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            pageSize={5}
            allowRating={true}
          />{" "}
        </>
      ),
    },
  ];

  return (
    <>
      <PageLayout>
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        {/* الهيدر */}
        <PagesHeader
          extra={
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
                <BookOpen className="w-5 h-5 text-[#0F7490]" />
                <span className="text-sm font-medium text-[#202938]">
                  {questions.length} سؤال
                </span>
              </div>
              <Link href={"questions/new"}>
                <Button
                  type="primary"
                  size="large"
                  className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  إضافة سؤال جديد
                </Button>
              </Link>
            </div>
          }
          title={
            <>
              {selectedSubjectAndUnitWithTopic?.topic?.name} :{" "}
              <span className="text-primary">بنك الأسئلة</span>
            </>
          }
          subtitle={"إدارة وتنظيم أسئلتك التعليمية"}
        />

        <HorizontalTabs tabs={tabs} />

        {/* نافذة معاينة السؤال */}
        {selectedQuestion?.type == "MCQ" ? (
          <Modal
            footer={null}
            open={prevModal}
            className="!w-[40%]"
            onCancel={() => setPrevModal(!prevModal)}
          >
            <MCQPrev />
          </Modal>
        ) : (
          <Modal
            footer={null}
            open={prevModal}
            className="!w-[40%]"
            onCancel={() => setPrevModal(!prevModal)}
          >
            <EssayPrev />
          </Modal>
        )}

        {/* نافذة الحذف */}
        <CustomModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          title="حذف السؤال"
          size="sm"
        >
          <div className="space-y-4" dir="rtl">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-900">هل أنت متأكد؟</h4>
                <p className="text-sm text-red-700">
                  لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">السؤال المراد حذفه:</p>
              <p className="font-medium text-[#202938]">
                {selectedQuestion?.question}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => null}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                حذف السؤال
              </button>
            </div>
          </div>
        </CustomModal>
      </PageLayout>
    </>
  );
};

export default TopicQuestions;
