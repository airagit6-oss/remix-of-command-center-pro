const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'src/lib/i18n.tsx');
let content = fs.readFileSync(i18nPath, 'utf8');

const supportTranslations = {
  hi: `, support: { supportCenter: 'समर्थन केंद्र', supportDesc: 'हम आपकी मदद के लिए यहाँ हैं। FAQ ब्राउज़ करें या हमें संदेश भेजें।', emailSupport: 'ईमेल समर्थन', liveChat: 'लाइव चैट', chatHours: '9am–6pm IST उपलब्ध', chatMsg: 'लाइव चैट 9am–6pm IST उपलब्ध है। इस बीच हमें ईमेल भेजें।', documentation: 'दस्तावेज़', browseDocs: 'हमारे दस्तावेज़ ब्राउज़ करें', faq: 'अक्सर पूछे जाने वाले प्रश्न', faqQ1: 'मैं अपनी खरीदी गई एप्लिकेशन तक कैसे पहुंच सकता हूं?', faqA1: 'डैशबोर्ड → मेरी एप्लिकेशन पर जाएं और किसी भी एप्लिकेशन को चलाने के लिए क्लिक करें।', faqQ2: 'क्या मैं अपनी सदस्यता रद्द कर सकता हूं?', faqA2: 'हाँ, डैशबोर्ड → सदस्यता पर जाएं और रद्द करें पर क्लिक करें। आप बिलिंग अवधि के अंत तक पहुंच बनाए रखते हैं।', faqQ3: 'क्या कोई निःशुल्क परीक्षण है?', faqA3: 'हाँ, सभी योजनाओं में 14 दिन का निःशुल्क परीक्षण शामिल है। क्रेडिट कार्ड की आवश्यकता नहीं है।', faqQ4: 'रीसेलर प्रोग्राम कैसे काम करता है?', faqA4: '/reseller-apply पर आवेदन करें, अपना रेफरल लिंक प्राप्त करें, और प्रत्येक बिक्रय से 30% कमीशन अर्जित करें।', faqQ5: 'आप कौन से भुगतान तरीके स्वीकार करते हैं?', faqA5: 'हम सभी प्रमुख क्रेडिट/डेबिट कार्ड, PayPal और UPI स्वीकार करते हैं।', sendMessage: 'हमें संदेश भेजें', messageSent: 'संदेश भेज दिया गया!', replyTime: 'हम 24 घंटे में जवाब देंगे।', name: 'नाम', yourName: 'आपका नाम', message: 'संदेश', howCanWeHelp: 'हम कैसे मदद कर सकते हैं?', nameRequired: 'कृपया अपना नाम दर्ज करें', validEmail: 'कृपया वैध ईमेल दर्ज करें', messageShort: 'संदेश बहुत छोटा है', messageSentSuccess: 'संदेश भेज दिया गया' }`,
  ar: `, support: { supportCenter: 'مركز الدعم', supportDesc: 'نحن هنا لمساعدتك. تصفح الأسئلة الشائعة أو أرسل لنا رسالة.', emailSupport: 'دعم البريد الإلكتروني', liveChat: 'الدردشة المباشرة', chatHours: 'متاح 9am–6pm IST', chatMsg: 'الدردشة المباشرة متاحة من 9am إلى 6pm IST. أرسل لنا بريدًا إلكترونيًا في غضون ذلك.', documentation: 'التوثيق', browseDocs: 'استعرض توثيقنا', faq: 'الأسئلة الشائعة', faqQ1: 'كيف يمكنني الوصول إلى التطبيقات التي اشتريتها؟', faqA1: 'انتقل إلى لوحة التحكم → تطبيقاتي وانقر على أي تطبيق لتشغيله.', faqQ2: 'هل يمكنني إلغاء اشتراكي؟', faqA2: 'نعم، انتقل إلى لوحة التحكم → الاشتراك وانقر على إلغاء. تحتفظ بالوصول حتى نهاية فترة الفواتير.', faqQ3: 'هل هناك نسخة تجريبية مجانية؟', faqA3: 'نعم، تتضمن جميع الخطط نسخة تجريبية مجانية لمدة 14 يومًا. لا حاجة لبطاقة ائتمان.', faqQ4: 'كيف يعمل برنامج الموزع؟', faqA4: 'تقديم الطلب على /reseller-apply، والحصول على رابط الإحالة الخاص بك، واكسب عمولة بنسبة 30% من كل عملية بيع.', faqQ5: 'ما طرق الدفع التي تقبلونها؟', faqA5: 'نقبل جميع بطاقات الائتمان/الخصم الرئيسية و PayPal و UPI.', sendMessage: 'أرسل لنا رسالة', messageSent: 'تم إرسال الرسالة!', replyTime: 'سنرد عليك في غضون 24 ساعة.', name: 'الاسم', yourName: 'اسمك', message: 'الرسالة', howCanWeHelp: 'كيف يمكننا مساعدتك؟', nameRequired: 'يرجى إدخال اسمك', validEmail: 'يرجى إدخال بريد إلكتروني صحيح', messageShort: 'الرسالة قصيرة جدا', messageSentSuccess: 'تم إرسال الرسالة' }`
};

// Find and add support to hi
const hiPattern = /hi: \{ common:.*?validation: \{.*?\} \},/;
if (content.match(hiPattern)) {
  content = content.replace(
    hiPattern,
    match => match.slice(0, -2) + supportTranslations.hi + ' },'
  );
  console.log('✓ Added support translations to Hindi (hi)');
} else {
  console.log('✗ Could not find Hindi entry pattern');
}

// Find and add support to ar
const arPattern = /ar: \{ common:.*?validation: \{.*?\} \},/;
if (content.match(arPattern)) {
  content = content.replace(
    arPattern,
    match => match.slice(0, -2) + supportTranslations.ar + ' },'
  );
  console.log('✓ Added support translations to Arabic (ar)');
} else {
  console.log('✗ Could not find Arabic entry pattern');
}

fs.writeFileSync(i18nPath, content, 'utf8');
console.log('✓ File updated successfully');
