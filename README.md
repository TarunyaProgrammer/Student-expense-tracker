# 💸 Budgettt — The Ultimate Student Money Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
![Status: Stable](https://img.shields.io/badge/Status-Stable-success)  
![Platform: PWA](https://img.shields.io/badge/Platform-PWA%20%2B%20Extension%20%2B%20Web-blue)

> **Secure. Offline-First. Privacy-Focused.**  
> A lightning-fast money tracking system built specifically for **Indian Students** — to track every rupee without data leaching.

---

## 🧠 Why I Built This

Like most students, I struggled with:

- ❌ Forgetting where my money actually went
- ❌ Depending on random apps filled with ads & trackers
- ❌ Internet not always being reliable
- ❌ No fast way to add expenses while browsing

I wanted something that was:

✅ **Fast**  
✅ **Works offline**  
✅ **Privacy-first**  
✅ **Simple & distraction-free**  
✅ **Available as a mobile app, website & browser extension**

So I built **Budgettt** — first to solve my own problem, and now to **help every student take control of their money without giving up privacy.**

---

## ✨ What Makes Budgettt Special?

- 📱 **Mobile-First & Fully Responsive**  
  Works perfectly on **phones, tablets & desktops**.

- ⚡ **100% Offline First (IndexedDB Powered)**  
  Add, edit & view expenses without internet.

- ☁️ **Optional Cloud Sync**  
  Firebase login only when YOU want backups.

- 🧩 **Chrome Extension Included**  
  Instantly add expenses while browsing with one click.

- 🔒 **Privacy at the Core**  
  Your data stays on your device unless you choose to sync.

- 💸 **Paise-Based Math Engine**  
  All values stored in integers for perfect accuracy.  
  `₹100.00 → 10000 paise`

- 🎨 **Minimal Dark UI**  
  Clean and premium student-focused design.

---

## 🧩 Platforms Included

✅ **Progressive Web App (PWA)**  
✅ **Chrome Extension**  
✅ **Responsive Website (Mobile + Desktop Ready)**

One project → Three powerful platforms 🚀

---

## 🎥 Live Working Demo

> Real-time working demo of Budgettt PWA & Chrome Extension.

<video src="assets/budgettt-demo.mp4" controls width="100%"></video>

✅ Replace the URL above after uploading your video via GitHub drag & drop.

---

## 🚀 Getting Started (Web App / PWA)

1. Open:
   ```bash
   web-pwa/index.html
   ```
2. Or run a local server:
   ```bash
   npx serve .
   ```
3. Click **“Install”** in the browser to use it like a native app.
4. Start adding transactions immediately — **no login required!**

✅ Fully works offline  
✅ Sync only if you want

---

## 🧩 Chrome Extension Setup

1. Open Chrome:
   ```
   chrome://extensions
   ```
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `chrome-extension` folder
5. **Pin it for instant access**

Now you can add expenses without leaving any website 💨

---

## 🛠️ Tech Stack & Architecture

Built with **Pure Vanilla Web Technologies** — no frameworks, no bloat.

### ⚙️ Frontend

- HTML5
- CSS3
- ES6 JavaScript

### 💾 Storage

- **Local:** IndexedDB
- **Cloud:** Firebase Firestore

### 🧠 Core Architecture

- Shared logic inside `/core`
- Used by both:
  - PWA
  - Chrome Extension

### 💸 Financial Engine

- Integer-based calculations
- No floating point bugs
- Accurate monthly summaries

---

## 📁 Project Structure

```txt
/core              → Shared database, auth & sync logic
/web-pwa           → Main Progressive Web App
/chrome-extension  → Lightweight browser popup
```

> ⚠️ Chrome Extensions need sandbox isolation, so `/core` is duplicated safely.

---

## 👩‍💻 Who Is This For?

- 🎓 College Students
- 🧑‍💻 Developers learning:
  - PWAs
  - IndexedDB
  - Browser Extensions
  - Offline-first architecture
- 🛡️ Privacy-conscious users
- 🚀 Open-source contributors & GSoC aspirants

---

## 🌱 Open Source & Contributions

This project is **fully open-source & beginner-friendly**.

You can contribute by:

- Improving UI/UX
- Adding charts & analytics
- UPI auto-expense detection
- Multi-language support
- AI-based monthly suggestions
- Improving sync performance

✨ Perfect for **Hackathons, GSoC prep & Open Source learning**

---

## 🔗 Repository

GitHub Repo:  
👉 https://github.com/TarunyaProgrammer/Student-expense-tracker

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify & distribute.

---

## ❤️ Final Note

This project started as a **personal struggle**, but my goal is bigger now:

> 🎯 **To help students take control of their money without sacrificing privacy.**

If this project helped you even a little:

⭐ Star the repo  
🍴 Fork it  
🧑‍💻 Contribute to it

Let’s build something impactful together 🚀
