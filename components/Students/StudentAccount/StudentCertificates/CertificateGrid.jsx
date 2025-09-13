import { Award, Calendar, CheckCircle, Download } from "lucide-react";
import ActionCorner from "./ActionCorner";

  const CertificateGridCard = ({ certificate  , openEdit, deleteCertificate , getGradeColor , getGradeTextColor}) => (
    <div className="relative group bg-white rounded-3xl border-2 border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
      <ActionCorner
        onEdit={() => openEdit(certificate)}
        onDelete={() => deleteCertificate(certificate.id)}
      />

      {/* Header preview */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        {certificate.thumbnailUrl && (
          <img
            src={certificate.thumbnailUrl}
            alt={certificate.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

        {!certificate.thumbnailUrl && (
          <div className="absolute inset-4 bg-white rounded-2xl shadow-inner flex items-center justify-center border-4 border-gradient-to-r from-blue-200 to-purple-200">
            <div className="text-center p-4">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${getGradeColor(certificate.grade)} flex items-center justify-center shadow-lg`}>
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-xs font-bold text-gray-600 mb-1">شهادة إتمام</div>
              <div className="text-sm font-bold text-gray-800 leading-tight line-clamp-1">
                {certificate.courseTitle || "—"}
              </div>
            </div>
          </div>
        )}

        {/* Grade */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${getGradeTextColor(certificate.grade)} shadow-sm`}>
            {certificate.grade} ({certificate.gradePercentage}%)
          </div>
        </div>

        {/* verification */}
        {certificate.verified && (
          <div className="absolute top-4 left-14">
            <div className="bg-green-500 text-white p-1.5 rounded-full shadow-sm">
              <CheckCircle size={14} />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {certificate.title}
          </h3>
         
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex text-gray-800 text-lg items-center gap-1">
              <p>تاريخ الانجاز : </p>
              <Calendar size={12} />
              <span className="!text-md">{new Date(certificate.issueDate).toLocaleDateString('ar-EG')}</span>
            </div>
          
          </div>
        </div>


       
        <div className="flex gap-2">        
          <a
            href={certificate.pdfUrl || "#"}
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

  export default CertificateGridCard