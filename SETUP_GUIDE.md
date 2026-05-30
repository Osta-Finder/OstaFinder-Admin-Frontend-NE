# Setup Guide - Arabic RTL Dashboard

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The dashboard will open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

Output will be in the `dist/` folder.

---

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main layout
│   │   ├── Sidebar.jsx            # Navigation
│   │   ├── StatsCards.jsx         # Metrics cards
│   │   ├── RevenueChart.jsx       # Chart section
│   │   └── ServicePopularity.jsx  # Service list
│   ├── store/
│   │   ├── store.js               # Redux store
│   │   └── slices/
│   │       ├── navSlice.js        # Nav state
│   │       └── themeSlice.js      # Theme state
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tailwind.config.js             # Tailwind config
├── postcss.config.js              # PostCSS config
├── vite.config.js                 # Vite config
├── README.md                      # Documentation
├── DESIGN_IMPROVEMENTS.md         # Design details
└── SETUP_GUIDE.md                 # This file
```

---

## Key Features

### ✅ Implemented
- [x] Arabic RTL support
- [x] Responsive design (mobile, tablet, desktop)
- [x] Visual hierarchy improvements
- [x] Card design enhancements
- [x] Sidebar with active states
- [x] Revenue chart section
- [x] Service popularity section
- [x] Micro-interactions (hover effects, transitions)
- [x] Redux state management
- [x] Accessibility features
- [x] TailwindCSS styling
- [x] Headless UI components

### 🔄 State Management

#### Navigation State
```javascript
// Access active navigation
const activeNav = useSelector((state) => state.nav.activeNav);

// Update active navigation
dispatch(setActiveNav('reports'));
```

#### Theme State
```javascript
// Access theme
const theme = useSelector((state) => state.theme);

// Update theme
dispatch(setThemeMode('dark'));
dispatch(setPrimaryColor('blue'));
```

---

## Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#f97316', // Orange
  },
  secondary: {
    500: '#22c55e', // Green
  },
}
```

### Spacing
Edit `tailwind.config.js`:
```javascript
spacing: {
  '128': '32rem',
  '144': '36rem',
}
```

### Fonts
Add to `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Cairo', 'sans-serif'],
  serif: ['Droid Serif', 'serif'],
}
```

### Breakpoints
Edit `tailwind.config.js`:
```javascript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
}
```

---

## Adding New Components

### 1. Create Component File
```jsx
// src/components/NewComponent.jsx
import React from 'react';

export default function NewComponent() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Content */}
    </div>
  );
}
```

### 2. Import in Dashboard
```jsx
// src/components/Dashboard.jsx
import NewComponent from './NewComponent';

export default function Dashboard() {
  return (
    <main>
      <NewComponent />
    </main>
  );
}
```

---

## Adding Redux State

### 1. Create Slice
```javascript
// src/store/slices/newSlice.js
import { createSlice } from '@reduxjs/toolkit';

const newSlice = createSlice({
  name: 'new',
  initialState: { /* state */ },
  reducers: {
    setNew: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setNew } = newSlice.actions;
export default newSlice.reducer;
```

### 2. Add to Store
```javascript
// src/store/store.js
import newReducer from './slices/newSlice';

export const store = configureStore({
  reducer: {
    new: newReducer,
  },
});
```

### 3. Use in Component
```jsx
import { useSelector, useDispatch } from 'react-redux';
import { setNew } from '../store/slices/newSlice';

export default function Component() {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.new.value);

  return (
    <button onClick={() => dispatch(setNew('new value'))}>
      {value}
    </button>
  );
}
```

---

## Styling Guidelines

### Class Organization
```jsx
<div className="
  // Layout
  flex items-center justify-between
  // Sizing
  w-full h-auto
  // Spacing
  p-6 gap-4
  // Colors
  bg-white text-gray-900
  // Borders & Shadows
  border border-gray-100 rounded-2xl shadow-md
  // Responsive
  md:p-8 lg:text-lg
  // Interactions
  transition-all duration-200 hover:shadow-lg
">
  {/* Content */}
</div>
```

### RTL Considerations
```jsx
// Always use text-right for text
<p className="text-right">محتوى النص</p>

// Flexbox handles direction automatically
<div className="flex items-center justify-between">
  {/* Automatically reversed in RTL */}
</div>

// Use gap instead of margin for spacing
<div className="flex gap-4">
  {/* Consistent spacing in both directions */}
</div>
```

---

## Performance Tips

### 1. Code Splitting
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

### 2. Memoization
```jsx
import { memo } from 'react';

const Card = memo(function Card({ data }) {
  return <div>{data}</div>;
});

export default Card;
```

### 3. useCallback
```jsx
import { useCallback } from 'react';

export default function Component() {
  const handleClick = useCallback(() => {
    // Handler logic
  }, []);

  return <button onClick={handleClick}>Click</button>;
}
```

---

## Debugging

### Redux DevTools
Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)

```javascript
// Automatically enabled in development
```

### React DevTools
Install [React DevTools Extension](https://react-devtools-tutorial.vercel.app/)

### Console Logging
```jsx
import { useEffect } from 'react';

export default function Component() {
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  return <div>Content</div>;
}
```

---

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

---

## Troubleshooting

### Issue: Styles not applying
**Solution**: 
- Clear cache: `npm run build`
- Restart dev server: `npm run dev`
- Check class names in `tailwind.config.js`

### Issue: RTL not working
**Solution**:
- Ensure `dir="rtl"` on main container
- Check `lang="ar"` in HTML
- Verify text-right classes applied

### Issue: Redux state not updating
**Solution**:
- Check reducer logic
- Verify action dispatch
- Use Redux DevTools to debug

### Issue: Components not rendering
**Solution**:
- Check import paths
- Verify component exports
- Check console for errors

---

## Resources

- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [TailwindCSS](https://tailwindcss.com)
- [Headless UI](https://headlessui.com)
- [Heroicons](https://heroicons.com)
- [Vite](https://vitejs.dev)

---

## Support

For issues or questions:
1. Check the documentation
2. Review the code comments
3. Check browser console for errors
4. Review Redux DevTools state

---

**Happy coding! 🚀**
