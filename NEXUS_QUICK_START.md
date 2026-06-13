# NEXUS Color System - Quick Start Guide

**Get started with Software Vala NEXUS in 5 minutes!**

---

## Installation

The NEXUS color system is already installed. No npm packages needed.

```
✅ src/styles/nexusColorSystem.ts    (Color definitions)
✅ src/hooks/useNexusTheme.ts        (React hook for components)
✅ NEXUS_DESIGN_SYSTEM.md             (Complete guide)
```

---

## Method 1: Using the Hook (Recommended for React Components)

### Step 1: Import the Hook
```typescript
import { useNexusTheme } from '@/hooks/useNexusTheme';
```

### Step 2: Use in Your Component
```typescript
export const MyComponent = () => {
  const colors = useNexusTheme();

  return (
    <div style={{ backgroundColor: colors.bg.card }}>
      <h1 style={{ color: colors.text.primary }}>Hello World</h1>
    </div>
  );
};
```

### Step 3: That's It! ✅

---

## Method 2: Direct Import (For Non-React Code)

```typescript
import NEXUS_COLORS from '@/styles/nexusColorSystem';

const bgColor = NEXUS_COLORS.FOUNDATION.cardBackground;  // #111827
const textColor = NEXUS_COLORS.TEXT.primary;             // #FFFFFF
```

---

## Common Use Cases

### 1. Background Colors

```typescript
const colors = useNexusTheme();

// Page background
<div style={{ backgroundColor: colors.bg.page }}>

// Card background
<div style={{ backgroundColor: colors.bg.card }}>

// Modal background
<div style={{ backgroundColor: colors.bg.modal }}>

// Sidebar background
<div style={{ backgroundColor: colors.sidebar.bg }}>
```

### 2. Text Colors

```typescript
// Heading (bright white)
<h1 style={{ color: colors.text.primary }}>Heading</h1>

// Body text (bright white)
<p style={{ color: colors.text.primary }}>Body</p>

// Supporting text (light blue)
<p style={{ color: colors.text.secondary }}>Supporting info</p>

// Muted text (gray)
<small style={{ color: colors.text.muted }}>Helper text</small>

// Disabled text (very muted)
<span style={{ color: colors.text.disabled }}>Disabled</span>
```

### 3. Status Colors

```typescript
// Success
<div style={{ color: colors.status.success }}>✓ Success</div>

// Warning
<div style={{ color: colors.status.warning }}>⚠ Warning</div>

// Danger
<div style={{ color: colors.status.danger }}>✕ Error</div>

// Critical
<div style={{ color: colors.status.critical }}>⚠ Critical</div>

// Info
<div style={{ color: colors.status.info }}>ℹ Info</div>
```

### 4. Primary Actions (Buttons)

```typescript
// Primary button
<button style={{
  backgroundColor: colors.brand.blue,
  color: colors.bg.main,
  padding: '10px 20px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
}}>
  Click Me
</button>
```

### 5. Premium Borders & Glows

```typescript
// Cyan border with glow
<div style={{
  border: `2px solid ${colors.brand.cyan}`,
  boxShadow: `0 0 20px ${colors.glow.cyan}`
}}>
  Premium Element
</div>
```

### 6. Module-Specific Colors

```typescript
// AI API Manager (purple)
<div style={{
  backgroundColor: colors.getModuleColor('aiAPIManager'),
  padding: '8px 12px',
  borderRadius: '4px'
}}>
  AI API Manager
</div>

// Sales Manager (green)
<div style={{
  backgroundColor: colors.getModuleColor('salesManager')
}}>
  Sales Manager
</div>
```

### 7. Chart Colors

```typescript
// 6-color series for charts
const chartColors = [
  colors.getChartColor(1),  // Blue
  colors.getChartColor(2),  // Cyan
  colors.getChartColor(3),  // Green
  colors.getChartColor(4),  // Amber
  colors.getChartColor(5),  // Red
  colors.getChartColor(6)   // Purple
];

// Use in your chart library
const chartConfig = {
  series: data.map((item, idx) => ({
    name: item.name,
    data: item.values,
    color: chartColors[idx % chartColors.length]
  }))
};
```

### 8. Sidebar Navigation

```typescript
// Active menu item
<a style={{
  color: colors.sidebar.active,  // #00D4FF
  backgroundColor: colors.sidebar.hover,
  borderLeft: `3px solid ${colors.sidebar.active}`
}}>
  Active Item
</a>

// Inactive menu item
<a style={{
  color: colors.sidebar.icons,   // #94A3B8
  backgroundColor: 'transparent'
}}>
  Menu Item
</a>
```

---

## Complete Component Example

