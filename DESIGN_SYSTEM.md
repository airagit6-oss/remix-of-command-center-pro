# ENTERPRISE DESIGN SYSTEM
## Command Center Pro - Phase 1 Foundation

---

## OVERVIEW

A comprehensive, enterprise-grade design system ensuring zero fragmentation, maximum consistency, and operational-grade UI quality across the entire ecosystem.

### Design Principles

1. **Token-Driven**: Every value references a CSS custom property
2. **Mobile-First**: Responsive breakpoints built from small screens up
3. **Accessible**: WCAG 2.1 AA compliance as baseline
4. **Performant**: Optimized CSS with minimal duplication
5. **Consistent**: Zero arbitrary values, zero visual fragmentation

---

## TOKEN ARCHITECTURE

### File Structure

```
src/styles/
├── tokens.css          # Primitive tokens (colors, spacing, etc.)
├── theme.css           # Semantic mappings
├── colors.css          # Color utilities
├── motion.css          # Animation utilities
├── spacing.css         # Spacing utilities
├── typography.css      # Typography utilities
├── z-index.css         # Z-index governance
├── grid.css            # Grid utilities
├── containers.css      # Container rhythm
├── button.css          # Button system
├── interactions.css    # Interaction states
├── responsive.css      # Responsive system
├── touch.css           # Touch UX
├── components.css      # Component system
└── accessibility.css   # Accessibility governance
```

### Primitive Tokens (tokens.css)

#### Colors
```css
/* Brand Palettes - 10 shades each */
--color-cyan-{50..900}
--color-fuchsia-{50..900}
--color-emerald-{50..900}
--color-amber-{50..900}
--color-rose-{50..900}
--color-neutral-{0..1000}
```

#### Spacing (8-step scale)
```css
--space-1: 4px    /* XS */
--space-2: 8px    /* SM */
--space-3: 12px   /* MD */
--space-4: 16px   /* LG */
--space-5: 24px   /* XL */
--space-6: 32px   /* 2XL */
--space-7: 48px   /* 3XL */
--space-8: 64px   /* 4XL */
```

#### Typography
```css
/* Sizes */
--text-xs: 0.75rem     /* 12px */
--text-sm: 0.875rem    /* 14px */
--text-md: 1rem        /* 16px */
--text-lg: 1.125rem    /* 18px */
--text-xl: 1.25rem     /* 20px */
--text-2xl: 1.5rem     /* 24px */
--text-3xl: 1.875rem   /* 30px */
--text-4xl: 2.25rem    /* 36px */
--text-5xl: 3rem       /* 48px */
--text-6xl: 3.75rem    /* 60px */

/* Line Heights */
--leading-tight: 1.15
--leading-snug: 1.3
--leading-normal: 1.5
--leading-relaxed: 1.65
```

#### Radius
```css
--radius-xs: 2px
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 24px
--radius-full: 9999px
```

#### Shadows
```css
--shadow-xs: 0 1px 2px hsl(0 0% 0% / 0.05)
--shadow-sm: 0 1px 3px hsl(0 0% 0% / 0.1)
--shadow-md: 0 4px 6px -1px hsl(0 0% 0% / 0.1)
--shadow-lg: 0 10px 15px -3px hsl(0 0% 0% / 0.1)
--shadow-xl: 0 20px 25px -5px hsl(0 0% 0% / 0.1)
--shadow-focus: 0 0 0 3px hsl(190 100% 50% / 0.3)
--shadow-glow: 0 0 40px hsl(190 100% 50% / 0.3)
```

#### Motion
```css
/* Duration */
--transition-fast: 150ms
--transition-normal: 250ms
--transition-slow: 400ms
--transition-premium: 700ms

/* Easing */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)
--ease-premium: cubic-bezier(0.16, 1, 0.3, 1)
--ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55)
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1)
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1)
```

#### Z-Index Scale
```css
--z-base: 0
--z-raised: 10
--z-sticky: 100
--z-dropdown: 200
--z-overlay: 300
--z-modal: 400
--z-toast: 500
--z-tooltip: 600
--z-max: 9999
```

