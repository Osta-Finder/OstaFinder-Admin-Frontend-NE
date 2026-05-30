# Code Examples & Best Practices

## Table of Contents
1. [Component Patterns](#component-patterns)
2. [Styling Patterns](#styling-patterns)
3. [Redux Patterns](#redux-patterns)
4. [RTL Patterns](#rtl-patterns)
5. [Responsive Patterns](#responsive-patterns)
6. [Accessibility Patterns](#accessibility-patterns)
7. [Performance Patterns](#performance-patterns)

---

## Component Patterns

### Basic Component Structure
```jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function MyComponent() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.mySlice.data);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Component Title
      </h2>
      <p className="text-gray-600">{data}</p>
    </div>
  );
}
```

### Component with State
```jsx
import React, { useState } from 'react';

export default function InteractiveComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-orange-500 text-white rounded-lg 
                   hover:bg-orange-600 transition-colors duration-200"
      >
        Toggle
      </button>
      {isOpen && <div>Content</div>}
    </div>
  );
}
```

### Component with Effects
```jsx
import React, { useEffect, useState } from 'react';

export default function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{data}</div>;
}
```

### Memoized Component
```jsx
import React, { memo } from 'react';

const Card = memo(function Card({ title, content }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );
});

export default Card;
```

---

## Styling Patterns

### Card Component
```jsx
<div className="
  bg-white
  rounded-2xl
  shadow-md
  border border-gray-100
  p-6 lg:p-8
  transition-all duration-300
  hover:shadow-lg hover:scale-105
  cursor-pointer
">
  {/* Content */}
</div>
```

### Button Component
```jsx
<button className="
  px-4 py-2 lg:px-6 lg:py-3
  bg-orange-500
  hover:bg-orange-600
  text-white
  font-semibold
  rounded-lg
  transition-all duration-200
  transform hover:scale-105
  shadow-md
  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
">
  Click Me
</button>
```

### Input Component
```jsx
<input
  type="text"
  placeholder="Enter text"
  className="
    w-full
    px-4 py-2
    border border-gray-300
    rounded-lg
    focus:outline-none
    focus:ring-2 focus:ring-orange-500
    focus:border-transparent
    transition-all duration-200
  "
/>
```

### Badge Component
```jsx
<span className="
  inline-flex
  items-center
  px-3 py-1
  bg-orange-100
  text-orange-700
  text-xs
  font-semibold
  rounded-full
">
  New
</span>
```

### Progress Bar
```jsx
<div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
  <div
    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 
               transition-all duration-500 group-hover:shadow-lg"
    style={{ width: `${percentage}%` }}
  />
</div>
```

---

## Redux Patterns

### Creating a Slice
```javascript
// src/store/slices/exampleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setItems, addItem, removeItem, setLoading, setError } =
  exampleSlice.actions;
export default exampleSlice.reducer;
```

### Using Redux in Component
```jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem } from '../store/slices/exampleSlice';

export default function ExampleComponent() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.example.items);
  const loading = useSelector((state) => state.example.loading);

  const handleAdd = () => {
    dispatch(addItem({ id: Date.now(), name: 'New Item' }));
  };

  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };

  return (
    <div>
      <button onClick={handleAdd}>Add Item</button>
      {loading && <p>Loading...</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => handleRemove(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Async Thunk Pattern
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchItems = createAsyncThunk(
  'example/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/items');
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const exampleSlice = createSlice({
  name: 'example',
  initialState: { items: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default exampleSlice.reducer;
```

---

## RTL Patterns

### Main Container
```jsx
<div className="flex h-screen bg-gray-50 rtl" dir="rtl">
  {/* All content automatically RTL */}
</div>
```

### Text Alignment
```jsx
// Always right-aligned in RTL
<p className="text-right">محتوى النص</p>
<h1 className="text-right">العنوان</h1>
<span className="text-right">النص الثانوي</span>
```

### Flex Layouts
```jsx
// Flexbox automatically reverses in RTL
<div className="flex items-center justify-between">
  <span>Left (becomes right in RTL)</span>
  <span>Right (becomes left in RTL)</span>
</div>

// Explicit flex-row-reverse for RTL
<div className="flex flex-row-reverse items-center gap-4">
  <span>Icon</span>
  <span>Label</span>
</div>
```

### Icon Positioning
```jsx
// Icons positioned with gap
<div className="flex items-center gap-3">
  <span className="text-2xl">📊</span>
  <span>Dashboard</span>
</div>

// Icons on right (RTL)
<div className="flex items-center justify-between">
  <span>Label</span>
  <span className="text-2xl">📊</span>
</div>
```

### Margin & Padding
```jsx
// Use gap instead of margin for consistent spacing
<div className="flex gap-4">
  {/* Consistent spacing in both directions */}
</div>

// Padding works the same in RTL
<div className="px-4 py-2">
  {/* Padding applied correctly */}
</div>
```

---

## Responsive Patterns

### Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</div>
```

### Responsive Padding
```jsx
<div className="p-4 md:p-6 lg:p-8">
  {/* Mobile: 16px, Tablet: 24px, Desktop: 32px */}
</div>
```

### Responsive Font Sizes
```jsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  {/* Mobile: 24px, Tablet: 30px, Desktop: 36px */}
</h1>
```

### Responsive Display
```jsx
<div className="hidden md:block">
  {/* Hidden on mobile, visible on tablet+ */}
</div>

<div className="md:hidden">
  {/* Visible on mobile, hidden on tablet+ */}
</div>
```

### Responsive Flex Direction
```jsx
<div className="flex flex-col md:flex-row gap-4">
  {/* Column on mobile, row on tablet+ */}
</div>
```

---

## Accessibility Patterns

### Semantic HTML
```jsx
<main>
  <section>
    <h1>Main Title</h1>
    <article>
      <h2>Article Title</h2>
      <p>Content</p>
    </article>
  </section>
</main>
```

### ARIA Labels
```jsx
<button aria-label="Close menu" onClick={handleClose}>
  ✕
</button>

<div aria-live="polite" aria-atomic="true">
  {message}
</div>
```

### Focus Management
```jsx
<button
  className="
    px-4 py-2 bg-orange-500 text-white rounded-lg
    focus:outline-none
    focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
  "
>
  Click Me
</button>
```

### Keyboard Navigation
```jsx
<input
  type="text"
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  }}
/>
```

### Color Contrast
```jsx
// High contrast (9:1 ratio)
<h1 className="text-gray-900">Heading</h1>

// Good contrast (7:1 ratio)
<p className="text-gray-600">Body text</p>

// Acceptable contrast (4.5:1 ratio)
<span className="text-gray-500">Secondary text</span>
```

---

## Performance Patterns

### Code Splitting
```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Memoization
```jsx
import { memo, useMemo, useCallback } from 'react';

const Card = memo(function Card({ data, onUpdate }) {
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      processed: true,
    }));
  }, [data]);

  const handleClick = useCallback(() => {
    onUpdate(data);
  }, [data, onUpdate]);

  return (
    <div onClick={handleClick}>
      {processedData.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});

export default Card;
```

### Conditional Rendering
```jsx
// Avoid unnecessary renders
{condition && <Component />}

// Use ternary for two options
{condition ? <ComponentA /> : <ComponentB />}

// Use switch for multiple options
{(() => {
  switch (type) {
    case 'a':
      return <ComponentA />;
    case 'b':
      return <ComponentB />;
    default:
      return <ComponentDefault />;
  }
})()}
```

### Event Delegation
```jsx
<ul onClick={(e) => {
  if (e.target.tagName === 'LI') {
    handleItemClick(e.target.dataset.id);
  }
}}>
  {items.map((item) => (
    <li key={item.id} data-id={item.id}>
      {item.name}
    </li>
  ))}
</ul>
```

---

## Common Patterns

### Loading State
```jsx
export default function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        setData(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{data}</div>;
}
```

### Form Handling
```jsx
export default function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Modal Component
```jsx
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
          {children}
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
```

---

## Best Practices Summary

### ✅ Do's
- Use semantic HTML
- Keep components small and focused
- Use Redux for global state
- Use TailwindCSS for styling
- Test accessibility
- Optimize performance
- Document code
- Use meaningful variable names
- Handle errors gracefully
- Use proper TypeScript types (if using TS)

### ❌ Don'ts
- Don't use inline styles
- Don't create large components
- Don't use Redux for local state
- Don't ignore accessibility
- Don't hardcode values
- Don't skip error handling
- Don't use `any` type (if using TS)
- Don't create circular dependencies
- Don't mutate state directly
- Don't ignore performance warnings

---

**Last Updated**: May 2026  
**Version**: 1.0.0
