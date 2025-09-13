import React from 'react'

 const CertificateModal = ({ certificate, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div className="relative p-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden`}>
              {certificate.thumbnailUrl ? (
                <img src={certificate.thumbnailUrl} alt={certificate.title} className="w-full h-full object-cover" />
              ) : (
                <Award className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{certificate.title}</h2>
              <p className="text-blue-100">{certificate.courseTitle || "—"}</p>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { onClose(); openEdit(certificate); }}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                title="تعديل"
              >
                <Edit size={18}/>
              </button>
              <button
                onClick={() => { onClose(); deleteCertificate(certificate.id); }}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                title="حذف"
              >
                <Trash2 size={18}/>
              </button>
            </div>
          </div>
        </div>

        {/* content */}
        <div className="p-8">
          {/* preview */}
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

          {/* details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <User size={16} />
                  <span className="font-medium">المعلم المسؤول</span>
                </div>
                <div className="text-gray-800 font-semibold">{certificate.instructorName || "—"}</div>
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
                <div className="text-gray-800 font-semibold">{certificate.category || "أخرى"}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FileText size={16} />
                  <span className="font-medium">مدة الدورة</span>
                </div>
                <div className="text-gray-800 font-semibold">{certificate.duration || "—"}</div>
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

              {certificate.shareableLink && (
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
              )}
            </div>
          </div>

          {!!certificate.skills?.length && (
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
          )}

          <div className="flex gap-4">
            <a
              href={certificate.pdfUrl || "#"}
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

  export default CertificateModal;
