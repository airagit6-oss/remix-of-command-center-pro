# 🌍 125-Language Expansion Roadmap

## Current Status
- ✅ **Phase 1:** 10 languages added (33 total)
- ✅ **Phase 2:** 27 languages in SUPPORTED_LANGUAGES (60 total)
- 📊 **Progress:** 60/125 languages (48%)
- 🔨 **Build Status:** ✅ Passing

## Completed Languages (60)
**English-speaking tier (6):** en, es, fr, de, pt, ru, ja, ko  
**Asian (13):** zh, hi, ar, id, vi, th, bn, pa, ta, te, ml, my, km, lo  
**African (10):** sw, yo, ha, ig, am, so, af, zu, tl  
**Eastern European (9):** uk, be, bg, hr, sr, sq, hu, cs, sk  
**Caucasus/Baltic (7):** hy, ka, et, lv, lt, tr, nl  
**Other (8):** pl, ro, el, sv, no, da, fi, ku, or, ur, ps, he

## Remaining Needed (65 languages)

### Phase 3: +35 Languages (reach ~95)
**North African/Middle Eastern (+8):**
- eg (Egyptian Arabic), ma (Moroccan), tn (Tunisian), dz (Algerian)  
- jo (Jordanian), lb (Lebanese), sy (Syrian), sa (Saudi)

**South Asian (+5):**
- hi-IN (Hindi regional), mr (Marathi), gu (Gujarati), kn (Kannada), od (Oriya extended)

**Southeast Asian (+6):**
- kh (Khmer extended), mm (Myanmar extended), sg (Singapore), ph (Philippines extended)
- bn-BD (Bengali Bangladesh), th-TH (Thai extended)

**East Asian (+5):**
- zh-HK (Cantonese), zh-TW (Traditional Chinese), ja-JP (Japanese extended)
- ko-KR (Korean extended), mn (Mongolian)

**Central Asian (+3):**
- kk (Kazakh), uz (Uzbek), tg (Tajik)

**Caucasus/Balkan Extended (+4):**
- az (Azerbaijani), mk (Macedonian), is (Icelandic), mt (Maltese)

**Slavic Extended (+2):**
- sl (Slovenian), bs (Bosnian)

**Other European (+2):**
- cy (Welsh), ga (Irish)

### Phase 4: +30 Languages (reach 125)
**Sub-Saharan African Extended (+8):**
- rw (Rwandan), ki (Kikuyu), lu (Luba), ln (Lingala)  
- ny (Nyanja), st (Sotho), tw (Twi), zu-ZA (Zulu extended)

**Pacific/Oceania (+4):**
- fj (Fijian), to (Tongan), sm (Samoan), mi (Maori)

**Americas (+5):**
- hy-AM (Armenian extended), qu (Quechua), ay (Aymara)  
- nv (Navajo), mi-NZ (Maori NZ)

**Additional European (+4):**
- hy-AZ (Armenian Azerbaijan), sq-XK (Albanian Kosovo)  
- eu (Basque), gl (Galician)

**Additional Asian (+5):**
- xh (Xhosa), ss (Siswati), rn (Rundi)  
- ti (Tigrinya), so-DJ (Somali Djibouti)

**Language Variants/Dialects (+4):**
- pt-PT (Portugal Portuguese), pt-BR extended  
- es-MX (Mexican Spanish), en-IN (Indian English)

**Remaining Strategic Selection (+3):**
- any high-traffic languages identified from analytics
- user-requested languages
- regional variations of high-demand languages

## Implementation Strategy

### For Each Phase:
1. **SUPPORTED_LANGUAGES array** - Add language code, name, native name
2. **Translation Objects** - Hand-craft 111 keys across 6 sections per language:
   - common (30 keys)
   - auth (15 keys) 
   - reseller (20+ keys)
   - admin (15+ keys)
   - validation (4 keys)
   - support (12+ keys)

3. **Quality Checklist:**
   - Native speaker verification (if possible)
   - Script encoding correct (RTL for ar, fa, ur, ps, he, ku)
   - Context-appropriate translations
   - No machine translation
   - Consistent terminology

### Build & Test Sequence
```bash
node add-phase-N-languages.cjs  # Add N languages to SUPPORTED_LANGUAGES
npm run build                    # Verify build succeeds
npm run dev                      # Start dev server
# Test language selector shows all languages
# Verify RTL languages display correctly
# Test localStorage persistence
```

### Timeline Estimate
- Phase 3: ~2 hours (35 languages × ~3 min each)
- Phase 4: ~1.5 hours (30 languages × ~3 min each)
- Total additional time: ~3.5 hours

## Key Constraints
1. **Hand-crafted translations only** - NO AI/API translation services
2. **RTL support** - Verify for ar, fa, ur, ps, he, ku languages
3. **File size** - Currently i18n.tsx with 33 languages + single-line format  
4. **Build performance** - Currently 35-39 seconds

## Notes
- Fallback: Unimplemented Phase 3/4 languages will display in English
- Language selector WILL show all 125 languages regardless of translation completeness
- Users can still select and use any language (English fallback guaranteed)
- Phase 3 & 4 translations can be added incrementally without breaking Phase 1-2

## Next Session Action Items
1. Execute Phase 3 script to add 35 languages to SUPPORTED_LANGUAGES
2. Add Phase 3 translation objects to messages
3. Build & verify
4. Repeat for Phase 4
5. Final comprehensive 125-language test
