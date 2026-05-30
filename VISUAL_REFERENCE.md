# Visual Reference Guide

## Color Palette

### Primary Colors
```
Orange (Primary Action)
  50:  #fef3c7
  100: #fde68a
  200: #fcd34d
  300: #fbbf24
  400: #f59e0b
  500: #f97316 ← Main
  600: #ea580c
  700: #c2410c
  800: #92400e
  900: #78350f
```

### Secondary Colors
```
Green (Sidebar, Secondary)
  50:  #f0fdf4
  100: #dcfce7
  200: #bbf7d0
  300: #86efac
  400: #4ade80
  500: #22c55e
  600: #16a34a
  700: #15803d ← Main
  800: #166534
  900: #145231
```

### Neutral Colors
```
Gray (Text, Backgrounds)
  50:  #f9fafb ← Light backgrounds
  100: #f3f4f6
  200: #e5e7eb
  300: #d1d5db
  400: #9ca3af
  500: #6b7280
  600: #4b5563 ← Secondary text
  700: #374151
  800: #1f2937
  900: #111827 ← Primary text
```

---

## Typography Scale

### Headings
```
h1: text-3xl lg:text-4xl font-bold
    Mobile: 30px, Desktop: 36px
    Weight: 700 (bold)
    Line Height: 1.2

h2: text-xl lg:text-2xl font-semibold
    Mobile: 20px, Desktop: 24px
    Weight: 600 (semibold)
    Line Height: 1.3

h3: text-lg font-semibold
    Size: 18px
    Weight: 600 (semibold)
    Line Height: 1.4
```

### Body Text
```
Body: text-base text-gray-600
      Size: 16px
      Weight: 400 (normal)
      Color: #4b5563
      Line Height: 1.5

Small: text-sm text-gray-500
       Size: 14px
       Weight: 400 (normal)
       Color: #6b7280
       Line Height: 1.5

Extra Small: text-xs text-gray-500
             Size: 12px
             Weight: 400 (normal)
             Color: #6b7280
             Line Height: 1.5
```

---

## Spacing Scale

### Padding & Margin
```
2px   (0.125rem)
4px   (0.25rem)
8px   (0.5rem)
12px  (0.75rem)
16px  (1rem)
24px  (1.5rem)
32px  (2rem)
48px  (3rem)
64px  (4rem)
```

### Common Spacing
```
Card Padding:        p-6 lg:p-8 (24px / 32px)
Section Spacing:     space-y-8 (32px)
Item Spacing:        space-y-2 to space-y-5 (8px - 20px)
Component Gap:       gap-3 to gap-6 (12px - 24px)
Border Spacing:      border-b border-gray-100
```

---

## Border Radius

### Sizes
```
sm:   0.375rem (6px)
md:   0.5rem (8px)
lg:   0.75rem (12px)
xl:   1rem (16px)
2xl:  1.5rem (24px) ← Cards
full: 9999px ← Buttons
```

### Usage
```
Cards:           rounded-2xl (24px)
Buttons:         rounded-lg (12px) or rounded-full
Input Fields:    rounded-lg (12px)
Progress Bars:   rounded-full
Badges:          rounded-full
Containers:      rounded-xl (16px)
```

---

## Shadows

### Shadow Levels
```
sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
     Subtle, barely visible

md:  0 4px 6px -1px rgba(0, 0, 0, 0.1)
     Default for cards

lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1)
     Hover state, elevated

xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1)
     Modals, dropdowns
```

### Usage
```
Cards:           shadow-md (default), shadow-lg (hover)
Buttons:         shadow-md
Modals:          shadow-xl
Dropdowns:       shadow-lg
Elevated Items:  shadow-lg
```

---

## Component Specifications

