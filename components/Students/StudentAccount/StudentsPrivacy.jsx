import React, { useState } from 'react'
import { 
  Shield, Lock, Settings, ChevronRight, Eye, EyeOff, 
  Bell, User, Check, AlertTriangle, Key, Smartphone,
  Mail, CheckCircle, XCircle, Info, Zap, Star
} from 'lucide-react'

export default function StudentsPrivacy() {
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [student, setStudent] = useState({
    notifications: true,
    parentAccess: false,
    twoFactorAuth: false,
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false
  })

  const handlePasswordChange = (e) => {
    e.preventDefault()
    // Handle password change logic
    setShowPasswordForm(false)
    setPasswords({ current: '', new: '', confirm: '' })
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const handlePasswordInput = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }))
    if (field === 'new') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const getPasswordStrengthColor = (strength) => {
    if (strength < 25) return 'bg-red-500'
    if (strength < 50) return 'bg-orange-500'
    if (strength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (strength) => {
    if (strength < 25) return 'ضعيفة'
    if (strength < 50) return 'متوسطة'
    if (strength < 75) return 'جيدة'
    return 'قوية جداً'
  }

  const securityTips = [
    {
      icon: Key,
      title: 'استخدم كلمة مرور قوية',
      description: 'تأكد من احتوائها على أحرف كبيرة وصغيرة وأرقام ورموز',
      color: 'text-blue-600 bg-blue-50'
    },
  
    {
      icon: Mail,
      title: 'تحقق من الإشعارات',
      description: 'راقب جميع أنشطة الدخول والتغييرات المهمة',
      color: 'text-purple-600 bg-purple-50'
    },
  ]

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="mx-auto">
     

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Security Panel */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Password Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#87bac8] via-[#3f90a6] to-[#27829b]  p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Lock size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">كلمة المرور</h2>
                      <p className="text-red-100">إدارة كلمة مرور حسابك</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className={`px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 font-medium ${
                      showPasswordForm 
                        ? 'bg-white/20 text-white hover:bg-white/30' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {showPasswordForm ? 'إلغاء' : 'تغيير كلمة المرور'}
                  </button>
                </div>
              </div>

              <div className="p-8">
                {showPasswordForm ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Current Password */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          كلمة المرور الحالية
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwords.current}
                            onChange={(e) => handlePasswordInput('current', e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 pr-12 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-300"
                            placeholder="أدخل كلمة المرور الحالية"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          كلمة المرور الجديدة
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwords.new}
                            onChange={(e) => handlePasswordInput('new', e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 pr-12 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="أدخل كلمة المرور الجديدة"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {passwords.new && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">قوة كلمة المرور:</span>
                              <span className={`font-semibold ${passwordStrength >= 75 ? 'text-green-600' : passwordStrength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {getPasswordStrengthText(passwordStrength)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor(passwordStrength)}`}
                                style={{ width: `${passwordStrength}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          تأكيد كلمة المرور
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwords.confirm}
                            onChange={(e) => handlePasswordInput('confirm', e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300"
                            placeholder="أعد كتابة كلمة المرور"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        
                        {/* Password Match Indicator */}
                        {passwords.confirm && (
                          <div className="flex items-center gap-2 text-sm">
                            {passwords.new === passwords.confirm ? (
                              <>
                                <Check size={16} className="text-green-500" />
                                <span className="text-green-600">كلمات المرور متطابقة</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={16} className="text-red-500" />
                                <span className="text-red-600">كلمات المرور غير متطابقة</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Info size={16} />
                        متطلبات كلمة المرور
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className={`flex items-center gap-2 ${passwords.new.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwords.new.length >= 8 ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300"></div>}
                          8 أحرف على الأقل
                        </div>
                        <div className={`flex items-center gap-2 ${/[A-Z]/.test(passwords.new) ? 'text-green-600' : 'text-gray-500'}`}>
                          {/[A-Z]/.test(passwords.new) ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300"></div>}
                          حرف كبير واحد على الأقل
                        </div>
                        <div className={`flex items-center gap-2 ${/[a-z]/.test(passwords.new) ? 'text-green-600' : 'text-gray-500'}`}>
                          {/[a-z]/.test(passwords.new) ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300"></div>}
                          حرف صغير واحد على الأقل
                        </div>
                        <div className={`flex items-center gap-2 ${/[0-9]/.test(passwords.new) ? 'text-green-600' : 'text-gray-500'}`}>
                          {/[0-9]/.test(passwords.new) ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300"></div>}
                          رقم واحد على الأقل
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button 
                        onClick={handlePasswordChange}
                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#87bac8] via-[#3f90a6] to-[#27829b]  text-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold"
                      >
                        <Lock size={18} />
                        تحديث كلمة المرور
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">كلمة المرور محمية</h3>
                    <p className="text-gray-600 mb-6">آخر تحديث: منذ 30 يوماً</p>
                    <button 
                      onClick={() => setShowPasswordForm(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
                    >
                      تغيير كلمة المرور
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Tips Sidebar */}
          <div className="space-y-6">
            
          

            {/* Security Tips */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                نصائح الأمان
              </h3>
              
              <div className="space-y-4">
                {securityTips.map((tip, index) => (
                  <div key={index} className="p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-102">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${tip.color}`}>
                        <tip.icon size={18} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{tip.title}</h4>
                        <p className="text-sm text-gray-600">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}