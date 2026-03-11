# ⚡ Explain & Decide

A Chrome Extension that instantly explains confusing text on any webpage — no tab switching, no copy-pasting, no back-and-forth with AI.

Select any text or open on any page → get **what it says, what it wants, red flags, and what you should do** — in one click.

---

## The Problem

You're reading something online — a contract, job offer, government notice, terms & conditions, email — and you don't fully understand it. The old flow:

> Copy → Open ChatGPT → Paste → Explain → Back and forth → Finally decide

**That's 10 steps for something that should take 1.**

---

## The Solution

Explain & Decide sits on every webpage. One click and you get a structured breakdown:

| | |
|---|---|
| 🔍 **What is this saying?** | Plain English summary |
| ⚡ **What does it want?** | What action it expects from you |
| 🚩 **Watch out** | Red flags, hidden clauses, suspicious claims |
| 👉 **What should you do?** | One clear next step |

---

## Features

- **Popup** — paste any text and analyze directly
- **Explain this page** — smart content detection, not raw DOM scrape
- **Sidebar** — slides in from the right, page stays open
- **Right-click menu** — select text → right-click → Explain & Decide
- **Copy summary** — one click to copy the full breakdown
- **Onboarding flow** — guided API key setup on first launch
- **Cream/off-white theme** — easy on the eyes

---

## Tech Stack

- **React 18 + TypeScript** — popup UI
- **Vite** — build tool
- **Chrome Manifest V3** — service worker, content scripts, context menus
- **Groq API** — llama-3.3-70b-versatile (free tier, fast inference)
- **chrome.storage.sync** — secure API key storage

---

## Architecture

```
User Action (popup / right-click / sidebar button)
        ↓
Popup (React) OR Content Script (sidebar on page)
        ↓
background.js (Service Worker) — proxies API call
        ↓
Groq API → llama-3.3-70b-versatile
        ↓
Structured JSON → 4 result cards rendered
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/explain-and-decide.git
cd explain-and-decide
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build

```bash
npm run build
```

### 4. Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer Mode** (top right)
3. Click **Load unpacked**
4. Select the `dist` folder

### 5. Add your Groq API key

1. Click the extension icon in Chrome toolbar
2. Go to **Settings** tab
3. Get a free key at [console.groq.com](https://console.groq.com) → API Keys → Create
4. Paste and save

---

## Project Structure

```
src/
├── background/
│   └── background.ts        # Service worker — API proxy, context menus
├── content/
│   ├── content.ts           # Sidebar injection, page analysis
│   └── content.css          # Sidebar styles
├── components/
│   ├── AnalyzeTab.tsx        # Main analyze UI
│   ├── AnalysisResultView.tsx # Result cards display
│   ├── ResultCard.tsx        # Single reusable card
│   ├── SettingsTab.tsx       # API key + onboarding
│   ├── Loading.tsx           # Spinner
│   └── ErrorMessage.tsx      # Error display
├── App.tsx                  # Root — header + tab routing
├── theme.ts                 # Central theme/colors
└── types.ts                 # Shared TypeScript interfaces
```

---

## Built By

**Shraddha Gaikwad** — Frontend Engineer  
[LinkedIn](https://www.linkedin.com/in/shraddha-3010/)
