import { ChevronDown, ChevronUp, Edit, Home, Plus, Trash2 } from 'lucide-react';
import React from 'react'

export default function SettingHome({newSlider , setNewSlider , deleteSlider, sliders , moveSlider, addSlider , clearImagePreview , handleImageUpload}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">التحكم في الصفحة الرئيسية</h2>
            </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded"></span>
              التحكم في السليدر الأساسي (ترتيبهم ومحتواهم، فيديو ونص وصور)
            </h3>
            
            {/* Enhanced Add New Slider Form */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8 border border-blue-100">
              <h4 className="text-lg font-semibold mb-6 text-blue-800">إضافة سليدر جديد</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={newSlider.title}
                    onChange={(e) => setNewSlider({...newSlider, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="أدخل عنوان السليدر"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">النص التوضيحي</label>
                  <input
                    type="text"
                    value={newSlider.description}
                    onChange={(e) => setNewSlider({...newSlider, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="أدخل النص التوضيحي"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نص الزر</label>
                  <input
                    type="text"
                    value={newSlider.buttonText}
                    onChange={(e) => setNewSlider({...newSlider, buttonText: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="أدخل نص الزر"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الصورة</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newSlider.image}
                      onChange={(e) => setNewSlider({...newSlider, image: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="أدخل رابط الصورة"
                    />
                    <div className="text-center text-gray-500 text-sm">أو</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {newSlider.image && (
                    <div className="mt-3 relative">
                      <img 
                        src={newSlider.image} 
                        alt="Slider Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        onClick={clearImagePreview}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={addSlider}
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                إضافة سليدر
              </button>
            </div>

            {/* Enhanced Existing Sliders with Reordering */}
            <div className="space-y-6">
              {sliders.map((slider, index) => (
                <div key={slider.id} className="border-2 border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveSlider(slider.id, 'up')}
                          disabled={index === 0}
                          className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveSlider(slider.id, 'down')}
                          disabled={index === sliders.length - 1}
                          className={`p-1 rounded ${index === sliders.length - 1 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        #{slider.order}
                      </span>
                      <h4 className="font-semibold text-gray-800 text-lg">{slider.title}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteSlider(slider.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 text-base">{slider.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      الزر: {slider.buttonText}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${slider.image ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                      الصورة: {slider.image ? "موجودة" : "غير موجودة"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}
