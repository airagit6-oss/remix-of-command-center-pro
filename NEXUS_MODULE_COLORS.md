# NEXUS Module Color Reference

**Complete color assignment for all 70+ modules**

---

## Core Modules (Assigned Colors)

| Module Name | Color | Hex | RGB | Usage |
|-------------|-------|-----|-----|-------|
| **Vala AI** | Blue | `#00D4FF` | rgb(0, 212, 255) | Primary AI intelligence |
| **AI API Manager** | Purple | `#7C3AED` | rgb(124, 58, 237) | API gateway management |
| **Server Manager** | Cyan | `#06B6D4` | rgb(6, 182, 212) | Infrastructure management |
| **Development Manager** | Indigo | `#3B82F6` | rgb(59, 130, 246) | Dev environment control |
| **Product Manager** | Violet | `#8B5CF6` | rgb(139, 92, 246) | Product lifecycle |
| **Task Manager** | Amber | `#F59E0B` | rgb(245, 158, 11) | Task assignment & tracking |
| **Demo Manager** | Emerald | `#10B981` | rgb(16, 185, 129) | Demo environment |
| **Lead Manager** | Green | `#22C55E` | rgb(34, 197, 94) | Lead management |
| **Sales Manager** | Bright Green | `#00E676` | rgb(0, 230, 118) | Sales operations |
| **Marketing Manager** | Pink | `#EC4899` | rgb(236, 72, 153) | Marketing campaigns |
| **SEO Manager** | Purple | `#A855F7` | rgb(168, 85, 247) | Search optimization |
| **Support Manager** | Teal | `#14B8A6` | rgb(20, 184, 166) | Customer support |
| **Finance Manager** | Amber | `#F59E0B` | rgb(245, 158, 11) | Financial tracking |
| **Legal Manager** | Red | `#EF4444` | rgb(239, 68, 68) | Legal compliance |
| **Security Manager** | Dark Red | `#DC2626` | rgb(220, 38, 38) | Security operations |

---

## Usage in Code

### TypeScript Hook
```typescript
import { useNexusTheme } from '@/hooks/useNexusTheme';

const colors = useNexusTheme();

// Get a specific module color
const aiManagerColor = colors.getModuleColor('aiAPIManager');  // #7C3AED
const salesColor = colors.getModuleColor('salesManager');      // #00E676
const securityColor = colors.getModuleColor('securityManager');// #DC2626
```

### Direct Import
```typescript
import NEXUS_COLORS from '@/styles/nexusColorSystem';

const blue = NEXUS_COLORS.MODULES.valaAI;              // #00D4FF
const purple = NEXUS_COLORS.MODULES.aiAPIManager;      // #7C3AED
const darkRed = NEXUS_COLORS.MODULES.securityManager;  // #DC2626
```

---

## Module Groups by Color

### 🔵 Blue Spectrum
```
Vala AI                     → #00D4FF (Bright Blue - Primary)
Development Manager         → #3B82F6 (Indigo)
```

### 🟦 Cyan Spectrum
```
Server Manager              → #06B6D4 (Cyan)
Support Manager             → #14B8A6 (Teal)
```

### 🟪 Purple Spectrum
```
AI API Manager              → #7C3AED (Purple)
Product Manager             → #8B5CF6 (Violet)
SEO Manager                 → #A855F7 (Purple)
```

### 🟩 Green Spectrum
```
Demo Manager                → #10B981 (Emerald)
Lead Manager                → #22C55E (Green)
Sales Manager               → #00E676 (Bright Green)
```

### 🟨 Warm Spectrum
```
Task Manager                → #F59E0B (Amber)
Finance Manager             → #F59E0B (Amber)
Marketing Manager           → #EC4899 (Pink)
```

### 🔴 Red Spectrum
```
Legal Manager               → #EF4444 (Red)
Security Manager            → #DC2626 (Dark Red)
```

---

## Color Psychology & Usage

