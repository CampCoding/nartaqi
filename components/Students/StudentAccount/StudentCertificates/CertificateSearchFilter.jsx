import { Filter, Search } from 'lucide-react'
import React from 'react'

export default function CertificateSearchFilter({searchTerm , setSearchTerm}) {
  return (
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
   
           </div>
         </div>
  )
}
