"use client";
import React, { useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import PagesHeader from "../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import { BarChart3, Book, Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "الدورات", href: "#", icon: Book, current: true },
];

export default function page() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 👈 تبويب افتراضي (الكل)
  const [NewModal, setNewModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activationModal, setActivationModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  return (
    <PageLayout>
      <div style={{ dir: "rtl" }}>
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
        <PagesHeader
          title={"إدارة دورات الوجهه المصرية"}
          subtitle={"نظّم وأدر موادك التعليمية"}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              
              <Button
                onClick={() => router.push(`/egyptian_course/add-course`)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة دورة جديدة
              </Button>
            </div>
          }
        />
        <SearchAndFilters
          mode={viewMode}
          setMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
    </PageLayout>
  );
}