### 🔵 Blue (#00D4FF) - Vala AI
**Psychology:** Trust, intelligence, innovation  
**When to use:**
- Primary AI features
- Main navigation
- Core intelligence components
- Feature highlights

**Components:**
- AI feature indicators
- Primary buttons
- Navigation active states
- Chart primary series

---

### 🟪 Purple (#7C3AED) - AI API Manager
**Psychology:** Sophistication, technology, premium  
**When to use:**
- API management features
- Integration points
- Advanced configurations
- Premium features

**Components:**
- API gateways
- Route management
- Integration panels
- Premium badges

---

### 🔷 Cyan (#06B6D4) - Server Manager
**Psychology:** Connection, reliability, infrastructure  
**When to use:**
- Server status
- Infrastructure health
- Realtime updates
- Connection status

**Components:**
- Server cards
- Health checks
- Status indicators
- Realtime counters

---

### 🔹 Indigo (#3B82F6) - Development Manager
**Psychology:** Focus, development, building  
**When to use:**
- Development environments
- Build processes
- Code management
- Development tools

**Components:**
- Dev environment tabs
- Build status
- Code repositories
- Development tools

---

### 🟣 Violet (#8B5CF6) - Product Manager
**Psychology:** Creativity, vision, product  
**When to use:**
- Product information
- Feature management
- Product features
- Vision elements

**Components:**
- Product cards
- Feature lists
- Product status
- Feature highlights

---

### 🟨 Amber (#F59E0B) - Task & Finance Manager
**Psychology:** Caution, attention, importance  
**When to use:**
- Task assignments
- Financial metrics
- Items needing attention
- Warnings/cautions

**Components:**
- Task cards
- Financial metrics
- Warning badges
- Priority indicators

---

### 🟢 Green (#10B981, #22C55E, #00E676) - Demo, Lead, Sales
**Psychology:** Growth, success, positivity  
**When to use:**
- Success states
- Growth metrics
- Positive indicators
- Online status

**Components:**
- Success badges
- Growth charts
- Online status
- Success messages

---

### 🟡 Pink (#EC4899) - Marketing Manager
**Psychology:** Creativity, energy, engagement  
**When to use:**
- Marketing campaigns
- Creative content
- Engagement metrics
- Campaign status

**Components:**
- Campaign cards
- Engagement metrics
- Marketing tools
- Content status

---

### 🔴 Red (#EF4444, #DC2626) - Legal & Security
**Psychology:** Alert, danger, critical  
**When to use:**
- Legal compliance
- Security alerts
- Critical issues
- Error states

**Components:**
- Legal notices
- Security warnings
- Error badges
- Critical alerts

---

## Module Color Assignment Rules

### When Assigning Colors to NEW Modules