### Semantic Tokens (theme.css)

```css
/* Surfaces */
--surface-base: hsl(220 20% 4%)
--surface-raised: hsl(220 18% 6%)
--surface-card: hsl(220 18% 8%)
--surface-elevated: hsl(220 15% 12%)
--surface-floating: hsl(220 15% 16%)
--surface-overlay: hsl(220 20% 4% / 0.85)
--surface-glass: hsl(220 20% 4% / 0.6)

/* Text */
--text-primary: hsl(0 0% 95%)
--text-secondary: hsl(220 10% 75%)
--text-muted: hsl(220 10% 55%)
--text-soft: hsl(220 10% 45%)
--text-disabled: hsl(220 10% 35%)

/* Borders */
--border-soft: hsl(220 14% 10%)
--border-normal: hsl(220 15% 14%)
--border-strong: hsl(220 14% 22%)
--border-glow: hsl(190 100% 50% / 0.5)
--border-focus: hsl(190 100% 50%)
```

---

## USAGE STANDARDS

### Spacing

```tsx
// CORRECT - Using tokens
<div className="p-4 gap-3">
  <div className="m-2">Content</div>
</div>

// INCORRECT - Arbitrary values
<div className="p-[17px] gap-[13px]">
  <div className="m-[7px]">Content</div>
</div>
```

### Colors

```tsx
// CORRECT - Using semantic tokens
<div className="bg-surface-card text-text-primary border-border-normal">
  <span className="text-cyan-500">Accent</span>
</div>

// INCORRECT - Hardcoded values
<div className="bg-[#1a1a2e] text-[#e0e0e0] border-[#333]">
  <span className="text-[#00d4ff]">Accent</span>
</div>
```

### Typography

```tsx
// CORRECT - Using typography tokens
<h1 className="text-3xl font-semibold leading-tight">
  Heading
</h1>
<p className="text-base leading-normal">
  Body text
</p>

// INCORRECT - Arbitrary typography
<h1 className="text-[26px] font-[550] leading-[1.35]">
  Heading
</h1>
```

### Buttons

```tsx
// CORRECT - Using enterprise button
import { Button } from "@/components/ui/button";

<Button variant="primary" size="md">
  Click me
</Button>

// INCORRECT - Manual button construction
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click me
</button>
```

### Motion

```tsx
// CORRECT - Using motion tokens
<div className="transition-normal ease-standard hover:translate-y-[-2px]">
  Hover card
</div>

// INCORRECT - Arbitrary transitions
<div className="transition-[all_200ms_ease-in-out] hover:translate-y-[-3px]">
  Hover card
</div>
```

---

## COMPONENT PATTERNS

### Cards

```tsx
// Standard Card
<div className="card card-standard">
  <div className="card-header">
    <h3 className="card-title">Title</h3>
    <p className="card-description">Description</p>
  </div>
  <div className="card-content">Content</div>
  <div className="card-footer">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </div>
</div>

// KPI Card
<div className="kpi-card">
  <span className="kpi-label">Revenue</span>
  <span className="kpi-value">$124.5K</span>
  <span className="kpi-change kpi-change-positive">+12.5%</span>
</div>
```

### Forms

```tsx
// Form Group
<div className="form-group">
  <label className="form-label label-required">Email</label>
  <input className="input" type="email" />
  <span className="help-text">We'll never share your email.</span>
  <span className="error-message">Invalid email format</span>
</div>
```

### Tables

```tsx
// Responsive Table
<div className="table-container">
  <table className="table table-hover table-sticky">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th className="table-cell-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Item 1</td>
        <td><Badge variant="success">Active</Badge></td>
        <td className="table-cell-right">$1,234</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## RESPONSIVE BREAKPOINTS

| Breakpoint | Value | Usage |
|------------|-------|-------|
| mobile-sm | 360px | Small phones |
| mobile | 480px | Standard phones |
| tablet | 768px | Tablets |
| laptop | 1024px | Laptops |
| desktop | 1280px | Desktops |
| wide | 1536px | Large monitors |
| ultra | 1920px | Ultra-wide |

### Mobile-First Pattern

```tsx
// Base styles = mobile
// tablet: = 768px+
// laptop: = 1024px+
// desktop: = 1280px+

