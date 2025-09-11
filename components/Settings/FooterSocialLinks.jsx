import { Trash2 } from "lucide-react";
import React from "react";

export default function FooterSocialLinks({
  section,
  editContent,
  setEditContent,
  setEditingFooterSection,
  handleSave,
}) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-4">
    <h4 className="font-semibold mb-4">تحرير قسم {section.title}</h4>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">الروابط</label>
      <div className="space-y-2">
        {editContent?.links.map((link, index) => (
          <div key={index} className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={link.name}
              onChange={(e) => {
                const newLinks = [...editContent?.links];
                newLinks[index].name = e.target.value;
                setEditContent({...editContent, links: newLinks});
              }}
              className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="اسم الرابط"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => {
                const newLinks = [...editContent.links];
                newLinks[index].url = e.target.value;
                setEditContent({...editContent, links: newLinks});
              }}
              className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="الرابط"
            />
            <button
              onClick={() => {
                const newLinks = editContent.links.filter((_, i) => i !== index);
                setEditContent({...editContent, links: newLinks});
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            setEditContent({
              ...editContent,
              links: [...editContent.links, { name: "", url: "" }]
            });
          }}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + إضافة رابط جديد
        </button>
      </div>
    </div>
    <div className="flex gap-2 mt-4">
      <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
        حفظ
      </button>
      <button onClick={() => setEditingFooterSection(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
        إلغاء
      </button>
    </div>
  </div>
  );
}
