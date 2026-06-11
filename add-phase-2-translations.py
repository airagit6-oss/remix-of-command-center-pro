#!/usr/bin/env python3
"""
Phase 2: Add 27 languages with complete translations to i18n.tsx
Adds: Ukrainian, Belarusian, Bulgarian, Croatian, Serbian, Albanian, Hungarian, Czech, Slovak,
      Bengali, Punjabi, Tamil, Telugu, Malayalam, Burmese, Khmer, Lao, Armenian, Georgian,
      Estonian, Latvian, Lithuanian, Kurdish, Odia, Urdu, Pashto, Hebrew
"""

import re
import json

# Phase 2 translations - hand-crafted for each language
phase2_translations = {
    'uk': {  # Ukrainian
        'common': {'language': 'Мова', 'resellerApply': 'Подати заявку як реселер', 'dashboard': 'Панель керування', 'settings': 'Параметри', 'logout': 'Вихід', 'loading': 'Завантаження...', 'error': 'Помилка', 'success': 'Успіх', 'save': 'Зберегти', 'cancel': 'Скасувати', 'delete': 'Видалити', 'edit': 'Редагувати', 'back': 'Назад', 'next': 'Далі', 'submit': 'Відправити', 'close': 'Закрити', 'email': 'Електронна пошта', 'password': 'Пароль', 'username': 'Ім\'я користувача', 'firstName': 'Ім\'я', 'lastName': 'Прізвище', 'phone': 'Телефон', 'search': 'Пошук', 'filter': 'Фільтр', 'sort': 'Сортування', 'export': 'Експорт', 'import': 'Імпорт', 'download': 'Завантажити', 'upload': 'Завантажити', 'refresh': 'Оновити'},
        'auth': {'login': 'Вхід', 'signup': 'Реєстрація', 'logout': 'Вихід', 'forgotPassword': 'Забули пароль?', 'resetPassword': 'Скинути пароль', 'rememberMe': 'Запам\'ятати мене', 'signInSecurely': 'Безпечний вхід', 'createAccount': 'Створити обліковий запис', 'alreadyHaveAccount': 'Вже маєте обліковий запис?', 'noAccount': 'Немаєте облікового запису?'},
        'reseller': {'dashboard': 'Панель реселера', 'earnings': 'Доходи', 'commissions': 'Комісії', 'payouts': 'Виплати', 'referrals': 'Реферали', 'leads': 'Потенційні клієнти', 'customers': 'Клієнти', 'reports': 'Звіти', 'settings': 'Параметри'},
        'admin': {'dashboard': 'Панель адміністратора', 'users': 'Користувачі', 'products': 'Продукти', 'orders': 'Замовлення', 'revenue': 'Дохід', 'settings': 'Параметри'},
        'validation': {'required': 'Це поле обов\'язкове', 'email': 'Невірна електронна пошта', 'password': 'Пароль повинен мати 6+ символів'},
        'support': {'help': 'Допомога', 'faq': 'Часті питання', 'contact': 'Контакти', 'feedback': 'Зворотний зв\'язок', 'docs': 'Документація', 'community': 'Спільнота', 'tutorial': 'Навчання'},
    },
    'be': {  # Belarusian
        'common': {'language': 'Мова', 'resellerApply': 'Падаць заяву як рэселер', 'dashboard': 'Паноль', 'settings': 'Налады', 'logout': 'Выход', 'loading': 'Загрузка...', 'error': 'Ошибка', 'success': 'Ўдача', 'save': 'Зберегчы', 'cancel': 'Скасаваць', 'delete': 'Удаліць', 'edit': 'Редагаваць', 'back': 'Назад', 'next': 'Далей', 'submit': 'Падаць', 'close': 'Закрыць', 'email': 'Email', 'password': 'Пароль', 'username': 'Імя карыстальніка', 'firstName': 'Імя', 'lastName': 'Фамілія', 'phone': 'Тэлефон', 'search': 'Пошук', 'filter': 'Фільтр', 'sort': 'Сартыраванне', 'export': 'Экспорт', 'import': 'Імпорт', 'download': 'Сцягнуць', 'upload': 'Загрузіць', 'refresh': 'Обновіць'},
        'auth': {'login': 'Ўваход', 'signup': 'Рэгістрацыя', 'logout': 'Выход', 'forgotPassword': 'Забылі пароль?', 'resetPassword': 'Скінуць пароль', 'rememberMe': 'Запомніць мяне', 'signInSecurely': 'Безпечны ўход', 'createAccount': 'Стварыць акаўнт', 'alreadyHaveAccount': 'Ужо ёсць акаўнт?', 'noAccount': 'Нема акаўнта?'},
        'reseller': {'dashboard': 'Паноль рэселера', 'earnings': 'Заробкі', 'commissions': 'Комісії', 'payouts': 'Выплаты', 'referrals': 'Рэфералы', 'leads': 'Патэнцыйныя кліенты', 'customers': 'Кліенты', 'reports': 'Справаводы', 'settings': 'Налады'},
        'admin': {'dashboard': 'Админ паноль', 'users': 'Карыстальнікі', 'products': 'Прадукты', 'orders': 'Заказы', 'revenue': 'Дохаданне', 'settings': 'Налады'},
        'validation': {'required': 'Гэтае поле абавязкова', 'email': 'Невернача email', 'password': 'Пароль павінен быць 6+ сімвалаў'},
        'support': {'help': 'Дапамога', 'faq': 'ЧАП', 'contact': 'Кантакты', 'feedback': 'Водгук', 'docs': 'Дакументацыя', 'community': 'Грамада', 'tutorial': 'Наўчанне'},
    },
    'bg': {  # Bulgarian
        'common': {'language': 'Език', 'resellerApply': 'Кандидатствайте като дилър', 'dashboard': 'Контролен панел', 'settings': 'Настройки', 'logout': 'Изход', 'loading': 'Зареждане...', 'error': 'Грешка', 'success': 'Успех', 'save': 'Запазване', 'cancel': 'Отмяна', 'delete': 'Изтриване', 'edit': 'Редактиране', 'back': 'Назад', 'next': 'Напред', 'submit': 'Изпращане', 'close': 'Затваряне', 'email': 'Имейл', 'password': 'Парола', 'username': 'Име на потребител', 'firstName': 'Първо име', 'lastName': 'Фамилия', 'phone': 'Телефон', 'search': 'Търсене', 'filter': 'Филтър', 'sort': 'Сортиране', 'export': 'Експорт', 'import': 'Импорт', 'download': 'Изтегляне', 'upload': 'Качване', 'refresh': 'Опресняване'},
        'auth': {'login': 'Вход', 'signup': 'Регистрация', 'logout': 'Изход', 'forgotPassword': 'Забравили пароля?', 'resetPassword': 'Нулиране на парола', 'rememberMe': 'Запомни ме', 'signInSecurely': 'Безопасен вход', 'createAccount': 'Създайте профил', 'alreadyHaveAccount': 'Вече имаш профил?', 'noAccount': 'Нямаш профил?'},
        'reseller': {'dashboard': 'Панел на дилър', 'earnings': 'Заработки', 'commissions': 'Комисии', 'payouts': 'Плащания', 'referrals': 'Препоръки', 'leads': 'Потенциални клиенти', 'customers': 'Клиенти', 'reports': 'Отчети', 'settings': 'Настройки'},
        'admin': {'dashboard': 'Админ панел', 'users': 'Потребители', 'products': 'Продукти', 'orders': 'Поръчки', 'revenue': 'Приход', 'settings': 'Настройки'},
        'validation': {'required': 'Това поле е задължително', 'email': 'Невалиден имейл', 'password': 'Паролата трябва да е 6+ символа'},
        'support': {'help': 'Помощ', 'faq': 'ЧЗВ', 'contact': 'Контакти', 'feedback': 'Обратна връзка', 'docs': 'Документация', 'community': 'Общност', 'tutorial': 'Ръководство'},
    },
    'hr': {  # Croatian
        'common': {'language': 'Jezik', 'resellerApply': 'Kandidira se kao prodavač', 'dashboard': 'Kontrolna ploča', 'settings': 'Postavke', 'logout': 'Odjava', 'loading': 'Učitavanje...', 'error': 'Greška', 'success': 'Uspjeh', 'save': 'Spremi', 'cancel': 'Otkazi', 'delete': 'Obriši', 'edit': 'Uredi', 'back': 'Natrag', 'next': 'Sljedeće', 'submit': 'Pošalji', 'close': 'Zatvori', 'email': 'Email', 'password': 'Lozinka', 'username': 'Korisničko ime', 'firstName': 'Ime', 'lastName': 'Prezime', 'phone': 'Telefon', 'search': 'Pretraživanje', 'filter': 'Filtar', 'sort': 'Sortiranje', 'export': 'Izvoz', 'import': 'Uvoz', 'download': 'Preuzmi', 'upload': 'Učitaj', 'refresh': 'Osvježi'},
        'auth': {'login': 'Prijava', 'signup': 'Registracija', 'logout': 'Odjava', 'forgotPassword': 'Zaboravili ste lozinku?', 'resetPassword': 'Resetiraj lozinku', 'rememberMe': 'Zapamti me', 'signInSecurely': 'Sigurna prijava', 'createAccount': 'Kreiraj račun', 'alreadyHaveAccount': 'Već imate račun?', 'noAccount': 'Nemate račun?'},
        'reseller': {'dashboard': 'Ploča prodavatelja', 'earnings': 'Zarada', 'commissions': 'Provizije', 'payouts': 'Isplate', 'referrals': 'Preporuke', 'leads': 'Potencijalni kupci', 'customers': 'Kupci', 'reports': 'Izvještaji', 'settings': 'Postavke'},
        'admin': {'dashboard': 'Admin ploča', 'users': 'Korisnici', 'products': 'Proizvodi', 'orders': 'Narudžbe', 'revenue': 'Prihod', 'settings': 'Postavke'},
        'validation': {'required': 'Ovo polje je obavezno', 'email': 'Neispravan email', 'password': 'Lozinka mora biti 6+ znakova'},
        'support': {'help': 'Pomoć', 'faq': 'Često postavljana pitanja', 'contact': 'Kontakt', 'feedback': 'Povratna informacija', 'docs': 'Dokumentacija', 'community': 'Zajednica', 'tutorial': 'Tutorijal'},
    },
    'sr': {  # Serbian
        'common': {'language': 'Језик', 'resellerApply': 'Апликуј као препродавач', 'dashboard': 'Контролна таб', 'settings': 'Подешавања', 'logout': 'Одјава', 'loading': 'Учитавање...', 'error': 'Грешка', 'success': 'Успех', 'save': 'Чувај', 'cancel': 'Отказ', 'delete': 'Избриши', 'edit': 'Уреди', 'back': 'Назад', 'next': 'Даље', 'submit': 'Пошаљи', 'close': 'Затвори', 'email': 'Емајл', 'password': 'Лозинка', 'username': 'Корисничко име', 'firstName': 'Име', 'lastName': 'Презиме', 'phone': 'Телефон', 'search': 'Претрага', 'filter': 'Филтер', 'sort': 'Сортирање', 'export': 'Извоз', 'import': 'Увоз', 'download': 'Преузми', 'upload': 'Отпреми', 'refresh': 'Освежи'},
        'auth': {'login': 'Пријава', 'signup': 'Регистрација', 'logout': 'Одјава', 'forgotPassword': 'Заборавио си лозинку?', 'resetPassword': 'Ресетуј лозинку', 'rememberMe': 'Запамти ме', 'signInSecurely': 'Безбедна пријава', 'createAccount': 'Направи налог', 'alreadyHaveAccount': 'Већ имаш налог?', 'noAccount': 'Немаш налог?'},
        'reseller': {'dashboard': 'Таб препродавача', 'earnings': 'Зарада', 'commissions': 'Провизије', 'payouts': 'Исплате', 'referrals': 'Препоруке', 'leads': 'Потенцијални купци', 'customers': 'Купци', 'reports': 'Извештаји', 'settings': 'Подешавања'},
        'admin': {'dashboard': 'Админ таб', 'users': 'Корисници', 'products': 'Производи', 'orders': 'Наруџбе', 'revenue': 'Приход', 'settings': 'Подешавања'},
        'validation': {'required': 'Ово поље је обавезно', 'email': 'Неважећи емајл', 'password': 'Лозинка мора бити 6+ карактера'},
        'support': {'help': 'Помоћ', 'faq': 'Често постављана питања', 'contact': 'Контакт', 'feedback': 'Повратна информација', 'docs': 'Документација', 'community': 'Заједница', 'tutorial': 'Упутство'},
    },
    'sq': {  # Albanian
        'common': {'language': 'Gjuha', 'resellerApply': 'Apliko si Përshitës', 'dashboard': 'Tabela e Kontrollit', 'settings': 'Cilësimet', 'logout': 'Dilni', 'loading': 'Po ngarkohet...', 'error': 'Gabim', 'success': 'Sukses', 'save': 'Ruaj', 'cancel': 'Anulo', 'delete': 'Fshirje', 'edit': 'Redaktim', 'back': 'Kthehu', 'next': 'Përpara', 'submit': 'Dërgoni', 'close': 'Mbylluni', 'email': 'Email', 'password': 'Fjalëkalimi', 'username': 'Emri i përdoruesit', 'firstName': 'Emri i parë', 'lastName': 'Mbiemri', 'phone': 'Telefoni', 'search': 'Kërkimi', 'filter': 'Filtro', 'sort': 'Rendisje', 'export': 'Eksport', 'import': 'Import', 'download': 'Shkarkimi', 'upload': 'Ngarko', 'refresh': 'Rifresko'},
        'auth': {'login': 'Hyrje', 'signup': 'Regjistrim', 'logout': 'Dilni', 'forgotPassword': 'Keni harruar fjalëkalimin?', 'resetPassword': 'Rivendos fjalëkalimin', 'rememberMe': 'Më mbaj mend', 'signInSecurely': 'Hyrje e Sigurt', 'createAccount': 'Krijo Llogari', 'alreadyHaveAccount': 'Keni tashmë llogari?', 'noAccount': 'Nuk keni llogari?'},
        'reseller': {'dashboard': 'Tabela e Përshitësit', 'earnings': 'Fitim', 'commissions': 'Komisionet', 'payouts': 'Pagesat', 'referrals': 'Referime', 'leads': 'Mundësit', 'customers': 'Klientët', 'reports': 'Raportet', 'settings': 'Cilësimet'},
        'admin': {'dashboard': 'Tabela Admin', 'users': 'Përdoruesit', 'products': 'Produktet', 'orders': 'Porositë', 'revenue': 'Të Ardhurat', 'settings': 'Cilësimet'},
        'validation': {'required': 'Ky fushë është i detyrueshëm', 'email': 'Email i pavlefshëm', 'password': 'Fjalëkalimi duhet të jetë 6+ karaktere'},
        'support': {'help': 'Ndihmë', 'faq': 'Pyetje të Shpeshta', 'contact': 'Kontakti', 'feedback': 'Përshtypje', 'docs': 'Dokumentacioni', 'community': 'Bashkësia', 'tutorial': 'Udhëzim'},
    },
    'hu': {  # Hungarian
        'common': {'language': 'Nyelv', 'resellerApply': 'Pályázz Viszonteladóként', 'dashboard': 'Vezérlőpult', 'settings': 'Beállítások', 'logout': 'Kijelentkezés', 'loading': 'Betöltés...', 'error': 'Hiba', 'success': 'Siker', 'save': 'Mentés', 'cancel': 'Mégse', 'delete': 'Törlés', 'edit': 'Szerkesztés', 'back': 'Vissza', 'next': 'Előre', 'submit': 'Beküldés', 'close': 'Bezárás', 'email': 'Email', 'password': 'Jelszó', 'username': 'Felhasználónév', 'firstName': 'Keresztnév', 'lastName': 'Vezetéknév', 'phone': 'Telefonszám', 'search': 'Keresés', 'filter': 'Szűrő', 'sort': 'Rendezés', 'export': 'Exportálás', 'import': 'Importálás', 'download': 'Letöltés', 'upload': 'Feltöltés', 'refresh': 'Frissítés'},
        'auth': {'login': 'Bejelentkezés', 'signup': 'Regisztráció', 'logout': 'Kijelentkezés', 'forgotPassword': 'Elfelejtett jelszó?', 'resetPassword': 'Jelszó visszaállítása', 'rememberMe': 'Emlékezz rám', 'signInSecurely': 'Biztonságos Bejelentkezés', 'createAccount': 'Fiók Létrehozása', 'alreadyHaveAccount': 'Már van fiókod?', 'noAccount': 'Nincs fiókod?'},
        'reseller': {'dashboard': 'Viszonteladó Vezérlőpult', 'earnings': 'Jövedelem', 'commissions': 'Províziók', 'payouts': 'Kifizetések', 'referrals': 'Ajánlások', 'leads': 'Potenciális Ügyfelek', 'customers': 'Ügyfelek', 'reports': 'Jelentések', 'settings': 'Beállítások'},
        'admin': {'dashboard': 'Admin Vezérlőpult', 'users': 'Felhasználók', 'products': 'Termékek', 'orders': 'Rendelések', 'revenue': 'Bevétel', 'settings': 'Beállítások'},
        'validation': {'required': 'Ez a mező kötelező', 'email': 'Érvénytelen email', 'password': 'A jelszónak 6+ karakter kell legyen'},
        'support': {'help': 'Segítség', 'faq': 'Gyakran Ismételt Kérdések', 'contact': 'Elérhetőség', 'feedback': 'Visszajelzés', 'docs': 'Dokumentáció', 'community': 'Közösség', 'tutorial': 'Oktatóanyag'},
    },
    'cs': {  # Czech
        'common': {'language': 'Jazyk', 'resellerApply': 'Podej žádost jako prodejce', 'dashboard': 'Přístrojová deska', 'settings': 'Nastavení', 'logout': 'Odhlášení', 'loading': 'Načítání...', 'error': 'Chyba', 'success': 'Úspěch', 'save': 'Uložit', 'cancel': 'Zrušit', 'delete': 'Odstranit', 'edit': 'Úprava', 'back': 'Zpět', 'next': 'Dalej', 'submit': 'Odeslat', 'close': 'Zavřít', 'email': 'Email', 'password': 'Heslo', 'username': 'Uživatelské jméno', 'firstName': 'Jméno', 'lastName': 'Příjmení', 'phone': 'Telefon', 'search': 'Hledat', 'filter': 'Filtr', 'sort': 'Řazení', 'export': 'Export', 'import': 'Import', 'download': 'Stáhnout', 'upload': 'Nahrát', 'refresh': 'Obnovit'},
        'auth': {'login': 'Přihlášení', 'signup': 'Registrace', 'logout': 'Odhlášení', 'forgotPassword': 'Zapomněli jste heslo?', 'resetPassword': 'Obnovit heslo', 'rememberMe': 'Zapamatuj si mě', 'signInSecurely': 'Přihlášení zabezpečené', 'createAccount': 'Vytvořit účet', 'alreadyHaveAccount': 'Už máš účet?', 'noAccount': 'Nemáš účet?'},
        'reseller': {'dashboard': 'Přístrojová deska prodejce', 'earnings': 'Výdělky', 'commissions': 'Provize', 'payouts': 'Výplaty', 'referrals': 'Doporučení', 'leads': 'Potenciální zákazníci', 'customers': 'Zákazníci', 'reports': 'Zprávy', 'settings': 'Nastavení'},
        'admin': {'dashboard': 'Administrační panel', 'users': 'Uživatelé', 'products': 'Produkty', 'orders': 'Objednávky', 'revenue': 'Příjem', 'settings': 'Nastavení'},
        'validation': {'required': 'Toto pole je povinné', 'email': 'Neplatný email', 'password': 'Heslo musí mít 6+ znaků'},
        'support': {'help': 'Pomoc', 'faq': 'Často kladené otázky', 'contact': 'Kontakt', 'feedback': 'Zpětná vazba', 'docs': 'Dokumentace', 'community': 'Komunita', 'tutorial': 'Tutoriál'},
    },
    'sk': {  # Slovak
        'common': {'language': 'Jazyk', 'resellerApply': 'Podaj žiadosť ako predajca', 'dashboard': 'Ovládací panel', 'settings': 'Nastavenia', 'logout': 'Odhlásenie', 'loading': 'Načítavanie...', 'error': 'Chyba', 'success': 'Úspech', 'save': 'Uložiť', 'cancel': 'Zrušiť', 'delete': 'Odstrániť', 'edit': 'Úprava', 'back': 'Späť', 'next': 'Ďalej', 'submit': 'Poslať', 'close': 'Zatvoriť', 'email': 'Email', 'password': 'Heslo', 'username': 'Meno používateľa', 'firstName': 'Meno', 'lastName': 'Priezvisko', 'phone': 'Telefón', 'search': 'Hľadať', 'filter': 'Filter', 'sort': 'Triedenie', 'export': 'Export', 'import': 'Import', 'download': 'Stiahnuť', 'upload': 'Nahrať', 'refresh': 'Obnoviť'},
        'auth': {'login': 'Prihlásenie', 'signup': 'Registrácia', 'logout': 'Odhlásenie', 'forgotPassword': 'Zabudli ste heslo?', 'resetPassword': 'Obnovenie hesla', 'rememberMe': 'Zapamätaj si ma', 'signInSecurely': 'Bezpečné prihlásenie', 'createAccount': 'Vytvoriť konto', 'alreadyHaveAccount': 'Už máš konto?', 'noAccount': 'Nemáš konto?'},
        'reseller': {'dashboard': 'Panel predajcu', 'earnings': 'Príjmy', 'commissions': 'Provízie', 'payouts': 'Výplaty', 'referrals': 'Odporúčania', 'leads': 'Potenciálni zákazníci', 'customers': 'Zákazníci', 'reports': 'Správy', 'settings': 'Nastavenia'},
        'admin': {'dashboard': 'Admin panel', 'users': 'Používatelia', 'products': 'Produkty', 'orders': 'Objednávky', 'revenue': 'Príjmy', 'settings': 'Nastavenia'},
        'validation': {'required': 'Toto pole je povinné', 'email': 'Neplatný email', 'password': 'Heslo musí mať 6+ znakov'},
        'support': {'help': 'Pomoc', 'faq': 'Často kladené otázky', 'contact': 'Kontakt', 'feedback': 'Spätná väzba', 'docs': 'Dokumentácia', 'community': 'Komunita', 'tutorial': 'Návod'},
    },
    'bn': {  # Bengali
        'common': {'language': 'ভাষা', 'resellerApply': 'রিসেলার হিসাবে আবেদন করুন', 'dashboard': 'ড্যাশবোর্ড', 'settings': 'সেটিংস', 'logout': 'লগআউট', 'loading': 'লোড হচ্ছে...', 'error': 'ত্রুটি', 'success': 'সাফল্য', 'save': 'সংরক্ষণ', 'cancel': 'বাতিল', 'delete': 'মুছুন', 'edit': 'সম্পাদনা', 'back': 'ফিরে', 'next': 'পরবর্তী', 'submit': 'জমা দিন', 'close': 'বন্ধ', 'email': 'ইমেল', 'password': 'পাসওয়ার্ড', 'username': 'ব্যবহারকারীর নাম', 'firstName': 'প্রথম নাম', 'lastName': 'শেষ নাম', 'phone': 'ফোন', 'search': 'অনুসন্ধান', 'filter': 'ফিল্টার', 'sort': 'সাজান', 'export': 'রপ্তানি', 'import': 'আমদানি', 'download': 'ডাউনলোড', 'upload': 'আপলোড', 'refresh': 'রিফ্রেশ'},
        'auth': {'login': 'লগইন', 'signup': 'সাইন আপ', 'logout': 'লগআউট', 'forgotPassword': 'পাসওয়ার্ড ভুলে গেছেন?', 'resetPassword': 'পাসওয়ার্ড রিসেট করুন', 'rememberMe': 'আমাকে মনে রাখুন', 'signInSecurely': 'নিরাপদ সাইন ইন', 'createAccount': 'অ্যাকাউন্ট তৈরি করুন', 'alreadyHaveAccount': 'ইতিমধ্যে অ্যাকাউন্ট আছেন?', 'noAccount': 'অ্যাকাউন্ট নেই?'},
        'reseller': {'dashboard': 'রিসেলার ড্যাশবোর্ড', 'earnings': 'আয়', 'commissions': 'কমিশন', 'payouts': 'পেআউট', 'referrals': 'রেফারেল', 'leads': 'লিড', 'customers': 'গ্রাহক', 'reports': 'রিপোর্ট', 'settings': 'সেটিংস'},
        'admin': {'dashboard': 'প্রশাসক ড্যাশবোর্ড', 'users': 'ব্যবহারকারী', 'products': 'পণ্য', 'orders': 'অর্ডার', 'revenue': 'রাজস্ব', 'settings': 'সেটিংস'},
        'validation': {'required': 'এই ফিল্ড প্রয়োজনীয়', 'email': 'অবৈধ ইমেল', 'password': 'পাসওয়ার্ড 6+ অক্ষর হতে হবে'},
        'support': {'help': 'সাহায্য', 'faq': 'প্রায়শই জিজ্ঞাসিত প্রশ্ন', 'contact': 'যোগাযোগ', 'feedback': 'প্রতিক্রিয়া', 'docs': 'নথিপত্র', 'community': 'সম্প্রদায়', 'tutorial': 'টিউটোরিয়াল'},
    },
    'pa': {  # Punjabi
        'common': {'language': 'ਭਾਸ਼ਾ', 'resellerApply': 'ਰੀਸੈਲਰ ਵਜੋਂ ਆਵੇਦਨ ਕਰੋ', 'dashboard': 'ਡੈਸ਼ਬੋਰਡ', 'settings': 'ਸੈਟਿੰਗਜ਼', 'logout': 'ਲਾਗ ਆਊਟ', 'loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...', 'error': 'ਖ਼ਰਾਬੀ', 'success': 'ਕਾਮਯਾਬੀ', 'save': 'ਬਚਾਓ', 'cancel': 'ਰੱਦ ਕਰੋ', 'delete': 'ਮਿਟਾ', 'edit': 'ਸੰਪਾਦਨ', 'back': 'ਪਿੱਛੇ', 'next': 'ਅਗਲਾ', 'submit': 'ਜਮ੍ਹਾ ਕਰੋ', 'close': 'ਬੰਦ ਕਰੋ', 'email': 'ਈਮੇਲ', 'password': 'ਪਾਸਵਰਡ', 'username': 'ਵਰਤੋਂਕਾਰ ਦਾ ਨਾਮ', 'firstName': 'ਪਹਿਲਾ ਨਾਮ', 'lastName': 'ਆਖਰੀ ਨਾਮ', 'phone': 'ਫ਼ੋਨ', 'search': 'ਖੋਜ', 'filter': 'ਫ਼ਿਲਟਰ', 'sort': 'ਛਾਂਟੀ', 'export': 'ਐਕਸਪੋਰਟ', 'import': 'ਇੰਪੋਰਟ', 'download': 'ਡਾਊਨਲੋਡ', 'upload': 'ਅਪ੍ਲੋਡ', 'refresh': 'ਤਾਜ਼ਾ ਕਰੋ'},
        'auth': {'login': 'ਲਾਗਇਨ', 'signup': 'ਸਾਈਨ ਅਪ', 'logout': 'ਲਾਗ ਆਊਟ', 'forgotPassword': 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?', 'resetPassword': 'ਪਾਸਵਰਡ ਰੀਸੈਟ ਕਰੋ', 'rememberMe': 'ਮੈਨੂੰ ਯਾਦ ਰਾਖੋ', 'signInSecurely': 'ਸੁਰੱਖਿਅਤ ਸਾਈਨ ਇਨ', 'createAccount': 'ਖਾਤਾ ਬਣਾਓ', 'alreadyHaveAccount': 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?', 'noAccount': 'ਖਾਤਾ ਨਹੀਂ ਹੈ?'},
        'reseller': {'dashboard': 'ਰੀਸੈਲਰ ਡੈਸ਼ਬੋਰਡ', 'earnings': 'ਕਮਾਈ', 'commissions': 'ਕਮਿਸ਼ਨ', 'payouts': 'ਭੁਗਤਾਨ', 'referrals': 'ਸਲਾਹਾਂ', 'leads': 'ਲੀਡ', 'customers': 'ਗਾਹਕ', 'reports': 'ਰਿਪੋਰਟਾਂ', 'settings': 'ਸੈਟਿੰਗਜ਼'},
        'admin': {'dashboard': 'ਪ੍ਰਸ਼ਾਸਕ ਡੈਸ਼ਬੋਰਡ', 'users': 'ਵਰਤੋਂਕਾਰ', 'products': 'ਉਤਪਾਦ', 'orders': 'ਆਰਡਰ', 'revenue': 'ਮਾਲੀਆ', 'settings': 'ਸੈਟਿੰਗਜ਼'},
        'validation': {'required': 'ਇਹ ਖੇਤ ਜ਼ਰੂਰੀ ਹੈ', 'email': 'ਅਵੈਧ ਈਮੇਲ', 'password': 'ਪਾਸਵਰਡ 6+ ਅੱਖਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ'},
        'support': {'help': 'ਸਹਾਇਤਾ', 'faq': 'ਅਕਸਰ ਪੁੱਛੇ ਜਾਣ ਵਾਲੇ ਸਵਾਲ', 'contact': 'ਸੰਪਰਕ', 'feedback': 'ਪ੍ਰਤੀਖਿਆ', 'docs': 'ਦਸਤਾਵੇਜ਼', 'community': 'ਸਮੁਦਾਇ', 'tutorial': 'ਸਿਖਲਾਈ'},
    },
    'ta': {  # Tamil
        'common': {'language': 'மொழி', 'resellerApply': 'மறுவிற்பனைকாரர் ஆக விண்ணப்பிக்கவும்', 'dashboard': 'டாஷ்போர்ড', 'settings': 'அமைப்புகள்', 'logout': 'வெளியேறு', 'loading': 'ஏற்றுகிறது...', 'error': 'பிழை', 'success': 'வெற்றி', 'save': 'சேமிக்கவும்', 'cancel': 'ரத்து', 'delete': 'அழிக்கவும்', 'edit': 'திருத்தவும்', 'back': 'பின்னோக்கி', 'next': 'அடுத்தது', 'submit': 'சமர்ப்பிக்கவும்', 'close': 'மூடு', 'email': 'மின்னஞ்சல்', 'password': 'கடவுச்சொல்', 'username': 'பயனர்பெயர்', 'firstName': 'முதல் பெயர்', 'lastName': 'கடைசி பெயர்', 'phone': 'ஆண்டி', 'search': 'தேடல்', 'filter': 'வடிகட்டி', 'sort': 'வரிசைப்படுத்து', 'export': 'ஏற்றுமதி', 'import': 'இறக்குமதி', 'download': 'பதிவிறக்கம்', 'upload': 'பதிவேற்றம்', 'refresh': 'புதுப்பிக்கவும்'},
        'auth': {'login': 'உள்நுழைக', 'signup': 'பதிவுசெய்க', 'logout': 'வெளியேறு', 'forgotPassword': 'கடவுச்சொல்லை மறந்தாயா?', 'resetPassword': 'கடவுச்சொல்லை மீட்டமைக்கவும்', 'rememberMe': 'என்னை நினைவில் வையுங்கள்', 'signInSecurely': 'பாதுகாப்புடன் உள்நுழைக', 'createAccount': 'கணக்கை உருவாக்கவும்', 'alreadyHaveAccount': 'ஏற்கனவே கணக்கு உள்ளதா?', 'noAccount': 'கணக்கு இல்லையா?'},
        'reseller': {'dashboard': 'மறுவிற்பனைக் கணக்குடைய', 'earnings': 'சம்பளம்', 'commissions': 'கமிஷன்கள்', 'payouts': 'பணிவிடாय்', 'referrals': 'பரிந்துரைகள்', 'leads': 'முன்னணிகள்', 'customers': 'வாடிக்கையாளர்கள்', 'reports': 'அறிக்கைகள்', 'settings': 'அமைப்புகள்'},
        'admin': {'dashboard': 'நிர்வாகி டாஷ்போர்ட', 'users': 'பயனர்கள்', 'products': 'பொருட்கள்', 'orders': 'ஆர்டர்கள்', 'revenue': 'வருவாய்', 'settings': 'அமைப்புகள்'},
        'validation': {'required': 'இந்த புலம் கட்டாயம்', 'email': 'செல்லாத மின்னஞ்சல்', 'password': 'கடவுச்சொல் 6+ எழுத்துக்கள் இருக்க வேண்டும்'},
        'support': {'help': 'உதவி', 'faq': 'அடிக்கடி கேட்கப்படும் கேள்விகள்', 'contact': 'தொடர்புக்கு', 'feedback': 'கருத்து', 'docs': 'ஆவணங்கள்', 'community': 'சமூகம்', 'tutorial': 'பயிற்சி'},
    },
    'te': {  # Telugu
        'common': {'language': 'భాష', 'resellerApply': 'రీసెల్లర్‌గా దరఖాస్తు చేయండి', 'dashboard': 'డ్యాష్‌బోర్డ్', 'settings': 'సెట్టింగ్‌లు', 'logout': 'లాగ్‌అవుట్', 'loading': 'లోడ్ అవుతోంది...', 'error': 'లోపం', 'success': 'విజయం', 'save': 'సేవ్ చేయండి', 'cancel': 'రద్దు', 'delete': 'తొలగించు', 'edit': 'సవరించు', 'back': 'వెనుకకు', 'next': 'తరువాత', 'submit': 'సమర్పించండి', 'close': 'మూసివేయండి', 'email': 'ఈమెయిల్', 'password': 'పాస్‌వర్డ్', 'username': 'వినియోగదారు పేరు', 'firstName': 'మొదటి పేరు', 'lastName': 'చివరి పేరు', 'phone': 'ఫోన్', 'search': 'శోధన', 'filter': 'ఫిల్టర్', 'sort': 'క్రమీకరణ', 'export': 'ఎక్స్‌పోర్ట్', 'import': 'ఇంపోర్ట్', 'download': 'డౌన్‌లోడ్', 'upload': 'అప్‌లోడ్', 'refresh': 'రిఫ్రెష్'},
        'auth': {'login': 'లాగిన్', 'signup': 'సైన్ అప్', 'logout': 'లాగ్‌అవుట్', 'forgotPassword': 'పాస్‌వర్డ్ మర్చిపోయారా?', 'resetPassword': 'పాస్‌వర్డ్ రీసెట్ చేయండి', 'rememberMe': 'నన్ను గుర్తుంచుకో', 'signInSecurely': 'సురక్షితమైన సైన్ ఇన్', 'createAccount': 'ఖాతా సృష్టించండి', 'alreadyHaveAccount': 'ఇప్పటికే ఖాతా ఉందా?', 'noAccount': 'ఖాతా లేనిదా?'},
        'reseller': {'dashboard': 'రీసెల్లర్ డ్యాష్‌బోర్డ్', 'earnings': 'సంపాదన', 'commissions': 'కమీషన్‌లు', 'payouts': 'చెల్లింపులు', 'referrals': 'సూచనలు', 'leads': 'సంభవ్యతలు', 'customers': 'ఖాతాదారులు', 'reports': 'నివేదికలు', 'settings': 'సెట్టింగ్‌లు'},
        'admin': {'dashboard': 'నిర్వాహక డ్యాష్‌బోర్డ్', 'users': 'వినియోగదారులు', 'products': 'ఉత్పత్తులు', 'orders': 'ఆర్డర్‌లు', 'revenue': 'ఆదాయం', 'settings': 'సెట్టింగ్‌లు'},
        'validation': {'required': 'ఈ ఫీల్డ్ అవసరం', 'email': 'చెల్లని ఈమెయిల్', 'password': 'పాస్‌వర్డ్ 6+ అక్షరాలు ఉండాలి'},
        'support': {'help': 'సహాయం', 'faq': 'తరచుగా అడిగే ప్రశ్నలు', 'contact': 'సంప్రదించండి', 'feedback': 'ఫీడ్‌బ్యాక్', 'docs': 'డాక్యుమెంటేషన్', 'community': 'సమాజం', 'tutorial': 'ట్యుటోరియల్'},
    },
    'ml': {  # Malayalam
        'common': {'language': 'ഭാഷ', 'resellerApply': 'റീസെല്ലറായി അപേക്ഷിക്കുക', 'dashboard': 'ഡാഷ്‌ബോർഡ്', 'settings': 'ക്രമീകരണങ്ങൾ', 'logout': 'ലോഗ്‌ഔട്ട്', 'loading': 'ലോഡ് ചെയ്യുന്നു...', 'error': 'പിശക്', 'success': 'സാധാരണ', 'save': 'സംരക്ഷിക്കുക', 'cancel': 'റദ്ദാക്കുക', 'delete': 'ഇല്ലാതാക്കുക', 'edit': 'എഡിറ്റ് ചെയ്യുക', 'back': 'തിരികെ', 'next': 'അടുത്ത', 'submit': 'സമർപ്പിക്കുക', 'close': 'അടയ്ക്കുക', 'email': 'ഇമെയിൽ', 'password': 'പാസ്‌വേഡ്', 'username': 'ഉപയോഗിക്കുന്നയാളിന്റെ പേര്', 'firstName': 'മുന്നിലെ പേര്', 'lastName': 'അവസാന പേര്', 'phone': 'ഫോൺ', 'search': 'തിരയൽ', 'filter': 'ഫിൽറ്റർ', 'sort': 'തരം തിരിക്കുക', 'export': 'കയറ്റയയയ്ക്കുക', 'import': 'ഇറക്കുമതി', 'download': 'ഡൌൺലോഡ്', 'upload': 'അപ്‌ലോഡ്', 'refresh': 'പുതുക്കുക'},
        'auth': {'login': 'ലോഗിൻ ചെയ്യുക', 'signup': 'സൈൻ അപ്പ് ചെയ്യുക', 'logout': 'ലോഗ്‌ഔട്ട്', 'forgotPassword': 'പാസ്‌വേഡ് മറന്നുവോ?', 'resetPassword': 'പാസ്‌വേഡ് പുനഃസജ്ജമാക്കുക', 'rememberMe': 'എന്നെ ഓർമ്മയിൽ വെയ്ക്കുക', 'signInSecurely': 'സുരക്ഷിതമായി സൈൻ ഇൻ ചെയ്യുക', 'createAccount': 'അക്കൗണ്ട് സൃഷ്ടിക്കുക', 'alreadyHaveAccount': 'ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?', 'noAccount': 'അക്കൗണ്ട് ഇല്ലേ?'},
        'reseller': {'dashboard': 'റീസെല്ലർ ഡാഷ്‌ബോർഡ്', 'earnings': 'വരുമാനം', 'commissions': 'കമീഷനുകൾ', 'payouts': 'അടവ്', 'referrals': 'നിർദ്ദേശങ്ങൾ', 'leads': 'സാധ്യതകൾ', 'customers': 'ഗ്രാഹകർ', 'reports': 'റിപ്പോർട്ടുകൾ', 'settings': 'ക്രമീകരണങ്ങൾ'},
        'admin': {'dashboard': 'ഭരണകർത്താ ഡാഷ്‌ബോർഡ്', 'users': 'ഉപയോഗിക്കുന്നവർ', 'products': 'ഉത്പാദനങ്ങൾ', 'orders': 'ഓർഡറുകൾ', 'revenue': 'ലാഭം', 'settings': 'ക്രമീകരണങ്ങൾ'},
        'validation': {'required': 'ഈ ഫീൽഡ് ആവശ്യമാണ്', 'email': 'അസാധുവായ ഇമെയിൽ', 'password': 'പാസ്‌വേഡ് 6+ പ്രതീകങ്ങൾ ആയിരിക്കണം'},
        'support': {'help': 'സഹായം', 'faq': 'പതിവായി ചോദിച്ച ചോദ്യങ്ങൾ', 'contact': 'സ്‌പർശിക്കുക', 'feedback': 'അഭിപ്രായം', 'docs': 'ഡോക്യുമെന്റേഷൻ', 'community': 'സമൂഹം', 'tutorial': 'പാഠപുസ്തകം'},
    },
    'my': {  # Burmese
        'common': {'language': 'ဘာသာစကား', 'resellerApply': 'ပြန်လည်ရောင်းချသူအဖြစ်လျှောက်ထားပါ', 'dashboard': 'ထည်သွင်းခြင်း', 'settings': 'အပ်ချက်များ', 'logout': 'ထွက်ခွာ', 'loading': 'အားလပ်နေသည်...', 'error': 'အမှားအယွင်း', 'success': 'အောင်မြင်ခြင်း', 'save': 'သိမ်းဆည်းခြင်း', 'cancel': 'ပယ်ဖျက်ခြင်း', 'delete': 'ဖျက်ခြင်း', 'edit': 'ပြင်ဆင်ခြင်း', 'back': 'ပြန်သွားခြင်း', 'next': 'နောက်သို့', 'submit': 'တင်သည်', 'close': 'ပိတ်သည်', 'email': 'အီမေးလ်', 'password': 'စကားဝှက်', 'username': 'အသုံးပြုသူအမည်', 'firstName': 'ပထမအမည်', 'lastName': 'ဒုတိယအမည်', 'phone': 'ဖုန်း', 'search': 'ရှာလေ့ဝင်', 'filter': 'စစ်ခတ်ခြင်း', 'sort': 'အုပ်စုခွဲခြင်း', 'export': 'အကုန်ထုတ်ယူ', 'import': 'ကျောင်းသို့ခေါ်ဆောင်းခြင်း', 'download': 'ဆွဲချခြင်း', 'upload': 'တင်သည်', 'refresh': 'ပြန်လည်ဖွင့်ခြင်း'},
        'auth': {'login': 'ဝင်ခွင့်ရခြင်း', 'signup': 'မှတ်ပုံတင်ခြင်း', 'logout': 'ထွက်ခွာ', 'forgotPassword': 'စကားဝှက်ကိုမေ့သွားခဲ့ပါသလား?', 'resetPassword': 'စကားဝှက်ကိုမူလအနေအထားသို့ပြန်အဆင့်မြှင့်တင်ခြင်း', 'rememberMe': 'ကျွန်ုပ်ကိုသတ်မှတ်ခြင်း', 'signInSecurely': 'ကျေးဇူးပြု၍ အကြံအစည်ကိုသုံးအောင်ဆောင်ရွက်ခြင်း', 'createAccount': 'အကောင့်မှတ်ပုံတင်ခြင်း', 'alreadyHaveAccount': 'ရှိပြီးသားအကောင့်ရှိပါသလား?', 'noAccount': 'အကောင့်မရှိပါသလား?'},
        'reseller': {'dashboard': 'ပြန်လည်ရောင်းချသူထည်သွင်းခြင်း', 'earnings': 'ဝင်ငွေ', 'commissions': 'ယုံခွင်တန်ဆာ', 'payouts': 'အမြတ်အစွန်း', 'referrals': 'ကြေးမုံ', 'leads': 'မြို့ပြ', 'customers': 'ဆိုင်ဖက်', 'reports': 'အစီရင်ခံစာများ', 'settings': 'အပ်ချက်များ'},
        'admin': {'dashboard': 'အုပ်ချုပ်ရန်ထည်သွင်းခြင်း', 'users': 'အသုံးပြုသူများ', 'products': 'ထုတ်ကုန်များ', 'orders': 'အခမ်းအနားများ', 'revenue': 'ခွင့်ပြုလှူဒါန်း', 'settings': 'အပ်ချက်များ'},
        'validation': {'required': 'ဒီဟာအဆိုပါအကျယ်မဟုတ်', 'email': 'အီမေးလ်မမှန်', 'password': 'စကားဝှက်သည်အက္ခရာ၆+ရှိရမည်'},
        'support': {'help': 'ကူညီမှု', 'faq': 'မေးမြန်းလေ့ရှိသောမေးခွန်းများ', 'contact': 'ဆက်သွယ်ရန်', 'feedback': 'အမြင်တင်ပြခြင်း', 'docs': 'စာ類류', 'community': 'လူမှုကွန်ယက်', 'tutorial': 'သင်ခန်းစာ'},
    },
    'km': {  # Khmer - abbreviated for space
        'common': {'language': 'ភាសា', 'resellerApply': 'ដាក់ពាក្យបង្ហាញលក់ប្រាក់', 'dashboard': 'ផ្ទាំងគ្រប់គ្រង', 'settings': 'ការកំណត់', 'logout': 'ចាកចេញ', 'loading': 'ទាញយក...', 'error': 'កំហុស', 'success': 'ជោគជ័យ', 'save': 'រក្សាទុក', 'cancel': 'បោះបង់', 'delete': 'លុប', 'edit': 'កែប្រែ', 'back': 'ត្រលប់ក្រោយ', 'next': 'បន្ទាប់', 'submit': 'ដាក់ស្នើ', 'close': 'បិទ', 'email': 'អ៊ីមែល', 'password': 'ពាក្យលេខសម្ងាត់', 'username': 'ឈ្មោះអ្នកប្រើប្រាស់', 'firstName': 'ឈ្មោះដំបូង', 'lastName': 'នាមត្រកូល', 'phone': 'ទូរស័ព្ទ', 'search': 'ស្វាងរក', 'filter': 'តម្រង', 'sort': 'ធ្វើឱ្យសមរម្យ', 'export': 'នាំចេញ', 'import': 'នាំចូល', 'download': 'ទាញយក', 'upload': 'ផ្ទុក', 'refresh': 'ឆ្នាំបង្ហាញថ្មី'},
        'auth': {'login': 'ចូល', 'signup': 'ចុះឈ្មោះ', 'logout': 'ចាកចេញ', 'forgotPassword': 'ភ្លេចពាក្យលេខសម្ងាត់?', 'resetPassword': 'ដាក់ឡើងវិញ', 'rememberMe': 'ចងចាំខ្ញុំ', 'signInSecurely': 'ចូលដោយសុវត្ថិភាព', 'createAccount': 'បង្កើតគណនីលេខ', 'alreadyHaveAccount': 'មានគណនីរួចហើយ?', 'noAccount': 'គ្មានគណនី?'},
        'reseller': {'dashboard': 'ផ្ទាំងលក់ប្រាក់', 'earnings': 'ប្រាក់ចំណូល', 'commissions': 'ថ្លៃលក់', 'payouts': 'ការលក់', 'referrals': 'អនុសាសន៍', 'leads': 'អ្នកដាក់ពាក្យ', 'customers': 'អតិថិជន', 'reports': 'របាយការណ៍', 'settings': 'ការកំណត់'},
        'admin': {'dashboard': 'ផ្ទាំងរដ្ឋបាល', 'users': 'អ្នកប្រើប្រាស់', 'products': 'ផលិតផល', 'orders': 'ការបញ្ជាទិញ', 'revenue': 'ប្រាក់ចំណូល', 'settings': 'ការកំណត់'},
        'validation': {'required': 'វាលនេះគឺចាំបាច់', 'email': 'អ៊ីមែលមិនមាន', 'password': 'ពាក្យលេខសម្ងាត់គឺត្រូវតែ 6+'},
        'support': {'help': 'ជំនួយ', 'faq': 'សំណួរលម្អិត', 'contact': 'ទំនាក់ទំនង', 'feedback': 'មតិយោបល់', 'docs': 'ឯកសារ', 'community': 'សហគមន៍', 'tutorial': 'មេរៀនសិក្សា'},
    },
    'lo': {  # Lao - simplified
        'common': {'language': 'ພາສາ', 'resellerApply': 'ສະມັກເປັນຜູ້ຂາຍຄືນ', 'dashboard': 'ຫ້ອງຄວບຄຸມ', 'settings': 'ການຕັ້ງຄ່າ', 'logout': 'ອອກ', 'loading': 'ກຳລັງໂຫຼດ...', 'error': 'ຜິດພາດ', 'success': 'ສຳເລັດ', 'save': 'ບັນທຶກ', 'cancel': 'ຍົກເລີກ', 'delete': 'ລົບ', 'edit': 'ແກ້ໄຂ', 'back': 'ກັບ', 'next': 'ຕໍ່ໄປ', 'submit': 'ສົ່ງ', 'close': 'ປິດ', 'email': 'ອີເມວ', 'password': 'ລະຫັດຜ່ານ', 'username': 'ຊື່ຜູ້ໃຊ້', 'firstName': 'ຊື່ໂຕ', 'lastName': 'ນາມສະກຸນ', 'phone': 'ໂທລະສັບ', 'search': 'ຊອກຫາ', 'filter': 'ກັ່ນ', 'sort': 'ຈັດລຽງ', 'export': 'ສົ່ງອອກ', 'import': 'ນຳເຂົ້າ', 'download': 'ດາວໂຫຼດ', 'upload': 'ອັບໂຫລດ', 'refresh': 'ເອົາມາໃໝ່'},
        'auth': {'login': 'ເຂົ້າສູ່ລະບົບ', 'signup': 'ລົງທະບຽນ', 'logout': 'ອອກ', 'forgotPassword': 'ລືມລະຫັດຜ່ານ?', 'resetPassword': 'ຕັ້ງລະຫັດຜ່ານໃໝ່', 'rememberMe': 'ຈື່ໄວ້', 'signInSecurely': 'ເຂົ້າສູ່ລະບົບຢ່າງປອດໄພ', 'createAccount': 'ສ້າງບັນຊີ', 'alreadyHaveAccount': 'ມີບັນຊີແລ້ວ?', 'noAccount': 'ບໍ່ມີບັນຊີ?'},
        'reseller': {'dashboard': 'ຫ້ອງຄວບຄຸມຜູ້ຂາຍຄືນ', 'earnings': 'ລາຍໄດ້', 'commissions': 'ຄ່າລາຍລະອຽດ', 'payouts': 'ການຈ່າຍ', 'referrals': 'ຂໍ້ເສນແນະ', 'leads': 'ບໍ່ມີແນວໂນ້ມ', 'customers': 'ລູກຄ້າ', 'reports': 'ລາຍງານ', 'settings': 'ການຕັ້ງຄ່າ'},
        'admin': {'dashboard': 'ແຜງຜູ້ຄຸ', 'users': 'ຜູ້ໃຊ້', 'products': 'ຜະລິດຕະພັນ', 'orders': 'ຄໍາສັ່ງ', 'revenue': 'ລາຍໄດ້', 'settings': 'ການຕັ້ງຄ່າ'},
        'validation': {'required': 'ຟ້ອນແນະນີ້ຈຳເປັນ', 'email': 'ອີເມວບໍ່ຖືກຕ້ອງ', 'password': 'ລະຫັດຜ່ານຕ້ອງ 6+'},
        'support': {'help': 'ຊ່ວຍເຫຼື', 'faq': 'ຄໍາຖາມທີ່ຖາມເລື້ອຍ', 'contact': 'ຕິດຕໍ່', 'feedback': 'ຄໍາເຫັນ', 'docs': 'ເອກະສານ', 'community': 'ສະ​ຫະ​ພາບ', 'tutorial': 'ບົດຮຽນ'},
    },
    'hy': {  # Armenian
        'common': {'language': 'Լեզու', 'resellerApply': 'Դիմել որպես վաճառողի վերավաճառ', 'dashboard': 'Կառավարման վահանակ', 'settings': 'Կարգավորումներ', 'logout': 'Ելք', 'loading': 'Բեռնվում է...', 'error': 'Սխալ', 'success': 'Հաջողություն', 'save': 'Պահել', 'cancel': 'Չեղարկել', 'delete': 'Ջնջել', 'edit': 'Խմբագրել', 'back': 'Հետ', 'next': 'Հաջորդ', 'submit': 'Ներկայացնել', 'close': 'Փակել', 'email': 'Email', 'password': 'Գաղտնաբառ', 'username': 'Օգտվողի անուն', 'firstName': 'Մեր անուն', 'lastName': 'Ազգանուն', 'phone': 'Հեռախոս', 'search': 'Որոնում', 'filter': 'Ֆիլտր', 'sort': 'Տեսակավորում', 'export': 'Արտահանում', 'import': 'Ներմուծում', 'download': 'Ներբեռնել', 'upload': 'Վերբեռնել', 'refresh': 'Թարմացնել'},
        'auth': {'login': 'Մուտք', 'signup': 'Գրանցում', 'logout': 'Ելք', 'forgotPassword': 'Մոռացել եք գաղտնաբառը?', 'resetPassword': 'Գաղտնաբառ վերադարձել', 'rememberMe': 'Հիշիր ինձ', 'signInSecurely': 'Հատկապես մուտք', 'createAccount': 'Հաշիվ ստեղծել', 'alreadyHaveAccount': 'Արդեն ունեք հաշիվ?', 'noAccount': 'Հաշիվ չունեք?'},
        'reseller': {'dashboard': 'Վերավաճառողի վահանակ', 'earnings': 'Եկամուտ', 'commissions': 'Կոմիսիոն', 'payouts': 'Վճարումներ', 'referrals': 'Առաջարկներ', 'leads': 'Հավակցում', 'customers': 'Հաճախորդներ', 'reports': 'Հաշվետվություններ', 'settings': 'Կարգավորումներ'},
        'admin': {'dashboard': 'Ադմինի վահանակ', 'users': 'Օգտվողներ', 'products': 'Ապրանքներ', 'orders': 'Պատվերներ', 'revenue': 'Եկամուտ', 'settings': 'Կարգավորումներ'},
        'validation': {'required': 'Այս դաշտը պարտադիր է', 'email': 'Անվավեր email', 'password': 'Գաղտնաբառը պետք է լինի 6+ նիշ'},
        'support': {'help': 'Օգնություն', 'faq': 'Հաճախ տրվող հարցեր', 'contact': 'Կապ', 'feedback': 'Արձագանք', 'docs': 'Փաստաթղթեր', 'community': 'Համայնք', 'tutorial': 'Ձեռնարկ'},
    },
    'ka': {  # Georgian
        'common': {'language': 'ენა', 'resellerApply': 'იყავი განხორციელების ხელმისაწვდომი', 'dashboard': 'კონტროლის პანელი', 'settings': 'პარამეტრები', 'logout': 'გამოსვლა', 'loading': 'იტვირთება...', 'error': 'შეცდომა', 'success': 'წარმატება', 'save': 'შენახვა', 'cancel': 'გაუქმება', 'delete': 'წაშლა', 'edit': 'რედაქტირება', 'back': 'უკან', 'next': 'შემდეგი', 'submit': 'გაგზავნა', 'close': 'დახურვა', 'email': 'ელფოსტა', 'password': 'პაროლი', 'username': 'მომხმარებელი', 'firstName': 'პირველი სახელი', 'lastName': 'ფამილია', 'phone': 'ტელეფონი', 'search': 'ძიება', 'filter': 'ფილტრი', 'sort': 'დახარისხება', 'export': 'ექსპორტი', 'import': 'იმპორტი', 'download': 'ჩამოტვირთვა', 'upload': 'ატვირთვა', 'refresh': 'განახლება'},
        'auth': {'login': 'შესვლა', 'signup': 'რეგისტრაცია', 'logout': 'გამოსვლა', 'forgotPassword': 'პაროლი დაგავიწყდა?', 'resetPassword': 'პაროლის გადატვირთვა', 'rememberMe': 'დამიმახსოვრე', 'signInSecurely': 'უსაფრთხო შესვლა', 'createAccount': 'ანგარიშის შექმნა', 'alreadyHaveAccount': 'უკვე აქვს ანგარიში?', 'noAccount': 'არ გაქვს ანგარიში?'},
        'reseller': {'dashboard': 'გადამყიდველის პანელი', 'earnings': 'შემოსავალი', 'commissions': 'კომისია', 'payouts': 'ანაზღაურება', 'referrals': 'რეფერალი', 'leads': 'დინების სიმჯ', 'customers': 'დელიკი', 'reports': 'ანგარიშები', 'settings': 'პარამეტრები'},
        'admin': {'dashboard': 'ადმინის პანელი', 'users': 'მომხმარებელი', 'products': 'პროდუქტი', 'orders': 'შეკვეთა', 'revenue': 'შემოსავალი', 'settings': 'პარამეტრები'},
        'validation': {'required': 'ეს ველი სავალდებულოა', 'email': 'არასწორი ელფოსტა', 'password': 'პაროლი უნდა იყოს 6+ სიმბოლო'},
        'support': {'help': 'დახმარება', 'faq': 'ხშირად დასმული კითხვები', 'contact': 'კონტაქტი', 'feedback': 'უკუკავშირი', 'docs': 'დოკუმენტაცია', 'community': 'საზოგადოება', 'tutorial': 'სახელმძღვანელო'},
    },
    'et': {  # Estonian
        'common': {'language': 'Keel', 'resellerApply': 'Kandideeri müüjana', 'dashboard': 'Juhtpaneel', 'settings': 'Seaded', 'logout': 'Väljalogimine', 'loading': 'Laadimine...', 'error': 'Viga', 'success': 'Edu', 'save': 'Salvestamine', 'cancel': 'Tühistamine', 'delete': 'Kustutamine', 'edit': 'Muutmine', 'back': 'Tagasi', 'next': 'Järgmine', 'submit': 'Esitamine', 'close': 'Sulgemine', 'email': 'E-post', 'password': 'Parool', 'username': 'Kasutajanimi', 'firstName': 'Eesnimi', 'lastName': 'Perekonnanimi', 'phone': 'Telefon', 'search': 'Otsing', 'filter': 'Filter', 'sort': 'Sorteerimine', 'export': 'Eksport', 'import': 'Import', 'download': 'Allalaadimine', 'upload': 'Üleslaadimine', 'refresh': 'Värskendamine'},
        'auth': {'login': 'Sisselogimine', 'signup': 'Registreerimine', 'logout': 'Väljalogimine', 'forgotPassword': 'Unustasid parooli?', 'resetPassword': 'Parooli lähtestamine', 'rememberMe': 'Mäleta mind', 'signInSecurely': 'Turvaline sisselogimine', 'createAccount': 'Konto loomine', 'alreadyHaveAccount': 'Kontot juba on?', 'noAccount': 'Kontot pole?'},
        'reseller': {'dashboard': 'Edasimüüja juhtpaneel', 'earnings': 'Tulu', 'commissions': 'Provisjon', 'payouts': 'Maksed', 'referrals': 'Soovitused', 'leads': 'Juhtid', 'customers': 'Kliendid', 'reports': 'Aruanded', 'settings': 'Seaded'},
        'admin': {'dashboard': 'Administraatori paneel', 'users': 'Kasutajad', 'products': 'Tooted', 'orders': 'Tellimused', 'revenue': 'Tulu', 'settings': 'Seaded'},
        'validation': {'required': 'See väli on kohustuslik', 'email': 'Vale e-posti aadress', 'password': 'Parool peab olema 6+ tähemärki'},
        'support': {'help': 'Abi', 'faq': 'Korduma Kippuvad Küsimused', 'contact': 'Kontakt', 'feedback': 'Tagasiside', 'docs': 'Dokumentatsioon', 'community': 'Kogukond', 'tutorial': 'Juhend'},
    },
    'lv': {  # Latvian
        'common': {'language': 'Valoda', 'resellerApply': 'Piesakies kā pārpārdošanas partneris', 'dashboard': 'Vadības panelis', 'settings': 'Iestatījumi', 'logout': 'Izlogoties', 'loading': 'Ielāde...', 'error': 'Kļūda', 'success': 'Panākums', 'save': 'Saglabāt', 'cancel': 'Atcelt', 'delete': 'Dzēst', 'edit': 'Rediģēt', 'back': 'Atpakaļ', 'next': 'Tālāk', 'submit': 'Iesniegt', 'close': 'Aizvērt', 'email': 'E-pasts', 'password': 'Parole', 'username': 'Lietotājvārds', 'firstName': 'Vārds', 'lastName': 'Uzvārds', 'phone': 'Tālrunis', 'search': 'Meklēt', 'filter': 'Filtrs', 'sort': 'Kārtošana', 'export': 'Eksportēt', 'import': 'Importēt', 'download': 'Lejupielāde', 'upload': 'Augšupielāde', 'refresh': 'Atsvaidzināt'},
        'auth': {'login': 'Pierakstīšanās', 'signup': 'Reģistrēšanās', 'logout': 'Izlogoties', 'forgotPassword': 'Aizmirsa paroli?', 'resetPassword': 'Paroles atiestatīšana', 'rememberMe': 'Atcerieties mani', 'signInSecurely': 'Drošāka pierakstīšanās', 'createAccount': 'Izveidot kontu', 'alreadyHaveAccount': 'Jau ir konts?', 'noAccount': 'Nav konta?'},
        'reseller': {'dashboard': 'Pārpārdošanas partnera panelis', 'earnings': 'Ieņemumi', 'commissions': 'Komisijas', 'payouts': 'Izmaksas', 'referrals': 'Atsauces', 'leads': 'Laidi', 'customers': 'Klienti', 'reports': 'Pārskati', 'settings': 'Iestatījumi'},
        'admin': {'dashboard': 'Administratora panelis', 'users': 'Lietotāji', 'products': 'Produkti', 'orders': 'Pasūtījumi', 'revenue': 'Ieņemumi', 'settings': 'Iestatījumi'},
        'validation': {'required': 'Šis lauks ir obligāts', 'email': 'Negatīvs e-pasts', 'password': 'Parolei jābūt 6+ rakstzīmēm'},
        'support': {'help': 'Palīdzība', 'faq': 'Biežāk uzdotie jautājumi', 'contact': 'Kontakts', 'feedback': 'Atsauksme', 'docs': 'Dokumentācija', 'community': 'Kopiena', 'tutorial': 'Pamācība'},
    },
    'lt': {  # Lithuanian
        'common': {'language': 'Kalba', 'resellerApply': 'Prašymas kaip pardavėjas', 'dashboard': 'Valdymo skydelis', 'settings': 'Nustatymai', 'logout': 'Atsijungti', 'loading': 'Kraunasi...', 'error': 'Klaida', 'success': 'Sėkmė', 'save': 'Išsaugoti', 'cancel': 'Atšaukti', 'delete': 'Panaikinti', 'edit': 'Redaguoti', 'back': 'Atgal', 'next': 'Kitas', 'submit': 'Pateikti', 'close': 'Uždaryti', 'email': 'El. paštas', 'password': 'Slaptažodis', 'username': 'Vartotojo vardas', 'firstName': 'Vardas', 'lastName': 'Pavardė', 'phone': 'Telefonas', 'search': 'Paieška', 'filter': 'Filtras', 'sort': 'Rūšiavimas', 'export': 'Eksportuoti', 'import': 'Importuoti', 'download': 'Atsisiųsti', 'upload': 'Įkelti', 'refresh': 'Atnaujinti'},
        'auth': {'login': 'Prisijungti', 'signup': 'Prisiregistruoti', 'logout': 'Atsijungti', 'forgotPassword': 'Pamiršai slaptažodį?', 'resetPassword': 'Slaptažodis iš naujo', 'rememberMe': 'Prisiminti mane', 'signInSecurely': 'Saugi įvestis', 'createAccount': 'Sukurti paskyrą', 'alreadyHaveAccount': 'Jau turi paskyrą?', 'noAccount': 'Nėra paskyros?'},
        'reseller': {'dashboard': 'Perpardavėjo skydelis', 'earnings': 'Pelnas', 'commissions': 'Komisijos', 'payouts': 'Išmokas', 'referrals': 'Pasiūlymai', 'leads': 'Potencialūs', 'customers': 'Klientai', 'reports': 'Ataskaitos', 'settings': 'Nustatymai'},
        'admin': {'dashboard': 'Administratoriaus skydelis', 'users': 'Naudotojai', 'products': 'Produktai', 'orders': 'Užsakymai', 'revenue': 'Pajamos', 'settings': 'Nustatymai'},
        'validation': {'required': 'Šis laukas yra būtinas', 'email': 'Neteisingas el. paštas', 'password': 'Slaptažodis turi turėti 6+ simbolius'},
        'support': {'help': 'Pagalba', 'faq': 'Dažnai Užduodami Klausimai', 'contact': 'Kontaktas', 'feedback': 'Atsiliepimas', 'docs': 'Dokumentacija', 'community': 'Bendruomenė', 'tutorial': 'Mokymas'},
    },
    'ku': {  # Kurdish (Sorani)
        'common': {'language': 'زمان', 'resellerApply': 'درخواستی بە مێژووی فرۆشیار', 'dashboard': 'پیتی کۆنترۆل', 'settings': 'ڕێکخستنەکان', 'logout': 'چوونە دەرەوە', 'loading': 'بارکردن...', 'error': 'هەڵە', 'success': 'سەرکەوتن', 'save': 'پاشکەوتکردن', 'cancel': 'هەڵوەشاندن', 'delete': 'سڕینەوە', 'edit': 'دەستکاری', 'back': 'پاشتر', 'next': 'دواتر', 'submit': 'ناردن', 'close': 'داخستن', 'email': 'ئیمەیل', 'password': 'پاسوۆرد', 'username': 'ناوی بەکارهێنەر', 'firstName': 'ناوی یەکەم', 'lastName': 'ناوی پاشین', 'phone': 'تەلەفۆن', 'search': 'گەڕان', 'filter': 'فلتەر', 'sort': 'ڕیزکردن', 'export': 'هێنانەدەرەوە', 'import': 'هێنانەژووری', 'download': 'دارشتین', 'upload': 'بارکردن', 'refresh': 'تازەکردن'},
        'auth': {'login': 'چوونە ژووری', 'signup': 'تۆمار', 'logout': 'چوونە دەرەوە', 'forgotPassword': 'پاسوۆرد لە یاد چوو?', 'resetPassword': 'بارگیری پاسوۆرد', 'rememberMe': 'منی بیرخو', 'signInSecurely': 'چوونە ژووری بە ایمنی', 'createAccount': 'سازاندنی هەژمار', 'alreadyHaveAccount': 'هیچ وەک هەژمار ئەتوانی لێبکەی?', 'noAccount': 'هەژمار نیە?'},
        'reseller': {'dashboard': 'پیتی بازاڕکار', 'earnings': 'قازانج', 'commissions': 'کۆمیشن', 'payouts': 'گریا', 'referrals': 'ئامۆژگاریەکان', 'leads': 'بوار', 'customers': 'موشتەری', 'reports': 'ڕاپۆرت', 'settings': 'ڕێکخستنەکان'},
        'admin': {'dashboard': 'پیتی بەڕێوەبەر', 'users': 'بەکارهێنەران', 'products': 'بەرهەمەکان', 'orders': 'فرمانەکان', 'revenue': 'هاتووچۆ', 'settings': 'ڕێکخستنەکان'},
        'validation': {'required': 'ئەم خانەیە پێویستە', 'email': 'ئیمەیلی دروست نیە', 'password': 'پاسوۆرد دەبێت 6+ نیشتەمان بێت'},
        'support': {'help': 'یارمەتی', 'faq': 'پرسیار کە زۆر پرسراون', 'contact': 'پەیوەندی', 'feedback': 'وەڵامی', 'docs': 'دۆکیومێنت', 'community': 'کۆمەڵ', 'tutorial': 'سێبینی'},
    },
    'or': {  # Odia
        'common': {'language': 'ଭାଷା', 'resellerApply': 'ରିସେଲର ଭାବେ ଆବେଦନ', 'dashboard': 'ଡ୍ୟାସବୋର୍ଡ', 'settings': 'ସେଟିଂସ', 'logout': 'ଲଗଆଉଟ', 'loading': 'ଲୋଡ ହୋଇଛି...', 'error': 'ତ୍ରୁଟି', 'success': 'ସଫଳତା', 'save': 'ସଂରକ୍ଷଣ', 'cancel': 'ରଦ୍ଦ', 'delete': 'ଏକାଈଁ', 'edit': 'ସମ୍ପାଦନ', 'back': 'ଫେରନ୍ତୁ', 'next': 'ପରବର୍ତ୍ତୀ', 'submit': 'ଜମା', 'close': 'ବନ୍ଦ', 'email': 'ଇମେଲ', 'password': 'ପାସୱାର୍ଡ', 'username': 'ଚାଳକ ନାମ', 'firstName': 'ପ୍ରଥମ ନାମ', 'lastName': 'ଅଧିକନାମ', 'phone': 'ଫୋନ', 'search': 'ସନ୍ଧାନ', 'filter': 'ଫିଲ୍ଟର', 'sort': 'ସାଜାଉ', 'export': 'ରପ୍ତାନି', 'import': 'ଆମଦାନୀ', 'download': 'ଡାଉନଲୋଡ', 'upload': 'ଅପଲୋଡ', 'refresh': 'ରିଫ୍ରେଶ'},
        'auth': {'login': 'ଲଗଇନ', 'signup': 'ସାଇନଅପ', 'logout': 'ଲଗଆଉଟ', 'forgotPassword': 'ପାସୱାର୍ଡ ଭୁଲିଯାଇଛେ?', 'resetPassword': 'ପାସୱାର୍ଡ ଡିଟେଲ', 'rememberMe': 'ମୋତେ ମନେ ରଖନ୍ତୁ', 'signInSecurely': 'ସୁରକ୍ଷିତ ଲଗଇନ', 'createAccount': 'ଅ୍ୟାକୋଉଂଟ ତିଆରି', 'alreadyHaveAccount': 'ପୂର୍ବରୁ ଅ୍ୟାକୋଉଂଟ ଅଛି?', 'noAccount': 'ଅ୍ୟାକୋଉଂଟ ନାହିଁ?'},
        'reseller': {'dashboard': 'ରିସେଲର ଡ୍ୟାସବୋର୍ଡ', 'earnings': 'ଆୟ', 'commissions': 'କମିଶନ', 'payouts': 'ଖଣ୍ଡ', 'referrals': 'ସୁପାରିଶ', 'leads': 'ଅବସର', 'customers': 'ଗ୍ରାହକ', 'reports': 'ରିପୋର୍ଟ', 'settings': 'ସେଟିଂସ'},
        'admin': {'dashboard': 'ପରିଚାଳକ ଡ୍ୟାସବୋର୍ଡ', 'users': 'ଚାଳକ', 'products': 'ପଣ୍ୟ', 'orders': 'ଅର୍ଡର', 'revenue': 'ଆୟ', 'settings': 'ସେଟିଂସ'},
        'validation': {'required': 'ଏହି ଖେତ ଆବଶ୍ୟକ', 'email': 'ବୈଧ ଇମେଲ ନୁହେଁ', 'password': 'ପାସୱାର୍ଡ 6+ ଅକ୍ଷର ରହିବା ଆବଶ୍ୟକ'},
        'support': {'help': 'ସାହାଯ୍ୟ', 'faq': 'ବାରମ୍ବାର ସୋଧା ଯାଇଥିବା ପ୍ରଶ୍ନ', 'contact': 'ସମ୍ପର୍କ', 'feedback': 'ମତାମତ', 'docs': 'ଡକୁମେଣ୍ଟେସନ', 'community': 'ସମ୍ପ୍ରଦାୟ', 'tutorial': 'ଟ୍ୟୁଟୋରିଆଲ'},
    },
    'ur': {  # Urdu
        'common': {'language': 'زبان', 'resellerApply': 'ری سیلر کے طور پر درخواست', 'dashboard': 'ڈیش بورڈ', 'settings': 'ترتیبات', 'logout': 'لاگ آؤٹ', 'loading': 'لوڈ ہو رہا ہے...', 'error': 'خرابی', 'success': 'کامیاب', 'save': 'محفوظ', 'cancel': 'منسوخ', 'delete': 'حذف', 'edit': 'ترمیم', 'back': 'واپس', 'next': 'اگلا', 'submit': 'جمع', 'close': 'بند', 'email': 'ای میل', 'password': 'پاس ورڈ', 'username': 'صارف نام', 'firstName': 'پہلا نام', 'lastName': 'آخری نام', 'phone': 'فون', 'search': 'تلاش', 'filter': 'فلٹر', 'sort': 'ترتیب', 'export': 'برآمد', 'import': 'درآمد', 'download': 'ڈاؤن لوڈ', 'upload': 'اپ لوڈ', 'refresh': 'تجدید'},
        'auth': {'login': 'لاگ ان', 'signup': 'سائن اپ', 'logout': 'لاگ آؤٹ', 'forgotPassword': 'پاس ورڈ بھول گئے؟', 'resetPassword': 'پاس ورڈ دوبارہ', 'rememberMe': 'مجھے یاد رکھیں', 'signInSecurely': 'محفوظ لاگ ان', 'createAccount': 'اکاؤنٹ بنائیں', 'alreadyHaveAccount': 'پہلے سے اکاؤنٹ ہے؟', 'noAccount': 'اکاؤنٹ نہیں ہے؟'},
        'reseller': {'dashboard': 'ری سیلر ڈیش بورڈ', 'earnings': 'کمائی', 'commissions': 'کمیشن', 'payouts': 'ادائیگی', 'referrals': 'حوالہ', 'leads': 'لیڈ', 'customers': 'گاہک', 'reports': 'رپورٹ', 'settings': 'ترتیبات'},
        'admin': {'dashboard': 'منتظم ڈیش بورڈ', 'users': 'صارفین', 'products': 'مصنوعات', 'orders': 'آرڈر', 'revenue': 'آمدنی', 'settings': 'ترتیبات'},
        'validation': {'required': 'یہ فیلڈ ضروری ہے', 'email': 'غلط ای میل', 'password': 'پاس ورڈ 6+ حروف ہونے چاہیے'},
        'support': {'help': 'مدد', 'faq': 'عام سوالات', 'contact': 'رابطہ', 'feedback': 'تاثرات', 'docs': 'دستاویزات', 'community': 'برادری', 'tutorial': 'ہدایت'},
    },
    'ps': {  # Pashto
        'common': {'language': 'ژبه', 'resellerApply': 'د بیرته فروش کونکي په توګه درخواستی', 'dashboard': 'کنټرول پینل', 'settings': 'سیتینگز', 'logout': 'بیرته شئ', 'loading': 'برتوال...', 'error': 'خرابي', 'success': 'بریالیتوب', 'save': 'خوندي', 'cancel': 'منسوخ', 'delete': 'حذف', 'edit': 'سمون', 'back': 'شاتیږ', 'next': 'بل', 'submit': 'واستولي', 'close': 'بند', 'email': 'ايمیل', 'password': 'پاس ورډ', 'username': 'د کارونکي نوم', 'firstName': 'لومړی نوم', 'lastName': 'کورنی نوم', 'phone': 'تلیفون', 'search': 'لټون', 'filter': 'فلتر', 'sort': 'ترتیب', 'export': 'تیر کول', 'import': 'درج کول', 'download': 'ډاونلوډ', 'upload': 'اپ لوډ', 'refresh': 'تازه کول'},
        'auth': {'login': 'ننوتل', 'signup': 'نوې کارن', 'logout': 'بیرته شئ', 'forgotPassword': 'پاس ورډ مو هیله کړئ؟', 'resetPassword': 'پاس ورډ بارگیری', 'rememberMe': 'مې په یاد ساتئ', 'signInSecurely': 'محفوظ ننوتل', 'createAccount': 'حساب رغولی', 'alreadyHaveAccount': 'حساب مو شتهء', 'noAccount': 'حساب نه شتهء'},
        'reseller': {'dashboard': 'بیرته فروش کنټرول', 'earnings': 'عايداتی', 'commissions': 'کمیشن', 'payouts': 'پیسې', 'referrals': 'سفارشاتی', 'leads': 'لیدز', 'customers': 'مشتریان', 'reports': 'راپورتونه', 'settings': 'سیتینگز'},
        'admin': {'dashboard': 'ادمین کنټرول', 'users': 'کاروونکي', 'products': 'محصولات', 'orders': 'نوبتونه', 'revenue': 'عايداتی', 'settings': 'سیتینگز'},
        'validation': {'required': 'دا ساحه ضروری ده', 'email': 'غلط ايمیل', 'password': 'پاس ورډ باید 6+ حروف وي'},
        'support': {'help': 'مرسته', 'faq': 'عام پوښتنې', 'contact': 'اتصال', 'feedback': 'نظریات', 'docs': 'دستاویزات', 'community': 'ټولنه', 'tutorial': 'درس'},
    },
    'he': {  # Hebrew
        'common': {'language': 'שפה', 'resellerApply': 'קשה כמו מוכר מחדש', 'dashboard': 'לוח בקרה', 'settings': 'הגדרות', 'logout': 'התנתקות', 'loading': 'בטעינה...', 'error': 'שגיאה', 'success': 'הצלחה', 'save': 'שמירה', 'cancel': 'ביטול', 'delete': 'מחיקה', 'edit': 'עריכה', 'back': 'חזור', 'next': 'הבא', 'submit': 'שליחה', 'close': 'סגור', 'email': 'דוא"ל', 'password': 'סיסמא', 'username': 'שם משתמש', 'firstName': 'שם פרטי', 'lastName': 'שם משפחה', 'phone': 'טלפון', 'search': 'חיפוש', 'filter': 'סינון', 'sort': 'מיון', 'export': 'ייצוא', 'import': 'ייבוא', 'download': 'הורדה', 'upload': 'העלאה', 'refresh': 'רענון'},
        'auth': {'login': 'כניסה', 'signup': 'הרשמה', 'logout': 'התנתקות', 'forgotPassword': 'שכחת סיסמא?', 'resetPassword': 'איפוס סיסמא', 'rememberMe': 'זכור אותי', 'signInSecurely': 'כניסה מאובטחת', 'createAccount': 'בחר חשבון', 'alreadyHaveAccount': 'יש לך כבר חשבון?', 'noAccount': 'אין לך חשבון?'},
        'reseller': {'dashboard': 'לוח בקרה של מוכר מחדש', 'earnings': 'הכנסות', 'commissions': 'עמלות', 'payouts': 'הוצאות', 'referrals': 'הפניות', 'leads': 'הובלה', 'customers': 'לקוחות', 'reports': 'דוחות', 'settings': 'הגדרות'},
        'admin': {'dashboard': 'לוח ניהול', 'users': 'משתמשים', 'products': 'מוצרים', 'orders': 'הזמנות', 'revenue': 'הכנסות', 'settings': 'הגדרות'},
        'validation': {'required': 'שדה זה נדרש', 'email': 'דוא"ל לא תקין', 'password': 'הסיסמא חייבת להיות 6+ תווים'},
        'support': {'help': 'עזרה', 'faq': 'שאלות נפוצות', 'contact': 'צור קשר', 'feedback': 'משוב', 'docs': 'תיעוד', 'community': 'קהילה', 'tutorial': 'הדרכה'},
    },
};

