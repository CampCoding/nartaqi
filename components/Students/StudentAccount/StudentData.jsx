"use client";
import {
  Camera, Check, Clock, Edit3, Mail, Phone, Save, X,
  Instagram, Facebook, Linkedin
} from 'lucide-react'
import React, { useEffect } from 'react'
import { StudentProgressBar } from '../../ui/StudentProgressBar'
import { useDispatch, useSelector } from 'react-redux'
import { handleGetAllStudents, handleGetStudentDetails } from '../../../lib/features/studentSlice';

export default function StudentData({
  id,
  getAvatarUrl, 
  otp, 
  otpSent, 
  setOtp,
  verifyPhoneOtp, 
  handleAvatarClick, 
  setStudent, 
  pendingPhone, 
  sendOtpForPhone, 
  setPendingPhone, 
  fileInputRef, 
  handleAvatarChange, 
  student, 
  isEditing,  
  handleSaveAccount, 
  calculateOverallProgress, 
  setIsEditing
}) {
  const dispatch = useDispatch();
  const { get_students_list, get_students_loading, get_student_by_phone_loading, get_student_by_phone_list } = useSelector(state => state?.students);
  
  useEffect(() => {
    dispatch(handleGetAllStudents({body : {
      per_page: 21,
    }}))
  } , [id , dispatch]);

  useEffect(() => {
    const student = (get_students_list?.data?.data?.message?.find(item => item?.id == id));
    dispatch(handleGetStudentDetails({body: { phone: student?.phone }}))
  } , [id , get_students_list]);

  useEffect(() => {
    console.log(get_student_by_phone_list?.data?.message);
  }, [id, get_student_by_phone_list]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile card */}
      <div className="lg:col-span-1 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <img
              src={get_student_by_phone_list?.data?.message?.image ||"https://avatar.iran.liara.run/public"  }
              onError={(e) => e.currentTarget.src="https://avatar.iran.liara.run/public"}
              alt="صورة المتدرب"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
            />
            {isEditing && (
              <button
                onClick={handleAvatarClick}
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <Camera size={16} />
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {`${get_student_by_phone_list?.data?.message?.name?.split(" ")[0] || ''} ${student.familyName || ''}`.trim() || '—'}
          </h3>

          <div className="space-y-3 mb-6">
            {get_student_by_phone_list?.data?.message?.email && <div className="flex items-center justify-center gap-2 text-gray-600">
              <Mail size={14} />
              <span className="text-sm">{get_student_by_phone_list?.data?.message?.email || '—'}</span>
              {/* {student.emailVerified && (
                <Check size={14} className="text-green-500" />
              )} */}
            </div>}
          </div>

          {/* Overall progress */}
          {/* <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
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
          </div> */}
        </div>
      </div>

      {/* Edit form */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isEditing ? "تعديل بيانات الحساب" : "بيانات الحساب"}
            </h2>
            <p className="text-gray-600">
              {isEditing ? "قم بتعديل المعلومات الشخصية والبيانات الأساسية" : "إدارة المعلومات الشخصية والبيانات الأساسية"}
            </p>
          </div>
          {/* <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${isEditing ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
          >
            {isEditing ? <X size={18} /> : <Edit3 size={18} />}
            {isEditing ? "إلغاء التعديل" : "تعديل البيانات"}
          </button> */}
        </div>

        <form onSubmit={handleSaveAccount} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First name */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الأول *
              </label>
              <input
                type="text"
                value={get_student_by_phone_list?.data?.message?.name?.split(" ")[0]  || ''}
                onChange={(e) =>
                  setStudent((prev) => ({ ...prev, firstName: e.target.value }))
                }
                disabled={!isEditing}
                className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 ${isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white" : "border-gray-200 bg-transparent text-gray-600"}`}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الثاني *
              </label>
              <input
                type="text"
                value={get_student_by_phone_list?.data?.message?.name?.split(" ")[1]  || ''}
                onChange={(e) =>
                  setStudent((prev) => ({ ...prev, secondName: e.target.value }))
                }
                disabled={!isEditing}
                className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 ${isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white" : "border-gray-200 bg-transparent text-gray-600"}`}
              />
            </div>

            {/* Family name */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم العائلة *
              </label>
              <input
                type="text"
                value={get_student_by_phone_list?.data?.message?.name?.split(" ")[2]  || ''}
                onChange={(e) =>
                  setStudent((prev) => ({ ...prev, familyName: e.target.value }))
                }
                disabled={!isEditing}
                className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 ${isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white" : "border-gray-200 bg-transparent text-gray-600"}`}
              />
            </div>

            {/* Email */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                value={get_student_by_phone_list?.data?.message?.email || ''}
                onChange={(e) =>
                  setStudent((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={!isEditing}
                className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 ${isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white" : "border-gray-200 bg-transparent text-gray-600"}`}
              />
            </div>

            {/* Gender */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الجنس *
              </label>
              <select
                value={get_student_by_phone_list?.data?.message?.gender || 'ذكر'}
                onChange={(e) =>
                  setStudent((prev) => ({ ...prev, gender: e.target.value }))
                }
                disabled={!isEditing}
                className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 ${isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white" : "border-gray-200 bg-transparent text-gray-600"}`}
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>

            {/* Phone */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الجوال الحالي *
              </label>
              <input
                type="tel"
                value={get_student_by_phone_list?.data?.message?.phone || ''}
                disabled
                className="w-full rounded-lg border border-gray-200 px-9 py-3 pr-10 bg-transparent text-gray-600"
              />
              {student.phoneVerified ? (
                <Check size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
              ) : (
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
              )}
            </div>
          </div>

          {/* Social links for lecturers */}
          {student.role === 'lecturer' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Instagram size={16} className="text-pink-500" />
                  Instagram
                </label>
                <input
                  type="url"
                  value={student.instagram || ''}
                  onChange={(e) =>
                    setStudent((prev) => ({ ...prev, instagram: e.target.value }))
                  }
                  disabled={!isEditing}
                  placeholder="https://instagram.com/username"
                  className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 ${isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white" : "border-gray-200 bg-transparent text-gray-600"}`}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Facebook size={16} className="text-blue-600" />
                  Facebook
                </label>
                <input
                  type="url"
                  value={student.facebook || ''}
                  onChange={(e) =>
                    setStudent((prev) => ({ ...prev, facebook: e.target.value }))
                  }
                  disabled={!isEditing}
                  placeholder="https://facebook.com/username"
                  className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 ${isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white" : "border-gray-200 bg-transparent text-gray-600"}`}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Linkedin size={16} className="text-sky-700" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={student.linkedin || ''}
                  onChange={(e) =>
                    setStudent((prev) => ({ ...prev, linkedin: e.target.value }))
                  }
                  disabled={!isEditing}
                  placeholder="https://www.linkedin.com/in/username"
                  className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 ${isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white" : "border-gray-200 bg-transparent text-gray-600"}`}
                />
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
                إلغاء التعديل
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
              >
                <Save size={18} />
                حفظ البيانات
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )  
}
