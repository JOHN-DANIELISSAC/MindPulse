# 🧠 MindPulse — Student Stress & Wellbeing Monitoring Tool

> *Your daily mental wellness companion — track mood, reduce stress, and thrive.*

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-5-yellow)](https://vitejs.dev)

---

## 📖 About

MindPulse is a production-quality web application built for college students to monitor and improve their mental wellbeing. Log your daily mood, track stress patterns over time, receive intelligent nudges, and access campus mental health resources — all in a beautiful, mobile-first interface.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Email/password signup & login with Firebase Auth |
| 📝 **Daily Check-in** | 1–10 mood slider, stress selector, optional journal note |
| 📅 **Mood History** | 7-day line chart + 30-day heatmap calendar |
| 💡 **Smart Suggestions** | Rule-based nudge engine with 3 alert levels |
| 🫁 **Breathing Widget** | Animated 4-4-4 box breathing exercise |
| 🏫 **Campus Resources** | Counselor booking, meditation room, mental health helpline |
| 👤 **Profile** | Stats, streak, mood distribution bar + logout |
| 📱 **Mobile-first** | Bottom nav on mobile, sidebar on desktop |

---

## 🔧 Prerequisites

- **Node.js** 18 or later → [nodejs.org](https://nodejs.org)
- **npm** 9 or later (comes with Node)
- A **Firebase** account → [firebase.google.com](https://firebase.google.com)

---

## 🔥 Firebase Setup (Step by Step)

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** → enter a name (e.g. `mindpulse-app`)
3. Disable Google Analytics (optional) → click **Create project**

### 2. Enable Email/Password Authentication
1. In the left sidebar → **Build → Authentication**
2. Click **"Get started"**
3. Under **Sign-in providers**, click **Email/Password**
4. Toggle **Enable** → click **Save**

### 3. Create Firestore Database
1. In the left sidebar → **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **Production mode** → select your region → click **Enable**
4. Go to **Rules** tab and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /checkins/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

5. Click **Publish**

### 4. Get Your Firebase Config
1. Go to **Project Settings** (gear icon) → **General** tab
2. Scroll to **"Your apps"** → click **"</> Web"**
3. Register the app (any nickname) → copy the `firebaseConfig` object values

### 5. Create Firestore Indexes
The app needs a composite index for the checkins collection:
1. Go to **Firestore → Indexes → Composite**
2. Add index: Collection: `checkins`, Fields: `userId (Ascending)` + `createdAt (Descending)`

> Alternatively, run the app and click the auto-generated index link in the browser console error.

---

## 🚀 Installation & Running

```bash
# 1. Clone or download this repo
git clone https://github.com/yourteam/mindpulse.git
cd mindpulse

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Open .env and fill in your Firebase config values

# 4. Start the dev server
npm run dev
```

The app will open at **http://localhost:3000**

---

## 📁 Folder Structure

```
mindpulse/
├── public/
│   └── favicon.svg              # App icon
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Navbar.jsx           # Bottom nav (mobile) / sidebar (desktop)
│   │   ├── MoodSlider.jsx       # Animated 1-10 mood slider
│   │   ├── StressSelector.jsx   # Low / Medium / High pill buttons
│   │   ├── NudgeCard.jsx        # Smart alert card (rules 1/2/3)
│   │   ├── ResourceCard.jsx     # Campus resource card
│   │   ├── MoodCalendar.jsx     # 30-day heatmap
│   │   ├── CheckinList.jsx      # Recent check-ins list
│   │   ├── StatCard.jsx         # Profile stat tile
│   │   └── ProtectedRoute.jsx   # Auth guard
│   ├── context/
│   │   └── AuthContext.jsx      # Firebase auth state provider
│   ├── pages/
│   │   ├── Login.jsx            # Sign-in page
│   │   ├── Signup.jsx           # Registration page
│   │   ├── Home.jsx             # Daily check-in form
│   │   ├── History.jsx          # Charts + check-in history
│   │   ├── Suggestions.jsx      # Nudge engine + breathing + resources
│   │   └── Profile.jsx          # User profile + stats
│   ├── services/
│   │   ├── firebase.js          # Firebase app init
│   │   ├── auth.js              # Auth operations
│   │   └── checkin.js           # Firestore CRUD + stats
│   ├── utils/
│   │   ├── moodUtils.js         # Emoji, colors, labels, analyzer
│   │   └── dateUtils.js         # Formatting, greeting, date ranges
│   ├── App.jsx                  # Router + layout shell
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind + global styles
├── .env.example                 # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── README.md
```

---

## 👥 Team Members

| # | Name | Role |
|---|------|------|
| 1 | _________________ | Frontend Lead |
| 2 | _________________ | Backend / Firebase |
| 3 | _________________ | UI/UX Designer |
| 4 | _________________ | Feature Development |
| 5 | _________________ | QA & Documentation |

---

## 📸 Screenshots

> *(Add screenshots here after running the app)*

| Login | Home Check-in | Mood History |
|-------|---------------|--------------|
| ![Login](./screenshots/login.png) | ![Home](./screenshots/home.png) | ![History](./screenshots/history.png) |

| Suggestions | Profile |
|-------------|---------|
| ![Suggestions](./screenshots/suggestions.png) | ![Profile](./screenshots/profile.png) |

---

## 🛠️ Built With

- [React 18](https://react.dev) — UI library
- [Vite 5](https://vitejs.dev) — Build tool
- [Tailwind CSS 3](https://tailwindcss.com) — Utility-first styling
- [Firebase 10](https://firebase.google.com) — Auth + Firestore
- [Recharts](https://recharts.org) — Data visualization
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Lucide React](https://lucide.dev) — Icons
- [React Router v6](https://reactrouter.com) — Client-side routing

---

## 📄 License

MIT © 2024 MindPulse Team
