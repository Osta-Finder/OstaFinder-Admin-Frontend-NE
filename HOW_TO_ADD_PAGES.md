# 📖 كيفية إضافة صفحات جديدة

## الخطوات الأساسية

### 1. إنشاء ملف الصفحة
أنشئ ملف جديد في `src/pages/`:

```jsx
// src/pages/NewPage.jsx
import React from 'react';

export default function NewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">عنوان الصفحة</h1>
        <p className="text-sm text-gray-500">وصف الصفحة</p>
      </div>
      
      {/* محتوى الصفحة */}
      <div className="bg-white rounded-3xl border border-[#F2DECF] p-6">
        محتوى الصفحة هنا
      </div>
    </div>
  );
}
```

### 2. إضافة المسار في App.jsx
أضف المسار الجديد في `src/App.jsx`:

```jsx
import NewPage from './pages/NewPage';

// داخل Routes
<Route path="/" element={<MainLayout />}>
  <Route index element={<Navigate to="/dashboard" replace />} />
  <Route path="dashboard" element={<DashboardPage />} />
  {/* ... الصفحات الأخرى ... */}
  <Route path="new-page" element={<NewPage />} />  {/* أضف هنا */}
</Route>
```

### 3. إضافة عنصر في الـ Sidebar
أضف عنصر جديد في `src/components/Layout/Sidebar.jsx`:

```jsx
const navItems = [
  { name: 'لوحة القيادة', icon: Squares2X2Icon, path: '/dashboard' },
  // ... العناصر الأخرى ...
  { name: 'الصفحة الجديدة', icon: YourIcon, path: '/new-page' },  {/* أضف هنا */}
];
```

### 4. (اختياري) إنشاء Redux Slice
إذا كنت تحتاج إلى إدارة حالة:

```javascript
// src/store/slices/newSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const newSlice = createSlice({
  name: 'new',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  },
});

export const { addItem, removeItem } = newSlice.actions;
export default newSlice.reducer;
```

### 5. (اختياري) تسجيل الـ Slice في Store
أضف الـ slice الجديد في `src/store/store.js`:

```javascript
import newReducer from './slices/newSlice';

export const store = configureStore({
  reducer: {
    // ... الـ slices الأخرى ...
    new: newReducer,
  },
});
```

## مثال عملي كامل

### 1. إنشاء صفحة "المنتجات"

```jsx
// src/pages/ProductsPage.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import { addProduct, deleteProduct } from '../store/slices/productsSlice';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.includes(searchTerm)
  );

  const columns = ['اسم المنتج', 'السعر', 'الكمية', 'الحالة', 'الإجراءات'];

  const renderRow = (product) => (
    <>
      <td className="px-6 py-4 font-bold text-gray-900">{product.name}</td>
      <td className="px-6 py-4">{product.price}</td>
      <td className="px-6 py-4">{product.quantity}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          product.status === 'متاح' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {product.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <button 
          onClick={() => dispatch(deleteProduct(product.id))}
          className="text-red-500 hover:text-red-700"
        >
          حذف
        </button>
      </td>
    </>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">إدارة المنتجات</h1>
        <p className="text-sm text-gray-500">عرض وإدارة جميع المنتجات</p>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-200 rounded-full py-2 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A85121]/50"
        />
        <Button variant="primary">إضافة منتج جديد</Button>
      </div>

      <Table columns={columns} data={filteredProducts} renderRow={renderRow} />
    </div>
  );
}
```

### 2. إنشاء Redux Slice

```javascript
// src/store/slices/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [
    { id: 1, name: 'منتج 1', price: '100 ر.س', quantity: 50, status: 'متاح' },
    { id: 2, name: 'منتج 2', price: '200 ر.س', quantity: 30, status: 'متاح' },
    { id: 3, name: 'منتج 3', price: '150 ر.س', quantity: 0, status: 'غير متاح' },
  ],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    updateProduct: (state, action) => {
      const product = state.products.find(p => p.id === action.payload.id);
      if (product) {
        Object.assign(product, action.payload);
      }
    }
  },
});

export const { addProduct, deleteProduct, updateProduct } = productsSlice.actions;
export default productsSlice.reducer;
```

### 3. تحديث App.jsx

```jsx
import ProductsPage from './pages/ProductsPage';

// داخل Routes
<Route path="products" element={<ProductsPage />} />
```

### 4. تحديث Sidebar

```jsx
const navItems = [
  { name: 'لوحة القيادة', icon: Squares2X2Icon, path: '/dashboard' },
  // ... العناصر الأخرى ...
  { name: 'المنتجات', icon: ShoppingBagIcon, path: '/products' },
];
```

### 5. تحديث Store

```javascript
import productsReducer from './slices/productsSlice';

export const store = configureStore({
  reducer: {
    // ... الـ slices الأخرى ...
    products: productsReducer,
  },
});
```

## نصائح مهمة

### 1. استخدم المكونات الموجودة
```jsx
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
```

### 2. اتبع نفس النمط
جميع الصفحات تتبع نفس النمط:
- عنوان وصف
- شريط بحث/فلاتر
- جدول أو محتوى
- أزرار إجراءات

### 3. استخدم Tailwind Classes
```jsx
// الألوان
bg-white, bg-gray-50, bg-[#FAFBFD]

// الحدود
border border-[#F2DECF], border-gray-200

// الظلال
shadow-sm, shadow-md, shadow-lg

// التقريب
rounded-3xl, rounded-xl, rounded-full

// الحشو
p-6, px-4, py-2
```

### 4. استخدم React Toastify للإشعارات
```jsx
import { toast } from 'react-toastify';

toast.success('تم بنجاح');
toast.error('حدث خطأ');
toast.info('معلومة');
```

## الملفات المرجعية

- `src/pages/OrdersPage.jsx` - مثال على صفحة مع جدول
- `src/pages/UsersPage.jsx` - مثال على صفحة مع نافذة منبثقة
- `src/pages/AnalyticsPage.jsx` - مثال على صفحة مع رسوم بيانية
- `src/store/slices/ordersSlice.js` - مثال على Redux slice

## الخلاصة

لإضافة صفحة جديدة:
1. ✅ أنشئ ملف الصفحة في `src/pages/`
2. ✅ أضف المسار في `src/App.jsx`
3. ✅ أضف عنصر في الـ Sidebar
4. ✅ (اختياري) أنشئ Redux slice إذا لزم الأمر
5. ✅ (اختياري) سجل الـ slice في الـ store

---

**استمتع بإضافة صفحات جديدة! 🚀**
