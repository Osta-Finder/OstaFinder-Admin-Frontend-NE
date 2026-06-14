import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserIcon, EnvelopeIcon, LockClosedIcon, PhoneIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { authAPI } from '../services/adminApi';

const phoneRegex = /^01[0-2,5][0-9]{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  // inline validation errors — only shown after field is touched
  const errors = {
    phoneNumber:
      touched.phoneNumber && formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)
        ? 'صيغة الرقم: 01012345678'
        : null,
    password:
      touched.password && formData.password && !passwordRegex.test(formData.password)
        ? 'يجب أن تحتوي على: أحرف كبيرة وصغيرة وأرقام ورموز (@$!%*?&)'
        : null,
    confirmPassword:
      touched.confirmPassword && formData.confirmPassword && formData.confirmPassword !== formData.password
        ? 'كلمات المرور غير متطابقة'
        : null,
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Mark all fields touched on submit
    setTouched({ phoneNumber: true, password: true, confirmPassword: true });

    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error('رقم الهاتف يجب أن يكون بالصيغة المصرية (مثال: 01012345678)');
      return;
    }
    if (!passwordRegex.test(formData.password)) {
      toast.error('كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'admin',
      });
      toast.success('تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول');
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.details || 'حدث خطأ في إنشاء الحساب';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldError) =>
    `w-full bg-gray-50 border rounded-lg py-3 px-4 pr-10 text-right focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
      fieldError
        ? 'border-red-400 focus:ring-red-300'
        : 'border-gray-300 focus:ring-[#D97706]/50'
    }`;

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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">الاسم الكامل</label>
              <div className="relative">
                <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(null) + ' pl-4'}
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">البريد الإلكتروني</label>
              <div className="relative">
                <EnvelopeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(null) + ' pl-4'}
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">رقم الهاتف</label>
              <div className="relative">
                <PhoneIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(errors.phoneNumber) + ' pl-4'}
                  placeholder="01012345678"
                  required
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 text-right mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">كلمة المرور</label>
              <div className="relative">
                <LockClosedIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(errors.password) + ' pl-10'}
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 text-right mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">تأكيد كلمة المرور</label>
              <div className="relative">
                <LockClosedIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(errors.confirmPassword) + ' pl-10'}
                  placeholder="أعد إدخال كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 text-right mt-1">{errors.confirmPassword}</p>
              )}
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
