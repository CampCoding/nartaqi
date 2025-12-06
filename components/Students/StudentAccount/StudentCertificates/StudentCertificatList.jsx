import { Award, Calendar, CheckCircle, Download, Eye, FileText, Share2, Trophy } from "lucide-react";
import ActionCorner from "./ActionCorner";

const CertificateListItem = ({ certificate ,getGradeTextColor, openEdit , deleteCertificate }) => (
    <div className="relative group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
      <ActionCorner
        onEdit={() => openEdit(certificate)}
        onDelete={() => deleteCertificate(certificate.id)}
      />

      <div className="flex items-center gap-6">
        {/* Icon/preview */}
        <div className="relative">
          {certificate.thumbnailUrl ? (
            <img
              src={certificate.thumbnailUrl}
              alt={certificate.title}
              className="w-20 h-20 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform"
            />
          ) : (
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${getGradeColor(certificate.grade)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <Award className="w-10 h-10 text-white" />
            </div>
          )}
          {certificate.verified && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-sm">
              <CheckCircle size={12} />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                {certificate.title}
              </h3>
              
            </div>
            
         
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={12} />
              <span>تاريخ الإنجاز: {new Date(certificate.issueDate).toLocaleDateString('ar-EG')}</span>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 min-w-fit">
          
          <a
            href={certificate.pdfUrl || "#"}
            download
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium"
          >
            <Download size={16} />
            تنزيل PDF
          </a>
        </div>
      </div>
    </div>
  );


  export default CertificateListItem