// src/i18n/translations.ts
// Multilingual UI strings for Sakhi Platform

export type LangCode = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr' | 'gu' | 'pa' | 'ml';

export interface Translations {
  // Nav
  nav_explore: string;
  nav_write: string;
  nav_saved: string;
  nav_login: string;
  nav_join: string;
  nav_logout: string;

  // Hero
  hero_eyebrow: string;
  hero_h1_line1: string;
  hero_h1_em: string;
  hero_h1_line2: string;
  hero_h1_line3: string;
  hero_desc: string;
  hero_cta_explore: string;
  hero_cta_share: string;

  // Sections
  section_categories: string;
  section_categories_title: string;
  section_featured: string;
  section_featured_title: string;
  section_latest: string;
  section_latest_title: string;
  see_all: string;

  // Skills
  skill_read_time: string;
  skill_saves: string;
  skill_views: string;
  skill_min_read: string;
  skill_save: string;
  skill_saved: string;
  skill_responses: string;
  skill_add_response: string;
  skill_post_response: string;

  // Write
  write_title_placeholder: string;
  write_subtitle_placeholder: string;
  write_body_placeholder: string;
  write_publish: string;
  write_preview: string;
  write_tags_placeholder: string;

  // CTA Banner
  cta_devanagari: string;
  cta_title: string;
  cta_desc: string;
  cta_btn: string;

  // Auth
  login_title: string;
  login_subtitle: string;
  register_title: string;
  register_subtitle: string;

  // Analytics
  analytics_title: string;
  analytics_total_views: string;
  analytics_total_saves: string;
  analytics_total_skills: string;
  analytics_total_comments: string;

  // Voice
  voice_record: string;
  voice_recording: string;
  voice_stop: string;
  voice_play: string;
  voice_upload: string;
  voice_notes: string;
  voice_add: string;
}

