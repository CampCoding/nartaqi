import { ConfigProvider, Divider, Modal } from "antd";
import { 
  Calendar, 
  Eye, 
  MessageSquareMore, 
  X, 
  Share2, 
  Heart,
  Bookmark,
  Clock,
  User,
  Tag
} from "lucide-react";
import React, { useState } from "react";

// Assuming PALETTE is imported from your constants
const PALETTE = {
  primary: "#0F7490",
  text: "#1F2937",
};

export default function BlogDetailsModal({ open, setOpen, rowData }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <ConfigProvider
      direction="rtl"
      theme={{
        token: {
          colorPrimary: PALETTE.primary,
          borderRadius: 16,
          colorText: PALETTE.text,
          controlHeight: 44,
        },
      }}
    >
      <Modal
        open={open}
        className="!w-full !max-w-5xl !top-4"
        onCancel={() => setOpen(false)}
        title={null}
        footer={null}
        closeIcon={null}
        styles={{
          content: {
            padding: 0,
            borderRadius: 20,
            overflow: 'hidden',
          },
          body: {
            padding: 0,
          }
        }}
      >
        <div className="bg-white" dir="rtl">
          {/* Header with close button */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">مدونة الشركة</p>
                  <p className="text-xs text-gray-500">منشور جديد</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
              
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {/* Main content grid */}
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Image section */}
              <div className="lg:col-span-3">
                <div className="relative group overflow-hidden rounded-2xl">
                  <img 
                    src={rowData?.image || '/api/placeholder/800/600'} 
                    className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={rowData?.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Image overlay stats */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span>{rowData?.views?.toLocaleString() || 0} مشاهدة</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MessageSquareMore className="w-4 h-4" />
                            <span>{rowData?.comments || 0} تعليق</span>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content section */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Title and meta */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      تقنية
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                      جديد
                    </span>
                  </div>
                  
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {rowData?.title || "عنوان المقال الافتراضي"}
                  </h1>
                  
                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <Calendar className="w-4 h-4" />
                      <span>{rowData?.date || "اليوم"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <Eye className="w-4 h-4" />
                      <span>{rowData?.views?.toLocaleString() || 0} مشاهدة</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <MessageSquareMore className="w-4 h-4" />
                      <span>{rowData?.comments || 0} تعليق</span>
                    </div>
                  </div>
                </div>

                <Divider className="my-2" />

                {/* Description */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">نظرة عامة</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed text-base">
                      {rowData?.desc || 
                        "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد."
                      }
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    العلامات
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(rowData?.tags || ['تطوير', 'تصميم', 'تقنية', 'برمجة']).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
               
              </div>
            </div>

            {/* Additional stats bar */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <div className="text-2xl font-bold text-gray-900">{rowData?.views?.toLocaleString() || "1,234"}</div>
                  <div className="text-sm text-gray-500">إجمالي المشاهدات</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <div className="text-2xl font-bold text-gray-900">{rowData?.comments || "56"}</div>
                  <div className="text-sm text-gray-500">التعليقات</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <div className="text-2xl font-bold text-gray-900">89</div>
                  <div className="text-sm text-gray-500">الإعجابات</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <div className="text-2xl font-bold text-gray-900">23</div>
                  <div className="text-sm text-gray-500">المشاركات</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}