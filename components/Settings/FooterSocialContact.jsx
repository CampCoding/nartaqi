import { Trash2, ChevronDown } from "lucide-react";
import React from "react";


export default function FooterSocialContact({
  editContent,
  section,
  handleSave,
  setEditContent,
  setEditingFooterSection,
}) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-4">
      <h4 className="font-semibold mb-4">تحرير معلومات الاتصال</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
          <input
            type="text"
            value={editContent.phone}
            onChange={(e) =>
              setEditContent({ ...editContent, phone: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={editContent.email}
            onChange={(e) =>
              setEditContent({ ...editContent, email: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">العنوان</label>
          <input
            type="text"
            value={editContent.address}
            onChange={(e) =>
              setEditContent({ ...editContent, address: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Social Media Section */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-3">
          وسائل التواصل الاجتماعي
        </label>
        <div className="space-y-3">
          {editContent?.socialMedia?.map((social, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
            >
              <div className="md:col-span-3">
                <input
                  type="text"
                  value={social.name}
                  onChange={(e) => {
                    const newSocial = [...editContent.socialMedia];
                    newSocial[index].name = e.target.value;
                    setEditContent({ ...editContent, socialMedia: newSocial });
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="اسم المنصة"
                />
              </div>
          
              
              <div className="md:col-span-5">
                <input
                  type="url"
                  value={social.url}
                  onChange={(e) => {
                    const newSocial = [...editContent.socialMedia];
                    newSocial[index].url = e.target.value;
                    setEditContent({ ...editContent, socialMedia: newSocial });
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="رابط الملف الشخصي"
                />
              </div>
              
              <div className="md:col-span-2">
                <button
                  onClick={() => {
                    const newSocial = editContent.socialMedia.filter(
                      (_, i) => i !== index
                    );
                    setEditContent({ ...editContent, socialMedia: newSocial });
                  }}
                  className="w-full p-2 text-red-600 hover:bg-red-50 rounded flex justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => {
              setEditContent({
                ...editContent,
                socialMedia: [
                  ...editContent.socialMedia,
                  { name: "", icon: "", url: "" },
                ],
              });
            }}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-4"
          >
            <span className="ml-1">+</span>
            إضافة منصة جديدة
          </button>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          حفظ
        </button>
        <button
          onClick={() => setEditingFooterSection(null)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}