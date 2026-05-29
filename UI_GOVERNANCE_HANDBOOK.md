# ENTERPRISE UI GOVERNANCE HANDBOOK
## Command Center Pro - Design System Standards

**Version:** 1.0.0  
**Phase:** 1 - Foundation Complete  
**Status:** Production Ready

---

## TABLE OF CONTENTS

1. [Design Principles](#design-principles)
2. [Token Architecture](#token-architecture)
3. [Naming Conventions](#naming-conventions)
4. [Component Standards](#component-standards)
5. [Responsive Standards](#responsive-standards)
6. [Animation Standards](#animation-standards)
7. [Accessibility Standards](#accessibility-standards)
8. [File Organization](#file-organization)
9. [Code Quality Rules](#code-quality-rules)
10. [Contribution Guidelines](#contribution-guidelines)
11. [Visual QA Process](#visual-qa-process)
12. [Appendix: Quick Reference](#appendix-quick-reference)

---

## DESIGN PRINCIPLES

### 1. Token-Driven Design
**EVERY visual value MUST use a CSS custom property.**

```css
/* ✅ CORRECT */
.card {
  padding: var(--space-4);
  background: var(--surface-card);
  border-radius: var(--radius-lg);
}

/* ❌ INCORRECT */
.card {
  padding: 16px;
  background: #1a1a2e;
  border-radius: 12px;
}
```

### 2. Mobile-First Approach
**Base styles for mobile. Enhance for larger screens.**

```css
/* Base = mobile (320px+) */
.grid {
  grid-template-columns: 1fr;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### 3. Consistency Over Creativity
**Use established patterns. Don't invent new ones.**

- Use existing component classes
- Follow spacing scale
- Use defined color tokens
- Apply standard animations

### 4. Accessibility as Baseline
**WCAG 2.1 AA compliance is mandatory, not optional.**

- Minimum 4.5:1 contrast ratios
- 44px touch targets minimum
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion respect

### 5. Performance Conscious
**Every line of CSS must justify its existence.**

- Use CSS custom properties (efficient cascade)
- GPU-accelerated animations only
- Minimize reflows and repaints
- No !important usage

---

## TOKEN ARCHITECTURE

### Token Categories

| Category | File | Count | Purpose |
|----------|------|-------|---------|
| **Colors** | `tokens.css` | 80+ | Brand palettes + semantic |
| **Spacing** | `tokens.css` | 8 | 4px to 64px scale |
| **Typography** | `tokens.css` | 17 | Sizes, line-heights, tracking |
| **Radius** | `tokens.css` | 7 | Border radius scale |
| **Shadows** | `tokens.css` | 8+ | Elevation system |
| **Motion** | `tokens.css` | 10 | Durations + easings |
| **Z-Index** | `tokens.css` | 9 | Layer hierarchy |
| **Breakpoints** | `tokens.css` | 10 | Responsive points |

### Token Naming Convention

```css
/* Primitives: --<category>-<variant> */
--color-cyan-500
--space-4
--text-lg
--radius-md

/* Semantic: --<context>-<property> */
--surface-card
--text-primary
--border-normal
--shadow-lg
```

### Using Tokens

```tsx
// In CSS
<div className="p-4 bg-surface-card rounded-lg">

// In Tailwind (with config)
<div className="p-space-4 bg-surface-card rounded-radius-lg">

// Direct CSS variable reference
<div style={{ padding: 'var(--space-4)' }}>
```

---

## NAMING CONVENTIONS

### CSS Classes

**Format:** `kebab-case` with semantic prefixes

| Prefix | Usage | Example |
|--------|-------|---------|
| `.btn-*` | Buttons | `.btn-primary`, `.btn-lg` |
| `.card-*` | Cards | `.card-standard`, `.card-elevated` |
| `.input-*` | Form inputs | `.input-enterprise`, `.input-error` |
| `.table-*` | Tables | `.table-enterprise`, `.table-hover` |
| `.modal-*` | Modals | `.modal-lg`, `.modal-glass` |
| `.overlay-*` | Overlays | `.overlay-blur`, `.overlay-dark` |
| `.text-*` | Typography | `.text-primary`, `.text-lg` |
| `.bg-*` | Backgrounds | `.bg-surface-card`, `.bg-cyan-500` |
| `.z-*` | Z-index | `.z-dropdown`, `.z-modal` |

### TypeScript/React

**Components:** PascalCase
```tsx
// ✅ CORRECT
function Button({ variant, size }: ButtonProps) { }

// ❌ INCORRECT
function button({ variant, size }) { }
function myButton({ variant, size }) { }
```

**Hooks:** camelCase with `use` prefix
```tsx
// ✅ CORRECT
function useTheme() { }
function useBreakpoint() { }

// ❌ INCORRECT
function theme() { }
function UseTheme() { }
```

**Utilities:** camelCase
```ts
// ✅ CORRECT
function cn(...classes: string[]) { }
function getColor(name: string) { }

// ❌ INCORRECT
function CN(...) { }
function get_color(...) { }
```

**Constants:** UPPER_SNAKE_CASE
```ts
// ✅ CORRECT
const BREAKPOINTS = { mobile: 768, tablet: 1024 };
const SPACING_SCALE = [4, 8, 12, 16, 24, 32, 48, 64];

// ❌ INCORRECT
const breakpoints = { ... };
const spacingScale = [ ... ];
```

### CSS Variables

**Format:** `--kebab-case`

```css
/* ✅ CORRECT */
--color-cyan-500
--surface-card
--transition-fast

/* ❌ INCORRECT */
--colorCyan500
--surfaceCard
--transitionFast
```

---

## COMPONENT STANDARDS

### Button Standards

**Always use the Button component.** Never create custom buttons.

```tsx
// ✅ CORRECT
import { Button } from "@/components/ui/button";

<Button variant="primary" size="md">
  Click me
</Button>

// ❌ INCORRECT
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click me
</button>
```

**Button Variants:**
- `primary` - Main action
- `secondary` - Secondary action
- `outline` - Outlined style
- `ghost` - Subtle, no border
- `danger` - Destructive action
- `success` - Positive action
- `premium` - Premium/gradient
- `glass` - Glassmorphism
- `link` - Text link style

**Button Sizes:**
- `xs` - 32px height
- `sm` - 36px height
- `md` - 42px height (default)
- `lg` - 48px height
- `xl` - 56px height

### Card Standards

**Use card classes for consistency.**

```tsx
// ✅ CORRECT
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

// ❌ INCORRECT
<div className="p-4 bg-gray-800 rounded-lg shadow-lg">
  <h3 className="text-xl font-bold">Title</h3>
  <p>Description</p>
  <div>Content</div>
  <div className="flex gap-2 mt-4">
    <button>Cancel</button>
    <button>Save</button>
  </div>
</div>
```

**Card Variants:**
- `card-standard` - Default padding
- `card-compact` - Tight padding
- `card-spacious` - Large padding
- `card-glass` - Glass effect
- `card-elevated` - With lift
- `card-metric` - For KPIs
- `card-dashboard` - Full height

### Form Standards

**Use form classes for all inputs.**

```tsx
// ✅ CORRECT
<div className="form-group">
  <label className="form-label">Email</label>
  <input className="input-enterprise" type="email" />
  <span className="form-help-text">We'll never share your email.</span>
  <span className="form-error-message">Invalid email format</span>
</div>

// ❌ INCORRECT
<div>
  <label>Email</label>
  <input type="email" className="w-full px-3 py-2 border rounded" />
  <span className="text-red-500">Invalid email format</span>
</div>
```

**Input States:**
- Default: `.input-enterprise`
- Error: `.input-error`
- Success: `.input-success`
- Warning: `.input-warning`
- Disabled: `[disabled]`

**Input Sizes:**
- `.input-sm` - 36px height
- `.input-enterprise` - 42px height (default)
- `.input-lg` - 48px height
- `.input-xl` - 56px height

### Table Standards

**Use table classes for data display.**

```tsx
// ✅ CORRECT
<div className="table-container">
  <table className="table-enterprise table-hover">
    <thead>
      <tr>
        <th className="th-sortable">Name</th>
        <th>Status</th>
        <th className="td-actions">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Item 1</td>
        <td><Badge>Active</Badge></td>
        <td className="td-actions">
          <Button variant="ghost" size="sm">Edit</Button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

**Table Variants:**
- `.table-enterprise` - Base table
- `.table-hover` - Row hover effects
- `.table-zebra` - Alternating rows
- `.table-compact` - Dense rows
- `.table-spacious` - Large rows

**Responsive Tables:**
- `.table-responsive-scroll` - Horizontal scroll
- `.table-responsive-cards` - Card view on mobile
- `.table-sticky-header` - Sticky headers
- `.table-sticky-first-col` - Sticky first column

---

## RESPONSIVE STANDARDS

### Breakpoint System

| Token | Value | Target |
|-------|-------|--------|
| `--bp-320` | 320px | Minimum mobile |
| `--bp-375` | 375px | iPhone standard |
| `--bp-425` | 425px | Large phones |
| `--bp-tablet` | 768px | Tablets |
| `--bp-laptop` | 1024px | Laptops |
| `--bp-desktop` | 1280px | Desktops |
| `--bp-1440` | 1440px | Large screens |

### Mobile-First Pattern

```css
/* Base styles = mobile */
.component {
  padding: var(--space-4);
}

/* Tablet enhancement */
@media (min-width: 768px) {
  .component {
    padding: var(--space-5);
  }
}

/* Desktop enhancement */
@media (min-width: 1024px) {
  .component {
    padding: var(--space-6);
  }
}
```

### Touch Target Compliance

**Minimum 44px × 44px for all interactive elements.**

```css
/* ✅ CORRECT */
.btn-touch {
  min-height: 44px;
  min-width: 44px;
}

/* ❌ INCORRECT */
.btn-small {
  height: 32px; /* Too small! */
  width: 32px;
}
```

### Mobile Typography

**Use 16px font-size on inputs to prevent iOS zoom.**

```css
/* ✅ CORRECT */
.input-mobile {
  font-size: 16px;
}

/* ❌ INCORRECT */
.input-mobile {
  font-size: 14px; /* Causes zoom on iOS */
}
```

---

## ANIMATION STANDARDS

### Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | 150ms | Hover states |
| `--transition-normal` | 250ms | Standard transitions |
| `--transition-slow` | 400ms | Complex animations |
| `--transition-premium` | 700ms | Premium effects |

### Easing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-standard` | cubic-bezier(0.4, 0, 0.2, 1) | Standard |
| `--ease-smooth` | cubic-bezier(0.4, 0, 0.2, 1) | Smooth |
| `--ease-premium` | cubic-bezier(0.16, 1, 0.3, 1) | Premium feel |
| `--ease-elastic` | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Playful |

### Animation Guidelines

**Use GPU-accelerated properties only:**
- ✅ `transform`
- ✅ `opacity`
- ❌ `width`, `height`, `top`, `left`

```css
/* ✅ CORRECT - GPU accelerated */
.card:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* ❌ INCORRECT - Causes reflow */
.card:hover {
  top: -2px;
  width: 102%;
}
```

### Reduced Motion Support

```css
/* Always respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## ACCESSIBILITY STANDARDS

### Focus Management

**All interactive elements MUST have visible focus states.**

```css
/* ✅ CORRECT - Visible focus */
.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--border-focus);
}

/* ❌ INCORRECT - Invisible focus */
.btn:focus {
  outline: none;
}
```

### Color Contrast

**Minimum 4.5:1 contrast ratio for text.**

| Usage | Contrast | Example |
|-------|----------|---------|
| Normal text | 4.5:1 | `text-primary` on `surface-card` |
| Large text (18px+) | 3:1 | `text-secondary` on `surface-card` |
| UI components | 3:1 | Borders, icons |

### Screen Reader Support

```tsx
// ✅ CORRECT - Proper ARIA
<button aria-label="Close menu" onClick={closeMenu}>
  <XIcon aria-hidden="true" />
</button>

// ❌ INCORRECT - No label for icon button
<button onClick={closeMenu}>
  <XIcon />
</button>
```

### Keyboard Navigation

**All functionality must be keyboard accessible.**

- Tab: Navigate focusable elements
- Enter/Space: Activate buttons
- Escape: Close modals/overlays
- Arrow keys: Navigate within components

---

## FILE ORGANIZATION

### CSS File Structure

```
src/styles/
├── tokens.css          # Primitive tokens
├── theme.css           # Semantic mappings
├── colors.css          # Color utilities
├── motion.css          # Animation system
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
├── accessibility.css   # Accessibility
├── layout.css          # Layout system
├── dashboards.css      # Dashboard system
├── mobile-first.css    # Mobile-first UX
├── premium.css         # Premium polish
├── forms.css           # Form system
├── tables.css          # Table system
├── modals.css          # Modal system
└── index.css           # Master imports
```

### Component File Structure

```
src/components/
├── ui/                 # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── modal.tsx
│   └── ...
├── theme-provider.tsx  # Theme context
└── ...
```

### Lib File Structure

```
src/lib/
├── utils.ts            # cn() helper
├── typography.ts       # Typography CVA
├── layout.ts           # Layout CVA
├── animation.ts        # Animation CVA
├── button.ts           # Button CVA
├── responsive.ts       # Responsive CVA
└── accessibility.ts  # Accessibility utilities
```

---

## CODE QUALITY RULES

### Prohibited Patterns

```css
/* ❌ NEVER USE - Arbitrary values */
p-[15px]
bg-[#1a1a2e]
text-[26px]
w-[123px]
rounded-[6px]
shadow-[0_2px_4px_rgba(0,0,0,0.1)]
!bg-cyan-500

/* ❌ NEVER USE - Inline styles */
<div style={{ margin: 10, color: '#fff' }}>

/* ❌ NEVER USE - !important */
.btn { background-color: blue !important; }

/* ❌ NEVER USE - Deep nesting */
.card .content .header .title { ... }

/* ❌ NEVER USE - IDs for styling */
#myButton { ... }
```

### Required Patterns

```css
/* ✅ ALWAYS USE - Token values */
p-4
bg-surface-card
text-lg
w-full
rounded-lg
shadow-md

/* ✅ ALWAYS USE - Utility classes */
enterprise-page
btn-primary
card-standard
focus-ring
```

---

## CONTRIBUTION GUIDELINES

### Before Contributing

1. **Read this handbook** - Understand all standards
2. **Check existing patterns** - Don't reinvent
3. **Use tokens only** - No hardcoded values
4. **Test accessibility** - Keyboard, screen reader, contrast
5. **Test responsiveness** - Mobile, tablet, desktop

### Adding New Components

1. Create component in `src/components/ui/`
2. Add styles to appropriate CSS file
3. Export from `src/components/ui/index.ts`
4. Add to Storybook (if applicable)
5. Update documentation

### Adding New Tokens

1. Add to `src/styles/tokens.css`
2. Update `tailwind.config.ts` if needed
3. Document in this handbook
4. Update component usages

### Code Review Checklist

- [ ] Uses token values only
- [ ] Follows naming conventions
- [ ] Has proper focus states
- [ ] Respects reduced motion
- [ ] Mobile-first responsive
- [ ] 44px touch targets
- [ ] No !important usage
- [ ] No inline styles
- [ ] Proper TypeScript types
- [ ] Export added to index

---

## VISUAL QA PROCESS

### Pre-Deployment Checklist

- [ ] Colors use tokens only
- [ ] Spacing uses scale only
- [ ] Typography uses scale only
- [ ] Animations use tokens
- [ ] All buttons use Button component
- [ ] All cards use card classes
- [ ] All forms use form classes
- [ ] Tables are responsive
- [ ] Modals use modal classes
- [ ] Touch targets 44px+
- [ ] Focus states visible
- [ ] Reduced motion respected
- [ ] Mobile layout works
- [ ] No console errors

### Cross-Browser Testing

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### Responsive Testing

- 320px (minimum)
- 375px (iPhone)
- 768px (tablet)
- 1024px (laptop)
- 1440px (desktop)

---

## APPENDIX: QUICK REFERENCE

### Token Quick Reference

```css
/* Spacing */
--space-1: 4px   --space-5: 24px
--space-2: 8px   --space-6: 32px
--space-3: 12px  --space-7: 48px
--space-4: 16px  --space-8: 64px

/* Typography */
--text-xs: 12px  --text-xl: 20px
--text-sm: 14px  --text-2xl: 24px
--text-md: 16px  --text-3xl: 30px
--text-lg: 18px  --text-4xl: 36px

/* Motion */
--transition-fast: 150ms
--transition-normal: 250ms
--transition-slow: 400ms
--transition-premium: 700ms

/* Z-Index */
--z-base: 0
--z-raised: 10
--z-sticky: 100
--z-dropdown: 200
--z-overlay: 300
--z-modal: 400
--z-toast: 500
--z-tooltip: 600
```

### Class Quick Reference

```css
/* Layout */
.page-wrapper, .dashboard-wrapper
.container-dashboard, .container-page
.section-wrapper

/* Cards */
.card, .card-standard, .card-compact
.card-glass, .card-elevated
.kpi-card

/* Forms */
.form-group, .form-label
.input-enterprise, .input-error, .input-success
.textarea-enterprise, .select-enterprise
.checkbox-enterprise, .radio-enterprise, .toggle-enterprise

/* Tables */
.table-container, .table-enterprise
.table-hover, .table-zebra, .table-responsive-cards

/* Modals */
.overlay, .overlay-blur
.modal, .modal-lg, .modal-glass
.drawer-right, .drawer-left
.sheet-bottom, .sheet-top

/* Premium */
.glass, .glass-premium
.glow-cyan, .glow-fuchsia
.gradient-primary, .gradient-soft
.shadow-cinematic, .shadow-glow
```

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | May 2026 | Phase 1 Complete - Foundation Release |

---

## CONTACT

**Enterprise UI Team**  
For questions, contact the design system maintainers.

**Documentation:** `/DESIGN_SYSTEM.md`  
**Tokens:** `/src/styles/tokens.css`  
**Components:** `/src/components/ui/`

---

**END OF UI GOVERNANCE HANDBOOK**