<div className="grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4">
  Content
</div>
```

---

## ACCESSIBILITY REQUIREMENTS

### Focus Management

- All interactive elements must have visible focus states
- Use `.focus-ring` utility for consistent focus appearance
- Ensure logical tab order

### Touch Targets

- Minimum 44px × 44px for all interactive elements
- Use `.touch-target` utility class
- Extended hit areas for small elements

### Screen Readers

- Use `.sr-only` for visually hidden content
- Include `aria-label` for icon-only buttons
- Use semantic HTML elements

### Motion

- Respect `prefers-reduced-motion`
- Provide instant alternatives for animations
- All motion must have purpose

---

## GOVERNANCE RULES

### Prohibited Patterns

```css
/* NEVER use arbitrary values */
p-px-[15]        /* ❌ */
bg-[#1a1a2e]    /* ❌ */
text-[#abc]      /* ❌ */
w-[123px]        /* ❌ */

/* NEVER use !important */
!bg-cyan-500     /* ❌ */

/* NEVER use inline styles */
style={{ margin: 10 }}  /* ❌ */
```

### Required Patterns

```css
/* ALWAYS use tokens */
p-4              /* ✅ */
bg-surface-card  /* ✅ */
text-primary     /* ✅ */
w-full           /* ✅ */

/* ALWAYS use utility classes */
enterprise-page  /* ✅ */
btn-primary      /* ✅ */
card-standard    /* ✅ */
```

---

## PERFORMANCE GUIDELINES

1. **Use CSS Custom Properties**: They cascade efficiently
2. **Avoid Deep Nesting**: Keep selectors flat
3. **Use GPU Acceleration**: `transform` and `opacity` animate best
4. **Minimize Reflows**: Batch DOM updates
5. **Lazy Load**: Defer non-critical CSS

---

## TESTING CHECKLIST

- [ ] No hardcoded colors (search for `#`, `rgb(`, `hsl(`)
- [ ] No arbitrary spacing (search for `px-[`)
- [ ] All buttons use Button component
- [ ] All cards use card classes
- [ ] All forms use form classes
- [ ] Tables are responsive
- [ ] Touch targets are 44px+
- [ ] Focus states are visible
- [ ] Reduced motion respected
- [ ] Mobile layout works
- [ ] No z-index conflicts

---

## MIGRATION GUIDE

### From Legacy Code

1. **Replace hardcoded colors** with semantic tokens
2. **Replace px values** with spacing tokens
3. **Replace arbitrary values** with utility classes
4. **Update components** to use enterprise variants
5. **Test responsive behavior** at all breakpoints

### Component Updates

```tsx
// Before
<div className="p-4 bg-gray-800 rounded-lg shadow-lg">
  <button className="px-4 py-2 bg-blue-500 text-white rounded">
    Click
  </button>
</div>

// After
<div className="card card-standard">
  <Button variant="primary" size="md">
    Click
  </Button>
</div>
```

---

## VERSION

**Phase 1 - Foundation Complete**
- 16 CSS files
- 6 TypeScript utility modules
- 250+ CSS custom properties
- 600+ utility classes
- WCAG 2.1 AA compliant

---

## MAINTAINERS

- **Design System**: Enterprise UI Team
- **Last Updated**: Phase 1 Completion
- **Next Phase**: Component Implementation & Page Refactoring

---

## ADDITIONAL RESOURCES

- `src/lib/typography.ts` - Typography CVA variants
- `src/lib/layout.ts` - Layout CVA variants
- `src/lib/animation.ts` - Animation CVA variants
- `src/lib/button.ts` - Button CVA variants
- `src/lib/responsive.ts` - Responsive CVA variants
- `src/lib/accessibility.ts` - Accessibility utilities
- `src/components/theme-provider.tsx` - Theme context
