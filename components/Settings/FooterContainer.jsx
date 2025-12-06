"use client";
import {
  Edit,
  Eye,
  EyeOff,
  Layout,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import FooterSocialLinks from "./FooterSocialLinks";
import FooterSocialAbout from "./FooterSocialAbout";
import FooterSocialContact from "./FooterSocialContact";

const FooterSectionEditor = ({
  sectionKey,
  section,
  setEditingFooterSection,
}) => {
  const [editContent, setEditContent] = useState(section.content);

  const handleSave = () => {
    updateFooterSection(sectionKey, editContent);
  };

  if (section.type === "contact") {
    return (
      <FooterSocialContact
        editContent={editContent}
        handleSave={handleSave}
        setEditContent={setEditContent}
        setEditingFooterSection={setEditingFooterSection}
        section={section}
      />
    );
  }

  if (section.type === "about") {
    return (
      <FooterSocialAbout
        editContent={editContent}
        handleSave={handleSave}
        setEditContent={setEditContent}
        setEditingFooterSection={setEditingFooterSection}
        section={section}
      />
    );
  }

  // For links sections
  return (
    <FooterSocialLinks
      editContent={editContent}
      handleSave={handleSave}
      setEditContent={setEditContent}
      setEditingFooterSection={setEditingFooterSection}
      section={section}
    />
  );
};

export default function FooterContainer({
  newFooterSection,
  deleteFooterSection,
  toggleSection,
  editingFooterSection,
  section,
  footerSections,
  addFooterSection,
  setEditingFooterSection,
  setNewFooterSection,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
          <Layout className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          التحكم في محتويات الفوتر
        </h2>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></span>
          إدارة وتحرير أقسام الفوتر
        </h3>

        {/* Add New Footer Section Form */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl mb-8 border border-purple-100">
          <h4 className="text-lg font-semibold mb-6 text-purple-800">
            إضافة قسم جديد للفوتر
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان القسم
              </label>
              <input
                type="text"
                value={newFooterSection.title}
                onChange={(e) =>
                  setNewFooterSection({
                    ...newFooterSection,
                    title: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="أدخل عنوان القسم"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع القسم
              </label>
              <select
                value={newFooterSection.type}
                onChange={(e) =>
                  setNewFooterSection({
                    ...newFooterSection,
                    type: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="links">روابط</option>
                <option value="about">من نحن</option>
                <option value="contact">اتصال</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف (اختياري)
              </label>
              <textarea
                value={newFooterSection.content.description}
                onChange={(e) =>
                  setNewFooterSection({
                    ...newFooterSection,
                    content: {
                      ...newFooterSection.content,
                      description: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                rows="3"
                placeholder="أدخل وصف القسم"
              />
            </div>
          </div>
          <button
            onClick={addFooterSection}
            className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            إضافة قسم جديد
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(footerSections).map(([key, section]) => (
            <div
              key={key}
              className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {section.visible ? (
                    <Eye className="w-6 h-6 text-green-600" />
                  ) : (
                    <EyeOff className="w-6 h-6 text-gray-400" />
                  )}
                  <span className="font-semibold text-gray-800 text-lg">
                    {section.title}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                    {section.type}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingFooterSection(key)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteFooterSection(key)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleSection(key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      section.visible
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {section.visible ? "إخفاء" : "إظهار"}
                  </button>
                </div>
              </div>

              {/* Display current content */}
              <div className="text-sm text-gray-600 space-y-2">
                {section.type === "contact" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {section.content.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {section.content.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {section.content.address}
                    </div>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {section.content.socialMedia.map((social, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {social.icon} {social.name}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                {section.type === "about" && (
                  <>
                    {section.content.logo && (
                      <div className="mb-2">
                        <img
                          src={section.content.logo}
                          alt="Logo"
                          className="h-8 w-auto"
                        />
                      </div>
                    )}
                    <p className="mb-2">{section.content.description}</p>
                    <div className="flex gap-1 flex-wrap">
                      {section.content.links.map((link, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {link.name}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                {section.type === "links" && (
                  <div className="flex gap-1 flex-wrap">
                    {section.content.links.map((link, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {link.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Editor */}
              {editingFooterSection === key && (
                <FooterSectionEditor
                  setEditingFooterSection={setEditingFooterSection}
                  sectionKey={key}
                  section={section}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
