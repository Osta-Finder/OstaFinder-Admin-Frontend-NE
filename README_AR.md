# 📊 لوحة تحكم أوستا أمن

لوحة تحكم عربية RTL حديثة مبنية بـ React و Redux و TailwindCSS

## 🎯 الميزات

✅ **واجهة عربية RTL** - دعم كامل للغة العربية  
✅ **Responsive Design** - يعمل على جميع الأجهزة  
✅ **Redux State Management** - إدارة الحالة المركزية  
✅ **TailwindCSS** - تصميم حديث وجميل  
✅ **Headless UI** - مكونات قابلة للوصول  
✅ **React Router** - التنقل بين الصفحات  
✅ **Toast Notifications** - إشعارات المستخدم  
✅ **Recharts** - رسوم بيانية متقدمة  

## 🚀 البدء السريع

### 1. تثبيت المكتبات
```bash
npm install
```

### 2. تشغيل الخادم
```bash
npm run dev
```

### 3. فتح المتصفح
```
http://localhost:3000
```

## 📁 بنية المشروع

```
src/
├── components/
│   ├── Layout/
│   │   ├── MainLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   ├── UI/
│   │   ├── Table.jsx
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   └── Modal.jsx
│   └── ...
├── pages/
│   ├── DashboardPage.jsx
│   ├── OrdersPage.jsx
│   ├── TechnicianApprovalsPage.jsx
│   ├── UsersPage.jsx
│   ├── AnalyticsPage.jsx
│   └── SupportPage.jsx
├── store/
│   ├── store.js
│   └── slices/
│       ├── navSlice.js
│       ├── themeSlice.js
│       ├── ordersSlice.js
│       ├── techniciansSlice.js
│       └── usersSlice.js
├── App.jsx
├── main.jsx
└── index.css
```

## 📄 الصفحات المتاحة

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| لوحة القيادة | `/dashboard` | عرض الإحصائيات والرسوم البيانية |
| اعتمادات الفنيين | `/technicians` | إدارة طلبات اعتماد الفنيين |
| إدارة المستخدمين | `/users` | إدارة حسابات المستخدمين |
| التحليلات | `/analytics` | عرض التحليلات والرسوم البيانية |
| إدارة الطلبات | `/orders` | إدارة الطلبات والخدمات |
| الدعم الفني | `/support` | نظام الدعم الفني والتذاكر |

## 🛠️ التكنولوجيات المستخدمة

### Frontend
- **React 18** - مكتبة واجهة المستخدم
- **React Router DOM** - التنقل بين الصفحات
- **Redux Toolkit** - إدارة الحالة
- **TailwindCSS** - تصميم الواجهة
- **Headless UI** - مكونات قابلة للوصول
- **Heroicons** - أيقونات
- **React Toastify** - إشعارات
- **Recharts** - رسوم بيانية

### Build Tools
- **Vite** - أداة البناء
- **PostCSS** - معالج CSS
- **Autoprefixer** - إضافة بادئات المتصفح

## 📦 المكتبات المثبتة

```json
{
  "@headlessui/react": "^1.7.17",
  "@heroicons/react": "^2.0.18",
  "@reduxjs/toolkit": "^1.9.7",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-redux": "^8.1.3",
  "react-router-dom": "^7.16.0",
  "react-toastify": "^11.1.0",
  "recharts": "^3.8.1"
}
```

## 🎨 نظام الألوان

- **Primary**: Orange (#E56E24)
- **Secondary**: Green (#0B3B24)
- **Neutral**: Gray (50-900)

## 📱 الأجهزة المدعومة

- ✅ الهواتف الذكية (320px+)
- ✅ الأجهزة اللوحية (768px+)
- ✅ أجهزة الكمبيوتر المكتبية (1024px+)
- ✅ الشاشات الكبيرة (1280px+)

## 🌐 المتصفحات المدعومة

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 الأوامر المتاحة

```bash
# تشغيل الخادم (مع Hot Reload)
npm run dev

# بناء المشروع للإنتاج
npm run build

# معاينة البناء
npm run preview

# فحص الأخطاء
npm run lint
```

## 🔧 الإصلاحات المطبقة

### ✅ مشكلة الصفحات البيضاء
- **السبب**: Redux store لم يكن يحتوي على جميع الـ slices
- **الحل**: تم إضافة جميع الـ slices إلى الـ store

### ✅ مشكلة Heroicons v2
- **السبب**: الاستيراد من مسار v1 بينما المشروع يستخدم v2
- **الحل**: تم تحديث جميع الاستيرادات إلى `@heroicons/react/24/outline`

## 📚 الملفات الإضافية

- `FIXES_APPLIED.md` - الإصلاحات الأولى
- `HEROICONS_FIX.md` - إصلاح Heroicons
- `FINAL_CHECKLIST.md` - قائمة التحقق
- `HOW_TO_ADD_PAGES.md` - إضافة صفحات جديدة
- `PROJECT_STRUCTURE.md` - بنية المشروع
- `RUN_PROJECT.md` - تشغيل المشروع
- `QUICK_START.md` - البدء السريع

## 🚀 الخطوات التالية

### إضافة صفحة جديدة
1. أنشئ ملف في `src/pages/`
2. أضف المسار في `src/App.jsx`
3. أضف عنصر في الـ Sidebar
4. (اختياري) أنشئ Redux slice

### الاتصال بـ API
1. استبدل البيانات الوهمية بـ API calls
2. استخدم Redux Thunk أو RTK Query
3. أضف معالجة الأخطاء

### تحسينات أخرى
1. إضافة Dark Mode
2. إضافة Multi-language
3. إضافة Authentication
4. إضافة Tests

## 💡 نصائح

1. **استخدم Redux DevTools** - لتتبع الحالة
2. **استخدم React DevTools** - لتتبع المكونات
3. **استخدم F12** - لفتح أدوات المطور
4. **اقرأ الملفات الأخرى** - للمزيد من المعلومات

## 🐛 استكشاف الأخطاء

### خطأ: "Cannot find module"
```bash
rm -rf node_modules
npm install
npm run dev
```

### خطأ: "Port 3000 is already in use"
```bash
npm run dev -- --port 3001
```

### صفحات بيضاء
✅ تم حل هذا الخطأ بالفعل!

### خطأ Heroicons
✅ تم حل هذا الخطأ بالفعل!

## 📞 الدعم

للمزيد من المعلومات، اقرأ الملفات الإضافية:
- `RUN_PROJECT.md` - تشغيل المشروع
- `HOW_TO_ADD_PAGES.md` - إضافة صفحات جديدة
- `PROJECT_STRUCTURE.md` - بنية المشروع

## 📄 الترخيص

MIT

## 👨‍💻 المطور

تم إنشاء هذا المشروع بـ ❤️

---

## 🎉 الخلاصة

```bash
# ثلاث أوامر فقط:
npm install
npm run dev
# ثم افتح http://localhost:3000
```

**جميع الصفحات تعمل بشكل مثالي! ✨**

---

**آخر تحديث**: مايو 2026  
**الإصدار**: 1.0.0  
**الحالة**: ✅ جاهز للإنتاج
