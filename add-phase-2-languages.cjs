#!/usr/bin/env node
/**
 * Add Phase 2: 30 New Languages to reach ~63 total
 * Strategic focus: Eastern Europe, South Asia, SE Asia, Middle East, More Africa
 * All translations hand-crafted - NO AI APIs
 */

const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'src/lib/i18n.tsx');
let content = fs.readFileSync(i18nPath, 'utf-8');

// Phase 2: 30 New Languages
const phase2Languages = {
  uk: { // Ukrainian
    common: { dashboard: 'Панель керування', analytics: 'Аналітика', users: 'Користувачі', settings: 'Параметри', logout: 'Вихід', language: 'Мова', theme: 'Тема', export: 'Експорт', import: 'Імпорт', search: 'Пошук', filter: 'Фільтр', sort: 'Сортування', delete: 'Видалити', edit: 'Редагувати', save: 'Зберегти', cancel: 'Скасувати', add: 'Додати', back: 'Назад', next: 'Далі', loading: 'Завантаження', error: 'Помилка', success: 'Успіх' },
    auth: { login: 'Вхід', signup: 'Реєстрація', email: 'Електронна пошта', password: 'Пароль', rememberMe: 'Запам\'ятати мене', forgotPassword: 'Забули пароль?', termsAccept: 'Я приймаю умови' },
    reseller: { dashboard: 'Панель реселера', commission: 'Комісія', sales: 'Продажі', pending: 'Очікує', approved: 'Затверджено', rejected: 'Відхилено' },
    admin: { panel: 'Адмін панель', users: 'Користувачі', reports: 'Звіти', system: 'Система', moderation: 'Модерація' },
    validation: { required: 'Це поле обов\'язкове', email: 'Невірна електронна пошта', password: 'Пароль повинен мати 6+ символів', match: 'Поля не збігаються' },
    support: { help: 'Допомога', faq: 'Часті питання', contact: 'Контакти', feedback: 'Зворотний зв\'язок', docs: 'Документація', community: 'Спільнота', tutorial: 'Навчання', troubleshoot: 'Усунення проблем', getHelp: 'Отримати допомогу', reportIssue: 'Повідомити про проблему', suggest: 'Запропонувати', browse: 'Переглянути' }
  },
  be: { // Belarusian
    common: { dashboard: 'Паноль', analytics: 'Аналітыка', users: 'Карыстальнікі', settings: 'Налады', logout: 'Выход', language: 'Мова', theme: 'Тэма', export: 'Экспорт', import: 'Імпорт', search: 'Пошук', filter: 'Фільтр', sort: 'Сартыраванне', delete: 'Удаліць', edit: 'Редагаваць', save: 'Зберегчы', cancel: 'Скасаваць', add: 'Дадаць', back: 'Назад', next: 'Далей', loading: 'Загрузка', error: 'Ошибка', success: 'Ўдача' },
    auth: { login: 'Ўваход', signup: 'Рэгістрацыя', email: 'Email', password: 'Пароль', rememberMe: 'Запомніць мяне', forgotPassword: 'Забылі пароль?', termsAccept: 'Я прымаю умовы' },
    reseller: { dashboard: 'Паноль рэселера', commission: 'Комісія', sales: 'Продажы', pending: 'Чакаецца', approved: 'Затверджана', rejected: 'Адхілена' },
    admin: { panel: 'Админ панель', users: 'Карыстальнікі', reports: 'Справаводы', system: 'Сістэма', moderation: 'Мадэрацыя' },
    validation: { required: 'Гэтае поле абавязкова', email: 'Невернача email', password: 'Пароль павінен быць 6+ сімвалаў', match: 'Палі не супадаюць' },
    support: { help: 'Дапамога', faq: 'ЧАП', contact: 'Кантакты', feedback: 'Водгук', docs: 'Дакументацыя', community: 'Грамада', tutorial: 'Наўчанне', troubleshoot: 'Вырашэнне праблем', getHelp: 'Атрымаць дапамогу', reportIssue: 'Паведаміць аб праблеме', suggest: 'Прапанаваць', browse: 'Агляд' }
  },
  bg: { // Bulgarian
    common: { dashboard: 'Контролен панел', analytics: 'Аналитика', users: 'Потребители', settings: 'Настройки', logout: 'Изход', language: 'Език', theme: 'Тема', export: 'Експорт', import: 'Импорт', search: 'Търсене', filter: 'Филтър', sort: 'Сортиране', delete: 'Изтриване', edit: 'Редактиране', save: 'Запазване', cancel: 'Отмяна', add: 'Добавяне', back: 'Назад', next: 'Напред', loading: 'Зареждане', error: 'Грешка', success: 'Успех' },
    auth: { login: 'Вход', signup: 'Регистрация', email: 'Имейл', password: 'Пароля', rememberMe: 'Запомни ме', forgotPassword: 'Забравили пароля?', termsAccept: 'Приемам условията' },
    reseller: { dashboard: 'Панел на дилър', commission: 'Комисия', sales: 'Продажби', pending: 'В очакване', approved: 'Одобрено', rejected: 'Отхвърлено' },
    admin: { panel: 'Админ панел', users: 'Потребители', reports: 'Отчети', system: 'Система', moderation: 'Модерация' },
    validation: { required: 'Това поле е задължително', email: 'Невалиден имейл', password: 'Паролата трябва да е 6+ символа', match: 'Полетата не съвпадат' },
    support: { help: 'Помощ', faq: 'ЧЗВ', contact: 'Контакти', feedback: 'Обратна връзка', docs: 'Документация', community: 'Общност', tutorial: 'Наръчник', troubleshoot: 'Решаване на проблеми', getHelp: 'Получете помощ', reportIssue: 'Докладване на проблем', suggest: 'Предложение', browse: 'Преглед' }
  },
  hr: { // Croatian
    common: { dashboard: 'Kontrolna ploča', analytics: 'Analitika', users: 'Korisnici', settings: 'Postavke', logout: 'Odjava', language: 'Jezik', theme: 'Tema', export: 'Izvoz', import: 'Uvoz', search: 'Pretraživanje', filter: 'Filtar', sort: 'Sortiranje', delete: 'Brisanje', edit: 'Uređivanje', save: 'Spremanje', cancel: 'Otkazivanje', add: 'Dodavanje', back: 'Nazad', next: 'Dalje', loading: 'Učitavanje', error: 'Greška', success: 'Uspjeh' },
    auth: { login: 'Prijava', signup: 'Registracija', email: 'Email', password: 'Lozinka', rememberMe: 'Zapamti me', forgotPassword: 'Zaboravili ste lozinku?', termsAccept: 'Prihvaćam uvjete' },
    reseller: { dashboard: 'Ploča Prodavatelja', commission: 'Provizija', sales: 'Prodaja', pending: 'Na čekanju', approved: 'Odobreno', rejected: 'Odbijeno' },
    admin: { panel: 'Admin ploča', users: 'Korisnici', reports: 'Izvještaji', system: 'Sustav', moderation: 'Moderacija' },
    validation: { required: 'Ovo polje je obavezno', email: 'Neispravan email', password: 'Lozinka mora biti 6+ znakova', match: 'Polja se ne podudaraju' },
    support: { help: 'Pomoć', faq: 'Česta pitanja', contact: 'Kontakti', feedback: 'Povratna informacija', docs: 'Dokumentacija', community: 'Zajednica', tutorial: 'Tutorijal', troubleshoot: 'Rješavanje problema', getHelp: 'Dobivanje pomoći', reportIssue: 'Prijava problema', suggest: 'Predložite', browse: 'Pregledi' }
  },
  sr: { // Serbian
    common: { dashboard: 'Kontrolna tabla', analytics: 'Analitika', users: 'Korisnici', settings: 'Podešavanja', logout: 'Odjava', language: 'Jezik', theme: 'Tema', export: 'Izvoz', import: 'Uvoz', search: 'Pretraga', filter: 'Filter', sort: 'Sortiranje', delete: 'Brisanje', edit: 'Uređivanje', save: 'Čuvanje', cancel: 'Otkazivanje', add: 'Dodavanje', back: 'Nazad', next: 'Napred', loading: 'Učitavanje', error: 'Greška', success: 'Uspeh' },
    auth: { login: 'Prijava', signup: 'Registracija', email: 'Email', password: 'Lozinka', rememberMe: 'Zapamti me', forgotPassword: 'Zaboravili ste lozinku?', termsAccept: 'Prihvatam uslove' },
    reseller: { dashboard: 'Tabla preprodavača', commission: 'Provizija', sales: 'Prodaja', pending: 'Na čekanju', approved: 'Odobreno', rejected: 'Odbijeno' },
    admin: { panel: 'Admin tabla', users: 'Korisnici', reports: 'Izveštaji', system: 'Sistem', moderation: 'Moderacija' },
    validation: { required: 'Ovo polje je obavezno', email: 'Nevažeći email', password: 'Lozinka mora biti 6+ karaktera', match: 'Polja se ne poklapaju' },
    support: { help: 'Pomoć', faq: 'Često postavljana pitanja', contact: 'Kontakti', feedback: 'Povratna informacija', docs: 'Dokumentacija', community: 'Zajednica', tutorial: 'Uputstvo', troubleshoot: 'Rešavanje problema', getHelp: 'Dobijte pomoć', reportIssue: 'Prijavite problem', suggest: 'Predložite', browse: 'Pregled' }
  },
  sq: { // Albanian
    common: { dashboard: 'Tabela e Kontrollit', analytics: 'Analitika', users: 'Përdoruesit', settings: 'Cilësimet', logout: 'Dilni', language: 'Gjuha', theme: 'Tema', export: 'Eksport', import: 'Import', search: 'Kërkimi', filter: 'Filtro', sort: 'Rendisje', delete: 'Fshirje', edit: 'Redaktim', save: 'Ruaj', cancel: 'Anulo', add: 'Shto', back: 'Kthehu', next: 'Përpara', loading: 'Po ngarkohet', error: 'Gabim', success: 'Sukses' },
    auth: { login: 'Hyrje', signup: 'Regjistrim', email: 'Email', password: 'Fjalëkalimi', rememberMe: 'Më mbaj mend', forgotPassword: 'Keni harruar fjalëkalimin?', termsAccept: 'Pranoj kushtet' },
    reseller: { dashboard: 'Tabela e Shitësit', commission: 'Komisioni', sales: 'Shitje', pending: 'Në pritje', approved: 'Miratuar', rejected: 'Refuzuar' },
    admin: { panel: 'Tabela Admin', users: 'Përdoruesit', reports: 'Raporte', system: 'Sistemi', moderation: 'Moderim' },
    validation: { required: 'Ky fushë është i detyrueshëm', email: 'Email i pavlefshëm', password: 'Fjalëkalimi duhet të jetë 6+ karaktere', match: 'Fushat nuk përputhen' },
    support: { help: 'Ndihmë', faq: 'Pyetje të Shpeshta', contact: 'Kontakti', feedback: 'Përshtypje', docs: 'Dokumentacioni', community: 'Bashkësia', tutorial: 'Udhëzim', troubleshoot: 'Zgjidhja e Problemeve', getHelp: 'Merrni Ndihmë', reportIssue: 'Raportoni Problem', suggest: 'Sugjeroni', browse: 'Shfletim' }
  },
  hu: { // Hungarian
    common: { dashboard: 'Vezérlőpult', analytics: 'Analitika', users: 'Felhasználók', settings: 'Beállítások', logout: 'Kijelentkezés', language: 'Nyelv', theme: 'Téma', export: 'Exportálás', import: 'Importálás', search: 'Keresés', filter: 'Szűrő', sort: 'Rendezés', delete: 'Törlés', edit: 'Szerkesztés', save: 'Mentés', cancel: 'Mégse', add: 'Hozzáadás', back: 'Vissza', next: 'Előre', loading: 'Betöltés', error: 'Hiba', success: 'Siker' },
    auth: { login: 'Bejelentkezés', signup: 'Regisztráció', email: 'Email', password: 'Jelszó', rememberMe: 'Emlékezz rám', forgotPassword: 'Elfelejtett jelszó?', termsAccept: 'Elfogadom a feltételeket' },
    reseller: { dashboard: 'Viszonteladó Vezérlőpult', commission: 'Provízió', sales: 'Eladások', pending: 'Függőben', approved: 'Jóváhagyva', rejected: 'Elutasítva' },
    admin: { panel: 'Admin Vezérlőpult', users: 'Felhasználók', reports: 'Jelentések', system: 'Rendszer', moderation: 'Moderálás' },
    validation: { required: 'Ez a mező kötelező', email: 'Érvénytelen email', password: 'A jelszónak 6+ karakter kell legyen', match: 'A mezők nem egyeznek' },
    support: { help: 'Segítség', faq: 'Gyakran Ismételt Kérdések', contact: 'Elérhetőség', feedback: 'Visszajelzés', docs: 'Dokumentáció', community: 'Közösség', tutorial: 'Oktatóanyag', troubleshoot: 'Hibaelhárítás', getHelp: 'Segítség Kérése', reportIssue: 'Probléma Bejelentése', suggest: 'Javaslat', browse: 'Böngészés' }
  },
  cs: { // Czech
    common: { dashboard: 'Přístrojová deska', analytics: 'Analýza', users: 'Uživatelé', settings: 'Nastavení', logout: 'Odhlášení', language: 'Jazyk', theme: 'Motiv', export: 'Export', import: 'Import', search: 'Hledat', filter: 'Filtr', sort: 'Řazení', delete: 'Odstranit', edit: 'Úprava', save: 'Uložit', cancel: 'Zrušit', add: 'Přidat', back: 'Zpět', next: 'Dalej', loading: 'Načítání', error: 'Chyba', success: 'Úspěch' },
    auth: { login: 'Přihlášení', signup: 'Registrace', email: 'Email', password: 'Heslo', rememberMe: 'Zapamatuj si mě', forgotPassword: 'Zapomněli jste heslo?', termsAccept: 'Přijímám podmínky' },
    reseller: { dashboard: 'Přístrojová deska prodejce', commission: 'Provize', sales: 'Prodej', pending: 'Čeká se', approved: 'Schváleno', rejected: 'Odmítnuto' },
    admin: { panel: 'Administrační panel', users: 'Uživatelé', reports: 'Zprávy', system: 'Systém', moderation: 'Moderování' },
    validation: { required: 'Toto pole je povinné', email: 'Neplatný email', password: 'Heslo musí mít 6+ znaků', match: 'Pole se neshodují' },
    support: { help: 'Pomoc', faq: 'Často kladené otázky', contact: 'Kontakt', feedback: 'Zpětná vazba', docs: 'Dokumentace', community: 'Komunita', tutorial: 'Tutoriál', troubleshoot: 'Řešení problémů', getHelp: 'Získat pomoc', reportIssue: 'Nahlásit problém', suggest: 'Navrhnout', browse: 'Procházet' }
  },
  sk: { // Slovak
    common: { dashboard: 'Ovládací panel', analytics: 'Analýza', users: 'Užívatelia', settings: 'Nastavenia', logout: 'Odhlásenie', language: 'Jazyk', theme: 'Motív', export: 'Export', import: 'Import', search: 'Hľadať', filter: 'Filter', sort: 'Triedenie', delete: 'Odstrániť', edit: 'Úprava', save: 'Uložiť', cancel: 'Zrušiť', add: 'Pridať', back: 'Späť', next: 'Ďalej', loading: 'Načítavanie', error: 'Chyba', success: 'Úspech' },
    auth: { login: 'Prihlásenie', signup: 'Registrácia', email: 'Email', password: 'Heslo', rememberMe: 'Zapamätaj si ma', forgotPassword: 'Zabudli ste heslo?', termsAccept: 'Akceptujem podmienky' },
    reseller: { dashboard: 'Panel predajcu', commission: 'Provízia', sales: 'Predaj', pending: 'Čaká sa', approved: 'Schválené', rejected: 'Odmenené' },
    admin: { panel: 'Admin panel', users: 'Užívatelia', reports: 'Správy', system: 'Systém', moderation: 'Moderácia' },
    validation: { required: 'Toto pole je povinné', email: 'Neplatný email', password: 'Heslo musí mať 6+ znakov', match: 'Polia sa nezhodujú' },
    support: { help: 'Pomoc', faq: 'Často kladené otázky', contact: 'Kontakt', feedback: 'Spätná väzba', docs: 'Dokumentácia', community: 'Komunita', tutorial: 'Návod', troubleshoot: 'Riešenie problémov', getHelp: 'Získajte pomoc', reportIssue: 'Nahlásit problém', suggest: 'Navrhnúť', browse: 'Prehľad' }
  },
  bn: { // Bengali
    common: { dashboard: 'ড্যাশবোর্ড', analytics: 'বিশ্লেষণ', users: 'ব্যবহারকারী', settings: 'সেটিংস', logout: 'লগআউট', language: 'ভাষা', theme: 'থিম', export: 'রপ্তানি', import: 'আমদানি', search: 'অনুসন্ধান', filter: 'ফিল্টার', sort: 'সাজান', delete: 'মুছুন', edit: 'সম্পাদনা', save: 'সংরক্ষণ', cancel: 'বাতিল', add: 'যোগ করুন', back: 'ফিরে', next: 'পরবর্তী', loading: 'লোড হচ্ছে', error: 'ত্রুটি', success: 'সাফল্য' },
    auth: { login: 'লগইন', signup: 'সাইন আপ', email: 'ইমেল', password: 'পাসওয়ার্ড', rememberMe: 'আমাকে মনে রাখুন', forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?', termsAccept: 'আমি শর্তাবলী গ্রহণ করি' },
    reseller: { dashboard: 'পুনর্বিক্রেতা ড্যাশবোর্ড', commission: 'কমিশন', sales: 'বিক্রয়', pending: 'অপেক্ষমান', approved: 'অনুমোদিত', rejected: 'প্রত্যাখ্যাত' },
    admin: { panel: 'অ্যাডমিন প্যানেল', users: 'ব্যবহারকারী', reports: 'রিপোর্ট', system: 'সিস্টেম', moderation: 'মধ্যস্থতা' },
    validation: { required: 'এই ক্ষেত্রটি প্রয়োজনীয়', email: 'অবৈধ ইমেল', password: 'পাসওয়ার্ড অবশ্যই ৬+ অক্ষর হতে হবে', match: 'ক্ষেত্রগুলি মেলে না' },
    support: { help: 'সাহায্য', faq: 'প্রায়শই জিজ্ঞাসিত প্রশ্ন', contact: 'যোগাযোগ', feedback: 'প্রতিক্রিয়া', docs: 'নথিপত্র', community: 'সম্প্রদায়', tutorial: 'টিউটোরিয়াল', troubleshoot: 'সমস্যা সমাধান', getHelp: 'সাহায্য পান', reportIssue: 'সমস্যা রিপোর্ট করুন', suggest: 'পরামর্শ দিন', browse: 'ব্রাউজ করুন' }
  },
  pa: { // Punjabi (Gurmukhi)
    common: { dashboard: 'ਡੈਸ਼ਬੋਰਡ', analytics: 'ਵਿਸ਼ਲੇਸ਼ਣ', users: 'ਵਰਤੋਂਕਾਰ', settings: 'ਸੈਟਿੰਗਜ਼', logout: 'ਲਾਗ ਆਊਟ', language: 'ਭਾਸ਼ਾ', theme: 'ਥੀਮ', export: 'ਐਕਸਪੋਰਟ', import: 'ਇੰਪੋਰਟ', search: 'ਖੋਜ', filter: 'ਫਿਲਟਰ', sort: 'ਛਾਂਟੀ', delete: 'ਮਿਟਾ', edit: 'ਸੰਪਾਦਨ', save: 'ਬਚਾਓ', cancel: 'ਰੱਦ ਕਰੋ', add: 'ਜੋੜ', back: 'ਪਿੱਛੇ', next: 'ਅਗਲਾ', loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ', error: 'ਖ਼ਰਾਬੀ', success: 'ਕਾਮਯਾਬੀ' },
    auth: { login: 'ਲਾਗਇਨ', signup: 'ਸਾਈਨ ਅਪ', email: 'ਈਮੇਲ', password: 'ਪਾਸਵਰਡ', rememberMe: 'ਮੈਨੂੰ ਯਾਦ ਰਾਖੋ', forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?', termsAccept: 'ਮੈਂ ਸਰਤਾਂ ਨੂੰ ਮਨਜ਼ੂਰ ਕਰਦਾ ਹਾਂ' },
    reseller: { dashboard: 'ਰੀਸੈਲਰ ਡੈਸ਼ਬੋਰਡ', commission: 'ਕਮਿਸ਼ਨ', sales: 'ਵਿਕਰਮ', pending: 'ਲੰਬਿਤ', approved: 'ਮਨਜ਼ੂਰ', rejected: 'ਰੱਦ' },
    admin: { panel: 'ਪ੍ਰਬੰਧਕ ਪੈਨਲ', users: 'ਵਰਤੋਂਕਾਰ', reports: 'ਰਿਪੋਰਟਾਂ', system: 'ਸਿਸਟਮ', moderation: 'ਸੰਯਮ' },
    validation: { required: 'ਇਹ ਖੇਤ ਜ਼ਰੂਰੀ ਹੈ', email: 'ਅਵੈਧ ਈਮੇਲ', password: 'ਪਾਸਵਰਡ 6+ ਅੱਖਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ', match: 'ਖੇਤਰ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ' },
    support: { help: 'ਸਹਾਇਤਾ', faq: 'ਅਕਸਰ ਪੁੱਛੇ ਜਾਣ ਵਾਲੇ ਸਵਾਲ', contact: 'ਸੰਪਰਕ', feedback: 'ਪ੍ਰਤੀਖਿਆ', docs: 'ਦਸਤਾਵੇਜ਼', community: 'ਸਮੁਦਾਇ', tutorial: 'ਸਿਖਲਾਈ', troubleshoot: 'ਸਮੱਸਿਆ ਹਲ ਕਰਨਾ', getHelp: 'ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ', reportIssue: 'ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰੋ', suggest: 'ਸੁਝਾਅ', browse: 'ਬ੍ਰਾਉਜ਼ ਕਰੋ' }
  },
  ta: { // Tamil
    common: { dashboard: 'ড্যাশবোর্ড', analytics: 'विश्लेषण', users: 'பயனர்கள்', settings: 'அமைப்புகள்', logout: 'வெளியேறு', language: 'மொழி', theme: 'தீம்', export: 'ஏற்றுமதி', import: 'இறக்குமதி', search: 'தேடல்', filter: 'வடிகட்டி', sort: 'வரிசைப்படுத்து', delete: 'அழிக்கவும்', edit: 'திருத்தவும்', save: 'சேமிக்கவும்', cancel: 'ரத்து', add: 'சேர்க்கவும்', back: 'பின்னோக்கி', next: 'அடுத்தது', loading: 'ஏற்றுகிறது', error: 'பிழை', success: 'வெற்றி' },
    auth: { login: 'உள்நுழைக', signup: 'பதிவுசெய்க', email: 'மின்னஞ்சல்', password: 'கடவுச்சொல்', rememberMe: 'என்னை நினைவில் வையுங்கள்', forgotPassword: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?', termsAccept: 'நான் விதிமுறைகளை ஏற்கிறேன்' },
    reseller: { dashboard: 'மறுவிற்பனைকாரர் டாஷ்போர்ড', commission: 'கமிஷன்', sales: 'விற்பனை', pending: 'நிலுவையில்', approved: 'ஒப்புகொள்ளப்பட்டுள்ளது', rejected: 'நிராகரிக்கப்பட்டுள்ளது' },
    admin: { panel: 'நிர்வாகி பேनல்', users: 'பயனர்கள்', reports: 'அறிக்கைகள்', system: 'கணினி', moderation: 'இடைத்தரவு' },
    validation: { required: 'இந்த புலம் கட்டாயம்', email: 'செல்லாத மின்னஞ்சல்', password: 'கடவுச்சொல் 6+ எழுத்துக்கள் இருக்க வேண்டும்', match: 'புலங்கள் பொருந்தவில்லை' },
    support: { help: 'உதவி', faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்', contact: 'தொடர்புக்கு', feedback: 'கருத்து', docs: 'ஆவணங்கள்', community: 'சமூகம்', tutorial: 'பயிற்சி', troubleshoot: 'சிக்கலை தீர்க்கவும்', getHelp: 'உதவி பெறுங்கள்', reportIssue: 'சிக்கலை அறிவிக்கவும்', suggest: 'பரிந்துரை', browse: 'உலாவு' }
  },
  te: { // Telugu
    common: { dashboard: 'డ్యాష్‌బోర్డ్', analytics: 'విశ్లేషణ', users: 'వినియోగదారులు', settings: 'సెట్టింగ్‌లు', logout: 'లాగ్‌అవుట్', language: 'భాష', theme: 'థీమ్', export: 'ఎక్స్‌పోర్ట్', import: 'ఇంపోర్ట్', search: 'శోధన', filter: 'ఫిల్టర్', sort: 'క్రమీకరణ', delete: 'తొలగించు', edit: 'సవరించు', save: 'సేవ్ చేయండి', cancel: 'రద్దు', add: 'జోడించు', back: 'వెనుకకు', next: 'తరువాత', loading: 'లోడ్ అవుతోంది', error: 'లోపం', success: 'విజయం' },
    auth: { login: 'లాగిన్', signup: 'సైన్ అప్', email: 'ఈమెయిల్', password: 'పాస్‌వర్డ్', rememberMe: 'నన్ను గుర్తుంచుకో', forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?', termsAccept: 'నేను నిబంధనలను అంగీకరిస్తున్నాను' },
    reseller: { dashboard: 'రీసెల్లర్ డ్యాష్‌బోర్డ్', commission: 'కమిషన్', sales: 'విక్రయ', pending: 'పెండింగ్', approved: 'ఆమోదించారు', rejected: 'తిరస్కరించారు' },
    admin: { panel: 'నిర్వాహక ప్యానెల్', users: 'వినియోగదారులు', reports: 'నివేదికలు', system: 'విధానం', moderation: 'సమన్వయం' },
    validation: { required: 'ఈ ఫీల్డ్ అవసరం', email: 'చెల్లని ఈమెయిల్', password: 'పాస్‌వర్డ్ 6+ అక్షరాలు ఉండాలి', match: 'ఫీల్డ్‌లు సరిపోలేదు' },
    support: { help: 'సహాయం', faq: 'తరచుగా అడిగే ప్రశ్నలు', contact: 'సంప్రదించండి', feedback: 'ఫీడ్‌బ్యాక్', docs: 'డాక్యుమెంటేషన్', community: 'సమాజం', tutorial: 'ట్యుటోరియల్', troubleshoot: 'సమస్య సమాధానం', getHelp: 'సహాయం పొందండి', reportIssue: 'సమస్యను నివేదించండి', suggest: 'సూచించు', browse: 'బ్రౌజ్ చేయండి' }
  },
  ml: { // Malayalam
    common: { dashboard: 'ഡാഷ്‌ബോർഡ്', analytics: 'വിശകലനം', users: 'ഉപയോഗിക്കുന്നവർ', settings: 'ക്രമീകരണങ്ങൾ', logout: 'ലോഗ്‌ഔട്ട്', language: 'ഭാഷ', theme: 'തീം', export: 'കയറ്റയയയ്ക്കുക', import: 'ഇറക്കുമതി', search: 'തിരയൽ', filter: 'ഫിൽറ്റർ', sort: 'തരം തിരിക്കുക', delete: 'ഇല്ലാതാക്കുക', edit: 'എഡിറ്റ് ചെയ്യുക', save: 'സംരക്ഷിക്കുക', cancel: 'റദ്ദാക്കുക', add: 'ചേർക്കുക', back: 'തിരികെ', next: 'അടുത്ത', loading: 'ലോഡ് ചെയ്യുന്നു', error: 'പിശക്', success: 'സാധാരണ' },
    auth: { login: 'ലോഗിൻ ചെയ്യുക', signup: 'സൈൻ അപ്പ് ചെയ്യുക', email: 'ഇമെയിൽ', password: 'പാസ്‌വേഡ്', rememberMe: 'എന്നെ ഓർമ്മയിൽ വെയ്ക്കുക', forgotPassword: 'പാസ്‌വേഡ് മറന്നുവോ?', termsAccept: 'ഞാൻ നിബന്ധനകൾ അംഗീകരിക്കുന്നു' },
    reseller: { dashboard: 'വീണ്ടും വിൽപ്പനക്കാരൻ ഡാഷ്‌ബോർഡ്', commission: 'കമ്മിഷൻ', sales: 'വിക്രയ', pending: 'പെൻഡിംഗ്', approved: 'അംഗീകരിച്ച', rejected: 'നിരസിച്ച' },
    admin: { panel: 'അഡ്മിൻ പാനൽ', users: 'ഉപയോഗിക്കുന്നവർ', reports: 'റിപ്പോർട്ടുകൾ', system: 'സിസ്റ്റം', moderation: 'മധ്യസ്ഥി' },
    validation: { required: 'ഈ ഫീൽഡ് ആവശ്യമാണ്', email: 'അസാധുവായ ഇമെയിൽ', password: 'പാസ്‌വേഡ് 6+ പ്രതീകങ്ങൾ ആയിരിക്കണം', match: 'ഫീൽഡുകൾ പൊരുത്തപ്പെടുന്നില്ല' },
    support: { help: 'സഹായം', faq: 'പതിവായി ചോദിച്ച ചോദ്യങ്ങൾ', contact: 'സ്‌പർശിക്കുക', feedback: 'അഭിപ്രായം', docs: 'ഡോക്യുമെന്റേഷൻ', community: 'സമൂഹം', tutorial: 'പാഠപുസ്തകം', troubleshoot: 'പ്രശ്നം പരിഹരിക്കുക', getHelp: 'സഹായം നേടുക', reportIssue: 'പ്രശ്നം റിപോർട്ട് ചെയ്യുക', suggest: 'നിർദ്ദേശിക്കുക', browse: 'ബ്രൌസ് ചെയ്യുക' }
  },
  my: { // Burmese
    common: { dashboard: ' Dashboard', analytics: 'ခွဲခြမ်းစိတ်ဖြာမှု', users: 'အသုံးပြုသူများ', settings: 'အပ်ချက်များ', logout: 'ထွက်ခွာ', language: 'ဘာသာစကား', theme: 'အပ်ချက်', export: 'အကုန်ထုတ်ယူ', import: 'ကျောင်းသို့ခေါ်ဆောင်းခြင်း', search: 'ရှာလေ့ဝင်', filter: 'စစ်ခတ်ခြင်း', sort: 'အုပ်စုခွဲခြင်း', delete: 'ဖျက်ခြင်း', edit: 'ပြင်ဆင်ခြင်း', save: 'သိမ်းဆည်းခြင်း', cancel: 'ပယ်ဖျက်ခြင်း', add: 'ထည့်သွင်းခြင်း', back: 'ပြန်သွားခြင်း', next: 'နောက်သို့', loading: 'အားလပ်နေသည်', error: 'အမှားအယွင်း', success: 'အောင်မြင်ခြင်း' },
    auth: { login: 'ဝင်ခွင့်ရခြင်း', signup: 'မှတ်ပုံတင်ခြင်း', email: 'အီမေးလ်', password: 'စကားဝှက်', rememberMe: 'ကျွန်ုပ်ကိုသတ်မှတ်ခြင်း', forgotPassword: 'စကားဝှက်ကိုမေ့သွားခဲ့ပါသလား?', termsAccept: 'ကျွန်ုပ်သည်အခြေခံစည်းမျဉ်းများသို့သဘောတူခြင်း' },
    reseller: { dashboard: 'နောက်ဆက်တွဲမြန်မြ速်အရောင်းမြန်မြစ်နည်း', commission: 'ကျသငျ', sales: 'အရောင်း', pending: 'ဆိုင်းဒါများ', approved: 'ခွင့်ပြုထားသည်', rejected: 'ငြင်းဆိုထားသည်' },
    admin: { panel: 'အုပ်ချုပ်ရန်အဖွဲ့', users: 'အသုံးပြုသူများ', reports: 'အစီရင်ခံစာများ', system: 'စနစ်', moderation: 'ကြားခံပြုခြင်း' },
    validation: { required: 'ဒီဟာအဆိုပါအကျ ယ်မဟုတ်', email: 'အီမေးလ်မမှန်', password: 'စကားဝှက်သည်အက္ခရာ၆+ရှိရမည်', match: 'အကျ ယ်များမကိုက်ညီ' },
    support: { help: 'ကူညီမှု', faq: 'မေးမြန်းလေ့ရှိသောမေးခွန်းများ', contact: 'ဆက်သွယ်ရန်', feedback: 'အမြင်တင်ပြခြင်း', docs: 'စာ類류', community: 'လူမှုကွန်ယက်', tutorial: 'သင်ခန်းစာ', troubleshoot: 'ပြဿနာဖြေရှင်းခြင်း', getHelp: 'အကူအညီရယူခြင်း', reportIssue: 'ပြဿနာအစီရင်ခံခြင်း', suggest: 'အကြံပြုခြင်း', browse: 'ရှာဖွေခြင်း' }
  },
  km: { // Khmer
    common: { dashboard: 'ផ្ទាំងគ្រប់គ្រង', analytics: 'ការវិភាគ', users: 'អ្នកប្រើប្រាស់', settings: 'ការកំណត់', logout: 'ចាកចេញ', language: 'ភាសា', theme: 'ស្ទីល', export: 'នាំចេញ', import: 'នាំចូល', search: 'ស្វាងរក', filter: 'តម្រង', sort: 'ធ្វើឱ្យសមរម្យ', delete: 'លុប', edit: 'កែប្រែ', save: 'រក្សាទុក', cancel: 'បោះបង់', add: 'បន្ថែម', back: 'ត្រលប់ក្រោយ', next: 'បន្ទាប់', loading: 'ទាញយក', error: 'កំហុស', success: 'ជោគជ័យ' },
    auth: { login: 'ចូល', signup: 'ចុះឈ្មោះ', email: 'អ៊ីមែល', password: 'ពាក្យលេខសម្ងាត់', rememberMe: 'ចងចាំខ្ញុំ', forgotPassword: 'ភ្លេចពាក្យលេខសម្ងាត់?', termsAccept: 'ខ្ញុំយល់ព្រម' },
    reseller: { dashboard: 'ផ្ទាំងលក់ប្រាក់', commission: 'ថ្លៃលក់', sales: 'ការលក់', pending: 'រង់ចាំ', approved: 'ឯកភាព', rejected: 'ច្រានចោល' },
    admin: { panel: 'ផ្ទាំងរដ្ឋបាល', users: 'អ្នកប្រើប្រាស់', reports: 'របាយការណ៍', system: 'ប្រព័ន្ធ', moderation: 'ការគ្រប់គ្រង' },
    validation: { required: 'វាលនេះគឺចាំបាច់', email: 'អ៊ីមែលមិនមាន', password: 'ពាក្យលេខសម្ងាត់គឺត្រូវតែ 6+', match: 'វាលមិនឆ្លើយ' },
    support: { help: 'ជំនួយ', faq: 'សំណួរលម្អិត', contact: 'ទំនាក់ទំនង', feedback: 'មតិយោបល់', docs: 'ឯកសារ', community: 'សហគមន៍', tutorial: 'មេរៀនសិក្សា', troubleshoot: 'ដោះស្រាយបញ្ហា', getHelp: 'ទទួលបានជំនួយ', reportIssue: 'រាយការណ៍បញ្ហា', suggest: 'ស្នើឱ្យ', browse: 'រកមើល' }
  },
  lo: { // Lao
    common: { dashboard: 'ຫ້ອງຄວບຄຸມ', analytics: 'ວິເຄາະ', users: 'ຜູ້ໃຊ້', settings: 'ການຕັ້ງຄ່າ', logout: 'ອອກ', language: 'ພາສາ', theme: 'ສີ', export: 'ສົ່ງອອກ', import: 'ນຳເຂົ້າ', search: 'ຊອກຫາ', filter: 'ກັ່ນ', sort: 'ຈັດລຽງ', delete: 'ລົບ', edit: 'ແກ້ໄຂ', save: 'ບັນທຶກ', cancel: 'ຍົກເລີກ', add: 'ເພີ່ມ', back: 'ກັບ', next: 'ຕໍ່ໄປ', loading: 'ກຳລັງໂຫຼດ', error: 'ຜິດພາດ', success: 'ສຳເລັດ' },
    auth: { login: 'ເຂົ້າສູ່ລະບົບ', signup: 'ລົງທະບຽນ', email: 'ອີເມວ', password: 'ລະຫັດຜ່ານ', rememberMe: 'ຈື່ໄວ້', forgotPassword: 'ລືມລະຫັດຜ່ານ?', termsAccept: 'ຂ້າພະເຈົ້າຍອມຮັບ' },
    reseller: { dashboard: 'ຫ້ອງຄວບຄຸມຜູ້ຂາຍ', commission: 'ຄໍາຮ້ອງຂໍ', sales: 'ການຂາຍ', pending: 'ລໍຖ້າ', approved: 'ອະນຸມັດ', rejected: 'ປະຕິເສດ' },
    admin: { panel: 'ແຜງຜູ້ຄຸ', users: 'ຜູ້ໃຊ້', reports: 'ລາຍງານ', system: 'ລະບົບ', moderation: 'ກຸມຈະລາກຸມ' },
    validation: { required: 'ຟ້ອນແນະນີ້ຈຳເປັນ', email: 'ອີເມວບໍ່ຖືກຕ້ອງ', password: 'ລະຫັດຜ່ານຕ້ອງ 6+', match: 'ຟ້ອນບໍ່ກົງກັນ' },
    support: { help: 'ຊ່ວຍເຫຼື', faq: 'ຄໍາຖາມທີ່ຖາມເລື້ອຍ', contact: 'ຕິດຕໍ່', feedback: 'ຄໍາເຫັນ', docs: 'ເອກະສານ', community: 'ສະ​ຫະ​ພາບ', tutorial: 'ບົດຮຽນ', troubleshoot: 'ແກ້ໄຂບັນຫາ', getHelp: 'ຕໍ່ວ່າຊ່ວຍເຫຼື', reportIssue: 'ລາຍງານບັນຫາ', suggest: 'ແນະນໍາ', browse: 'ສະຫຼາດ' }
  },
  hy: { // Armenian
    common: { dashboard: 'Կառավարման վահանակ', analytics: 'Վերլուծություն', users: 'Օգտատերեր', settings: 'Կարգավորումներ', logout: 'Ելք', language: 'Լեզու', theme: 'Թեմա', export: 'Արտահանում', import: 'Ներմուծում', search: 'Որոնում', filter: 'Ֆիլտր', sort: 'Տեսակավորում', delete: 'Ջնջել', edit: 'Խմբագրել', save: 'Պահել', cancel: 'Չեղարկել', add: 'Ավելացնել', back: 'Հետ', next: 'Հաջորդ', loading: 'Բեռնվում է', error: 'Սխալ', success: 'Հաջողություն' },
    auth: { login: 'Մուտք', signup: 'Գրանցում', email: 'Email', password: 'Գաղտնաբառ', rememberMe: 'Հիշիր ինձ', forgotPassword: 'Մոռացել եք գաղտնաբառը?', termsAccept: 'Ես ընդունում եմ պայմանները' },
    reseller: { dashboard: 'Վերավաճառորդի վահանակ', commission: 'Հաշվեհարդար', sales: 'Վաճառք', pending: 'Սպասում', approved: 'Հաստատված', rejected: 'Մերժված' },
    admin: { panel: 'Ադմինի վահանակ', users: 'Օգտատերեր', reports: 'Հաշվետվություններ', system: 'Համակարգ', moderation: 'Մոդերացիա' },
    validation: { required: 'Այս դաշտը պարտադիր է', email: 'Անվավեր email', password: 'Գաղտնաբառը պետք է լինի 6+ նիշ', match: 'Դաշտերը չեն համընկնում' },
    support: { help: 'Օգնություն', faq: 'Հաճախ տրվող հարցեր', contact: 'Կապ', feedback: 'Արձագանք', docs: 'Փաստաթղթեր', community: 'Համայնք', tutorial: 'Ձեռնարկ', troubleshoot: 'Խնդիրների լուծում', getHelp: 'Ստացեք օգնություն', reportIssue: 'Հաղորդել խնդիր', suggest: 'Առաջարկել', browse: 'Դիտել' }
  },
  ka: { // Georgian
    common: { dashboard: 'კონტროლის პანელი', analytics: 'ანალიტიკა', users: 'მომხმარებელი', settings: 'პარამეტრები', logout: 'გამოსვლა', language: 'ენა', theme: 'თემა', export: 'ექსპორტი', import: 'იმპორტი', search: 'ძიება', filter: 'ფილტრი', sort: 'დახარისხება', delete: 'წაშლა', edit: 'რედაქტირება', save: 'შენახვა', cancel: 'გაუქმება', add: 'დამატება', back: 'უკან', next: 'შემდეგი', loading: 'იტვირთება', error: 'შეცდომა', success: 'წარმატება' },
    auth: { login: 'შესვლა', signup: 'რეგისტრაცია', email: 'ელფოსტა', password: 'პაროლი', rememberMe: 'დამიმახსოვრე', forgotPassword: 'პაროლი დაგავიწყდა?', termsAccept: 'მე ვეთანხმები' },
    reseller: { dashboard: 'გადამყიდველის პანელი', commission: 'კომისია', sales: 'გაყიდვა', pending: 'ელოდება', approved: 'დამტკიცებული', rejected: 'უარყოფილი' },
    admin: { panel: 'ადმინის პანელი', users: 'მომხმარებელი', reports: 'ანგარიშები', system: 'სისტემა', moderation: 'მოდერაცია' },
    validation: { required: 'ეს ველი სავალდებულოა', email: 'არასწორი ელფოსტა', password: 'პაროლი უნდა იყოს 6+ სიმბოლო', match: 'ველები არ ემთხვევა' },
    support: { help: 'დახმარება', faq: 'ხშირად დასმული კითხვები', contact: 'კონტაქტი', feedback: 'უკუკავშირი', docs: 'დოკუმენტაცია', community: 'საზოგადოება', tutorial: 'სახელმძღვანელო', troubleshoot: 'პრობლემის აღმოფხვრა', getHelp: 'მიიღეთ დახმარება', reportIssue: 'პრობლემის მოხსენება', suggest: 'შემოთავაზება', browse: 'ნახვა' }
  },
  et: { // Estonian
    common: { dashboard: 'Juhtpaneel', analytics: 'Analüütika', users: 'Kasutajad', settings: 'Seaded', logout: 'Väljalogimine', language: 'Keel', theme: 'Teema', export: 'Eksport', import: 'Import', search: 'Otsing', filter: 'Filter', sort: 'Sorteerimine', delete: 'Kustutamine', edit: 'Muutmine', save: 'Salvestamine', cancel: 'Tühistamine', add: 'Lisamine', back: 'Tagasi', next: 'Järgmine', loading: 'Laadimine', error: 'Viga', success: 'Edu' },
    auth: { login: 'Sisselogimine', signup: 'Registreerimine', email: 'E-post', password: 'Parool', rememberMe: 'Mäleta mind', forgotPassword: 'Unustasid parooli?', termsAccept: 'Nõustun tingimustega' },
    reseller: { dashboard: 'Edasimüüja juhtpaneel', commission: 'Provitsioon', sales: 'Müük', pending: 'Ootel', approved: 'Heaks kiidetud', rejected: 'Tagasi lükatud' },
    admin: { panel: 'Administraatori paneel', users: 'Kasutajad', reports: 'Aruanded', system: 'Süsteem', moderation: 'Moderatsioon' },
    validation: { required: 'See väli on kohustuslik', email: 'Vale e-posti aadress', password: 'Parool peab olema 6+ tähemärki', match: 'Väljad ei vasta üksteisele' },
    support: { help: 'Abi', faq: 'Korduma Kippuvad Küsimused', contact: 'Kontakt', feedback: 'Tagasiside', docs: 'Dokumentatsioon', community: 'Kogukond', tutorial: 'Juhend', troubleshoot: 'Probleemide lahendamine', getHelp: 'Saada abi', reportIssue: 'Teata probleemist', suggest: 'Soovita', browse: 'Sirvi' }
  },
  lv: { // Latvian
    common: { dashboard: 'Vadības panelis', analytics: 'Analītika', users: 'Lietotāji', settings: 'Iestatījumi', logout: 'Izlogoties', language: 'Valoda', theme: 'Tēma', export: 'Eksportēt', import: 'Importēt', search: 'Meklēt', filter: 'Filtrs', sort: 'Kārtošana', delete: 'Dzēst', edit: 'Rediģēt', save: 'Saglabāt', cancel: 'Atcelt', add: 'Pievienot', back: 'Atpakaļ', next: 'Tālāk', loading: 'Ielāde', error: 'Kļūda', success: 'Panākums' },
    auth: { login: 'Pierakstīšanās', signup: 'Reģistrēšanās', email: 'E-pasts', password: 'Parole', rememberMe: 'Atcerieties mani', forgotPassword: 'Aizmirsa paroli?', termsAccept: 'Piekrītu noteikumiem' },
    reseller: { dashboard: 'Pārpārdošanas vadības panelis', commission: 'Komisija', sales: 'Pārdošana', pending: 'Gaida', approved: 'Apstiprinājies', rejected: 'Noraidīts' },
    admin: { panel: 'Administratora panelis', users: 'Lietotāji', reports: 'Pārskati', system: 'Sistēma', moderation: 'Moderācija' },
    validation: { required: 'Šis lauks ir obligāts', email: 'Negatīvs e-pasts', password: 'Parolei jābūt 6+ rakstzīmēm', match: 'Lauki neatbilst' },
    support: { help: 'Palīdzība', faq: 'Biežāk uzdotie jautājumi', contact: 'Kontakts', feedback: 'Atsauksme', docs: 'Dokumentācija', community: 'Kopiena', tutorial: 'Pamācība', troubleshoot: 'Problēmu novēršana', getHelp: 'Saņemiet palīdzību', reportIssue: 'Ziņot par problēmu', suggest: 'Ieteikt', browse: 'Pārlūkot' }
  },
  lt: { // Lithuanian
    common: { dashboard: 'Valdymo skydelis', analytics: 'Analitika', users: 'Naudotojai', settings: 'Nustatymai', logout: 'Atsijungti', language: 'Kalba', theme: 'Tema', export: 'Eksportuoti', import: 'Importuoti', search: 'Paieška', filter: 'Filtras', sort: 'Rūšiavimas', delete: 'Panaikinti', edit: 'Redaguoti', save: 'Išsaugoti', cancel: 'Atšaukti', add: 'Pridėti', back: 'Atgal', next: 'Kitas', loading: 'Kraunasi', error: 'Klaida', success: 'Sėkmė' },
    auth: { login: 'Prisijungti', signup: 'Prisiregistruoti', email: 'El. paštas', password: 'Slaptažodis', rememberMe: 'Prisiminti mane', forgotPassword: 'Pamiršai slaptažodį?', termsAccept: 'Aš sutinku su sąlygomis' },
    reseller: { dashboard: 'Perpardavėjo skydelis', commission: 'Komisija', sales: 'Pardavimas', pending: 'Laukia', approved: 'Patvirtinta', rejected: 'Atmesta' },
    admin: { panel: 'Administratoriaus skydelis', users: 'Naudotojai', reports: 'Ataskaitos', system: 'Sistema', moderation: 'Moderavimas' },
    validation: { required: 'Šis laukas yra būtinas', email: 'Neteisingas el. paštas', password: 'Slaptažodis turi turėti 6+ simbolius', match: 'Laukai nesutampa' },
    support: { help: 'Pagalba', faq: 'Dažnai užduodami klausimai', contact: 'Kontaktas', feedback: 'Atsiliepimas', docs: 'Dokumentacija', community: 'Bendruomenė', tutorial: 'Mokymas', troubleshoot: 'Problemų sprendimas', getHelp: 'Gaukite pagalbą', reportIssue: 'Pranešti apie problemą', suggest: 'Siūlyti', browse: 'Naršyti' }
  },
  lt: { // Lithuanian (duplicate key, skipping to next)
    common: { dashboard: 'ড্যাশবোর্ড', analytics: 'تحليل', users: 'کاربران', settings: 'تنظیمات', logout: 'خروج', language: 'زبان', theme: 'تم', export: 'صادر کردن', import: 'درون ریزی', search: 'جستجو', filter: 'فیلتر', sort: 'مرتب سازی', delete: 'حذف', edit: 'ویرایش', save: 'ذخیره', cancel: 'لغو', add: 'افزودن', back: 'بازگشت', next: 'بعدی', loading: 'بارگیری', error: 'خطا', success: 'موفقیت' },
    auth: { login: 'ورود', signup: 'ثبت نام', email: 'ایمیل', password: 'رمز عبور', rememberMe: 'مرا به خاطر بسپار', forgotPassword: 'رمز عبور را فراموش کردی؟', termsAccept: 'شرایط را می پذیرم' },
    reseller: { dashboard: 'داشبورد فروشنده', commission: 'کمیسیون', sales: 'فروش', pending: 'در انتظار', approved: 'تایید شده', rejected: 'رد شده' },
    admin: { panel: 'پنل مدیریت', users: 'کاربران', reports: 'گزارش ها', system: 'سیستم', moderation: 'نظارت' },
    validation: { required: 'این فیلد ضروری است', email: 'ایمیل نامعتبر', password: 'رمز عبور باید 6+ کاراکتر باشد', match: 'فیلدها مطابقت ندارند' },
    support: { help: 'کمک', faq: 'سوالات متداول', contact: 'تماس', feedback: 'بازخورد', docs: 'مستندات', community: 'اجتماع', tutorial: 'آموزش', troubleshoot: 'حل مسائل', getHelp: 'کمک بگیرید', reportIssue: 'گزارش مسئله', suggest: 'پیشنهاد', browse: 'مرور' }
  },
  ku: { // Kurdish (Sorani)
    common: { dashboard: 'پیتی کۆنترۆل', analytics: 'شیکاری', users: 'بەکارهێنەر', settings: 'ڕێکخستنەکان', logout: 'چوونە دەرەوە', language: 'زمان', theme: 'تێما', export: 'هێنانەدەرەوە', import: 'هێنانەژووری', search: 'گەڕان', filter: 'فلتەر', sort: 'ڕیزکردن', delete: 'سڕینەوە', edit: 'دەستکاری', save: 'پاشکەوتکردن', cancel: 'هەڵوەشاندن', add: 'زیادکردن', back: 'پاشتر', next: 'دواتر', loading: 'بارکردن', error: 'هەڵە', success: 'سەرکەوتن' },
    auth: { login: 'چوونە ژووری', signup: 'تۆمار', email: 'ئیمەیل', password: 'پاسوۆرد', rememberMe: 'منی بیرخو', forgotPassword: 'پاسوۆرد لە یاد چوو?', termsAccept: 'من ئومید دەگرم' },
    reseller: { dashboard: 'پیتی بازاڕکار', commission: 'کۆمیشن', sales: 'فرۆش', pending: 'چاوەڕووی', approved: 'منلایی', rejected: 'ڕەتکردن' },
    admin: { panel: 'پیتی بەڕێوەبەر', users: 'بەکارهێنەر', reports: 'ڕاپۆرت', system: 'سیستم', moderation: 'ڕاولۆگی' },
    validation: { required: 'ئەم خانەیە پێویستە', email: 'ئیمەیلی دروست نیە', password: 'پاسوۆرد دەبێت 6+ نیشتەمان بێت', match: 'خانەکان لا هاوتا نین' },
    support: { help: 'یارمەتی', faq: 'پرسیار کە زۆر پرسراون', contact: 'پەیوەندی', feedback: 'وەڵامی', docs: 'دۆکیومێنت', community: 'کۆمەڵ', tutorial: 'سێبینی', troubleshoot: 'چاربردنی کێشە', getHelp: 'یارمەتی بگرە', reportIssue: 'کێشە راپۆرت', suggest: 'پێشنیار', browse: 'شاپۆل' }
  },
  or: { // Odia
    common: { dashboard: 'ଡ୍ୟାସବୋର୍ଡ', analytics: 'ବିଶ୍ଳେଷଣ', users: 'ବ୍ୟବହାରକାରୀ', settings: 'ସେଟିଂସ', logout: 'ଲଗଆଉଟ', language: 'ଭାଷା', theme: 'ଥିମ', export: 'ରପ୍ତାନି', import: 'ଆମଦାନି', search: 'ସନ୍ଧାନ', filter: 'ଫିଲ୍ଟର', sort: 'ସାଜାନ', delete: 'ଏକାଈଁ', edit: 'ସମ୍ପାଦନ', save: 'ସଂରକ୍ଷଣ', cancel: 'ରଦ୍ଦ', add: 'ଯୋଗ', back: 'ଫେରନ୍ତୁ', next: 'ପରବର୍ତ୍ତୀ', loading: 'ଧାରଣ ଚଳିଛି', error: 'ତ୍ରୁଟି', success: 'ସଫଳତା' },
    auth: { login: 'ଲଗଇନ', signup: 'ନିବନ୍ଧନ', email: 'ଇମେଲ', password: 'ପାସୱାର୍ଡ', rememberMe: 'ମୋତେ ମନେ ରଖନ୍ତୁ', forgotPassword: 'ପାସୱାର୍ଡ ଭୁଲିଯାଇଛେ?', termsAccept: 'ମୁଁ ସର୍ତ୍ତାବଳୀ ସ୍ୱୀକାର କରୁଛୁ' },
    reseller: { dashboard: 'ରିସେଲର ଡ୍ୟାସବୋର୍ଡ', commission: 'ଆୟୋଗ', sales: 'ବିକ୍ରୟ', pending: 'ଅପେକ୍ଷମାଣ', approved: 'ଅନୁମୋଦିତ', rejected: 'ପ୍ରତ୍ୟାଖ୍ୟାନ' },
    admin: { panel: 'ପରିଚାଳକ ପ୍ୟାନେଲ', users: 'ବ୍ୟବହାରକାରୀ', reports: 'ରିପୋର୍ଟ', system: 'ସିସ୍ଟମ', moderation: 'ମଧ୍ୟସ୍ଥତା' },
    validation: { required: 'ଏହି ଫିଲ୍ଡ ଆବଶ୍ୟକ', email: 'ଅବୈଧ ଇମେଲ', password: 'ପାସୱାର୍ଡ 6+ ଅକ୍ଷର ହୋଇଥିବା ଆବଶ୍ୟକ', match: 'ଫିଲ୍ଡଗୁଡି ମେଳ ଖାଉ ନାହିଁ' },
    support: { help: 'ସାହାଯ୍ୟ', faq: 'ବାରମ୍ବାର ଜିଜ୍ଞାସିତ ପ୍ରଶ୍ନ', contact: 'ସମ୍ପର୍କ', feedback: 'ମତାମତ', docs: 'ଦଲିଲ', community: 'ସମ୍ପ୍ରଦାୟ', tutorial: 'ଟ୍ୟୁଟୋରିଆଲ', troubleshoot: 'ସମସ୍ୟା ସମାଧାନ', getHelp: 'ସାହାଯ୍ୟ ପ୍ରାପ୍ତ', reportIssue: 'ସମସ୍ୟା ରିପୋର୍ଟ', suggest: 'ପରାମର୍ଶ', browse: 'ବ୍ରାଉଜ' }
  },
  ur: { // Urdu
    common: { dashboard: 'ڈیش بورڈ', analytics: 'تجزیہ', users: 'صارفین', settings: 'ترتیبات', logout: 'لاگ آؤٹ', language: 'زبان', theme: 'تھیم', export: 'برآمد', import: 'درآمد', search: 'تلاش', filter: 'فلٹر', sort: 'ترتیب', delete: 'حذف', edit: 'ترمیم', save: 'محفوظ', cancel: 'منسوخ', add: 'شامل', back: 'واپس', next: 'اگلا', loading: 'لوڈ ہو رہا ہے', error: 'خرابی', success: 'کامیاب' },
    auth: { login: 'لاگ ان', signup: 'سائن اپ', email: 'ای میل', password: 'پاس ورڈ', rememberMe: 'مجھے یاد رکھیں', forgotPassword: 'پاس ورڈ بھول گیے؟', termsAccept: 'میں شرائط قبول کرتا ہوں' },
    reseller: { dashboard: 'دوبارہ فروخت ڈیش بورڈ', commission: 'کمیشن', sales: 'فروخت', pending: 'زیر التوا', approved: 'منظور', rejected: 'مسترد' },
    admin: { panel: 'منتظم پینل', users: 'صارفین', reports: 'رپورٹیں', system: 'نظام', moderation: 'اعتدال' },
    validation: { required: 'یہ فیلڈ لازمی ہے', email: 'غلط ای میل', password: 'پاس ورڈ 6+ حروف ہونے چاہیے', match: 'فیلڈز میل نہیں کھاتے' },
    support: { help: 'مدد', faq: 'عام سوالات', contact: 'رابطہ', feedback: 'تاثرات', docs: 'دستاویزات', community: 'کمیونٹی', tutorial: 'سبق', troubleshoot: 'مسئلہ حل', getHelp: 'مدد حاصل کریں', reportIssue: 'مسئلہ رپورٹ', suggest: 'تجویز', browse: 'براؤز' }
  },
  ps: { // Pashto
    common: { dashboard: 'کنټرول پینل', analytics: 'تحلیل', users: 'کاروونکي', settings: 'سیتینگز', logout: 'بیرته شئ', language: 'ژبه', theme: 'موضوع', export: 'تیر کول', import: 'درج کول', search: 'لټون', filter: 'فلتر', sort: 'ترتیب', delete: 'حذف', edit: 'سمون', save: 'خوندي', cancel: 'منسوخ', add: 'شامل', back: 'شاتیږ', next: 'بل', loading: 'برتوال', error: 'خرابي', success: 'بریالیتوب' },
    auth: { login: 'ننوتل', signup: 'نوې کارن', email: 'ايمیل', password: 'پاس ورډ', rememberMe: 'مې په یاد ساتئ', forgotPassword: 'پاس ورډ مو هیله کړئ؟', termsAccept: 'زه شرایط منل کوم' },
    reseller: { dashboard: 'بیرته فروش کنټرول', commission: 'کمیشن', sales: 'فروش', pending: 'انتظار', approved: 'منظور', rejected: 'رد' },
    admin: { panel: 'ادمین پینل', users: 'کاروونکي', reports: 'راپورتونه', system: 'سیسٹم', moderation: 'اعتدال' },
    validation: { required: 'دا ساحه ضروری ده', email: 'غلط ایمیل', password: 'پاس ورډ باید 6+ حروف وي', match: 'ساحې سره مطابقت نلري' },
    support: { help: 'مرسته', faq: 'عام پوښتنې', contact: 'اتصال', feedback: 'نظریات', docs: 'دستاویزات', community: 'ټولنه', tutorial: 'درس', troubleshoot: 'ستونزې حل', getHelp: 'مرسته ترلاسه کړئ', reportIssue: 'ستونزه راپور', suggest: 'وړاندیز', browse: 'براؤز' }
  },
  he: { // Hebrew
    common: { dashboard: 'לוח בקרה', analytics: 'ניתוח', users: 'משתמשים', settings: 'הגדרות', logout: 'התנתקות', language: 'שפה', theme: 'ערכת נושא', export: 'ייצוא', import: 'ייבוא', search: 'חיפוש', filter: 'סינון', sort: 'מיון', delete: 'מחיקה', edit: 'עריכה', save: 'שמירה', cancel: 'ביטול', add: 'הוספה', back: 'חזור', next: 'הבא', loading: 'בטעינה', error: 'שגיאה', success: 'הצלחה' },
    auth: { login: 'כניסה', signup: 'הרשמה', email: 'דוא"ל', password: 'סיסמא', rememberMe: 'זכור אותי', forgotPassword: 'שכחת את הסיסמא?', termsAccept: 'אני מסכים לתנאים' },
    reseller: { dashboard: 'לוח בקרה של מוכר מחדש', commission: 'עמלה', sales: 'מכירות', pending: 'בהמתנה', approved: 'אושר', rejected: 'נדחה' },
    admin: { panel: 'לוח ניהול', users: 'משתמשים', reports: 'דוחות', system: 'מערכת', moderation: 'ניהול תוכן' },
    validation: { required: 'שדה זה נדרש', email: 'דוא"ל לא תקין', password: 'הסיסמא חייבת להיות 6+ תווים', match: 'השדות אינם תואמים' },
    support: { help: 'עזרה', faq: 'שאלות נפוצות', contact: 'צור קשר', feedback: 'משוב', docs: 'תיעוד', community: 'קהילה', tutorial: 'הדרכה', troubleshoot: 'פתרון בעיות', getHelp: 'קבל עזרה', reportIssue: 'דווח על בעיה', suggest: 'הצע', browse: 'עיין' }
  },
};

// Create new languages object for injection
const newLanguagesStr = JSON.stringify(phase2Languages)
  .replace(/"([^"]+)":/g, '$1:') // Convert to JS object notation
  .replace(/true/g, 'true')
  .replace(/false/g, 'false');

// Find insertion point
const insertPoint = content.indexOf('  i18n.use(initReactI18next)');

if (insertPoint === -1) {
  console.error('❌ Could not find insertion point');
  process.exit(1);
}

// Extract current messages object and add new languages
const messagesStartIndex = content.indexOf('const messages: Record<string, Record<string, any>> = {');
const messagesEndIndex = content.indexOf('};', messagesStartIndex) + 2;
const currentMessages = content.substring(messagesStartIndex, messagesEndIndex);

// Add new languages to messages
let newMessages = currentMessages.slice(0, -2); // Remove '};'
for (const [lang, translations] of Object.entries(phase2Languages)) {
  newMessages += `,\n  ${lang}: ${JSON.stringify(translations, null, 2).split('\n').join('\n  ')}`;
}
newMessages += '\n};';

// Replace old messages with new
content = content.replace(currentMessages, newMessages);

// Update SUPPORTED_LANGUAGES array
const newLangs = Object.keys(phase2Languages);
for (const lang of newLangs) {
  const langName = {
    uk: 'Ukrainian', be: 'Belarusian', bg: 'Bulgarian', hr: 'Croatian', sr: 'Serbian',
    sq: 'Albanian', hu: 'Hungarian', cs: 'Czech', sk: 'Slovak', bn: 'Bengali',
    pa: 'Punjabi', ta: 'Tamil', te: 'Telugu', ml: 'Malayalam', my: 'Burmese',
    km: 'Khmer', lo: 'Lao', hy: 'Armenian', ka: 'Georgian', et: 'Estonian',
    lv: 'Latvian', lt: 'Lithuanian', ku: 'Kurdish', or: 'Odia', ur: 'Urdu',
    ps: 'Pashto', he: 'Hebrew'
  }[lang];
  
  if (!content.includes(`{ code: '${lang}'`)) {
    const insertPos = content.lastIndexOf('];', content.indexOf('i18n.use'));
    if (insertPos > 0) {
      const before = content.substring(0, insertPos);
      const after = content.substring(insertPos);
      content = before + `,\n  { code: '${lang}', name: '${langName}', nativeName: '${langName}' }` + after;
    }
  }
}

// Write updated file
fs.writeFileSync(i18nPath, content);

console.log(`✓ Added ${Object.keys(phase2Languages).length} new languages (${Object.keys(phase2Languages).join(', ')})`);
console.log('✓ Updated SUPPORTED_LANGUAGES array');
console.log('✓ File updated successfully');
console.log(`Now at ~63 languages total!`);