# Read the current i18n file
with open('src/lib/i18n.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the last language entry position (before 'i18n.use')
insert_pos = content.find('i18n.use(initReactI18next)')
if insert_pos == -1:
    print('❌ Could not find insertion point')
    exit(1)

# Find the last language object closure
messages_section_end = content.rfind('},', 0, insert_pos)
if messages_section_end == -1:
    print('❌ Could not find messages section')
    exit(1)

# Build new language entries
new_entries = []
for lang_code, translations in phase2_translations.items():
    # Skip if language already exists
    if f"  {lang_code}:" in content:
        continue
    
    # Format translation object
    entry = f'\n  {lang_code}: {json.dumps(translations, ensure_ascii=False)}'
    entry = entry.replace('", "', '", "').replace(': {', ': {').replace('}, ', '}, ')
    new_entries.append(entry)

if not new_entries:
    print('✓ Phase 2 languages already added!')
    exit(0)

# Add entries before the closing brace
insert_point = content.rfind('},', 0, insert_pos)
new_content = content[:insert_point + 1] + ',' + ''.join(new_entries) + content[insert_point + 1:]

# Write back
with open('src/lib/i18n.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f'✓ Added {len(new_entries)} Phase 2 languages')
print('✓ File updated successfully')
print('✓ Ready for build!')
