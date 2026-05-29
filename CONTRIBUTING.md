# Contributing to Command Center Pro UI

Thank you for your interest in contributing to the Command Center Pro design system! This document provides guidelines for contributing to the UI/UX system.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Design System Principles](#design-system-principles)
3. [Code Standards](#code-standards)
4. [Pull Request Process](#pull-request-process)
5. [Review Criteria](#review-criteria)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/command-center-pro.git
cd command-center-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

### Important Files

- `UI_GOVERNANCE_HANDBOOK.md` - **READ THIS FIRST**
- `src/styles/tokens.css` - All design tokens
- `src/components/ui/` - UI components
- `src/lib/` - Utility functions

---

## Design System Principles

### 1. Token-Driven Design

**ALL values must use CSS custom properties.**

```tsx
// ✅ CORRECT
<div className="p-4 bg-surface-card text-primary">

// ❌ INCORRECT
<div className="p-[16px] bg-[#1a1a2e] text-[#fff]">
```

### 2. Use Existing Components

**Don't create custom solutions when standard components exist.**

```tsx
// ✅ CORRECT
import { Button } from "@/components/ui/button";
<Button variant="primary" size="md">Click</Button>

// ❌ INCORRECT
<button className="px-4 py-2 bg-blue-500 text-white rounded">Click</button>
```

### 3. Mobile-First Approach

**Base styles for mobile, enhance for larger screens.**

```css
/* ✅ CORRECT - Mobile first */
.component {
  padding: var(--space-4); /* Mobile */
}

@media (min-width: 768px) {
  .component {
    padding: var(--space-6); /* Desktop */
  }
}
```

---

## Code Standards

### CSS/SCSS

#### Naming Convention

- Use `kebab-case` for classes
- Use semantic prefixes: `.btn-*`, `.card-*`, `.input-*`
- Use BEM-like structure for variants: `.btn-primary`, `.btn-lg`

```css
/* ✅ CORRECT */
.btn-primary { }
.card-standard { }
.input-enterprise { }
.modal-overlay { }

/* ❌ INCORRECT */
.btnPrimary { }
.cardStandard { }
.myCustomInput { }
```

#### No Arbitrary Values

```css
/* ❌ NEVER USE */
p-[15px]
bg-[#abc]
text-[14px]
w-[100px]
rounded-[5px]
```

#### Use Tokens

```css
/* ✅ CORRECT */
p-4
bg-surface-card
text-sm
w-full
rounded-md
```

### TypeScript/React

#### Component Structure

```tsx
// ✅ CORRECT
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        primary: "bg-cyan-500",
        secondary: "bg-surface-elevated",
      },
      size: {
        sm: "h-9",
        md: "h-10",
      },
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

#### Props Naming

- Use descriptive, semantic prop names
- Boolean props should be adjectives: `isLoading`, `isDisabled`
- Use `VariantProps` from CVA for variant types

---

## Pull Request Process

### 1. Before You Start

- [ ] Read `UI_GOVERNANCE_HANDBOOK.md`
- [ ] Check existing components in `src/components/ui/`
- [ ] Review token values in `src/styles/tokens.css`

### 2. Development

- [ ] Create feature branch: `git checkout -b feature/my-feature`
- [ ] Follow all code standards
- [ ] Use tokens only
- [ ] Test accessibility
- [ ] Test responsiveness

### 3. Testing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Build for production
npm run build
```

### 4. Pull Request

- [ ] Fill out PR template
- [ ] Link related issues
- [ ] Add screenshots for UI changes
- [ ] Ensure all checks pass

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Uses token values only
- [ ] Follows naming conventions
- [ ] Has proper focus states
- [ ] Respects reduced motion
- [ ] Mobile-first responsive
- [ ] 44px touch targets
- [ ] No !important usage
- [ ] No inline styles
- [ ] Proper TypeScript types

## Screenshots
(Add screenshots for UI changes)
```

---

## Review Criteria

### Design System Compliance

- [ ] Uses CSS custom properties
- [ ] No hardcoded colors
- [ ] No arbitrary spacing
- [ ] Uses component classes
- [ ] Follows responsive breakpoints

### Accessibility

- [ ] 44px minimum touch targets
- [ ] Visible focus states
- [ ] Proper ARIA attributes
- [ ] Color contrast 4.5:1 minimum
- [ ] Reduced motion support

### Code Quality

- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Proper JSDoc comments
- [ ] Clean commit history

### Performance

- [ ] No layout thrashing
- [ ] GPU-accelerated animations
- [ ] Efficient CSS selectors

---

## Common Issues

### Issue: "I need a custom color"

**Solution:** Check existing color tokens first. If truly needed, add to tokens.css.

```css
/* Add to tokens.css */
:root {
  --color-new-accent-500: hsl(120 100% 50%);
}
```

### Issue: "I need custom spacing"

**Solution:** Use existing spacing scale. The 8-step scale covers most needs.

```css
/* Available */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-7: 48px
--space-8: 64px
```

### Issue: "The component doesn't do what I need"

**Solution:** Extend the existing component rather than creating a new one.

```tsx
// Extend with additional variants
const extendedButtonVariants = cva(
  buttonVariants({ variant, size }),
  {
    variants: {
      newFeature: {
        true: "additional-classes",
      },
    },
  }
);
```

---

## Resources

- [Design System Docs](./DESIGN_SYSTEM.md)
- [UI Governance Handbook](./UI_GOVERNANCE_HANDBOOK.md)
- [Token Reference](./src/styles/tokens.css)
- [Component Library](./src/components/ui/)

---

## Questions?

Contact the Enterprise UI Team or open an issue.

**Thank you for contributing!**
