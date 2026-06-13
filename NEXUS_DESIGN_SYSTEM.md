# SOFTWARE VALA NEXUS - Enterprise Color System & Design Guide

**Version:** 1.0  
**Last Updated:** 2026-06-12  
**Modules:** 70+  
**Design Philosophy:** Datadog + Grafana + Linear + Vercel Enterprise Feel  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Primary Brand Colors](#primary-brand-colors)
3. [Dark Foundation](#dark-foundation)
4. [Text System](#text-system)
5. [Status Indicators](#status-indicators)
6. [AI System Colors](#ai-system-colors)
7. [Module Colors](#module-colors)
8. [Chart & Data Visualization](#chart--data-visualization)
9. [Glow System](#glow-system)
10. [Component Guidelines](#component-guidelines)
11. [Implementation Examples](#implementation-examples)
12. [Migration Checklist](#migration-checklist)

---

## Overview

**Software Vala NEXUS** is a unified, enterprise-grade color system designed for consistency across all modules. This system enforces:

✅ **Dark Premium Enterprise** aesthetic  
✅ **No white dashboard backgrounds**  
✅ **No gradient overload**  
✅ **No neon rainbow colors**  
✅ **No glass blur everywhere**  
✅ **No consumer app styling**  
✅ **Single design language** for all 70+ modules  

### Color System Files

```
src/styles/nexusColorSystem.ts    - Main color definitions
src/hooks/useNexusTheme.ts        - React hook for component access
NEXUS_DESIGN_SYSTEM.md             - This file
```

---

## Primary Brand Colors

### 1. Software Vala Blue (`#00D4FF`)

**Purpose:** Main brand color - highest contrast, primary actions  
**Usage:**
- Button backgrounds (primary CTAs)
- Active link states
- Chart series (primary)
- AI element highlights
- Active menu items
- Focus states

```typescript
// Using in components
const colors = useNexusTheme();
<button style={{ backgroundColor: colors.brand.blue }}>Primary Action</button>

// Direct import
import { NEXUS_COLORS } from '@/styles/nexusColorSystem';
<div style={{ borderColor: NEXUS_COLORS.BRAND.blue }}>Active Item</div>
```

### 2. Software Vala Cyan (`#00FFF0`)

**Purpose:** Premium accent, glow effects, realtime indicators  
**Usage:**
- Glow/shadow effects
- Premium borders
- Realtime status indicators
- Secondary highlights
- Chart series (secondary)

```typescript
<div style={{
  borderColor: colors.brand.cyan,
  boxShadow: `0 0 20px ${colors.glow.cyan}`
}}>
  Premium Border
</div>
```

### 3. Software Vala Emerald (`#00E676`)

**Purpose:** Success, healthy systems, positive metrics  
**Usage:**
- Success messages
- Online/healthy status
- Positive growth indicators
- Revenue increases
- Health check passes

```typescript
<span style={{ color: colors.status.success }}>✓ System Online</span>
```

---

## Dark Foundation

All background colors follow the **dark premium enterprise** palette. No white backgrounds allowed.

| Layer | Color | Hex | Usage |
|-------|-------|-----|-------|
| **Main Background** | Navy Black | `#050816` | Application root, page wrapper |
| **Page Background** | Navy Blue | `#0B1020` | Page content area |
| **Sidebar Background** | Dark Navy | `#0A0F1C` | Navigation sidebar |
| **Card Background** | Charcoal Blue | `#111827` | Cards, components, panels |
| **Modal Background** | Deep Navy | `#161F35` | Modals, overlays, popovers |

### Implementation

```typescript
const colors = useNexusTheme();

// Page wrapper
<div style={{ backgroundColor: colors.bg.page }}>
  {/* Content */}
</div>

// Card component
<div style={{ backgroundColor: colors.bg.card }}>
  Card content
</div>

// Modal overlay
<div style={{ backgroundColor: colors.bg.modal }}>
  Modal content
</div>
```

---

## Text System

| Role | Color | Hex | Contrast | Usage |
|------|-------|-----|----------|-------|
| **Primary** | White | `#FFFFFF` | High (20:1) | Main body text, headings |
| **Secondary** | Light Indigo | `#C7D2FE` | Good (15:1) | Supporting text, metadata |
| **Muted** | Gray Blue | `#94A3B8` | Medium (8:1) | Hints, helpers, timestamps |
| **Disabled** | Slate | `#64748B` | Low (5:1) | Disabled fields, inactive items |

### Text Hierarchy

```typescript
// Heading (Primary)
<h1 style={{ color: colors.text.primary }}>Main Heading</h1>

// Body (Primary)
<p style={{ color: colors.text.primary }}>Body text goes here.</p>

// Supporting Info (Secondary)
<p style={{ color: colors.text.secondary }}>Subtitle or supporting text</p>

// Helper Text (Muted)
<small style={{ color: colors.text.muted }}>Helper text or timestamp</small>

// Disabled State (Disabled)
<span style={{ color: colors.text.disabled }}>Disabled field</span>
```

---

## Status Indicators

Use these colors for status badges, alerts, and state indicators.

| Status | Color | Hex | Meaning |
|--------|-------|-----|---------|
| **Success** | Bright Green | `#00E676` | Online, healthy, positive metric |
| **Warning** | Amber | `#F59E0B` | Attention needed, caution |
| **Danger** | Red | `#EF4444` | Error, failed operation |
| **Critical** | Dark Red | `#DC2626` | Critical error, emergency |
| **Info** | Cyan | `#00D4FF` | Information, alert, notification |

### Usage Examples

```typescript
// Success Badge
<div style={{
  backgroundColor: colors.status.success,
  padding: '4px 8px',
  borderRadius: '4px',
  color: colors.bg.main
}}>
  System Online
</div>

// Warning Alert
<div style={{
  borderLeft: `4px solid ${colors.status.warning}`,
  backgroundColor: `${colors.status.warning}15`,
  padding: '12px'
}}>
  This action requires attention
</div>

// Critical Error
<div style={{
  backgroundColor: `${colors.status.critical}20`,
  borderColor: colors.status.critical,
  color: colors.status.critical
}}>
  Critical Error: Action Required
</div>
```

---

## AI System Colors

Dedicated colors for AI/ML features and intelligent components.

| Component | Color | Hex | Usage |
|-----------|-------|-----|-------|
| **AI Primary** | Bright Blue | `#00D4FF` | Main AI controls, indicators |
| **AI Secondary** | Cyan | `#00FFF0` | Secondary AI elements |
| **AI Glow** | Light Blue | `#38BDF8` | Glow effects for AI |
| **AI Premium** | Purple | `#7C3AED` | Premium AI features |

### AI Component Example

```typescript
// AI Feature Indicator
<div style={{
  backgroundColor: colors.bg.card,
  borderLeft: `3px solid ${colors.ai.primary}`,
  paddingLeft: '12px',
  boxShadow: `0 0 15px ${colors.ai.glow}`
}}>
  <div style={{ color: colors.ai.primary }}>🤖 AI Powered</div>
  <p style={{ color: colors.text.secondary }}>
    This feature uses machine learning
  </p>
</div>
```

---

## Module Colors

Each module has a dedicated brand color for visual identification.

```
Vala AI                     → #00D4FF (Blue)
AI API Manager              → #7C3AED (Purple)
Server Manager              → #06B6D4 (Cyan)
Development Manager         → #3B82F6 (Indigo)
Product Manager             → #8B5CF6 (Violet)
Task Manager                → #F59E0B (Amber)
Demo Manager                → #10B981 (Emerald)
Lead Manager                → #22C55E (Green)
Sales Manager               → #00E676 (Bright Green)
Marketing Manager           → #EC4899 (Pink)
SEO Manager                 → #A855F7 (Purple)
Support Manager             → #14B8A6 (Teal)
Finance Manager             → #F59E0B (Amber)
Legal Manager               → #EF4444 (Red)
Security Manager            → #DC2626 (Dark Red)
```

### Module Color Implementation

```typescript
// Get color by module name
const getModuleColor = (moduleName: string) => {
  const colors = useNexusTheme();
  return colors.getModuleColor(moduleName);
};

// Usage
<div style={{
  backgroundColor: getModuleColor('AI API Manager'),
  padding: '8px 12px',
  borderRadius: '4px',
  color: colors.bg.main
}}>
  AI API Manager
</div>

// In module header
<header style={{
  borderBottomColor: getModuleColor('Sales Manager'),
  borderBottomWidth: '2px'
}}>
  Sales Manager Dashboard
</header>
```

---

## Chart & Data Visualization

Use these 6 colors for consistent charts across all modules.

| Series | Color | Hex |
|--------|-------|-----|
| Series 1 | Blue | `#00D4FF` |
| Series 2 | Cyan | `#00FFF0` |
| Series 3 | Green | `#00E676` |
| Series 4 | Amber | `#F59E0B` |
| Series 5 | Red | `#EF4444` |
| Series 6 | Purple | `#8B5CF6` |

### Chart Implementation

```typescript
const colors = useNexusTheme();

const chartConfig = {
  series: [
    {
      name: 'Revenue',
      data: [10, 20, 15, 25],
      color: colors.getChartColor(1)  // Blue
    },
    {
      name: 'Expenses',
      data: [5, 8, 7, 10],
      color: colors.getChartColor(2)  // Cyan
    },
    {
      name: 'Profit',
      data: [5, 12, 8, 15],
      color: colors.getChartColor(3)  // Green
    },
  ]
};

// For ApexCharts, Chart.js, or similar
<Chart options={chartConfig} />
```

---

## Glow System

Premium glow effects with specific opacity for enterprise feel.

```typescript
const colors = useNexusTheme();

// Blue glow (35% opacity)
const blueGlow = colors.glow.blue;  // rgba(0,212,255,0.35)

// Cyan glow for premium elements
<div style={{
  boxShadow: `0 0 30px ${colors.glow.cyan}`
}}>
  Premium Element
</div>

// Green glow for success states
<div style={{
  boxShadow: `0 0 20px ${colors.glow.green}`,
  backgroundColor: colors.bg.card
}}>
  Success State
</div>

// Purple glow for AI elements
<div style={{
  boxShadow: `0 0 25px ${colors.glow.purple}`
}}>
  AI Feature
</div>

// Red glow for alerts
<div style={{
  boxShadow: `0 0 20px ${colors.glow.red}`
}}>
  Critical Alert
</div>
```

---

## Component Guidelines

### 1. Buttons

```typescript
const colors = useNexusTheme();

// Primary Button
<button style={{
  backgroundColor: colors.brand.blue,
  color: colors.bg.main,
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer'
}}>
  Primary Action
</button>

// Secondary Button
<button style={{
  backgroundColor: 'transparent',
  color: colors.brand.blue,
  border: `2px solid ${colors.brand.blue}`,
  padding: '8px 18px',
  borderRadius: '6px'
}}>
  Secondary Action
</button>

// Danger Button
<button style={{
  backgroundColor: colors.status.danger,
  color: colors.text.primary,
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px'
}}>
  Delete
</button>
```

### 2. Cards

```typescript
// Card with premium border
<div style={{
  backgroundColor: colors.bg.card,
  border: `1px solid ${colors.brand.cyan}`,
  borderRadius: '8px',
  padding: '16px',
  boxShadow: `0 0 20px ${colors.glow.blue}`
}}>
  <h3 style={{ color: colors.text.primary }}>Card Title</h3>
  <p style={{ color: colors.text.secondary }}>Card content goes here.</p>
</div>
```

### 3. Status Badges

```typescript
// Success Badge
<span style={{
  backgroundColor: `${colors.status.success}20`,
  color: colors.status.success,
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold'
}}>
  ✓ Active
</span>

// Warning Badge
<span style={{
  backgroundColor: `${colors.status.warning}20`,
  color: colors.status.warning,
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '12px'
}}>
  ⚠ Pending
</span>

// Critical Badge
<span style={{
  backgroundColor: `${colors.status.critical}20`,
  color: colors.status.critical,
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '12px'
}}>
  ✕ Failed
</span>
```

### 4. Navigation (Sidebar)

```typescript
const colors = useNexusTheme();

// Sidebar Container
<nav style={{
  backgroundColor: colors.sidebar.bg,
  width: '250px'
}}>
  {/* Menu Items */}
  <a href="/" style={{
    color: colors.text.secondary,
    backgroundColor: colors.sidebar.hover,
    padding: '12px 16px',
    display: 'block'
  }}>
    Menu Item
  </a>

  {/* Active Menu Item */}
  <a href="/" style={{
    color: colors.sidebar.active,
    backgroundColor: colors.bg.card,
    borderLeftColor: colors.sidebar.active,
    borderLeftWidth: '3px',
    padding: '12px 16px',
    display: 'block'
  }}>
    Active Item
  </a>
</nav>
```

### 5. Forms & Inputs

```typescript
// Input Field
<input
  type="text"
  placeholder="Enter value"
  style={{
    backgroundColor: colors.bg.card,
    color: colors.text.primary,
    border: `1px solid ${colors.brand.cyan}20`,
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '14px'
  }}
/>

// Input with focus state
<input
  type="text"
  onFocus={(e) => {
    e.target.style.borderColor = colors.brand.blue;
    e.target.style.boxShadow = `0 0 10px ${colors.glow.blue}`;
  }}
  style={{
    backgroundColor: colors.bg.card,
    color: colors.text.primary,
    border: `1px solid ${colors.brand.cyan}20`,
    borderRadius: '6px',
    padding: '10px 12px'
  }}
/>
```

### 6. Modals & Overlays

```typescript
// Modal Overlay
<div style={{
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
  {/* Modal Box */}
  <div style={{
    backgroundColor: colors.bg.modal,
    borderRadius: '8px',
    border: `1px solid ${colors.brand.cyan}`,
    padding: '24px',
    maxWidth: '500px',
    boxShadow: `0 20px 25px rgba(0,0,0,0.5)`
  }}>
    <h2 style={{ color: colors.text.primary }}>Dialog Title</h2>
    <p style={{ color: colors.text.secondary }}>Dialog content</p>
  </div>
</div>
```

---

## Implementation Examples

### Example 1: Dashboard Overview Card

```typescript
import { useNexusTheme } from '@/hooks/useNexusTheme';

export const DashboardCard = ({ title, value, status, change }) => {
  const colors = useNexusTheme();

  return (
    <div style={{
      backgroundColor: colors.bg.card,
      border: `1px solid ${colors.brand.cyan}20`,
      borderRadius: '8px',
      padding: '16px',
      boxShadow: `0 0 15px ${colors.glow.blue}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{ color: colors.text.secondary, fontSize: '14px' }}>
          {title}
        </h3>
        <span style={{
          backgroundColor: `${colors.status[status]}20`,
          color: colors.status[status],
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {status.toUpperCase()}
        </span>
      </div>

      <div style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: colors.brand.blue,
        marginBottom: '8px'
      }}>
        {value}
      </div>

      <div style={{
        color: colors.status[change > 0 ? 'success' : 'danger'],
        fontSize: '12px'
      }}>
        {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last period
      </div>
    </div>
  );
};
```

### Example 2: AI Feature Banner

```typescript
import { useNexusTheme } from '@/hooks/useNexusTheme';

export const AIBanner = ({ feature, description }) => {
  const colors = useNexusTheme();

  return (
    <div style={{
      backgroundColor: colors.bg.card,
      borderLeft: `4px solid ${colors.ai.primary}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: `0 0 20px ${colors.glow.blue}`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '20px' }}>🤖</span>
        <h3 style={{ color: colors.ai.primary, margin: 0 }}>
          {feature}
        </h3>
      </div>
      <p style={{ color: colors.text.secondary, margin: 0 }}>
        {description}
      </p>
    </div>
  );
};
```

### Example 3: Module Status Timeline

```typescript
import { useNexusTheme } from '@/hooks/useNexusTheme';

export const ModuleTimeline = ({ modules }) => {
  const colors = useNexusTheme();

  return (
    <div>
      {modules.map((module, idx) => (
        <div key={idx} style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px'
        }}>
          {/* Timeline dot */}
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: colors.getModuleColor(module.name),
            flexShrink: 0,
            marginTop: '4px'
          }} />

          {/* Timeline content */}
          <div style={{
            backgroundColor: colors.bg.card,
            borderLeft: `2px solid ${colors.getModuleColor(module.name)}`,
            paddingLeft: '12px',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingRight: '12px',
            borderRadius: '4px'
          }}>
            <h4 style={{ color: colors.text.primary, margin: 0 }}>
              {module.name}
            </h4>
            <p style={{ color: colors.text.secondary, margin: '4px 0 0' }}>
              {module.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## Migration Checklist

Use this checklist to migrate existing modules to NEXUS colors.

### Phase 1: Component Audit (Per Module)
- [ ] Identify all hardcoded colors in component files
- [ ] List all custom color variables
- [ ] Document current color usage pattern
- [ ] Note any brand-specific colors that need preservation

### Phase 2: Hook Integration
- [ ] Import `useNexusTheme` hook
- [ ] Replace all hardcoded color values
- [ ] Update inline styles to use theme
- [ ] Test color rendering in all states

### Phase 3: Component Update
- [ ] Update buttons to use `colors.brand.blue`
- [ ] Update text to use text hierarchy
- [ ] Update status indicators to use status colors
- [ ] Update sidebar to use sidebar colors

### Phase 4: Testing & Validation
- [ ] Test dark mode appearance
- [ ] Verify all text contrast meets WCAG AA
- [ ] Check glow effects on supported browsers
- [ ] Test module-specific colors

### Phase 5: Documentation
- [ ] Update component README
- [ ] Add usage examples
- [ ] Document module color selection
- [ ] Update design tokens docs

---

## Quick Reference

### CSS Variables
```css
/* Use in inline styles */
<div style={{ color: 'var(--color-brand-blue)' }}>Blue text</div>

/* Use in CSS files */
.my-element {
  background-color: var(--color-bg-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-brand-cyan);
}
```

### TypeScript Hook
```typescript
const colors = useNexusTheme();
const blue = colors.brand.blue;           // #00D4FF
const cardBg = colors.bg.card;            // #111827
const successColor = colors.status.success; // #00E676
```

### Module Colors
```typescript
colors.getModuleColor('AI API Manager')    // #7C3AED
colors.getModuleColor('Sales Manager')     // #00E676
colors.getModuleColor('Security Manager')  // #DC2626
```

### Chart Colors
```typescript
colors.getChartColor(1)    // #00D4FF (Blue)
colors.getChartColor(2)    // #00FFF0 (Cyan)
colors.getChartColor(3)    // #00E676 (Green)
```

### Glow Effects
```typescript
colors.glow.blue           // rgba(0,212,255,0.35)
colors.glow.cyan           // rgba(0,255,240,0.35)
colors.glow.purple         // rgba(124,58,237,0.35)
```

---

## Design Philosophy

### What NEXUS IS
✅ **Dark premium enterprise** aesthetic  
✅ **Navy/charcoal foundation** with cyan/blue accents  
✅ **Consistent** across all 70+ modules  
✅ **Professional** Datadog/Grafana/Linear inspired  
✅ **Accessible** with proper contrast ratios  
✅ **Scalable** to any number of modules  

### What NEXUS is NOT
❌ White dashboard backgrounds  
❌ Gradient overload  
❌ Neon rainbow colors  
❌ Glass/blur effects everywhere  
❌ Consumer app styling  
❌ Inconsistent color usage  
❌ Poor contrast ratios  

---

## Support & Questions

For questions about NEXUS color system:
- Check this style guide first
- Review implementation examples
- Check `src/hooks/useNexusTheme.ts` for available utilities
- Refer to `src/styles/nexusColorSystem.ts` for color definitions

---

**Software Vala NEXUS - Single Design Language for Enterprise Excellence**

*Last Updated: 2026-06-12*  
*Version: 1.0*  
*Status: Active Production Use*
