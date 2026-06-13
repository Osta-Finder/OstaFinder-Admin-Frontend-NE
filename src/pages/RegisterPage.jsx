import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserIcon, EnvelopeIcon, LockClosedIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { authAPI } from '../services/adminApi';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل مع أحرف كبيرة وصغيرة وأرقام ورموز');
      return;
    }

    // Validate phone format (Egyptian format: 01XXXXXXXXX)
    const phoneRegex = /^01[0-2,5][0-9]{8}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error('رقم الهاتف يجب أن يكون بالصيغة المصرية (مثال: 01012345678)');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'admin', // Register as admin
      });

      toast.success('تم إنشاء الحساب بنجاح');
      
      // Auto-login after successful registration
      setTimeout(async () => {
        try {
          const loginResponse = await authAPI.login(formData.email, formData.password);
          if (loginResponse && loginResponse.user) {
            localStorage.setItem('user', JSON.stringify(loginResponse.user));
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/dashboard');
          }
        } catch (loginError) {
          // If auto-login fails, redirect to login page
          navigate('/login');
        }
      }, 500);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.details || 'حدث خطأ في إنشاء الحساب';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D97706] to-[#B45309] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D97706] rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">أوستا أدمن</h1>
            <p className="text-gray-600">إنشاء حساب جديد</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                الاسم الكامل
              </label>
              <div className="relative">
                <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-10 text-right focus:outline-none focus:ring-2 focus:ring-[#D97706]/50 focus:border-transparent"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-10 text-right focus:outline-none focus:ring-2 focus:ring-[#D97706]/50 focus:border-transparent"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                رقم الهاتف
              </label>
              <div className="relative">
                <PhoneIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-10 text-right focus:outline-none focus:ring-2 focus:ring-[#D97706]/50 focus:border-transparent"
                  placeholder="01012345678"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 text-right mt-1">صيغة الرقم: 01012345678</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-10 text-right focus:outline-none focus:ring-2 focus:ring-[#D97706]/50 focus:border-transparent"
                  placeholder="أدخل كلمة المرور"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 text-right mt-1">يجب أن تحتوي على: أحرف كبيرة وصغيرة وأرقام ورموز (@$!%*?&)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-10 text-right focus:outline-none focus:ring-2 focus:ring-[#D97706]/50 focus:border-transparent"
                  placeholder="أعد إدخال كلمة المرور"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#92360F] text-white font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'جاري التحميل...' : 'إنشاء حساب'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              هل لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-[#D97706] hover:text-[#B45309] font-bold">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