```typescript
import { useNexusTheme } from '@/hooks/useNexusTheme';

export const AnalyticsDashboard = ({ data }) => {
  const colors = useNexusTheme();

  return (
    <div style={{
      backgroundColor: colors.bg.page,
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header */}
      <header style={{
        color: colors.text.primary,
        marginBottom: '24px',
        borderBottom: `1px solid ${colors.brand.cyan}20`
      }}>
        <h1>Analytics Dashboard</h1>
      </header>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {data.metrics.map((metric) => (
          <div key={metric.id} style={{
            backgroundColor: colors.bg.card,
            border: `1px solid ${colors.brand.cyan}20`,
            borderRadius: '8px',
            padding: '16px',
            boxShadow: `0 0 15px ${colors.glow.blue}`
          }}>
            <div style={{
              color: colors.text.secondary,
              fontSize: '12px',
              marginBottom: '8px'
            }}>
              {metric.label}
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: colors.brand.blue,
              marginBottom: '8px'
            }}>
              {metric.value}
            </div>
            <div style={{
              color: metric.change > 0
                ? colors.status.success
                : colors.status.danger,
              fontSize: '12px'
            }}>
              {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
            </div>
          </div>
        ))}
      </div>

      {/* Status Cards */}
      <div style={{
        backgroundColor: colors.bg.card,
        borderRadius: '8px',
        padding: '16px'
      }}>
        <h2 style={{ color: colors.text.primary, marginTop: 0 }}>
          System Status
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px'
        }}>
          <StatusBadge color="success" label="Services Online" />
          <StatusBadge color="warning" label="Updates Pending" />
          <StatusBadge color="info" label="2 Alerts" />
        </div>
      </div>
    </div>
  );
};

// Helper component using NEXUS colors
const StatusBadge = ({ color, label }) => {
  const colors = useNexusTheme();
  const statusColor = colors.status[color];

  return (
    <div style={{
      backgroundColor: `${statusColor}20`,
      color: statusColor,
      padding: '12px',
      borderRadius: '6px',
      fontSize: '14px',
      border: `1px solid ${statusColor}40`
    }}>
      ● {label}
    </div>
  );
};
```

---

## Color Reference Quick Sheet

| Need | Code |
|------|------|
| Blue accent | `colors.brand.blue` |
| Cyan glow | `colors.brand.cyan` |
| Green success | `colors.status.success` |
| Card background | `colors.bg.card` |
| Primary text | `colors.text.primary` |
| Secondary text | `colors.text.secondary` |
| Module color | `colors.getModuleColor('name')` |
| Chart color | `colors.getChartColor(1-6)` |
| Glow effect | `colors.glow.blue` |
| Sidebar active | `colors.sidebar.active` |

---

## Before & After Migration

### ❌ OLD (Hardcoded Colors)

```typescript
export const OldCard = () => {
  return (
    <div style={{
      backgroundColor: '#1a1a2e',
      color: '#ffffff',
      border: '1px solid #0f3460'
    }}>
      Old Card
    </div>
  );
};
```

### ✅ NEW (Using NEXUS)

```typescript
export const NewCard = () => {
  const colors = useNexusTheme();
  return (
    <div style={{
      backgroundColor: colors.bg.card,
      color: colors.text.primary,
      border: `1px solid ${colors.brand.cyan}20`
    }}>
      New Card
    </div>
  );
};
```

---

## CSS Variables (Alternative Method)

If you prefer CSS variables instead of React hooks:

```css
/* Your CSS file */
.my-card {
  background-color: var(--color-bg-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-brand-cyan);
}

.my-button {
  background-color: var(--color-brand-blue);
  color: var(--color-bg-main);
}
```

Add to your main app initialization:
```typescript
import { generateCSSVariables } from '@/styles/nexusColorSystem';

// Add CSS variables to document
const styleEl = document.createElement('style');
styleEl.textContent = generateCSSVariables();
document.head.appendChild(styleEl);
```

---

## Troubleshooting

### Q: Hook not working in my component?
**A:** Make sure your component is inside a React component tree. If using in standalone code, use direct imports:
```typescript
import NEXUS_COLORS from '@/styles/nexusColorSystem';
const blue = NEXUS_COLORS.BRAND.blue;
```

### Q: Colors not applying?
**A:** Check the color value:
```typescript
const colors = useNexusTheme();
console.log(colors.bg.card);  // Should print #111827
```

### Q: Text contrast issues?
**A:** Always use text hierarchy:
- `colors.text.primary` for main text
- `colors.text.secondary` for supporting text
- `colors.text.muted` for hints

### Q: Module color not found?
**A:** Module names should match the MODULES object keys. Check NEXUS_DESIGN_SYSTEM.md for full list.

---

## Next Steps

1. ✅ Copy the hook import line
2. ✅ Replace hardcoded colors in your component
3. ✅ Test the colors render correctly
4. ✅ Verify text contrast is readable
5. ✅ Deploy!

---

## Files to Check

- **Color Definitions:** `src/styles/nexusColorSystem.ts`
- **React Hook:** `src/hooks/useNexusTheme.ts`
- **Full Guide:** `NEXUS_DESIGN_SYSTEM.md`
- **This File:** `NEXUS_QUICK_START.md`

---

**Ready to use NEXUS? Start with the hook and you're done! 🚀**

```typescript
// That's all you need!
const colors = useNexusTheme();
```
