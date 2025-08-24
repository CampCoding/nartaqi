import { Camera, Check, Clock, Edit3, Mail, Phone, Save, X } from 'lucide-react'
import React from 'react'
import { StudentProgressBar } from '../../ui/StudentProgressBar'

export default function StudentData({getAvatarUrl , otp , otpSent, setOtp ,verifyPhoneOtp , handleAvatarClick , setStudent , pendingPhone , sendOtpForPhone, setPendingPhone , fileInputRef , handleAvatarChange, student , isEditing,  handleSaveAccount , calculateOverallProgress , setIsEditing}) {
  return (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile card */}
            <div className="lg:col-span-1 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <img
                    src={getAvatarUrl()}
                    alt="صورة الطالب"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <button
                    onClick={handleAvatarClick}
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {`${student.firstName} ${student.lastName}`}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Mail size={14} />
                    <span className="text-sm">{student.email}</span>
                    {student.emailVerified && (
                      <Check size={14} className="text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Phone size={14} />
                    <span className="text-sm">{student.phone}</span>
                    {student.phoneVerified ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Clock size={14} className="text-amber-500" />
                    )}
                  </div>
                </div>

                {/* Overall progress */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-800">
                      معدل الإنجاز الكلي
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {calculateOverallProgress()}%
                    </span>
                  </div>
                  <StudentProgressBar value={calculateOverallProgress()} />
                  <p className="text-xs text-gray-600 mt-3 text-center">
                    ممتاز! استمر في التقدم
                  </p>
                </div>
              </div>
            </div>

            {/* Edit form */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    بيانات الحساب
                  </h2>
                  <p className="text-gray-600">
                    إدارة المعلومات الشخصية والبيانات الأساسية
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isEditing
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {isEditing ? <X size={18} /> : <Edit3 size={18} />}
                  {isEditing ? "إلغاء التعديل" : "تعديل البيانات"}
                </button>
              </div>

              <form onSubmit={handleSaveAccount} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* First name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الأول *
                    </label>
                    <input
                      type="text"
                      value={student.firstName}
                      onChange={(e) =>
                        setStudent((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className={`w-full rounded-xl border px-4 py-3 transition-all duration-300 ${
                        isEditing
                          ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>

                  {/* Middle name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الأوسط
                    </label>
                    <input
                      type="text"
                      value={student.middleName}
                      onChange={(e) =>
                        setStudent((prev) => ({
                          ...prev,
                          middleName: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className={`w-full rounded-xl border px-4 py-3 transition-all duration-300 ${
                        isEditing
                          ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>

                  {/* Last name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الأخير *
                    </label>
                    <input
                      type="text"
                      value={student.lastName}
                      onChange={(e) =>
                        setStudent((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className={`w-full rounded-xl border px-4 py-3 transition-all duration-300 ${
                        isEditing
                          ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={student.email}
                        onChange={(e) =>
                          setStudent((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className={`w-full rounded-xl border px-4 py-3 pr-10 transition-all duration-300 ${
                          isEditing
                            ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
                            : "border-gray-200 bg-gray-50 text-gray-600"
                        }`}
                      />
                      {student.emailVerified && (
                        <Check
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
                        />
                      )}
                    </div>
                  </div>

                  {/* Current phone (readonly) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الجوال *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={student.phone}
                        readOnly
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 bg-gray-50 text-gray-600"
                      />
                      {student.phoneVerified ? (
                        <Check
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
                        />
                      ) : (
                        <Clock
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
                        />
                      )}
                    </div>
                  </div>

                  {/* Alternative phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم جوال بديل
                    </label>
                    <input
                      type="tel"
                      value={student.alternativePhone}
                      onChange={(e) =>
                        setStudent((prev) => ({
                          ...prev,
                          alternativePhone: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className={`w-full rounded-xl border px-4 py-3 transition-all duration-300 ${
                        isEditing
                          ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                      placeholder="اختياري"
                    />
                  </div>

                  {/* Birth date */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ الميلاد
                    </label>
                    <input
                      type="date"
                      value={student.birthDate}
                      onChange={(e) =>
                        setStudent((prev) => ({
                          ...prev,
                          birthDate: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className={`w-full rounded-xl border px-4 py-3 transition-all duration-300 ${
                        isEditing
                          ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      النوع
                    </label>
                    <select
                      value={student.gender}
                      onChange={(e) =>
                        setStudent((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className={`w-full rounded-xl border px-4 py-3 transition-all duration-300 ${
                        isEditing
                          ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    >
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>
                </div>

                {/* Phone change with OTP */}
                {isEditing && (
                  <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200">
                    <h4 className="font-semibold text-amber-800 mb-4">
                      تغيير رقم الجوال
                    </h4>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <input
                          type="tel"
                          value={pendingPhone}
                          onChange={(e) => setPendingPhone(e.target.value)}
                          placeholder="أدخل رقم الجوال الجديد"
                          className="flex-1 rounded-xl border border-amber-300 px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                        <button
                          type="button"
                          onClick={sendOtpForPhone}
                          className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium"
                        >
                          إرسال كود
                        </button>
                      </div>

                      {otpSent && (
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="أدخل كود التحقق"
                            className="flex-1 rounded-xl border border-green-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                            maxLength="6"
                          />
                          <button
                            type="button"
                            onClick={verifyPhoneOtp}
                            className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
                          >
                            تأكيد
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Save size={18} />
                      حفظ التغييرات
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
  )
}