### Stats Card
```
Dimensions:
  Width:  Full (responsive)
  Height: Auto
  Padding: p-6 lg:p-8

Colors:
  Background: bg-{color}-50 (light)
  Border: border-{color}-200
  Text: text-gray-900 (heading), text-gray-600 (label)

Shadows:
  Default: shadow-md
  Hover: shadow-lg

Interactions:
  Hover: scale-105, shadow-lg
  Duration: 300ms
```

### Sidebar Item
```
Dimensions:
  Width: Full
  Height: Auto
  Padding: px-4 py-3

Colors (Inactive):
  Background: transparent
  Text: text-green-100
  Hover: bg-green-600

Colors (Active):
  Background: bg-orange-500
  Text: text-white
  Indicator: White bar (w-1)

Interactions:
  Hover: bg-green-600
  Active: bg-orange-500 + indicator
  Duration: 200ms
```

### Button
```
Dimensions:
  Padding: px-4 py-2 (small), px-6 py-3 (large)
  Border Radius: rounded-lg or rounded-full

Colors:
  Background: bg-orange-500
  Hover: bg-orange-600
  Text: text-white
  Focus: ring-2 ring-orange-500

Interactions:
  Hover: scale-105, shadow-lg
  Focus: ring-2 ring-offset-2
  Duration: 200ms
```

### Progress Bar
```
Dimensions:
  Height: h-3 (12px)
  Width: Full
  Border Radius: rounded-full

Colors:
  Background: bg-gray-100
  Fill: bg-gradient-to-r from-{color}-400 to-{color}-500
  Hover: shadow-lg

Animations:
  Width: transition-all duration-500
  Hover: shadow-lg
```

---

## Layout Grid

### Responsive Columns
```
Mobile (< 768px):
  Stats Cards:    1 column
  Charts:         1 column
  Services:       1 column

Tablet (768px - 1024px):
  Stats Cards:    2 columns
  Charts:         2 columns
  Services:       1 column

Desktop (1024px+):
  Stats Cards:    3 columns
  Charts:         2 columns (chart) + 1 column (services)
  Services:       1 column
```

### Gap Sizes
```
Between Cards:   gap-6 (24px)
Between Items:   gap-4 (16px)
Between Sections: space-y-8 (32px)
```

---

## Animations & Transitions

### Timing Functions
```
Duration:
  Fast:    duration-200 (200ms)
  Normal:  duration-300 (300ms)
  Slow:    duration-500 (500ms)

Easing:
  Default: ease-in-out
  Linear:  linear
```

### Common Animations
```
Card Hover:
  scale-105 + shadow-lg
  Duration: 300ms

Button Hover:
  bg-color-600 + scale-105
  Duration: 200ms

Progress Bar:
  width change
  Duration: 500ms

Menu Appearance:
  fade + slide
  Duration: 200ms
```

---

## Responsive Breakpoints

### Tailwind Breakpoints
```
sm:  640px   (Small devices)
md:  768px   (Tablets)
lg:  1024px  (Desktops)
xl:  1280px  (Large desktops)
2xl: 1536px  (Extra large)
```

### Usage
```
Mobile First:
  Default styles for mobile
  md: for tablets
  lg: for desktops

Example:
  text-lg md:text-xl lg:text-2xl
  p-4 md:p-6 lg:p-8
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## RTL Considerations

### Text Alignment
```
All text:        text-right
Headings:        text-right
Labels:          text-right
Descriptions:    text-right
```

### Flex Layouts
```
Default flex:    Automatically reversed in RTL
Explicit RTL:    flex-row-reverse (if needed)
Gap:             gap-3 (works in both directions)
```

### Icon Positioning
```
Icons + Text:    flex items-center gap-3
                 Icon on right, text on left (RTL)

Icon Only:       Positioned with flex
                 Automatically adjusted for RTL
```

---

## Accessibility Standards

### Color Contrast Ratios
```
WCAG AA (Minimum):
  Normal text:     4.5:1
  Large text:      3:1
  UI Components:   3:1

WCAG AAA (Enhanced):
  Normal text:     7:1
  Large text:      4.5:1

