// src/db/seed.js
// Run: npm run db:seed
// Seeds database with categories, sample users, and skills

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Sakhi database...\n');

  // ── Categories (multilingual) ───────────────────────────────
  const categories = [
    { id: 'kitchen',   name_en: 'Kitchen',   name_hi: 'रसोई',     name_bn: 'রান্নাঘর', name_te: 'వంటగది',  name_mr: 'स्वयंपाक', name_ta: 'சமையலறை', emoji: '🍛', sort_order: 1 },
    { id: 'remedies',  name_en: 'Remedies',  name_hi: 'घरेलू नुस्खे', name_bn: 'ঘরোয়া প্রতিকার', name_te: 'చికిత్సలు', name_mr: 'घरगुती उपाय', name_ta: 'வீட்டு வைத்தியம்', emoji: '🌿', sort_order: 2 },
    { id: 'crafts',    name_en: 'Crafts',    name_hi: 'कारीगरी',  name_bn: 'হস্তশিল্প', name_te: 'చేతిపని',  name_mr: 'हस्तकला',  name_ta: 'கைவினை',   emoji: '🧵', sort_order: 3 },
    { id: 'home',      name_en: 'Home',      name_hi: 'घर',        name_bn: 'বাড়ি',     name_te: 'ఇల్లు',   name_mr: 'घर',        name_ta: 'வீடு',      emoji: '🏡', sort_order: 4 },
    { id: 'beauty',    name_en: 'Beauty',    name_hi: 'सौंदर्य',  name_bn: 'সৌন্দর্য', name_te: 'అందం',    name_mr: 'सौंदर्य',  name_ta: 'அழகு',      emoji: '🌸', sort_order: 5 },
    { id: 'parenting', name_en: 'Parenting', name_hi: 'पालन-पोषण', name_bn: 'অভিভাবকত্ব', name_te: 'పెంపకం', name_mr: 'संगोपन',   name_ta: 'பெற்றோர்', emoji: '📚', sort_order: 6 },
    { id: 'earning',   name_en: 'Earning',   name_hi: 'कमाई',     name_bn: 'উপার্জন',  name_te: 'సంపాదన',  name_mr: 'कमाई',     name_ta: 'வருமானம்', emoji: '💰', sort_order: 7 },
    { id: 'garden',    name_en: 'Garden',    name_hi: 'बागवानी',  name_bn: 'বাগান',    name_te: 'తోట',     name_mr: 'बागकाम',   name_ta: 'தோட்டம்',  emoji: '🌱', sort_order: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({ where: { id: cat.id }, update: cat, create: cat });
  }
  console.log(`✅ ${categories.length} categories seeded`);

  // ── Users ───────────────────────────────────────────────────
  const pass = await bcrypt.hash('password123', 10);
  const colors = ['#E8621A', '#4A7C59', '#C9506A', '#5B4FCF', '#D4A017', '#8B4A6B', '#2D5FA6', '#B84A30'];

  const usersData = [
    { name: 'Rekha Sharma',     email: 'rekha@sakhi.app',   city: 'Jaipur',    state: 'Rajasthan',    bio: 'Home cook for 20 years.',          avatar_color: colors[0], preferred_lang: 'hi' },
    { name: 'Divya Nair',       email: 'divya@sakhi.app',   city: 'Kochi',     state: 'Kerala',       bio: 'Ayurveda enthusiast.',             avatar_color: colors[1], preferred_lang: 'ml' },
    { name: 'Fatima Begum',     email: 'fatima@sakhi.app',  city: 'Hyderabad', state: 'Telangana',    bio: 'Upcycling saris into bags.',       avatar_color: colors[2], preferred_lang: 'te' },
    { name: 'Ananya Chatterjee',email: 'ananya@sakhi.app',  city: 'Kolkata',   state: 'West Bengal',  bio: 'Bengali food writer.',             avatar_color: colors[3], preferred_lang: 'bn' },
    { name: 'Kamla Yadav',      email: 'kamla@sakhi.app',   city: 'Patna',     state: 'Bihar',        bio: 'Home pickle business owner.',      avatar_color: colors[1], preferred_lang: 'hi' },
    { name: 'Sunita Verma',     email: 'sunita@sakhi.app',  city: 'Lucknow',   state: 'UP',           bio: 'Awadhi cuisine specialist.',       avatar_color: colors[0], preferred_lang: 'hi' },
    { name: 'Neha Gupta',       email: 'neha@sakhi.app',    city: 'Chandigarh',state: 'Punjab',       bio: 'DIY beauty with kitchen items.',   avatar_color: colors[5], preferred_lang: 'pa' },
    { name: 'Tulsi Bai',        email: 'tulsi@sakhi.app',   city: 'Bhilai',    state: 'Chhattisgarh', bio: 'Traditional weaver.',              avatar_color: colors[1], preferred_lang: 'hi' },
    { name: 'Priya Mehta',      email: 'priya@sakhi.app',   city: 'Surat',     state: 'Gujarat',      bio: 'Textile artist and entrepreneur.', avatar_color: colors[6], preferred_lang: 'gu' },
    { name: 'Lakshmi Reddy',    email: 'lakshmi@sakhi.app', city: 'Vijayawada',state: 'Andhra Pradesh',bio: 'Traditional Andhra recipes.',     avatar_color: colors[7], preferred_lang: 'te' },
  ];

  const users = [];
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password: pass },
    });
    users.push(user);
  }
  console.log(`✅ ${users.length} users seeded`);

  // ── Skills ──────────────────────────────────────────────────
  const skillsData = [
    {
      author_id: users[0].id, category_id: 'kitchen',
      title: 'How I make Rajma without soaking overnight',
      subtitle: 'My shortcut that actually works — and my mother-in-law finally approved',
      body: `I grew up watching my mother soak rajma every single night before she went to bed. For years I believed that was the only way. Then life got busy and I had to find a shortcut.\n\n**The trick is boiling water, not cold.**\n\nWash the rajma three times, then pour boiling water over it and let it sit for 2 hours. The heat accelerates what soaking does overnight.\n\n**Ingredients:**\n- 1 cup dried rajma (kidney beans)\n- 3 cups boiling water for soaking\n- 2 medium onions, finely chopped\n- 3 tomatoes, pureed\n- 1 tbsp ginger-garlic paste\n- 1 tsp cumin seeds\n- Salt to taste\n\n**Steps:**\n1. Pour boiling water over washed rajma. Cover and let rest 2 hours.\n2. Drain and pressure cook with fresh water for 6–7 whistles on medium flame.\n3. In a heavy kadhai, heat oil. Add cumin seeds and wait for them to sputter.\n4. Add onions and fry until deep golden — this takes 12 full minutes, don't rush.\n5. Add ginger-garlic paste, fry 2 minutes. Add pureed tomatoes, cook till oil separates.\n6. Add cooked rajma with its water. Simmer 20 minutes.\n7. Mash a few beans against the pot — this thickens the gravy naturally.`,
      tags: "'rajma', 'shortcut', 'north-indian', 'protein', 'budget'],
      language: 'Hindi', region: 'North India', read_time: 12,
      saves_count: 892, views_count: 4200, is_featured: false,
    },
    {
      author_id: users[1].id, category_id: 'remedies',
      title: 'Methi water for hair fall — my grandmother\'s 3-month protocol',
      subtitle: 'Before you spend on serums, try this fenugreek routine I\'ve followed for years',
      body: `Three years ago I was losing alarming amounts of hair. I tried two expensive serums, one dermatologist visit, and a biotin supplement. Nothing helped significantly.\n\nThen I called my grandmother in our village outside Thrissur.\n\n**The protocol she gave me:**\n\n**Week 1–4 (Internal):**\nSoak 1 teaspoon of methi (fenugreek) seeds overnight in a glass of water. Drink it first thing in the morning, before tea, before anything.\n\n**Week 2–4 (External):**\nGrind soaked methi seeds into a paste. Mix with 2 tablespoons of coconut oil. Apply to scalp, leave 45 minutes, rinse with mild shampoo. Do this once a week.\n\n**Month 2:**\nAdd amla powder (½ tsp) to your morning methi water.\n\n**Month 3:**\nYou should see significantly less fall. My comb changed from looking alarming to looking normal.\n\n**Why it works:**\nMethi is rich in proteins and nicotinic acid, both known to strengthen hair follicles.\n\nCost of this entire protocol: approximately ₹80 for 3 months of methi seeds.`,
      tags: "'hair-fall', 'methi', 'fenugreek', 'ayurveda', 'natural'],
      language: 'Malayalam', region: 'South India', read_time: 8,
      saves_count: 2341, views_count: 11200, is_featured: true,
    },
    {
      author_id: users[3].id, category_id: 'kitchen',
      title: 'Masoor dal the Bengali way',
      subtitle: 'How my ma cooked it when money was tight — a recipe that feeds four on thirty rupees',
      body: `We grew up in a small flat in North Kolkata. My ma had one gas burner and a small iron kadhai. But every evening at 7, the whole building would smell like her dal.\n\n**What you need:**\n- ½ cup masoor dal (red lentils)\n- 1.5 cups water\n- 1–2 tbsp mustard oil\n- 1 dried red chilli\n- ½ tsp panch phoron (Bengali five-spice)\n- 1 medium tomato, sliced\n- ¼ tsp turmeric\n- Salt to taste\n- Squeeze of lemon\n\n**The method:**\n\nWash dal three times. Pressure cook with water, turmeric, and salt — 2 whistles on medium.\n\nHeat mustard oil in your kadhai until it just starts to smoke — this is essential. Raw mustard oil has a harsh taste.\n\nAdd the dried red chilli first. Wait for it to darken and puff slightly. Then add panch phoron. Count to 10 slowly.\n\nPour in the cooked dal immediately. Add sliced tomato. Stir gently.\n\nSimmer on the lowest flame for 8 minutes. Do not boil hard.\n\nBefore serving, squeeze half a lemon and add one small drop of fresh mustard oil on top.`,
      tags: "'bengali', 'dal', 'budget', 'quick', 'mustard-oil'],
      language: 'Bengali', region: 'East India', read_time: 15,
      saves_count: 3102, views_count: 15600, is_featured: true,
    },
    {
      author_id: users[4].id, category_id: 'earning',
      title: 'How I started selling pickles from home — ₹800 to ₹18,000 a month',
      subtitle: 'No business experience. Just my mother\'s recipe and a WhatsApp group.',
      body: `In July 2021, I had ₹800 left after paying rent and buying groceries. My husband had lost his job 3 months earlier. I had two children, a rented kitchen, and my mother's recipe for aam ka achar.\n\nI made 4 jars. I put a photo in my housing society WhatsApp group: "homemade pickle, ₹80 per jar." All 4 sold in 45 minutes.\n\n**Month 1 — Just start:**\nDon't overthink packaging. Clean jars from recycled bottles. A handwritten label is fine. Focus entirely on quality.\n\n**Month 2 — Expand the menu:**\nI added nimbu ka achar and lahsun chutney. Having 3 items makes people feel like they're shopping.\n\n**Month 3 — Price properly:**\nI was undercharging. Count your ingredients, your time, the gas, the jars. Time is not free.\n\n**Month 4 — Word of mouth:**\nAsk every buyer to send a photo if they liked it. In WhatsApp groups, a real customer photo is worth more than any advertisement.\n\n**Month 6 — Scaling:**\nSaturdays for preparation, Sundays for making, deliveries Monday morning.\n\nToday I supply to two small grocery stores. I have 60 regular families. Next quarter: FSSAI registration.`,
      tags: "'pickle', 'home-business', 'whatsapp', 'women-entrepreneur', 'startup'],
      language: 'Hindi', region: 'East India', read_time: 15,
      saves_count: 4820, views_count: 22000, is_featured: true,
    },
    {
      author_id: users[6].id, category_id: 'beauty',
      title: 'Besan-rose water face pack I\'ve used every Friday for 5 years',
      subtitle: 'My skin was oily and full of marks. Nothing from a shop worked as well as this.',
      body: `I spent probably ₹4,000 on face washes and creams between the ages of 19 and 22. My skin was oily with closed comedones and dark spots.\n\nMy naani came to visit when I was 22. She looked at my skincare shelf and quietly said: "Besan aur gulab jal."\n\n**Basic pack (for everyday use):**\n- 2 tbsp besan (chickpea flour)\n- Rose water — enough to make a smooth paste\n- A pinch of haldi (turmeric) — literally just a pinch\n\nMix to a smooth paste. Apply on clean face. Leave 15 minutes. Rinse with lukewarm water, then splash cold water.\n\n**For oily skin — add:**\n- ½ tsp lemon juice\n- 1 tsp curd\n\n**For dry skin — replace rose water with:**\n- Half rose water, half raw milk\n\n**What it actually does:**\nBesan is a mild physical exfoliant. Haldi is anti-inflammatory. Rose water balances pH.\n\nAfter 3 months of weekly use, my closed comedones cleared significantly. After 5 years, my skin is the best it has ever been.`,
      tags: "'besan', 'natural', 'oily-skin', 'DIY', 'acne', 'budget'],
      language: 'Hindi', region: 'North India', read_time: 10,
      saves_count: 3102, views_count: 14400, is_featured: false,
    },
    {
      author_id: users[2].id, category_id: 'crafts',
      title: 'Old sari into a tote bag — zero-waste stitching in 6 steps',
      subtitle: 'No sewing machine. No experience needed. I\'ve sold 30 of these at my local market.',
      body: `I have made over 40 of these bags. 30 of them were sold. The first one was from a sari my mother could no longer wear.\n\n**What you need:**\nAn old sari, scissors, needle, strong thread, 2 hours.\n\n**Step 1: Choose your section**\nThe pallu (decorative end) makes the best bags. Cut a 60cm × 90cm section.\n\n**Step 2: Fold and mark**\nFold in half lengthwise. The fold is the bottom of your bag. Mark sides with chalk — 1.5cm seam allowance.\n\n**Step 3: Stitch the sides**\nRunning stitch along both sides. Stitch twice for strength.\n\n**Step 4: Box the corners**\nPinch each bottom corner into a triangle, about 4cm deep. Stitch across. This gives the bag a flat bottom.\n\n**Step 5: Finish the top**\nFold raw top edge in by 1cm, then again by 2cm. Stitch all around.\n\n**Step 6: Make the handles**\nCut two strips 60cm × 8cm. Fold in thirds, stitch. Thread through top channel, knot at ends.\n\nThe sari border running around the bag looks intentional and beautiful.`,
      tags: "'upcycling', 'sari', 'zero-waste', 'no-machine', 'beginner'],
      language: 'Telugu', region: 'South India', read_time: 20,
      saves_count: 1567, views_count: 7800, is_featured: false,
    },
    {
      author_id: users[8].id, category_id: 'garden',
      title: 'Kitchen scrap garden on a 4x4 balcony — what I grow year-round',
      subtitle: 'No garden needed. Spring onions from water, tomatoes from seeds, methi in 10 days.',
      body: `My entire balcony is 4 feet by 4 feet. I grow 11 things on it.\n\n**Regrow from scraps (no soil needed, just water):**\n\n1. **Spring onions** — Put the white root ends in a glass of water. Change water every 2 days. Ready to cut in 7 days. I've been regrowing the same bunch for 8 months.\n\n2. **Ginger** — Plant a small piece with a bud in moist soil. You'll have fresh ginger in 4 months.\n\n3. **Methi (fenugreek)** — Soak seeds overnight, plant in any container, harvest microgreens in 10 days.\n\n**From seeds (very easy):**\n\n4. **Cherry tomatoes** — Save seeds from a ripe store-bought tomato, dry them, plant in monsoon. I get 2kg per season from 2 containers.\n\n5. **Coriander** — Plant the split seeds. Harvest in 3 weeks. Let some go to seed, harvest those seeds, replant.\n\n**Soil mix I use:**\n60% regular garden soil + 30% compost (I make from kitchen waste) + 10% cocopeat.\n\nMonthly cost of my garden: approximately zero. I invest only time.`,
      tags: "'balcony-garden', 'kitchen-scraps', 'zero-waste', 'urban-farming', 'beginners'],
      language: 'Gujarati', region: 'West India', read_time: 12,
      saves_count: 1240, views_count: 6800, is_featured: false,
    },
    {
      author_id: users[9].id, category_id: 'kitchen',
      title: 'Gongura pachadi — the Andhra way, the way my amma made it',
      subtitle: 'Sorrel leaves chutney that takes 20 minutes and changes the entire meal',
      body: `Gongura is the soul of Andhra Pradesh cooking. We eat it with rice, we stuff it in rotis, we add it to mutton and fish. It is tart, earthy, deeply aromatic, and completely unlike anything else.\n\nMy amma made three versions depending on what we had. This is the basic pachadi (chutney) version — the one you make when you want gongura on the table in 20 minutes.\n\n**Ingredients:**\n- 2 large bunches gongura (sorrel) leaves, washed\n- 6–8 dried red chillies\n- 1 tsp mustard seeds\n- 1 tsp cumin seeds\n- 6 garlic cloves\n- 1 tsp sesame seeds\n- Salt to taste\n- 3 tbsp sesame oil (or any oil, but sesame is traditional)\n\n**Method:**\n\nHeat 1 tbsp oil in a heavy pan. Add gongura leaves, sprinkle salt, and stir on medium heat for 8–10 minutes until completely wilted and soft. The leaves shrink dramatically. Set aside.\n\nIn the same pan, dry roast red chillies, cumin, and sesame seeds for 2 minutes until fragrant. Let cool.\n\nBlend the roasted spices with garlic into a coarse powder.\n\nAdd the wilted gongura to the blender. Pulse 3–4 times — you want texture, not a smooth paste.\n\nHeat remaining oil, add mustard seeds, let them pop. Pour this tadka over the pachadi.\n\nEat with hot steamed rice and a generous drizzle of ghee.`,
      tags: "'gongura', 'andhra', 'chutney', 'south-indian', 'traditional', 'vegetarian'],
      language: 'Telugu', region: 'South India', read_time: 14,
      saves_count: 876, views_count: 4300, is_featured: false,
    },
  ];

  for (const s of skillsData) {
    await prisma.skill.create({ data: s });
  }
  console.log(`✅ ${skillsData.length} skills seeded`);

  // ── Sample analytics data ───────────────────────────────────
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);

    await prisma.dailyStats.upsert({
      where: { date },
      update: {},
      create: {
        date,
        total_users: 10 + Math.floor(i * 0.3),
        new_users: Math.floor(Math.random() * 3),
        total_skills: 8 + Math.floor(i * 0.2),
        new_skills: Math.floor(Math.random() * 2),
        total_views: 1000 + Math.floor(Math.random() * 500) + (29 - i) * 80,
        total_saves: 200 + Math.floor(Math.random() * 100) + (29 - i) * 20,
        total_comments: 50 + Math.floor(Math.random() * 30) + (29 - i) * 5,
        active_users: 3 + Math.floor(Math.random() * 5),
      },
    });
  }
  console.log('✅ 30 days of analytics seeded');

  console.log('\n🌸 Seed complete! Login with any user: password123');
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
