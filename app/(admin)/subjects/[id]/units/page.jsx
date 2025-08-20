"use client";

import React, { useMemo, useState } from "react";
import PageLayout from "../../../../../components/layout/PageLayout";
import {
  BarChart3,
  Book,
  Download,
  Eye,
  Layers,
  Plus,
  Upload,
} from "lucide-react";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../components/ui/PagesHeader";
import Button from "../../../../../components/atoms/Button";
import { useParams } from "next/navigation";
import { subjects } from "../../../../../data/subjects";
import UnitsStats from "../../../../../components/Units/UnitStats";
import SearchAndFilters from "../../../../../components/ui/SearchAndFilters";
import UnitCard from "../../../../../components/ui/Cards/UnitCard";
import AddUnitForm from "./../../../../../components/Units/AddNewUnit.modal";
import DeleteUnitModal from "../../../../../components/Units/DeleteUnit.modal";
import SubjectDetails from "../../../../../components/Subjects/SubjectOverviewSection";
import HorizontalTabs from "../../../../../components/ui/Tab";
import SubjectComments from "../../../../../components/Subjects/SubjectComments";
import SubjectStudentsSection from "../../../../../components/Subjects/SubjectStudents";
import EditUnitForm from "../../../../../components/Units/EditUnit.modal";

const Units = () => {
  const { id } = useParams();
  const [mode, setMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [newUnitModal, setNewUnitModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [rowData, setRowData] = useState(null);

  const selectedSubject = useMemo(() => {
    const subject = subjects.find((subject) => subject.code === id);
    console.log(subject);
    return subject;
  }, [id]);
  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "الدورات", href: "/subjects", icon: Book },
    { label: selectedSubject?.name, href: "#", current: true },
  ];

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
      label: "نظرة عامة",
      icon: Eye,
      gradient: "from-purple-500 to-pink-500",
      content: <SubjectDetails />,
    },
    {
      id: 1,
      label: "مراحل الدورة",
      icon: Layers,
      gradient: "from-blue-500 to-cyan-500",
      content: (
        <>
          <SearchAndFilters
            mode={mode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setMode={setMode}
          />

          {/* Content */}
          {mode === "table" ? (
            ""
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedSubject?.units?.map((unit, index) => (
                <UnitCard
                  onDeleteClick={(e, data) => {
                    setSelectedUnit(data);
                    console.log("selectedData", data);
                    setDeleteModal(true);
                  }}
                  onEditUnit={(e, data) => {
                    setSelectedUnit(data);
                    setEditModal(true);
                  }}
                  unit={unit}
                  key={index}
                />
              ))}
            </div>
          )}
        </>
      ),
    },
    {
      id: 2,
      label: "التعليقات على الدورة",
      icon: Layers,
      gradient: "from-blue-500 to-cyan-500",
      content: (
        <div className="p-6">
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
        </div>
      ),
    },
    {
      id: 3,
      label: "الطلاب المشتركين في الدورة",
      icon: Layers,
      gradient: "from-blue-500 to-cyan-500",
      content: (
        <SubjectStudentsSection
          subjectName="Biology"
          students={[
            {
              id: 1,
              name: "Amira N.",
              email: "amira@example.com",
              avatarUrl: "https://i.pravatar.cc/100?img=1",
              status: "active",
              grade: "A",
              lastActivity: "2025-08-16T15:22:00Z",
              enrolledAt: "2025-02-01",
              notesCount: 4,
            },
          ]}
          onView={(s) => console.log("view", s)}
          onEdit={(s) => console.log("edit", s)}
          onMessage={(ids) => console.log("message ->", ids)}
          onRemove={async (ids) => console.log("remove ->", ids)}
          onAddStudent={() => console.log("add student")}
          onExportCSV={(rows) => console.log("export rows", rows)}
        />
      ),
    },
  ];

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

      {/* Header */}
      <PagesHeader
        title={
          <>
            الدورة:{" "}
            <span className="text-primary">{selectedSubject?.name}</span>
          </>
        }
        subtitle={"نظّم وأدر موادك التعليمية"}
        extra={
          <div className="flex  gap-4">
            <Button type="default" icon={<Upload className="w-4 h-4" />}>
              استيراد
            </Button>
            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
              تصدير
            </Button>
            <Button
              onClick={() => setNewUnitModal(true)}
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              إضافة موضوع جديد
            </Button>
          </div>
        }
      />

      <UnitsStats units={selectedSubject.units} />
      <HorizontalTabs tabs={tabs} />

      <AddUnitForm
        open={newUnitModal}
        onCancel={() => setNewUnitModal(false)}
        onSubmit={() => null}
        subjects={subjects}
      />

      <DeleteUnitModal
        open={deleteModal}
        setOpne={setDeleteModal}
        data={selectedUnit}
      />
      <EditUnitForm
        open={editModal}
        onCancel={() => setEditModal(false)}
        unit={selectedUnit}
        subjects={subjects}
      />
    </PageLayout>
  );
};

export default Units;
