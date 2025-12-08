# Budgettt - Privacy-First Money Transaction

**A secure, offline-first Budgeting App for Indian Students.**

## 🚀 Use the Web PWA
1. Open `web-pwa/index.html` in a browser.
   - You can use a local server: `npx serve .` inside `Budgettt` folder.
2. **Offline Mode**: Works immediately. Add transactions, filters, summaries.
3. **Sync**: Login with Email/Password. Click "Refresh" icon to Sync with Cloud.

## 🧩 Chrome Extension Setup
1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer Mode** (top right).
3. Click **Load Unpacked**.
4. Select the `chrome-extension` folder inside `Budgettt`.
5. Pin the extension. Click it to **Quick Add** transactions.
   - *Note: Extension uses its own local storage. To sync, ensure you implement full auth in extension or use the PWA for management.*

## 🔒 Privacy & Architecture
- **Tech Stack**: Vanilla JS, HTML, CSS.
- **Database**: IndexedDB (Local), Firestore (Sync).
- **Money**: Integer Paise (e.g. ₹100 = 10000).
- **Sync Strategy**: Last Write Wins.
- **Rules**: Per-user data isolation.

## ⚠️ Important for Devs
- The `core` folder is the single source of logic.
- The Chrome Extension uses a **symlink** to access `../core`.
- If you move the folder, you might need to recreate the symlink:
  ```bash
  cd chrome-extension
  ln -s ../core core
  ```