export const translations: Record<LangCode, Translations> = {
  en: {
    nav_explore: 'Explore', nav_write: 'Write', nav_saved: 'Saved',
    nav_login: 'Login', nav_join: 'Join Sakhi', nav_logout: 'Logout',
    hero_eyebrow: 'By Women · For Women · Across India',
    hero_h1_line1: 'Knowledge', hero_h1_em: 'woven',
    hero_h1_line2: 'from real hands,', hero_h1_line3: 'real homes.',
    hero_desc: 'Sakhi is where women across India share what they\'ve learned — recipes from grandmothers, remedies that actually work, crafts made from what\'s around you.',
    hero_cta_explore: 'Explore skills', hero_cta_share: 'Share yours',
    section_categories: 'Browse', section_categories_title: 'What are you looking for?',
    section_featured: "Editor's picks", section_featured_title: 'Stories worth reading slowly',
    section_latest: 'Latest', section_latest_title: 'Fresh from the community',
    see_all: 'See all',
    skill_read_time: 'min read', skill_saves: 'saves', skill_views: 'views',
    skill_min_read: 'min read', skill_save: 'Save', skill_saved: 'Saved',
    skill_responses: 'responses', skill_add_response: 'Share your experience...',
    skill_post_response: 'Post response',
    write_title_placeholder: 'e.g. How I make dal without soaking overnight',
    write_subtitle_placeholder: 'A short description that makes people want to read...',
    write_body_placeholder: 'Write your skill here. Tell the story, list the ingredients, explain the steps...',
    write_publish: 'Publish skill', write_preview: 'Preview',
    write_tags_placeholder: 'e.g. rajma, shortcut, north-indian',
    cta_devanagari: 'आप भी जानती हैं कुछ खास',
    cta_title: 'You know something no one else does',
    cta_desc: 'A recipe, a remedy, a craft — the knowledge you carry is worth sharing.',
    cta_btn: 'Start sharing today',
    login_title: 'Welcome back', login_subtitle: 'Sign in to your Sakhi account',
    register_title: 'Join Sakhi', register_subtitle: 'Share your knowledge with women across India',
    analytics_title: 'Your Analytics', analytics_total_views: 'Total Views',
    analytics_total_saves: 'Total Saves', analytics_total_skills: 'Skills Published',
    analytics_total_comments: 'Comments Received',
    voice_record: 'Record', voice_recording: 'Recording...', voice_stop: 'Stop',
    voice_play: 'Play', voice_upload: 'Upload audio', voice_notes: 'Voice Notes', voice_add: 'Add voice note',
  },
  hi: {
    nav_explore: 'खोजें', nav_write: 'लिखें', nav_saved: 'सहेजे',
    nav_login: 'लॉगिन', nav_join: 'सखी से जुड़ें', nav_logout: 'लॉगआउट',
    hero_eyebrow: 'महिलाओं द्वारा · महिलाओं के लिए · पूरे भारत में',
    hero_h1_line1: 'ज्ञान', hero_h1_em: 'बुना हुआ',
    hero_h1_line2: 'असली हाथों से,', hero_h1_line3: 'असली घरों से।',
    hero_desc: 'सखी वह जगह है जहाँ भारत भर की महिलाएँ अपना सीखा हुआ साझा करती हैं — नानी की रेसिपी, काम करने वाले घरेलू नुस्खे, आसपास की चीज़ों से बनाई कारीगरी।',
    hero_cta_explore: 'कौशल खोजें', hero_cta_share: 'अपना साझा करें',
    section_categories: 'श्रेणियाँ', section_categories_title: 'आप क्या ढूंढ रही हैं?',
    section_featured: 'संपादक की पसंद', section_featured_title: 'धीरे पढ़ने लायक कहानियाँ',
    section_latest: 'नया', section_latest_title: 'समुदाय से ताज़ा',
    see_all: 'सब देखें',
    skill_read_time: 'मिनट पढ़ाई', skill_saves: 'सहेजे', skill_views: 'बार देखा',
    skill_min_read: 'मिनट पढ़ाई', skill_save: 'सहेजें', skill_saved: 'सहेजा गया',
    skill_responses: 'प्रतिक्रियाएँ', skill_add_response: 'अपना अनुभव साझा करें...',
    skill_post_response: 'प्रतिक्रिया डालें',
    write_title_placeholder: 'जैसे: मैं बिना भिगोए राजमा कैसे बनाती हूँ',
    write_subtitle_placeholder: 'एक छोटा विवरण जो लोगों को पढ़ने पर मजबूर करे...',
    write_body_placeholder: 'अपना कौशल यहाँ लिखें। कहानी बताएं, सामग्री की सूची दें, चरण समझाएं...',
    write_publish: 'कौशल प्रकाशित करें', write_preview: 'पूर्वावलोकन',
    write_tags_placeholder: 'जैसे: राजमा, शॉर्टकट, उत्तर-भारतीय',
    cta_devanagari: 'आप भी जानती हैं कुछ खास',
    cta_title: 'आप कुछ ऐसा जानती हैं जो और कोई नहीं जानता',
    cta_desc: 'एक रेसिपी, एक नुस्खा, एक कारीगरी — आपका ज्ञान साझा करने योग्य है।',
    cta_btn: 'आज ही साझा करना शुरू करें',
    login_title: 'वापस स्वागत है', login_subtitle: 'अपने सखी खाते में लॉगिन करें',
    register_title: 'सखी से जुड़ें', register_subtitle: 'पूरे भारत की महिलाओं के साथ अपना ज्ञान साझा करें',
    analytics_title: 'आपका विश्लेषण', analytics_total_views: 'कुल दर्शन',
    analytics_total_saves: 'कुल सहेजे', analytics_total_skills: 'प्रकाशित कौशल',
    analytics_total_comments: 'प्राप्त टिप्पणियाँ',
    voice_record: 'रिकॉर्ड करें', voice_recording: 'रिकॉर्डिंग...', voice_stop: 'रोकें',
    voice_play: 'चलाएँ', voice_upload: 'ऑडियो अपलोड करें', voice_notes: 'वॉयस नोट्स', voice_add: 'वॉयस नोट जोड़ें',
  },
  bn: {
    nav_explore: 'অন্বেষণ', nav_write: 'লিখুন', nav_saved: 'সংরক্ষিত',
    nav_login: 'লগইন', nav_join: 'সখীতে যোগ দিন', nav_logout: 'লগআউট',
    hero_eyebrow: 'নারীদের দ্বারা · নারীদের জন্য · সমগ্র ভারতে',
    hero_h1_line1: 'জ্ঞান', hero_h1_em: 'বোনা',
    hero_h1_line2: 'আসল হাত থেকে,', hero_h1_line3: 'আসল ঘর থেকে।',
    hero_desc: 'সখী সেই জায়গা যেখানে সারা ভারতের নারীরা তাদের শেখা জ্ঞান ভাগ করে নেন।',
    hero_cta_explore: 'দক্ষতা খুঁজুন', hero_cta_share: 'আপনারটা শেয়ার করুন',
    section_categories: 'বিভাগ', section_categories_title: 'আপনি কী খুঁজছেন?',
    section_featured: 'সম্পাদকের পছন্দ', section_featured_title: 'ধীরে পড়ার মতো গল্প',
    section_latest: 'সর্বশেষ', section_latest_title: 'সম্প্রদায় থেকে তাজা',
    see_all: 'সব দেখুন',
    skill_read_time: 'মিনিট পড়া', skill_saves: 'সংরক্ষিত', skill_views: 'দর্শন',
    skill_min_read: 'মিনিট পড়া', skill_save: 'সংরক্ষণ', skill_saved: 'সংরক্ষিত',
    skill_responses: 'প্রতিক্রিয়া', skill_add_response: 'আপনার অভিজ্ঞতা শেয়ার করুন...',
    skill_post_response: 'প্রতিক্রিয়া পোস্ট করুন',
    write_title_placeholder: 'যেমন: আমি কিভাবে রাজমা ভিজিয়ে না রেখেই বানাই',
    write_subtitle_placeholder: 'একটি সংক্ষিপ্ত বিবরণ...',
    write_body_placeholder: 'আপনার দক্ষতা এখানে লিখুন...',
    write_publish: 'দক্ষতা প্রকাশ করুন', write_preview: 'পূর্বরূপ',
    write_tags_placeholder: 'যেমন: রাজমা, শর্টকাট, উত্তর-ভারতীয়',
    cta_devanagari: 'আপনিও জানেন কিছু বিশেষ',
    cta_title: 'আপনি এমন কিছু জানেন যা অন্য কেউ জানে না',
    cta_desc: 'একটি রেসিপি, একটি প্রতিকার, একটি কারুশিল্প — আপনার জ্ঞান শেয়ার করার যোগ্য।',
    cta_btn: 'আজই শেয়ার শুরু করুন',
    login_title: 'স্বাগতম', login_subtitle: 'আপনার সখী অ্যাকাউন্টে লগইন করুন',
    register_title: 'সখীতে যোগ দিন', register_subtitle: 'সারা ভারতের নারীদের সাথে জ্ঞান ভাগ করুন',
    analytics_title: 'আপনার বিশ্লেষণ', analytics_total_views: 'মোট দর্শন',
    analytics_total_saves: 'মোট সংরক্ষণ', analytics_total_skills: 'প্রকাশিত দক্ষতা',
    analytics_total_comments: 'প্রাপ্ত মন্তব্য',
    voice_record: 'রেকর্ড', voice_recording: 'রেকর্ডিং...', voice_stop: 'থামুন',
    voice_play: 'চালান', voice_upload: 'অডিও আপলোড', voice_notes: 'ভয়েস নোট', voice_add: 'ভয়েস নোট যোগ করুন',
  },
  te: {
    nav_explore: 'అన్వేషించండి', nav_write: 'రాయండి', nav_saved: 'సేవ్ చేసినవి',
    nav_login: 'లాగిన్', nav_join: 'సఖికి చేరండి', nav_logout: 'లాగ్అవుట్',
    hero_eyebrow: 'మహిళలచే · మహిళల కోసం · భారతదేశం అంతటా',
    hero_h1_line1: 'జ్ఞానం', hero_h1_em: 'అల్లిన',
    hero_h1_line2: 'నిజమైన చేతులతో,', hero_h1_line3: 'నిజమైన ఇళ్ళనుండి.',
    hero_desc: 'సఖి అనేది భారతదేశం అంతటా మహిళలు తాము నేర్చుకున్నదాన్ని పంచుకునే స్థలం.',
    hero_cta_explore: 'నైపుణ్యాలు అన్వేషించండి', hero_cta_share: 'మీది పంచుకోండి',
    section_categories: 'వర్గాలు', section_categories_title: 'మీరు ఏమి వెతుకుతున్నారు?',
    section_featured: 'ఎడిటర్ ఎంపిక', section_featured_title: 'నెమ్మదిగా చదవదగిన కథలు',
    section_latest: 'తాజా', section_latest_title: 'సమాజం నుండి తాజా',
    see_all: 'అన్నీ చూడండి',
    skill_read_time: 'నిమిషాల పఠనం', skill_saves: 'సేవ్', skill_views: 'వీక్షణలు',
    skill_min_read: 'నిమిషాల పఠనం', skill_save: 'సేవ్', skill_saved: 'సేవ్ అయింది',
    skill_responses: 'స్పందనలు', skill_add_response: 'మీ అనుభవం పంచుకోండి...',
    skill_post_response: 'స్పందన పోస్ట్ చేయండి',
    write_title_placeholder: 'ఉదా: నేను రాజ్మాను నానబెట్టకుండా ఎలా చేస్తాను',
    write_subtitle_placeholder: 'చదవాలనిపించే చిన్న వివరణ...',
    write_body_placeholder: 'మీ నైపుణ్యాన్ని ఇక్కడ రాయండి...',
    write_publish: 'నైపుణ్యాన్ని ప్రచురించండి', write_preview: 'ప్రివ్యూ',
    write_tags_placeholder: 'ఉదా: రాజ్మా, షార్ట్‌కట్, ఉత్తర-భారత',
    cta_devanagari: 'మీకు కూడా ఏదో ప్రత్యేకమైనది తెలుసు',
    cta_title: 'మీకు మరొకరికి తెలియనిది తెలుసు',
    cta_desc: 'ఒక వంట, ఒక నివారణ, ఒక హస్తకళ — మీ జ్ఞానం పంచుకోవడానికి అర్హమైనది.',
    cta_btn: 'ఈరోజే పంచుకోవడం ప్రారంభించండి',
    login_title: 'తిరిగి స్వాగతం', login_subtitle: 'మీ సఖి ఖాతాలోకి లాగిన్ అవ్వండి',
    register_title: 'సఖికి చేరండి', register_subtitle: 'భారతదేశం అంతటా మహిళలతో జ్ఞానం పంచుకోండి',
    analytics_title: 'మీ విశ్లేషణలు', analytics_total_views: 'మొత్తం వీక్షణలు',
    analytics_total_saves: 'మొత్తం సేవ్', analytics_total_skills: 'ప్రచురించిన నైపుణ్యాలు',
    analytics_total_comments: 'వచ్చిన వ్యాఖ్యలు',
    voice_record: 'రికార్డ్', voice_recording: 'రికార్డింగ్...', voice_stop: 'ఆపండి',
    voice_play: 'ప్లే', voice_upload: 'ఆడియో అప్‌లోడ్', voice_notes: 'వాయిస్ నోట్స్', voice_add: 'వాయిస్ నోట్ జోడించండి',
  },
  ta: {
    nav_explore: 'ஆராயுங்கள்', nav_write: 'எழுதுங்கள்', nav_saved: 'சேமித்தவை',
    nav_login: 'உள்நுழைக', nav_join: 'சகியில் சேருங்கள்', nav_logout: 'வெளியேறு',
    hero_eyebrow: 'பெண்களால் · பெண்களுக்காக · இந்தியா முழுவதும்',
    hero_h1_line1: 'அறிவு', hero_h1_em: 'நெய்யப்பட்டது',
    hero_h1_line2: 'உண்மையான கைகளால்,', hero_h1_line3: 'உண்மையான வீடுகளிலிருந்து.',
    hero_desc: 'சகி என்பது இந்தியா முழுவதும் உள்ள பெண்கள் தாங்கள் கற்றதை பகிர்ந்துகொள்ளும் இடம்.',
    hero_cta_explore: 'திறன்களை ஆராயுங்கள்', hero_cta_share: 'உங்களையும் பகிருங்கள்',
    section_categories: 'வகைகள்', section_categories_title: 'நீங்கள் என்ன தேடுகிறீர்கள்?',
    section_featured: 'ஆசிரியர் தேர்வு', section_featured_title: 'மெதுவாக படிக்க வேண்டிய கதைகள்',
    section_latest: 'புதியது', section_latest_title: 'சமூகத்திலிருந்து புதியது',
    see_all: 'எல்லாவற்றையும் பார்',
    skill_read_time: 'நிமிட வாசிப்பு', skill_saves: 'சேமிப்புகள்', skill_views: 'பார்வைகள்',
    skill_min_read: 'நிமிட வாசிப்பு', skill_save: 'சேமி', skill_saved: 'சேமிக்கப்பட்டது',
    skill_responses: 'பதில்கள்', skill_add_response: 'உங்கள் அனுபவத்தை பகிருங்கள்...',
    skill_post_response: 'பதில் இடுங்கள்',
    write_title_placeholder: 'எ.கா: ஊறவைக்காமல் ராஜ்மா எப்படி செய்கிறேன்',
    write_subtitle_placeholder: 'படிக்க வைக்கும் சிறு விளக்கம்...',
    write_body_placeholder: 'உங்கள் திறனை இங்கே எழுதுங்கள்...',
    write_publish: 'திறனை வெளியிடுங்கள்', write_preview: 'முன்னோட்டம்',
    write_tags_placeholder: 'எ.கா: ராஜ்மா, குறுக்குவழி, வட-இந்திய',
    cta_devanagari: 'உங்களுக்கும் ஏதோ சிறப்பு தெரியும்',
    cta_title: 'வேறு யாருக்கும் தெரியாத ஏதோ உங்களுக்கு தெரியும்',
    cta_desc: 'ஒரு செய்முறை, ஒரு மருந்து, ஒரு கலை — உங்கள் அறிவை பகிர்வது மதிப்பானது.',
    cta_btn: 'இன்றே பகிர தொடங்குங்கள்',
    login_title: 'மீண்டும் வரவேற்கிறோம்', login_subtitle: 'உங்கள் சகி கணக்கில் உள்நுழையுங்கள்',
    register_title: 'சகியில் சேருங்கள்', register_subtitle: 'இந்தியா முழுவதும் பெண்களுடன் அறிவை பகிருங்கள்',
    analytics_title: 'உங்கள் பகுப்பாய்வு', analytics_total_views: 'மொத்த பார்வைகள்',
    analytics_total_saves: 'மொத்த சேமிப்புகள்', analytics_total_skills: 'வெளியிட்ட திறன்கள்',
    analytics_total_comments: 'பெற்ற கருத்துக்கள்',
    voice_record: 'பதிவு', voice_recording: 'பதிவு செய்கிறது...', voice_stop: 'நிறுத்து',
    voice_play: 'இயக்கு', voice_upload: 'ஆடியோ பதிவேற்று', voice_notes: 'குரல் குறிப்புகள்', voice_add: 'குரல் குறிப்பு சேர்',
  },
  mr: {
    nav_explore: 'शोधा', nav_write: 'लिहा', nav_saved: 'जतन केलेले',
    nav_login: 'लॉगिन', nav_join: 'सखीत सामील व्हा', nav_logout: 'लॉगआउट',
    hero_eyebrow: 'महिलांकडून · महिलांसाठी · संपूर्ण भारतात',
    hero_h1_line1: 'ज्ञान', hero_h1_em: 'विणलेले',
    hero_h1_line2: 'खऱ्या हातांनी,', hero_h1_line3: 'खऱ्या घरांतून.',
    hero_desc: 'सखी ही जागा आहे जिथे भारतभरातील महिला त्यांनी शिकलेले सांगतात.',
    hero_cta_explore: 'कौशल्ये शोधा', hero_cta_share: 'तुमचे सांगा',
    section_categories: 'श्रेणी', section_categories_title: 'तुम्हाला काय हवे आहे?',
    section_featured: 'संपादकाची निवड', section_featured_title: 'सावकाश वाचण्यासारख्या गोष्टी',
    section_latest: 'नवीन', section_latest_title: 'समुदायाकडून ताजे',
    see_all: 'सगळे पहा',
    skill_read_time: 'मिनिट वाचन', skill_saves: 'जतन', skill_views: 'दर्शने',
    skill_min_read: 'मिनिट वाचन', skill_save: 'जतन करा', skill_saved: 'जतन केले',
    skill_responses: 'प्रतिसाद', skill_add_response: 'तुमचा अनुभव सांगा...',
    skill_post_response: 'प्रतिसाद द्या',
    write_title_placeholder: 'उदा: मी राजमा न भिजवता कसा बनवतो',
    write_subtitle_placeholder: 'वाचायला प्रवृत्त करणारे छोटे वर्णन...',
    write_body_placeholder: 'तुमचे कौशल्य येथे लिहा...',
    write_publish: 'कौशल्य प्रकाशित करा', write_preview: 'पूर्वावलोकन',
    write_tags_placeholder: 'उदा: राजमा, शॉर्टकट, उत्तर-भारतीय',
    cta_devanagari: 'तुम्हालाही काहीतरी खास माहित आहे',
    cta_title: 'तुम्हाला असे काहीतरी माहित आहे जे इतर कोणाला नाही',
    cta_desc: 'एक पाककृती, एक उपाय, एक कारागिरी — तुमचे ज्ञान सांगण्यासारखे आहे.',
    cta_btn: 'आजच सांगायला सुरुवात करा',
    login_title: 'पुन्हा स्वागत', login_subtitle: 'तुमच्या सखी खात्यात लॉगिन करा',
    register_title: 'सखीत सामील व्हा', register_subtitle: 'भारतभरातील महिलांसोबत ज्ञान सांगा',
    analytics_title: 'तुमचे विश्लेषण', analytics_total_views: 'एकूण दर्शने',
    analytics_total_saves: 'एकूण जतन', analytics_total_skills: 'प्रकाशित कौशल्ये',
    analytics_total_comments: 'मिळालेले प्रतिसाद',
    voice_record: 'रेकॉर्ड', voice_recording: 'रेकॉर्डिंग...', voice_stop: 'थांबा',
    voice_play: 'प्ले', voice_upload: 'ऑडिओ अपलोड', voice_notes: 'व्हॉईस नोट्स', voice_add: 'व्हॉईस नोट जोडा',
  },
  gu: {
    nav_explore: 'શોધો', nav_write: 'લખો', nav_saved: 'સાચવેલ',
    nav_login: 'લૉગિન', nav_join: 'સખીમાં જોડાઓ', nav_logout: 'લૉગઆઉટ',
    hero_eyebrow: 'મહિલાઓ દ્વારા · મહિલાઓ માટે · સમગ્ર ભારતમાં',
    hero_h1_line1: 'જ્ઞાન', hero_h1_em: 'ગૂંથેલ',
    hero_h1_line2: 'સાચા હાથો વડે,', hero_h1_line3: 'સાચા ઘરોમાંથી.',
    hero_desc: 'સખી એ સ્થળ છે જ્યાં ભારતભરની મહિલાઓ તેઓ જે શીખ્યા છે તે શેર કરે છે.',
    hero_cta_explore: 'કૌશળ્ય શોધો', hero_cta_share: 'તમારું શેર કરો',
    section_categories: 'શ્રેણીઓ', section_categories_title: 'તમે શું શોધી રહ્યા છો?',
    section_featured: 'સંપાદકની પસંદ', section_featured_title: 'ધીમે ધીમે વાંચવાની વાર્તાઓ',
    section_latest: 'તાજું', section_latest_title: 'સમુદાય તરફથી તાજું',
    see_all: 'બધું જુઓ',
    skill_read_time: 'મિનિટ વાંચન', skill_saves: 'સાચવ્યા', skill_views: 'જોવાઈ',
    skill_min_read: 'મિનિટ વાંચન', skill_save: 'સાચવો', skill_saved: 'સાચવ્યું',
    skill_responses: 'પ્રતિભાવ', skill_add_response: 'તમારો અનુભવ શેર કરો...',
    skill_post_response: 'પ્રતિભાવ આપો',
    write_title_placeholder: 'ઉ.દા: હું ભીંજવ્યા વગર રાજમા કેવી રીતે બનાવું',
    write_subtitle_placeholder: 'વાંચવા પ્રેરે તેવું ટૂંકું વર્ણન...',
    write_body_placeholder: 'તમારું કૌશળ્ય અહીં લખો...',
    write_publish: 'કૌશળ્ય પ્રકાશિત કરો', write_preview: 'પૂર્વાવલોકન',
    write_tags_placeholder: 'ઉ.દા: રાજમા, શૉર્ટકટ, ઉત્તર-ભારતીય',
    cta_devanagari: 'તમને પણ કંઈ ખાસ ખબર છે',
    cta_title: 'તમને એવું કંઈ ખબર છે જે બીજા કોઈને ખબર નથી',
    cta_desc: 'એક રેસિપી, એક ઉપાય, એક હસ્તકળા — તમારું જ્ઞાન શેર કરવા યોગ્ય છે.',
    cta_btn: 'આજે જ શેર કરવાનું શરૂ કરો',
    login_title: 'ફરી સ્વાગત છે', login_subtitle: 'તમારા સખી એકાઉન્ટમાં લૉગિન કરો',
    register_title: 'સખીમાં જોડાઓ', register_subtitle: 'ભારતભરની મહિલાઓ સાથે જ્ઞાન શેર કરો',
    analytics_title: 'તમારું વિશ્લેષણ', analytics_total_views: 'કુલ જોવાઈ',
    analytics_total_saves: 'કુલ સાચવ્યા', analytics_total_skills: 'પ્રકાશિત કૌશળ્ય',
    analytics_total_comments: 'મળેલ ટિપ્પણીઓ',
    voice_record: 'રેકોર્ડ', voice_recording: 'રેકોર્ડ થઈ રહ્યું...', voice_stop: 'થોભો',
    voice_play: 'ચલાવો', voice_upload: 'ઑડિઓ અપલોડ', voice_notes: 'વૉઇસ નોટ્સ', voice_add: 'વૉઇસ નોટ ઉમેરો',
  },
  pa: {
    nav_explore: 'ਖੋਜੋ', nav_write: 'ਲਿਖੋ', nav_saved: 'ਸੁਰੱਖਿਅਤ',
    nav_login: 'ਲੌਗਇਨ', nav_join: 'ਸਖੀ ਨਾਲ ਜੁੜੋ', nav_logout: 'ਲੌਗਆਊਟ',
    hero_eyebrow: 'ਔਰਤਾਂ ਦੁਆਰਾ · ਔਰਤਾਂ ਲਈ · ਪੂਰੇ ਭਾਰਤ ਵਿੱਚ',
    hero_h1_line1: 'ਗਿਆਨ', hero_h1_em: 'ਬੁਣਿਆ',
    hero_h1_line2: 'ਅਸਲ ਹੱਥਾਂ ਤੋਂ,', hero_h1_line3: 'ਅਸਲ ਘਰਾਂ ਤੋਂ।',
    hero_desc: 'ਸਖੀ ਉਹ ਥਾਂ ਹੈ ਜਿੱਥੇ ਪੂਰੇ ਭਾਰਤ ਦੀਆਂ ਔਰਤਾਂ ਆਪਣਾ ਸਿੱਖਿਆ ਸਾਂਝਾ ਕਰਦੀਆਂ ਹਨ।',
    hero_cta_explore: 'ਹੁਨਰ ਖੋਜੋ', hero_cta_share: 'ਆਪਣਾ ਸਾਂਝਾ ਕਰੋ',
    section_categories: 'ਸ਼੍ਰੇਣੀਆਂ', section_categories_title: 'ਤੁਸੀਂ ਕੀ ਲੱਭ ਰਹੇ ਹੋ?',
    section_featured: 'ਸੰਪਾਦਕ ਦੀ ਪਸੰਦ', section_featured_title: 'ਧੀਰੇ ਪੜ੍ਹਨ ਯੋਗ ਕਹਾਣੀਆਂ',
    section_latest: 'ਨਵਾਂ', section_latest_title: 'ਭਾਈਚਾਰੇ ਤੋਂ ਤਾਜ਼ਾ',
    see_all: 'ਸਭ ਦੇਖੋ',
    skill_read_time: 'ਮਿੰਟ ਪੜ੍ਹਨ', skill_saves: 'ਸੁਰੱਖਿਅਤ', skill_views: 'ਦ੍ਰਿਸ਼',
    skill_min_read: 'ਮਿੰਟ ਪੜ੍ਹਨ', skill_save: 'ਸੁਰੱਖਿਅਤ ਕਰੋ', skill_saved: 'ਸੁਰੱਖਿਅਤ',
    skill_responses: 'ਜਵਾਬ', skill_add_response: 'ਆਪਣਾ ਤਜਰਬਾ ਸਾਂਝਾ ਕਰੋ...',
    skill_post_response: 'ਜਵਾਬ ਦਿਓ',
    write_title_placeholder: 'ਜਿਵੇਂ: ਮੈਂ ਰਾਜਮਾ ਭਿਓਏ ਬਿਨਾਂ ਕਿਵੇਂ ਬਣਾਉਂਦੀ ਹਾਂ',
    write_subtitle_placeholder: 'ਪੜ੍ਹਨ ਲਈ ਉਤਸ਼ਾਹਿਤ ਕਰਨ ਵਾਲਾ ਛੋਟਾ ਵਰਣਨ...',
    write_body_placeholder: 'ਆਪਣਾ ਹੁਨਰ ਇੱਥੇ ਲਿਖੋ...',
    write_publish: 'ਹੁਨਰ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ', write_preview: 'ਪੂਰਵਦਰਸ਼ਨ',
    write_tags_placeholder: 'ਜਿਵੇਂ: ਰਾਜਮਾ, ਸ਼ਾਰਟਕੱਟ, ਉੱਤਰੀ-ਭਾਰਤੀ',
    cta_devanagari: 'ਤੁਸੀਂ ਵੀ ਕੁਝ ਖਾਸ ਜਾਣਦੇ ਹੋ',
    cta_title: 'ਤੁਸੀਂ ਕੁਝ ਅਜਿਹਾ ਜਾਣਦੇ ਹੋ ਜੋ ਕੋਈ ਹੋਰ ਨਹੀਂ ਜਾਣਦਾ',
    cta_desc: 'ਇੱਕ ਨੁਸਖਾ, ਇੱਕ ਦਵਾਈ, ਇੱਕ ਕਲਾ — ਤੁਹਾਡਾ ਗਿਆਨ ਸਾਂਝਾ ਕਰਨ ਯੋਗ ਹੈ।',
    cta_btn: 'ਅੱਜ ਸਾਂਝਾ ਕਰਨਾ ਸ਼ੁਰੂ ਕਰੋ',
    login_title: 'ਵਾਪਸ ਜੀ ਆਇਆਂ', login_subtitle: 'ਆਪਣੇ ਸਖੀ ਖਾਤੇ ਵਿੱਚ ਲੌਗਇਨ ਕਰੋ',
    register_title: 'ਸਖੀ ਨਾਲ ਜੁੜੋ', register_subtitle: 'ਪੂਰੇ ਭਾਰਤ ਦੀਆਂ ਔਰਤਾਂ ਨਾਲ ਗਿਆਨ ਸਾਂਝਾ ਕਰੋ',
    analytics_title: 'ਤੁਹਾਡੇ ਅੰਕੜੇ', analytics_total_views: 'ਕੁੱਲ ਦ੍ਰਿਸ਼',
    analytics_total_saves: 'ਕੁੱਲ ਸੁਰੱਖਿਅਤ', analytics_total_skills: 'ਪ੍ਰਕਾਸ਼ਿਤ ਹੁਨਰ',
    analytics_total_comments: 'ਮਿਲੀਆਂ ਟਿੱਪਣੀਆਂ',
    voice_record: 'ਰਿਕਾਰਡ', voice_recording: 'ਰਿਕਾਰਡਿੰਗ...', voice_stop: 'ਰੋਕੋ',
    voice_play: 'ਚਲਾਓ', voice_upload: 'ਆਡੀਓ ਅੱਪਲੋਡ', voice_notes: 'ਵੌਇਸ ਨੋਟਸ', voice_add: 'ਵੌਇਸ ਨੋਟ ਜੋੜੋ',
  },
  ml: {
    nav_explore: 'പര്യവേഷണം', nav_write: 'എഴുതുക', nav_saved: 'സേവ് ചെയ്തത്',
    nav_login: 'ലോഗിൻ', nav_join: 'സഖിയിൽ ചേരുക', nav_logout: 'ലോഗ്ഔട്ട്',
    hero_eyebrow: 'സ്ത്രീകളാൽ · സ്ത്രീകൾക്കായി · ഇന്ത്യ മുഴുവൻ',
    hero_h1_line1: 'അറിവ്', hero_h1_em: 'നെയ്ത',
    hero_h1_line2: 'യഥാർഥ കൈകളിൽ നിന്ന്,', hero_h1_line3: 'യഥാർഥ വീടുകളിൽ നിന്ന്.',
    hero_desc: 'സഖി എന്നത് ഇന്ത്യ മുഴുവൻ സ്ത്രീകൾ തങ്ങൾ പഠിച്ചത് പങ്കുവെക്കുന്ന ഒരു ഇടമാണ്.',
    hero_cta_explore: 'നൈപുണ്യങ്ങൾ കണ്ടെത്തുക', hero_cta_share: 'നിങ്ങളുടേത് പങ്കുവെക്കുക',
    section_categories: 'വിഭാഗങ്ങൾ', section_categories_title: 'നിങ്ങൾ എന്ത് അന്വേഷിക്കുന്നു?',
    section_featured: 'എഡിറ്ററുടെ തിരഞ്ഞെടുപ്പ്', section_featured_title: 'സ천രമൊ വായിക്കാൻ യോഗ്യമായ കഥകൾ',
    section_latest: 'പുതിയത്', section_latest_title: 'സമൂഹത്തിൽ നിന്ന് പുതിയത്',
    see_all: 'എല്ലാം കാണുക',
    skill_read_time: 'മിനിറ്റ് വായന', skill_saves: 'സേവ്', skill_views: 'കാഴ്ചകൾ',
    skill_min_read: 'മിനിറ്റ് വായന', skill_save: 'സേവ് ചെയ്യുക', skill_saved: 'സേവ് ചെയ്തു',
    skill_responses: 'പ്രതികരണങ്ങൾ', skill_add_response: 'നിങ്ങളുടെ അനുഭവം പങ്കുവെക്കുക...',
    skill_post_response: 'പ്രതികരണം പോസ്റ്റ് ചെയ്യുക',
    write_title_placeholder: 'ഉദാ: ഞാൻ രാജ്മ ഊറ്റാതെ എങ്ങനെ ഉണ്ടാക്കുന്നു',
    write_subtitle_placeholder: 'വായിക്കാൻ പ്രേരിപ്പിക്കുന്ന ചെറിയ വിവരണം...',
    write_body_placeholder: 'നിങ്ങളുടെ നൈപുണ്യം ഇവിടെ എഴുതുക...',
    write_publish: 'നൈപുണ്യം പ്രസിദ്ധീകരിക്കുക', write_preview: 'പ്രിവ്യൂ',
    write_tags_placeholder: 'ഉദാ: രാജ്മ, ഷോർട്ട്കട്ട്, ഉത്തര-ഇന്ത്യൻ',
    cta_devanagari: 'നിങ്ങൾക്കും ഏതോ പ്രത്യേകം അറിയാം',
    cta_title: 'മറ്റ് ആർക്കും അറിയാത്ത ഏതോ കാര്യം നിങ്ങൾക്ക് അറിയാം',
    cta_desc: 'ഒരു റെസിപ്പി, ഒരു ഉപദേശം, ഒരു കരകൗശലം — നിങ്ങളുടെ അറിവ് പങ്കുവെക്കാൻ യോഗ്യമാണ്.',
    cta_btn: 'ഇന്ന് തന്നെ പങ്കുവെക്കാൻ ആരംഭിക്കുക',
    login_title: 'തിരിച്ചു സ്വാഗതം', login_subtitle: 'നിങ്ങളുടെ സഖി അക്കൗണ്ടിൽ ലോഗിൻ ചെയ്യുക',
    register_title: 'സഖിയിൽ ചേരുക', register_subtitle: 'ഇന്ത്യ മുഴുവൻ സ്ത്രീകളുമായി അറിവ് പങ്കുവെക്കുക',
    analytics_title: 'നിങ്ങളുടെ വിശകലനം', analytics_total_views: 'ആകെ കാഴ്ചകൾ',
    analytics_total_saves: 'ആകെ സേവ്', analytics_total_skills: 'പ്രസിദ്ധീകരിച്ച നൈപുണ്യങ്ങൾ',
    analytics_total_comments: 'ലഭിച്ച അഭിപ്രായങ്ങൾ',
    voice_record: 'റെക്കോർഡ്', voice_recording: 'റെക്കോർഡ് ചെയ്യുന്നു...', voice_stop: 'നിർത്തുക',
    voice_play: 'പ്ലേ', voice_upload: 'ഓഡിയോ അപ്‌ലോഡ്', voice_notes: 'വോയ്സ് നോട്ടുകൾ', voice_add: 'വോയ്സ് നോട്ട് ചേർക്കുക',
  },
};

export const LANG_LABELS: Record<LangCode, string> = {
  en: 'English', hi: 'हिंदी', bn: 'বাংলা',
  te: 'తెలుగు', ta: 'தமிழ்', mr: 'मराठी',
  gu: 'ગુજરાતી', pa: 'ਪੰਜਾਬੀ', ml: 'മലയാളം',
};

export function t(lang: LangCode, key: keyof Translations): string {
  return translations[lang]?.[key] ?? translations['en'][key];
}
