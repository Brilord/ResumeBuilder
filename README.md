# 📄 한국식 이력서 작성기 — Korean Resume Builder

A React + TypeScript web app for building professional Korean-format résumés (이력서), with Google Sign-In and automatic cloud save via Firebase.

---

## Features

- **Standard Korean 이력서 format** — tabular layout matching what Korean companies expect
- **All major sections** — 인적사항, 학력, 경력, 병역, 자격증, 어학능력, 수상활동, 자기소개서
- **Photo upload** — 3×4cm style증명사진 support
- **Live preview** — see the finished 이력서 as you type
- **Print / PDF export** — one-click browser print with proper page breaks
- **Google Sign-In** — Firebase Authentication
- **Auto cloud save** — resume data saved to Firestore with 1.5s debounce
- **Responsive** — works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Auth | Firebase Authentication (Google) |
| Database | Cloud Firestore |
| Print | react-to-print |
| Fonts | Noto Sans KR (Google Fonts) |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Firebase](https://console.firebase.google.com/) project with:
  - **Authentication** → Google sign-in method enabled
  - **Firestore Database** created (start in test mode)
  - `localhost` added to authorized domains

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Brilord/ResumeBuilder.git
cd ResumeBuilder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase environment variables

Copy the example env file and fill in your Firebase project credentials:

```bash
cp .env.example .env
```

Open `.env` and add your values (found in Firebase Console → Project Settings → Your apps → SDK setup):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |

---

## Project Structure

```
ResumeBuilder/
├── src/
│   ├── components/
│   │   ├── ResumeForm.tsx       # Input form for all resume sections
│   │   └── ResumePreview.tsx    # Live 이력서 preview (print-ready)
│   ├── contexts/
│   │   └── AuthContext.tsx      # Firebase auth context + Google Sign-In
│   ├── hooks/
│   │   └── useResumeSync.ts     # Firestore load/auto-save hook
│   ├── pages/
│   │   └── LoginPage.tsx        # Login / sign-up page
│   ├── types/
│   │   └── resume.ts            # TypeScript types + default data
│   ├── firebase.ts              # Firebase app initialization
│   ├── App.tsx                  # Root component + auth routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # All styles (form, preview, login, print)
├── .env.example                 # Environment variable template
├── index.html
├── vite.config.ts
└── tsconfig.json
```

---

## How to Export as PDF

1. Click **🖨 출력 / PDF** in the top right
2. In the browser print dialog, set **Destination → Save as PDF**
3. Set paper size to **A4**, margins to **Minimum**
4. Click **Save**

The 자기소개서 (self-introduction) prints as a separate page automatically.

---

## Firebase Setup Guide

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project
2. **Authentication** → Get started → Google → Enable → Save
3. **Firestore Database** → Create database → Start in test mode → Choose a region → Enable
4. **Project Settings** (gear icon) → Your apps → Add app (Web) → Copy the config into your `.env`

> **Note:** The `.env` file is in `.gitignore` and will never be committed.

---

## License

MIT
