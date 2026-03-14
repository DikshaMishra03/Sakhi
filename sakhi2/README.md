# 🌸 Sakhi (सखी) — Life Skills Platform v2.0

> *"Every woman carries irreplaceable knowledge"*

A production-grade full-stack web platform where women across India discover and share practical life skills — from recipes passed down through generations to crafts, home remedies, voice notes, and home businesses.

**Built by Diksha Mishra** · 3rd Year B.Tech Engineering Student

---

## 🎯 The Problem This Solves

The generational knowledge held by Indian women — in their kitchens, their hands, their traditions — has no digital home. This platform gives that knowledge a place to live, be discovered in 9 languages, and spread through voice and text.

---

## ✨ Feature Set

### 🌍 Multilingual (9 Languages)
Full UI translation in **English, Hindi (हिंदी), Bengali (বাংলা), Telugu (తెలుగు), Tamil (தமிழ்), Marathi (मराठी), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), Malayalam (മലയാളം)**
- Language preference stored per user in database
- Category names translated in all 9 languages in schema
- One-click language switcher in navbar

### 🎙️ Voice Notes
- Record directly in browser (Web Audio API / MediaRecorder)
- Or upload existing audio files
- Audio streaming with HTTP Range request support (seek/scrub)
- Per-note play count tracking
- Language tagging on each voice note
- Visual waveform player with progress bar
- Up to 3 voice notes per skill

### 📊 Analytics Dashboard
- **Platform-wide stats**: total skills, views, saves, users, comments
- **30-day line chart**: views, saves, new users over time
- **Category breakdown**: pie chart of skills distribution
- **Top 5 skills**: ranked by saves with author info
- **Personal analytics**: views/saves/comments per your own skills
- **Per-skill bar chart**: compare your skills' performance
- Daily stats snapshot via cron job (node-cron)

### 🗄️ MySQL + Prisma ORM
- Full relational schema with proper foreign keys
- Indexes on all queried fields
- Cascade deletes for data integrity
- Prisma migrations for version-controlled schema changes
- Seeded with real data and 30 days of analytics history

### Core Platform
- 📖 Skill feed with category/search/sort/pagination
- 🔍 Live search across titles, tags, regions, languages
- 📝 Write + Preview mode editor
- 💾 Save/bookmark skills
- 💬 Comments with auth
- 🔐 JWT authentication
- 👤 Public user profiles with follow system
- ⭐ Featured skills curation

---

## 🏗️ Architecture

```
sakhi/
│
├── backend/                     # Node.js + Express REST API
│   ├── prisma/
│   │   └── schema.prisma        # PostgreSQL schema (8 tables)
│   ├── src/
│   │   ├── server.js            # Express app entry point
│   │   ├── config/
│   │   │   ├── logger.js        # Winston structured logging
│   │   │   └── upload.js        # Multer voice note config
│   │   ├── db/
│   │   │   ├── client.js        # Prisma client singleton
│   │   │   └── seed.js          # Rich multilingual seed data
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT authentication
│   │   │   ├── errorHandler.js  # Global error handling
│   │   │   └── rateLimit.js     # Per-route rate limiting
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── skillsController.js
│   │   │   ├── voiceController.js
│   │   │   └── analyticsController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── skills.js
│   │   │   ├── voice.js
│   │   │   └── analytics.js
│   │   └── jobs/
│   │       └── dailyStats.js    # Midnight cron: snapshot stats
│   └── uploads/
│       └── voice-notes/         # Served as static files
│
└── frontend/                    # React 18 + TypeScript + Vite
    ├── src/
    │   ├── App.tsx              # Routes definition
    │   ├── index.css            # Global styles + CSS design tokens
    │   ├── i18n/
    │   │   └── translations.ts  # 9-language translation strings
    │   ├── context/
    │   │   ├── AuthContext.tsx  # Global user auth state
    │   │   └── LangContext.tsx  # Global language preference
    │   ├── lib/
    │   │   └── api.ts           # Typed Axios client + all API fns
    │   ├── components/
    │   │   ├── layout/
    │   │   │   └── Layout.tsx   # Navbar + search overlay + footer
    │   │   ├── skills/
    │   │   │   └── SkillCard.tsx
    │   │   ├── voice/
    │   │   │   └── VoiceNoteSection.tsx  # Record + play + upload
    │   │   └── ui/
    │   │       └── LangSwitcher.tsx      # Dropdown language picker
    │   └── pages/
    │       ├── HomePage.tsx      # Hero, stats, categories, featured
    │       ├── ExplorePage.tsx   # Filter + search + sort + paginate
    │       ├── SkillPage.tsx     # Full skill + voice + comments
    │       ├── WritePage.tsx     # Create/edit with live preview
    │       ├── AnalyticsPage.tsx # Charts (Recharts), personal stats
    │       ├── ProfilePage.tsx
    │       ├── SavedPage.tsx
    │       ├── LoginPage.tsx
    │       └── RegisterPage.tsx
    └── package.json
```

---

## 🗃️ Database Schema

```
users          → id, name, email, password, city, state, bio,
                 avatar_color, preferred_lang, is_verified
categories     → id, name_en, name_hi, name_bn, name_te, name_mr,
                 name_ta, emoji (multilingual!)
skills         → id, title, subtitle, body, category_id, tags[],
                 language, region, read_time, saves_count, views_count,
                 is_featured, author_id
comments       → id, body, skill_id, author_id
saves          → id, user_id, skill_id  (unique constraint)
follows        → id, follower_id, following_id
voice_notes    → id, skill_id, author_id, file_path, duration_s,
                 mime_type, language, plays_count
skill_views    → id, skill_id, user_id, ip_hash, viewed_at
daily_stats    → id, date, total_users, new_users, total_skills,
                 total_views, total_saves, total_comments
```

---

## 👩‍💻 About

Built as a portfolio project to demonstrate production-level full-stack engineering — not just CRUD, but real features people actually use.

**Diksha Mishra** · 3rd Year B.Tech · GitHub: [@yourusername](https://github.com)

*"I built the platform I wish existed when I was trying to find my grandfather's chai masala recipe after she was gone."*