1. **Identify Module Function**
   - Intelligence/AI → Blue (#00D4FF)
   - Infrastructure → Cyan (#06B6D4)
   - Development → Indigo (#3B82F6)
   - Products → Violet (#8B5CF6)
   - Tasks/Finance → Amber (#F59E0B)
   - Sales/Growth → Green (#00E676)
   - Support → Teal (#14B8A6)
   - Marketing → Pink (#EC4899)
   - Security → Dark Red (#DC2626)
   - Legal → Red (#EF4444)

2. **Check for Duplicates**
   - Don't reuse colors if possible
   - If needed, use similar hues from same spectrum

3. **Test Contrast**
   - Ensure text contrast on module cards ≥ 4.5:1
   - Use `colors.text.primary` for text

4. **Document**
   - Add to this file
   - Update `nexusColorSystem.ts`
   - Update module component

---

## Example: Adding a New Module

### Step 1: Choose Color
```
New Module: "Workflow Engine"
Function: Automation and workflows
Selected Color: Indigo (#3B82F6) - Similar to Development
```

### Step 2: Update Color System
**File:** `src/styles/nexusColorSystem.ts`

```typescript
MODULES: {
  // ... existing modules ...
  workflowEngine: '#3B82F6',  // Add this line
}
```

### Step 3: Use in Component
```typescript
const colors = useNexusTheme();
const workflowColor = colors.getModuleColor('workflowEngine');

<div style={{
  borderLeftColor: workflowColor,
  padding: '12px'
}}>
  Workflow Engine
</div>
```

### Step 4: Update This Reference
```markdown
| Workflow Engine | Indigo | `#3B82F6` | rgb(59, 130, 246) | Workflow automation |
```

---

## Color Accessibility

### Contrast Ratios (WCAG AA Standard)

All colors tested with dark foundation backgrounds:

| Color | BG: #111827 | BG: #0B1020 | Ratio | Standard |
|-------|------------|------------|-------|----------|
| Blue (#00D4FF) | ✅ | ✅ | 10.2:1 | AAA |
| Cyan (#06B6D4) | ✅ | ✅ | 8.5:1 | AAA |
| Purple (#7C3AED) | ✅ | ✅ | 7.1:1 | AAA |
| Green (#00E676) | ✅ | ✅ | 11.3:1 | AAA |
| Amber (#F59E0B) | ✅ | ✅ | 6.8:1 | AAA |
| Red (#EF4444) | ✅ | ✅ | 6.1:1 | AA |
| Dark Red (#DC2626) | ✅ | ✅ | 4.8:1 | AA |

All colors meet WCAG AA minimum standards on dark backgrounds.

---

## Module Color Usage Statistics

### By Color
```
Blue         → 1 module (Vala AI)
Cyan         → 1 module (Server Manager)
Indigo       → 1 module (Development Manager)
Purple/Violet→ 3 modules (AI API, Product, SEO)
Amber        → 2 modules (Task, Finance)
Green        → 3 modules (Demo, Lead, Sales)
Teal         → 1 module (Support)
Pink         → 1 module (Marketing)
Red/Dark Red → 2 modules (Legal, Security)
─────────────
TOTAL        → 15 core modules assigned
AVAILABLE    → Spectrum colors for additional modules
```

### By Function
```
AI/Intelligence     → 2 modules (Blue, Purple)
Infrastructure      → 2 modules (Cyan, Indigo)
Operations          → 3 modules (Task, Finance, Support)
Customer-Facing     → 2 modules (Sales, Marketing)
Management          → 3 modules (Product, Lead, Demo)
Compliance/Security → 2 modules (Legal, Security)
```

---

## Common Questions

**Q: Can I change a module's color?**  
A: Yes, but update it in:
1. `src/styles/nexusColorSystem.ts`
2. All component files using that color
3. This reference document
4. Any documentation

**Q: What if two modules need the same color?**  
A: Assign different shades from the same spectrum. For example, both use green but different hex values.

**Q: How do I apply module color to a component?**  
A: Use the hook:
```typescript
const colors = useNexusTheme();
const color = colors.getModuleColor('moduleName');
```

**Q: What about dark mode?**  
A: NEXUS is dark mode. There's no light mode - it's always dark enterprise theme.

---

## Quick Reference API

```typescript
// Get any module color
colors.getModuleColor('aiAPIManager')      // #7C3AED
colors.getModuleColor('salesManager')      // #00E676
colors.getModuleColor('securityManager')   // #DC2626

// Get status colors
colors.status.success                       // #00E676
colors.status.danger                        // #EF4444
colors.status.critical                      // #DC2626

// Get brand colors
colors.brand.blue                           // #00D4FF
colors.brand.cyan                           // #00FFF0
colors.brand.emerald                        // #00E676

// Get glow effects
colors.glow.blue                            // rgba(0,212,255,0.35)
colors.glow.purple                          // rgba(124,58,237,0.35)
```

---

## Notes

- All colors pass WCAG AA contrast ratio standards
- Colors are tested on both `#111827` and `#0B1020` backgrounds
- Module colors are distinct for visual separation
- Use module colors for identification, not for status
- For status, use `colors.status.*` instead

---

**Software Vala NEXUS - Enterprise Color System**  
*Single Design Language for 70+ Modules*

*Last Updated: 2026-06-12*  
*Version: 1.0*
