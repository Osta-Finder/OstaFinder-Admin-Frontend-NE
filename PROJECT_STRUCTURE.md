# 📁 بنية المشروع

## الهيكل الكامل

```
admin/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── MainLayout.jsx          # التخطيط الرئيسي
│   │   │   ├── Sidebar.jsx             # الشريط الجانبي
│   │   │   └── Header.jsx              # رأس الصفحة
│   │   ├── UI/
│   │   │   ├── Table.jsx               # مكون الجدول
│   │   │   ├── Badge.jsx               # مكون الشارة
│   │   │   ├── Button.jsx              # مكون الزر
│   │   │   └── Modal.jsx               # مكون النافذة المنبثقة
│   │   ├── Users/
│   │   │   └── RegisterUserModal.jsx   # نافذة تسجيل المستخدم
│   │   ├── Dashboard.jsx               # مكون الداشبورد (قديم)
│   │   ├── Sidebar.jsx                 # مكون الشريط الجانبي (قديم)
│   │   ├── StatsCards.jsx              # بطاقات الإحصائيات
│   │   ├── RevenueChart.jsx            # رسم بياني الإيرادات
│   │   └── ServicePopularity.jsx       # شعبية الخدمات
│   ├── pages/
│   │   ├── DashboardPage.jsx           # صفحة لوحة القيادة
│   │   ├── OrdersPage.jsx              # صفحة إدارة الطلبات
│   │   ├── TechnicianApprovalsPage.jsx # صفحة اعتمادات الفنيين
│   │   ├── UsersPage.jsx               # صفحة إدارة المستخدمين
│   │   ├── AnalyticsPage.jsx           # صفحة التحليلات
│   │   ├── SupportPage.jsx             # صفحة الدعم الفني
│   │   ├── ReportsPage.jsx             # صفحة التقارير (إضافية)
│   │   ├── CustomersPage.jsx           # صفحة العملاء (إضافية)
│   │   ├── ServicesPage.jsx            # صفحة الخدمات (إضافية)
│   │   ├── SettingsPage.jsx            # صفحة الإعدادات (إضافية)
│   │   └── PlaceholderPage.jsx         # صفحة نموذجية
│   ├── store/
│   │   ├── store.js                    # إعدادات Redux ✅ تم تحديثه
│   │   ├── index.js                    # ملف الفهرس
│   │   └── slices/
│   │       ├── navSlice.js             # حالة التنقل
│   │       ├── themeSlice.js           # حالة المظهر
│   │       ├── ordersSlice.js          # حالة الطلبات ✅ مضافة
│   │       ├── techniciansSlice.js     # حالة الفنيين ✅ مضافة
│   │       └── usersSlice.js           # حالة المستخدمين ✅ مضافة
│   ├── App.jsx                         # التطبيق الرئيسي
│   ├── main.jsx                        # نقطة الدخول
│   └── index.css                       # الأنماط العامة
├── index.html                          # ملف HTML الرئيسي
├── package.json                        # المكتبات والإعدادات
├── tailwind.config.js                  # إعدادات Tailwind
├── postcss.config.js                   # إعدادات PostCSS
├── vite.config.js                      # إعدادات Vite
├── FIXES_APPLIED.md                    # الإصلاحات المطبقة
├── QUICK_START.md                      # البدء السريع
└── PROJECT_STRUCTURE.md                # هذا الملف
```

## شرح المكونات الرئيسية

### 1. التخطيط (Layout)
- **MainLayout.jsx**: يحتوي على Sidebar و Header و Outlet للصفحات
- **Sidebar.jsx**: الشريط الجانبي مع قائمة التنقل
- **Header.jsx**: رأس الصفحة مع البحث والإشعارات

### 2. الصفحات (Pages)
كل صفحة تحتوي على محتوى فريد:
- **DashboardPage**: الإحصائيات والرسوم البيانية
- **OrdersPage**: جدول الطلبات مع الفلاتر
- **TechnicianApprovalsPage**: إدارة طلبات الفنيين
- **UsersPage**: إدارة المستخدمين
- **AnalyticsPage**: رسوم بيانية متقدمة
- **SupportPage**: نظام الدعم الفني

### 3. مكونات واجهة المستخدم (UI Components)
- **Table.jsx**: جدول قابل لإعادة الاستخدام
- **Badge.jsx**: شارات الحالة
- **Button.jsx**: أزرار بأنماط مختلفة
- **Modal.jsx**: نوافذ منبثقة

### 4. إدارة الحالة (Redux)
- **store.js**: إعدادات Redux مع جميع الـ slices
- **slices/**: ملفات الحالة المختلفة

## تدفق البيانات

```
App.jsx
  ↓
BrowserRouter
  ↓
Routes
  ↓
MainLayout (Layout)
  ├── Sidebar (Navigation)
  ├── Header (Top Bar)
  └── Outlet (Page Content)
      ├── DashboardPage
      ├── OrdersPage
      ├── TechnicianApprovalsPage
      ├── UsersPage
      ├── AnalyticsPage
      └── SupportPage
```

## Redux State Structure

```javascript
{
  nav: {
    activeNav: 'dashboard'
  },
  theme: {
    mode: 'light',
    primaryColor: 'orange'
  },
  orders: {
    orders: [...]
  },
  technicians: {
    technicians: [...],
    stats: {...}
  },
  users: {
    users: [...]
  }
}
```

## المسارات (Routes)

```
/                    → Dashboard
/dashboard           → Dashboard
/orders              → Orders Management
/technicians         → Technician Approvals
/users               → Users Management
/analytics           → Analytics
/support             → Support Tickets
```

## المكتبات المستخدمة

### Frontend
- **React 18**: مكتبة واجهة المستخدم
- **React Router DOM**: التنقل بين الصفحات
- **Redux Toolkit**: إدارة الحالة
- **React Redux**: ربط Redux مع React
- **Tailwind CSS**: تصميم الواجهة
- **Headless UI**: مكونات قابلة للوصول
- **Heroicons**: أيقونات
- **React Toastify**: إشعارات
- **Recharts**: رسوم بيانية

### Build Tools
- **Vite**: أداة البناء
- **PostCSS**: معالج CSS
- **Autoprefixer**: إضافة بادئات المتصفح

## الملفات المهمة

### تم تحديثها
- ✅ `src/store/store.js` - إضافة جميع الـ slices

### موجودة بالفعل
- ✅ `src/App.jsx` - التطبيق الرئيسي مع Routing
- ✅ `src/components/Layout/MainLayout.jsx` - التخطيط الرئيسي
- ✅ جميع الصفحات في `src/pages/`
- ✅ جميع الـ slices في `src/store/slices/`
- ✅ جميع مكونات UI في `src/components/UI/`

## الخطوات التالية

1. **تثبيت المكتبات**
   ```bash
   npm install
   ```

2. **تشغيل الخادم**
   ```bash
   npm run dev
   ```

3. **الآن جميع الصفحات تعمل بشكل صحيح!**

## ملاحظات

- جميع البيانات وهمية للاختبار
- يمكن استبدالها بـ API حقيقي لاحقاً
- الـ Redux store جاهز للتوسع
- التصميم متجاوب مع جميع الأجهزة
- الواجهة مدعومة بالكامل للعربية RTL

---

**تم الإصلاح بنجاح! 🎉**
