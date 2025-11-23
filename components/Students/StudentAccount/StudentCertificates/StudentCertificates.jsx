"use client";
import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import CertificateGridCard from "./CertificateGrid";
import CertificateListItem from "./StudentCertificatList";
import CertificateModal from "./CertificateModal";
import AddCertificateModal from "./AddCertificateModal";
import EditCertificateModal from "./EditCertificateModal";
import CertificateStats from "./CertificateStats";
import CertificateSearchFilter from "./CertificateSearchFilter";
import CertificateHeader from "./CertificateHeader";
// import { handleGetAllCertificates } from "../../../../lib/features/certificateSlice";
import { useDispatch, useSelector } from "react-redux";

export default function StudentsCertificates({student_id}) {
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [filterGrade, setFilterGrade] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCert, setEditingCert] = useState(null); // <- edit modal state

  // ==== Seed + persistence ====
  const SEED = [
    {
      id: 1,
      title: "شهادة إتمام دورة الرياضيات الممتعة",
      courseTitle: "الرياضيات الممتعة",
      issueDate: "2023-11-15",
      grade: "امتياز",
      gradePercentage: 95,
      instructorName: "أ. خالد محمود",
      pdfUrl: "/certificates/math-cert.pdf",
      certificateId: "CERT-MATH-2023-001",
      category: "العلوم والرياضيات",
      duration: "3 أشهر",
      skills: ["حل المسائل", "التفكير المنطقي", "العمليات الحسابية"],
      verified: true,
      shareableLink:
        "https://certificates.example.com/verify/CERT-MATH-2023-001",
      thumbnailUrl: "/cert-thumbnails/math.jpg",
    },
    {
      id: 2,
      title: "شهادة تقدير للالتزام والحضور",
      courseTitle: "أساسيات البرمجة للأطفال",
      issueDate: "2023-10-30",
      grade: "جيد جداً",
      gradePercentage: 88,
      instructorName: "أ. سارة أحمد",
      pdfUrl: "/certificates/attendance-cert.pdf",
      certificateId: "CERT-ATT-2023-002",
      category: "التكنولوجيا والبرمجة",
      duration: "4 أشهر",
      skills: ["البرمجة الأساسية", "حل المشاكل", "التفكير الحاسوبي"],
      verified: true,
      shareableLink:
        "https://certificates.example.com/verify/CERT-ATT-2023-002",
      thumbnailUrl: "/cert-thumbnails/programming.jpg",
    },
    {
      id: 3,
      title: "شهادة إتمام دورة اللغة الإنجليزية المتقدمة",
      courseTitle: "اللغة الإنجليزية - المستوى الثاني",
      issueDate: "2023-12-20",
      grade: "ممتاز",
      gradePercentage: 92,
      instructorName: "أ. مريم حسن",
      pdfUrl: "/certificates/english-cert.pdf",
      certificateId: "CERT-ENG-2023-003",
      category: "اللغات",
      duration: "6 أشهر",
      skills: ["المحادثة", "القواعد", "المفردات المتقدمة"],
      verified: true,
      shareableLink:
        "https://certificates.example.com/verify/CERT-ENG-2023-003",
      thumbnailUrl: "/cert-thumbnails/english.jpg",
    },
  ];

  const [certificates, setCertificates] = useState(SEED);

  const dispatch = useDispatch();
  const {certificate_loading , certificate_list} = useSelector(state => state?.certificate);

  // useEffect(() => {
  //   const data_send = {
  //      student_id : student_id
  //   }
  //   dispatch(handleGetAllCertificates({body : data_send}))
  // } , [dispatch])
  
  // useEffect(() => {
  //   console.log(certificate_list)
  // } , [certificate_list])

  useEffect(() => {
    const saved = localStorage.getItem("students_certificates");
    if (saved) {
      try {
        setCertificates(JSON.parse(saved));
      } catch {
        setCertificates(SEED);
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("students_certificates", JSON.stringify(certificates));
  }, [certificates]);

  const getGradeColor = (grade) => {
    switch (grade) {
      case "امتياز":
        return "from-emerald-400 to-green-500";
      case "ممتاز":
        return "from-blue-400 to-cyan-500";
      case "جيد جداً":
        return "from-purple-400 to-pink-500";
      case "جيد":
        return "from-orange-400 to-red-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getGradeTextColor = (grade) => {
    switch (grade) {
      case "امتياز":
        return "text-emerald-700 bg-emerald-100";
      case "ممتاز":
        return "text-blue-700 bg-blue-100";
      case "جيد جداً":
        return "text-purple-700 bg-purple-100";
      case "جيد":
        return "text-orange-700 bg-orange-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const filteredCertificates = certificates.filter((cert) => {
    const term = searchTerm.trim();
    const matchesSearch =
      !term ||
      cert.title?.includes(term) ||
      cert.courseTitle?.includes(term) ||
      cert.instructorName?.includes(term);
    const matchesGrade = filterGrade === "all" || cert.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  // ==== CRUD Handlers ====
  const addCertificate = (cert) => {
    setCertificates((prev) => [cert, ...prev]);
  };

  const openEdit = (cert) => setEditingCert(cert);

  const saveEdit = (updated) => {
    setCertificates((prev) =>
      prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
    );
    setEditingCert(null);
  };

  const deleteCertificate = (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الشهادة؟")) return;
    setCertificates((prev) => prev.filter((c) => c.id !== id));
    if (editingCert?.id === id) setEditingCert(null);
    if (selectedCertificate?.id === id) setSelectedCertificate(null);
  };

  // ==== UI ====
  return (
    <div className="rounded-3xl shadow-lg border border-gray-100 p-8" dir="rtl">
      {/* Header */}
      <CertificateHeader
        viewMode={viewMode}
        setIsAdding={setIsAdding}
        setViewMode={setViewMode}
        certificates={certificates}
      />

      {/* Filters & search */}
      <CertificateSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Stats */}
      <CertificateStats certificates={certificates} />

      {/* List/Grid */}
      {filteredCertificates.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm || filterGrade !== "all"
              ? "لم يتم العثور على شهادات مطابقة للبحث"
              : "لا توجد شهادات حتى الآن"}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm || filterGrade !== "all"
              ? "جرب تغيير كلمات البحث أو المرشحات"
              : "أكمل الدورات للحصول على الشهادات المعتمدة"}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-6"
          }
        >
          {filteredCertificates.map((certificate) =>
            viewMode === "grid" ? (
              <CertificateGridCard
                getGradeColor={getGradeColor}
                deleteCertificate={deleteCertificate}
                getGradeTextColor={getGradeTextColor}
                openEdit={openEdit}
                key={certificate.id}
                certificate={certificate}
              />
            ) : (
              <CertificateListItem
                deleteCertificate={deleteCertificate}
                openEdit={openEdit}
                key={certificate.id}
                getGradeTextColor={getGradeTextColor}
                certificate={certificate}
              />
            )
          )}
        </div>
      )}

      {/* Detail modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}

      {/* Add modal */}
      {isAdding && (
        <AddCertificateModal
          onClose={() => setIsAdding(false)}
          onSave={addCertificate}
        />
      )}

      {/* Edit modal */}
      {editingCert && (
        <EditCertificateModal
          initial={editingCert}
          onClose={() => setEditingCert(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}
