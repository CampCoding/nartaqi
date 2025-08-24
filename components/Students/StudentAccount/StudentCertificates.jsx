import React, { useState } from "react";
import { 
  Download, 
  Eye, 
  Award, 
  Calendar, 
  User, 
  FileText, 
  Share2, 
  Star, 
  Trophy, 
  Medal,
  ExternalLink,
  CheckCircle,
  Filter,
  Search,
  Grid,
  List
} from "lucide-react";

export default function StudentsCertificates() {
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [filterGrade, setFilterGrade] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Enhanced certificates data
  const certificates = [
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
      shareableLink: "https://certificates.example.com/verify/CERT-MATH-2023-001",
      thumbnailUrl: "/cert-thumbnails/math.jpg"
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
      shareableLink: "https://certificates.example.com/verify/CERT-ATT-2023-002",
      thumbnailUrl: "/cert-thumbnails/programming.jpg"
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
      shareableLink: "https://certificates.example.com/verify/CERT-ENG-2023-003",
      thumbnailUrl: "/cert-thumbnails/english.jpg"
    }
  ];

  const grades = ["all", "امتياز", "ممتاز", "جيد جداً", "جيد"];
  const categories = [...new Set(certificates.map(cert => cert.category))];

  const getGradeColor = (grade) => {
    switch(grade) {
      case "امتياز": return "from-emerald-400 to-green-500";
      case "ممتاز": return "from-blue-400 to-cyan-500";
      case "جيد جداً": return "from-purple-400 to-pink-500";
      case "جيد": return "from-orange-400 to-red-500";
      default: return "from-gray-400 to-gray-500";
    }
  };

  const getGradeTextColor = (grade) => {
    switch(grade) {
      case "امتياز": return "text-emerald-700 bg-emerald-100";
      case "ممتاز": return "text-blue-700 bg-blue-100";
      case "جيد جداً": return "text-purple-700 bg-purple-100";
      case "جيد": return "text-orange-700 bg-orange-100";
      default: return "text-gray-700 bg-gray-100";
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.includes(searchTerm) || 
                         cert.courseTitle.includes(searchTerm) ||
                         cert.instructorName.includes(searchTerm);
    const matchesGrade = filterGrade === "all" || cert.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const CertificateGridCard = ({ certificate }) => (
    <div className="group bg-white rounded-3xl border-2 border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
      {/* Certificate thumbnail/preview */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        
        {/* Mock certificate design */}
        <div className="absolute inset-4 bg-white rounded-2xl shadow-inner flex items-center justify-center border-4 border-gradient-to-r from-blue-200 to-purple-200">
          <div className="text-center p-4">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${getGradeColor(certificate.grade)} flex items-center justify-center shadow-lg`}>
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-xs font-bold text-gray-600 mb-1">شهادة إتمام</div>
            <div className="text-sm font-bold !text-white leading-tight">{certificate.courseTitle}</div>
          </div>
        </div>

        {/* Grade badge */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${getGradeTextColor(certificate.grade)} shadow-sm`}>
            {certificate.grade} ({certificate.gradePercentage}%)
          </div>
        </div>

        {/* Verification badge */}
        {certificate.verified && (
          <div className="absolute top-4 left-4">
            <div className="bg-green-500 text-white p-1.5 rounded-full shadow-sm">
              <CheckCircle size={14} />
            </div>
          </div>
        )}
      </div>

      {/* Certificate details */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {certificate.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <User size={14} />
            <span>{certificate.instructorName}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{new Date(certificate.issueDate).toLocaleDateString('ar-EG')}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText size={12} />
              <span>{certificate.duration}</span>
            </div>
          </div>
        </div>

        {/* Skills tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {certificate.skills.slice(0, 2).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {skill}
              </span>
            ))}
            {certificate.skills.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                +{certificate.skills.length - 2} مهارة
              </span>
            )}
          </div>
        </div>

        {/* Certificate ID */}
        <div className="mb-4 p-2 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-500">رقم الشهادة</div>
          <div className="text-sm font-mono text-gray-800">{certificate.certificateId}</div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCertificate(certificate)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium"
          >
            <Eye size={16} />
            عرض
          </button>
          <a
            href={certificate.pdfUrl}
            download
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium"
          >
            <Download size={16} />
            تنزيل
          </a>
        </div>
      </div>
    </div>
  );

  const CertificateListItem = ({ certificate }) => (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex items-center gap-6">
        {/* Certificate icon/preview */}
        <div className="relative">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${getGradeColor(certificate.grade)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            <Award className="w-10 h-10 text-white" />
          </div>
          {certificate.verified && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-sm">
              <CheckCircle size={12} />
            </div>
          )}
        </div>

        {/* Certificate details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                {certificate.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>الدورة: {certificate.courseTitle}</span>
                <span>•</span>
                <span>المعلم: {certificate.instructorName}</span>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${getGradeTextColor(certificate.grade)}`}>
              {certificate.grade} ({certificate.gradePercentage}%)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={12} />
              <span>تاريخ الإصدار: {new Date(certificate.issueDate).toLocaleDateString('ar-EG')}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={12} />
              <span>مدة الدورة: {certificate.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy size={12} />
              <span>التصنيف: {certificate.category}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {certificate.skills.map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                {skill}
              </span>
            ))}
          </div>

          {/* Certificate ID */}
          <div className="text-xs text-gray-500 mb-4">
            رقم الشهادة: <span className="font-mono text-gray-800">{certificate.certificateId}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 min-w-fit">
          <button
            onClick={() => setSelectedCertificate(certificate)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium"
          >
            <Eye size={16} />
            عرض تفاصيل
          </button>
          <a
            href={certificate.pdfUrl}
            download
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium"
          >
            <Download size={16} />
            تنزيل PDF
          </a>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-colors text-sm font-medium">
            <Share2 size={16} />
            مشاركة
          </button>
        </div>
      </div>
    </div>
  );

  const CertificateModal = ({ certificate, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="relative p-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center`}>
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{certificate.title}</h2>
              <p className="text-blue-100">{certificate.courseTitle}</p>
            </div>
            {certificate.verified && (
              <div className="bg-green-400 text-white p-2 rounded-full">
                <CheckCircle size={20} />
              </div>
            )}
          </div>
        </div>

        {/* Modal content */}
        <div className="p-8">
          {/* Certificate preview */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border-2 border-dashed border-gray-200">
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r ${getGradeColor(certificate.grade)} flex items-center justify-center shadow-xl`}>
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">شهادة إتمام بدرجة</h3>
              <div className={`inline-block px-6 py-3 rounded-2xl text-lg font-bold ${getGradeTextColor(certificate.grade)} mb-4`}>
                {certificate.grade} ({certificate.gradePercentage}%)
              </div>
            </div>
          </div>

          {/* Certificate details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <User size={16} />
                  <span className="font-medium">المعلم المسؤول</span>
                </div>
                <div className="text-gray-800 font-semibold">{certificate.instructorName}</div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar size={16} />
                  <span className="font-medium">تاريخ الإصدار</span>
                </div>
                <div className="text-gray-800 font-semibold">
                  {new Date(certificate.issueDate).toLocaleDateString('ar-EG')}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Trophy size={16} />
                  <span className="font-medium">التصنيف</span>
                </div>
                <div className="text-gray-800 font-semibold">{certificate.category}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FileText size={16} />
                  <span className="font-medium">مدة الدورة</span>
                </div>
                <div className="text-gray-800 font-semibold">{certificate.duration}</div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <CheckCircle size={16} />
                  <span className="font-medium">رقم الشهادة</span>
                </div>
                <div className="text-gray-800 font-mono font-semibold text-sm">
                  {certificate.certificateId}
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <ExternalLink size={16} />
                  <span className="font-medium">رابط التحقق</span>
                </div>
                <a 
                  href={certificate.shareableLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-700 hover:text-green-800 text-sm underline break-all"
                >
                  {certificate.shareableLink}
                </a>
              </div>
            </div>
          </div>

          {/* Skills earned */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Star size={16} />
              المهارات المكتسبة
            </h4>
            <div className="flex flex-wrap gap-2">
              {certificate.skills.map((skill, index) => (
                <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <a
              href={certificate.pdfUrl}
              download
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              <Download size={18} />
              تنزيل الشهادة (PDF)
            </a>
            <button className="flex items-center justify-center gap-2 py-3 px-6 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium">
              <Share2 size={18} />
              مشاركة الشهادة
            </button>
            <button
              onClick={onClose}
              className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className=" rounded-3xl shadow-lg border border-gray-100 p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">شهاداتي المعتمدة</h2>
          <p className="text-gray-600">
            مجموعة الشهادات والإنجازات الأكاديمية ({certificates.length} شهادة)
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في الشهادات..."
            className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Grade filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
          >
            <option value="all">جميع الدرجات</option>
            {grades.slice(1).map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white p-4 rounded-2xl text-center">
          <div className="text-2xl font-bold">{certificates.filter(c => c.grade === "امتياز").length}</div>
          <div className="text-sm text-white opacity-90">امتياز</div>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white p-4 rounded-2xl text-center">
          <div className="text-2xl font-bold">{certificates.filter(c => c.grade === "ممتاز").length}</div>
          <div className="text-sm text-white opacity-90">ممتاز</div>
        </div>
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-4 rounded-2xl text-center">
          <div className="text-2xl font-bold">{certificates.filter(c => c.grade === "جيد جداً").length}</div>
          <div className="text-sm text-white opacity-90">جيد جداً</div>
        </div>
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-4 rounded-2xl text-center">
          <div className="text-2xl font-bold">
            {Math.round(certificates.reduce((sum, cert) => sum + cert.gradePercentage, 0) / certificates.length)}%
          </div>
          <div className="text-sm text-white opacity-90">المعدل العام</div>
        </div>
      </div>

      {/* Certificates display */}
      {filteredCertificates.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm || filterGrade !== "all" ? "لم يتم العثور على شهادات مطابقة للبحث" : "لا توجد شهادات حتى الآن"}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm || filterGrade !== "all" ? "جرب تغيير كلمات البحث أو المرشحات" : "أكمل الدورات للحصول على الشهادات المعتمدة"}
          </p>
        </div>
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "space-y-6"
        }>
          {filteredCertificates.map((certificate) => (
            viewMode === "grid" ? (
              <CertificateGridCard key={certificate.id} certificate={certificate} />
            ) : (
              <CertificateListItem key={certificate.id} certificate={certificate} />
            )
          ))}
        </div>
      )}

      {/* Certificate detail modal */}
      {selectedCertificate && (
        <CertificateModal 
          certificate={selectedCertificate} 
          onClose={() => setSelectedCertificate(null)} 
        />
      )}
    </div>
  );
}