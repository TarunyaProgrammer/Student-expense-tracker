# 💸 Budgettt — The Ultimate Student Money Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
![Status: Active](https://img.shields.io/badge/Status-Active-success)  
![Platform: Vercel](https://img.shields.io/badge/Platform-Vercel%20%2B%20React%20%2B%20Extension-blue)

> **Secure. Offline-First. Privacy-Focused.**  
> A lightning-fast money tracking system built specifically for **Indian Students** — now powered by React & Vercel.

---

## 🚀 New Architecture (v2.0)

We have upgraded from a Vanilla JS PWA to a modern **React + Serverless** architecture:

- **Frontend (`client/`)**: Built with React + Vite. Uses IndexedDB for 100% offline capability.
- **Backend (`api/`)**: Express.js on Vercel Serverless Functions. Handles Sync & AI.
- **Extension (`chrome-extension/`)**: Lightweight browser popup (Legacy Core).

---

## 🛠️ Tech Stack

### ⚙️ Frontend (React)
- **Vite** for fast development.
- **React** for UI components.
- **Recharts** for analytics.
- **Glassmorphism** design system.

### ☁️ Backend (API)
- **Vercel Serverless** deployment.
- **Firebase Admin** for secure Firestore access.
- **Google Gemini AI** for financial insights.

### 💾 Data
- **Local:** IndexedDB (Offline First).
- **Cloud:** Firebase Firestore (Sync).

---

## 🏃‍♂️ Getting Started

### 1. Run the Client (UI)
```bash
cd client
npm install
npm run dev
```
Access at `http://localhost:5173`.

### 2. Run the Backend (API)
```bash
cd api
npm install
node index.js
```
*Note: For full sync, you need a `FIREBASE_SERVICE_ACCOUNT` json in `api/.env`.*

---

## 🧩 Chrome Extension
1. Open Chrome -> `chrome://extensions`
2. Enable **Developer Mode**.
3. **Load Unpacked** -> Select `chrome-extension/`.

---

## 👩‍💻 Contributing
This project is open-source. Feel free to open PRs for new charts, AI prompts, or UI improvements!

## 📜 License
MIT License.
