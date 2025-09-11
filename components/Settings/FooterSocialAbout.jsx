import { Trash2, Upload } from 'lucide-react';
import React, { useState } from 'react'

export default function FooterSocialAbout({section , setEditContent , editContent, setEditingFooterSection,  handleSave}) {
  const [logoPreview, setLogoPreview] = useState(editContent.logo || null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      
      // Update the editContent with the file
      setEditContent({
        ...editContent, 
        logo: file,
        logoPreview: previewUrl // Store preview URL temporarily
      });
    }
  };

  const handleRemoveLogo = () => {
    // Revoke the object URL to prevent memory leaks
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    setEditContent({
      ...editContent,
      logo: null,
      logoPreview: null
    });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-4">
      <h4 className="font-semibold mb-4">تحرير قسم {section.title}</h4>
      
      {/* Logo Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">شعار الموقع</label>
        
        <div className="flex items-center gap-4">
          {/* Logo Preview */}
          {logoPreview && (
            <div className="relative">
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                className="h-16 w-auto border rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {/* File Upload Input */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors">
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 text-center">
              {logoPreview ? 'تغيير الشعار' : 'رفع شعار جديد'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          المقاسات الموصى بها: 150×50 بكسل (PNG, JPG, SVG)
        </p>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">الوصف</label>
        <textarea
          value={editContent.description || ''}
          onChange={(e) => setEditContent({...editContent, description: e.target.value})}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          placeholder="أدخل وصفاً عن المؤسسة..."
        />
      </div>

      {/* Links Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">الروابط</label>
        <div className="space-y-3">
          {editContent.links?.map((link, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-5">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => {
                    const newLinks = [...editContent.links];
                    newLinks[index].name = e.target.value;
                    setEditContent({...editContent, links: newLinks});
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="اسم الرابط"
                />
              </div>
              <div className="md:col-span-5">
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...editContent.links];
                    newLinks[index].url = e.target.value;
                    setEditContent({...editContent, links: newLinks});
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="رابط URL"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={() => {
                    const newLinks = editContent.links.filter((_, i) => i !== index);
                    setEditContent({...editContent, links: newLinks});
                  }}
                  className="w-full p-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => {
              setEditContent({
                ...editContent,
                links: [...(editContent.links || []), { name: "", url: "" }]
              });
            }}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
          >
            <span className="ml-1">+</span>
            إضافة رابط جديد
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
        <button 
          onClick={handleSave} 
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          حفظ التغييرات
        </button>
        <button 
          onClick={() => setEditingFooterSection(null)} 
          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}