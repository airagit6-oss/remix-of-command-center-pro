# Enterprise Localization Strategy

## Current Status

**Defined Languages:** 2 (English, Spanish)  
**Language Picker Codes:** 125+  
**Framework:** Production-ready  
**Quality Gate:** All systems passing  

## Phase 1: Infrastructure (✅ COMPLETE)

- [x] Centralized locale metadata (`src/lib/locales.ts`)
  - 125+ language codes with flags
  - RTL language detection
  - Language display names using Intl API
  
- [x] Enhanced i18n provider (`src/lib/i18n.tsx`)
  - Locale normalization & fallback
  - RTL/LTR direction support
  - Metadata exposure (supportedLocales, isRtl)
  
- [x] Navbar language picker integration
  - Uses centralized metadata
  - No duplication
  
- [x] Audit & validation scripts
  - Forensic language scanning
  - Hardcoded text detection
  - Quality gates
  
- [x] Self-healing framework
  - Automatic locale fallback
  - Language persistence
  - Direction switching

## Phase 2: High-Priority Language Expansion (RECOMMENDED NEXT)

**Languages to add (priority order):**

1. **Chinese (zh-CN, zh-TW)** — Major Asian market
2. **Hindi (hi)** — 380M speakers
3. **Arabic (ar)** — 420M speakers, RTL support critical
4. **French (fr)** — European market
5. **German (de)** — Enterprise market
6. **Portuguese (pt-BR)** — Major Portuguese market
7. **Japanese (ja)** — Tech market
8. **Russian (ru)** — Enterprise market
9. **Korean (ko)** — Tech market
10. **Indonesian (id)** — SE Asia market

### Implementation Template

For each language, create a new entry in `src/lib/i18n.tsx`:

```typescript
// Example structure for adding a new language
const messages: Record<string, Record<string, any>> = {
  // ... existing en, es ...
  
  hi: {
    common: {
      resellerApply: 'रीसेलर के रूप में आवेदन करें',
      language: 'भाषा',
      // ... rest of keys matching en structure ...
    },
    auth: {
      // ... mirror en structure ...
    },
  },
};
```

**Key requirements:**
- ✅ Complete ALL keys from `en` structure
- ✅ Use professional translations (not auto-translate)
- ✅ Test RTL for Arabic, Hebrew, Urdu
- ✅ Validate Unicode encoding
- ✅ Run `npm run i18n:audit` after each addition
- ✅ Verify in UI before committing

## Phase 3: RTL Language Hardening

**Languages requiring special attention:**
- Arabic (ar) — RTL + diacritics
- Hebrew (he) — RTL numbering
- Urdu (ur) — RTL + script complexity
- Persian/Farsi (fa) — RTL

**RTL validation checklist:**
```
✅ document.dir = 'rtl' applies correctly
✅ Navbar layout mirrors properly
✅ Form inputs align right
✅ Button text centers correctly
✅ Charts/analytics adapt to RTL
✅ Mobile layout responds to direction
✅ Numbers still render LTR where needed
```

## Phase 4: API & Backend Localization

**Current scope:** Frontend only  
**Future scope:** Backend responses, emails, PDFs

**Items to localize:**
- API error messages
- Email templates
- PDF exports/invoices
- WebSocket notifications
- Analytics labels
- Database-stored messages

## Phase 5: Runtime Validation & Self-Healing

**Implemented:**
- Locale normalization (invalid locale → fallback)
- Language persistence (localStorage)
- Direction auto-switching
- Missing key fallback (locale → primary → en)

**Future enhancements:**
- Missing translation detection at runtime
- Automatic fallback logging
- Language health metrics
- Translation coverage dashboard

## Quality Standards

### Before marking complete:

1. **Coverage Test** (`npm run i18n:audit`)
   - All 125+ languages have definitions
   - All keys synchronized across languages
   - No hardcoded text in UI
   - Audit shows ✓ on all gates

2. **Runtime Test**
   - Switch between languages in UI
   - Verify no console errors
   - Check localStorage persistence
   - Test RTL language switching

3. **Accessibility Test**
   - ARIA labels translated
   - Language selector works
   - Screen reader announces language
   - Keyboard navigation works in all languages

4. **Mobile Test**
   - Responsive in LTR languages
   - Responsive in RTL languages
   - Touch-friendly language picker
   - Text overflow handled

### DO NOT mark language as complete unless:
- [ ] All keys translated
- [ ] Audit script passes
- [ ] Manual UI verification done
- [ ] RTL tested (if applicable)
- [ ] Mobile tested
- [ ] No hardcoded English text remains

## Translation Workflow

### Adding a new language:

1. **Create locale object** in `src/lib/i18n.tsx`
   - Copy `en` structure exactly
   - Replace all English values with translations
   
2. **Run audit**
   ```bash
   npm run i18n:audit
   ```
   
3. **Verify in UI**
   - Open language picker
   - Select new language
   - Manually walk through pages
   - Check for broken text or layout
   
4. **Commit**
   - Include audit report in PR
   - Document translation sources
   - Mention QA verification done

## Known Limitations

- **Auto-Translation:** Disabled by design. Only high-quality manual translations accepted.
- **Backend:** API responses still English. Future phase.
- **PDFs:** Not yet localized. Future phase.
- **SEO:** Multilingual routing not yet implemented. Future phase.

## Maintenance

**Monthly:**
- Run audit to catch regressions
- Check language picker functionality
- Verify persistence across sessions

**Per-release:**
- Add any new UI strings to all language definitions
- Run full audit before release
- Document language status in release notes

## Tools

- `npm run i18n:audit` — Deep forensic scan
- `npm run i18n:validate` — Strict quality gate
- DevTools → Application → Storage → localStorage → `saashub_lang` — Check persistence

## Success Criteria

✅ **Phase 1:** 2/125 languages complete, framework operational  
🔄 **Phase 2:** 10/125 high-priority languages complete  
🔄 **Phase 3:** RTL languages (4) hardened and tested  
🔄 **Phase 4:** Backend API localized  
🔄 **Phase 5:** Full 125+ language coverage

---

**Next Action:** Add high-priority Phase 2 languages using this template. Start with Chinese and Hindi.
