import React from 'react'

export default function CertificateStats({certificates}) {
  return (
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
            {Math.round(certificates.reduce((sum, cert) => sum + (cert.gradePercentage || 0), 0) / Math.max(certificates.length, 1))}%
          </div>
          <div className="text-sm text-white opacity-90">المعدل العام</div>
        </div>
      </div>
  )
}