Our Implementation:
  Headings:        9:1 (text-gray-900)
  Body text:       7:1 (text-gray-600)
  Secondary:       4.5:1 (text-gray-500)
```

### Focus Indicators
```
All interactive elements:
  ring-2 ring-orange-500 ring-offset-2
  Visible on keyboard focus
  Minimum 3px width
```

### Keyboard Navigation
```
Tab:      Move to next element
Shift+Tab: Move to previous element
Enter:    Activate button/link
Space:    Activate button
Escape:   Close modal/menu
```

---

## Component States

### Button States
```
Default:
  bg-orange-500 text-white

Hover:
  bg-orange-600 scale-105

Focus:
  ring-2 ring-orange-500 ring-offset-2

Active:
  bg-orange-700

Disabled:
  bg-gray-300 cursor-not-allowed opacity-50
```

### Input States
```
Default:
  border border-gray-300

Focus:
  ring-2 ring-orange-500 border-transparent

Error:
  border border-red-500

Success:
  border border-green-500

Disabled:
  bg-gray-100 cursor-not-allowed
```

### Card States
```
Default:
  shadow-md

Hover:
  shadow-lg scale-105

Active:
  shadow-lg

Disabled:
  opacity-50 cursor-not-allowed
```

---

## Icon Guidelines

### Icon Sizes
```
Small:   text-lg (18px)
Medium:  text-2xl (24px)
Large:   text-3xl (30px)
Extra:   text-4xl (36px)
```

### Icon Positioning
```
With Text:
  flex items-center gap-3
  Icon on right (RTL)

Standalone:
  Centered in container
  Proper spacing around

In Buttons:
  flex items-center justify-center gap-2
  Icon + text aligned
```

---

## Responsive Typography

### Mobile to Desktop
```
h1: text-3xl → lg:text-4xl
h2: text-xl → lg:text-2xl
h3: text-lg → lg:text-xl
body: text-base → lg:text-lg
small: text-sm → lg:text-base
```

### Line Heights
```
Headings:  leading-tight (1.2)
Body:      leading-relaxed (1.625)
Small:     leading-normal (1.5)
```

---

## Spacing Examples

### Card Spacing
```
Outer Padding:    p-6 lg:p-8
Inner Spacing:    space-y-4
Item Gap:         gap-3
Border Spacing:   border-b border-gray-100 pb-4
```

### Section Spacing
```
Between Sections: space-y-8
Section Padding:  p-6 lg:p-8
Item Spacing:     space-y-2 to space-y-5
```

---

## Color Usage Guide

### Primary (Orange)
```
Use for:
  - Primary buttons
  - Active states
  - Important highlights
  - Call-to-action elements

Shades:
  500: Main action
  600: Hover state
  700: Active state
  50:  Light background
```

### Secondary (Green)
```
Use for:
  - Sidebar background
  - Secondary actions
  - Success states
  - Navigation

Shades:
  700: Main sidebar
  600: Hover state
  50:  Light background
```

### Neutral (Gray)
```
Use for:
  - Text
  - Backgrounds
  - Borders
  - Disabled states

Shades:
  900: Primary text
  600: Secondary text
  500: Tertiary text
  100: Borders
  50:  Light backgrounds
```

---

## Quick Reference

### Most Used Classes
```
Padding:         p-6 lg:p-8
Margin:          space-y-8
Border Radius:   rounded-2xl
Shadow:          shadow-md hover:shadow-lg
Text Color:      text-gray-900 (heading), text-gray-600 (body)
Background:      bg-white, bg-gray-50, bg-{color}-50
Transitions:     transition-all duration-200/300
Hover Effects:   hover:scale-105 hover:shadow-lg
Grid:            grid-cols-1 md:grid-cols-2 lg:grid-cols-3
Flex:            flex items-center justify-between
```

---

**Last Updated**: May 2026  
**Version**: 1.0.0
