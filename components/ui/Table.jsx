


// import { SortAsc, SortDesc } from 'lucide-react';
// import { useState } from 'react';


// const Table = ({ columns, dataSource, rowKey, pagination, className = '', ...props }) => {
//   const [sortedData, setSortedData] = useState(dataSource);
//   const [sortField, setSortField] = useState('');
//   const [sortOrder, setSortOrder] = useState('');

//   const handleSort = (field) => {
//     let order = 'asc';
//     if (sortField === field && sortOrder === 'asc') {
//       order = 'desc';
//     }
    
//     const sorted = [...sortedData].sort((a, b) => {
//       if (order === 'asc') {
//         return a[field] > b[field] ? 1 : -1;
//       } else {
//         return a[field] < b[field] ? 1 : -1;
//       }
//     });
    
//     setSortedData(sorted);
//     setSortField(field);
//     setSortOrder(order);
//   };

//   return (
//     <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-100">
//             <tr>
//               {columns.map((column, index) => (
//                 <th
//                   key={index}
//                   className={`px-6 py-4 text-left text-sm font-semibold text-[#202938] ${column.sorter ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''}`}
//                   onClick={() => column.sorter && handleSort(column.dataIndex)}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span>{column.title}</span>
//                     {column.sorter && (
//                       <div className="flex flex-col">
//                         <SortAsc className={`w-3 h-3 ${sortField === column.dataIndex && sortOrder === 'asc' ? 'text-[#0F7490]' : 'text-gray-400'}`} />
//                         <SortDesc className={`w-3 h-3 -mt-1 ${sortField === column.dataIndex && sortOrder === 'desc' ? 'text-[#0F7490]' : 'text-gray-400'}`} />
//                       </div>
//                     )}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {sortedData.map((record, index) => (
//               <tr key={record[rowKey] || index} className="hover:bg-gray-50 transition-colors">
//                 {columns.map((column, colIndex) => (
//                   <td key={colIndex} className="px-6 py-4 text-sm text-[#202938]">
//                     {column.render ? column.render(record[column.dataIndex], record) : record[column.dataIndex]}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {pagination && (
//         <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
//           <span className="text-sm text-[#202938]/60">
//             Showing {dataSource.length} of {dataSource.length} subjects
//           </span>
//           <div className="flex items-center gap-2">
//             <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors">
//               Previous
//             </button>
//             <button className="px-3 py-1 text-sm bg-[#0F7490] text-white rounded hover:bg-[#0F7490]/90 transition-colors">
//               1
//             </button>
//             <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors">
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// export default Table;



import { SortAsc, SortDesc } from "lucide-react";
import React, { useEffect, useState } from "react";

const Table = ({
  columns,
  dataSource = [],
  rowKey,
  pagination,
  loading = false,
  className = "",
  ...props
}) => {
  const [sortedData, setSortedData] = useState(dataSource);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // كل ما الداتا تتغير نعمل ريسيت للـ sortedData
  useEffect(() => {
    setSortedData(dataSource || []);
    setSortField("");
    setSortOrder("");
  }, [dataSource]);

  const handleSort = (field) => {
    if (!field) return;
    let order = "asc";
    if (sortField === field && sortOrder === "asc") {
      order = "desc";
    }

    const sorted = [...sortedData].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal == null && bVal != null) return order === "asc" ? -1 : 1;
      if (aVal != null && bVal == null) return order === "asc" ? 1 : -1;
      if (aVal == null && bVal == null) return 0;

      if (aVal > bVal) return order === "asc" ? 1 : -1;
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      return 0;
    });

    setSortedData(sorted);
    setSortField(field);
    setSortOrder(order);
  };

  const getRowKey = (record, index) => {
    if (typeof rowKey === "function") return rowKey(record);
    if (typeof rowKey === "string") return record[rowKey];
    return record.id || record.code || index;
  };

  const total = pagination?.total ?? sortedData.length;
  const current = pagination?.current ?? 1;
  const perPage = (pagination?.perPage ?? sortedData.length) || 1;

  const start = total === 0 ? 0 : (current - 1) * perPage + 1;
  const end = Math.min(current * perPage, total);

  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const canPrev = current > 1;
  const canNext = current < lastPage;

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full" {...props}>
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-left text-sm font-semibold text-[#202938] ${
                    column.sorter ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""
                  }`}
                  onClick={() => column.sorter && handleSort(column.dataIndex)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {column.sorter && column.dataIndex && (
                      <div className="flex flex-col">
                        <SortAsc
                          className={`w-3 h-3 ${
                            sortField === column.dataIndex && sortOrder === "asc"
                              ? "text-[#0F7490]"
                              : "text-gray-400"
                          }`}
                        />
                        <SortDesc
                          className={`w-3 h-3 -mt-1 ${
                            sortField === column.dataIndex && sortOrder === "desc"
                              ? "text-[#0F7490]"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && sortedData?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns?.length}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  جاري التحميل...
                </td>
              </tr>
            ) : sortedData?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  لا توجد بيانات للعرض
                </td>
              </tr>
            ) : (
              sortedData?.map((record, index) => (
                <tr
                  key={getRowKey(record, index)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-[#202938]">
                      {column.render
                        ? column.render(
                            column.dataIndex ? record[column.dataIndex] : undefined,
                            record
                          )
                        : column.dataIndex
                        ? record[column.dataIndex]
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && total > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-[#202938]/60">
            عرض {start} - {end} من {total} دورة
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={!canPrev}
              onClick={() => canPrev && pagination.onPageChange?.(current - 1)}
              className={`px-3 py-1 text-sm border border-gray-200 rounded transition-colors ${
                canPrev ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
              }`}
            >
              السابق
            </button>
            <span className="px-3 py-1 text-sm bg-[#0F7490] text-white rounded">
              {current}
            </span>
            <button
              disabled={!canNext}
              onClick={() => canNext && pagination.onPageChange?.(current + 1)}
              className={`px-3 py-1 text-sm border border-gray-200 rounded transition-colors ${
                canNext ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
              }`}
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
