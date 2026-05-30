import React, { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'أوستا أمن',
    email: 'info@ousta-amn.com',
    phone: '+966501234567',
    address: 'الرياض، المملكة العربية السعودية',
    notifications: true,
    darkMode: false,
    language: 'ar',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    alert('تم حفظ الإعدادات بنجاح!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          الإعدادات
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          إدارة إعدادات النظام والحساب
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-right">
            معلومات الشركة
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                اسم الشركة
              </label>
              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-orange-500 
                          focus:border-transparent transition-all duration-200 text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-orange-500 
                          focus:border-transparent transition-all duration-200 text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-orange-500 
                          focus:border-transparent transition-all duration-200 text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                العنوان
              </label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-orange-500 
                          focus:border-transparent transition-all duration-200 text-right"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-right">
            إعدادات النظام
          </h2>

          <div className="space-y-4">
            {/* Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="text-right">
                <p className="font-semibold text-gray-900">الإشعارات</p>
                <p className="text-sm text-gray-600">تفعيل الإشعارات</p>
              </div>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="w-5 h-5 text-orange-500 rounded cursor-pointer"
              />
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="text-right">
                <p className="font-semibold text-gray-900">الوضع الليلي</p>
                <p className="text-sm text-gray-600">تفعيل الوضع الليلي</p>
              </div>
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
                className="w-5 h-5 text-orange-500 rounded cursor-pointer"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                اللغة
              </label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-orange-500 
                          focus:border-transparent transition-all duration-200 text-right"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Danger Zone */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-red-600 mb-3 text-right">
                منطقة الخطر
              </p>
              <button className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 
                                text-white font-semibold rounded-lg transition-all 
                                duration-200">
                حذف الحساب
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-2 border border-gray-300 text-gray-700 
                          font-semibold rounded-lg hover:bg-gray-50 
                          transition-all duration-200">
          إلغاء
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white 
                    font-semibold rounded-lg transition-all duration-200 
                    transform hover:scale-105"
        >
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
}
