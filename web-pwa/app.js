/**
 * Budgettt PWA Logic
 */
import { DB } from "../core/db.js";
import {
  loginUser,
  registerUser,
  logoutUser,
  subscribeToAuth,
  getCurrentUserId,
} from "../core/auth.js";
import { Sync } from "../core/sync.js";
import {
  generateUUID,
  getUTCNow,
  formatDateTimeIST,
  getDateKey,
} from "../core/utils.js";
import { exportCSV, exportJSON } from "../core/export.js";
// Money logic is in money.js, but utils exports formatMoney?
// No, I put money logic in money.js but exported it.
// Let's fix imports. Core money.js has formatMoney. Core utils.js DOES NOT.
// I made a mistake in utils.js description in implementation plan vs what I wrote.
// I wrote formatMoney in money.js.
// I need to import formatMoney from money.js
import { formatMoney as fmtMoney, toPaise } from "../core/money.js";

// DOM Elements
const authView = document.getElementById("auth-view");
const dashboardView = document.getElementById("dashboard-view");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authMsg = document.getElementById("auth-message");
const txnList = document.getElementById("txn-list");
const addTxnForm = document.getElementById("add-txn-form");
const netBalanceEl = document.getElementById("net-balance");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const syncStatusEl = document.getElementById("sync-status");
const syncBtn = document.getElementById("sync-btn");

let currentUser = null;
let currentFilter = "all";

// INIT
async function init() {
  try {
    await DB.init();
    setupEventListeners();

    // Listen to Auth State
    subscribeToAuth((user) => {
      currentUser = user;
      updateUIState();
      if (user) {
        // If logged in, try to sync (optional, maybe manual only to save data)
        // Let's do a pull on login
        Sync.pull().then(refreshData);
      }
    });

    // Initial Data Load (Offline mode supported immediately)
    refreshData();
  } catch (e) {
    console.error("Init failed", e);
    alert("Failed to initialize database. Please update browser.");
  }
}

function updateUIState() {
  if (currentUser) {
    authView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    syncStatusEl.textContent = "Online";
    syncStatusEl.classList.add("online");
    syncBtn.style.display = "block";
  } else {
    // We allow offline usage without login?
    // "Optional Cloud Sync - OFF by default, Enabled only after Email Login"
    // But we need a way to show Dashboard without login.
    // The "Skip / Offline Mode" button handles this.
    // If we are in "skipped" mode, we hide auth view.
    // But on refresh, we check auth. If no auth, we show Auth View by default?
    // Or we check if user has skipped before?
    // Let's rely on user clicking "Skip" for now to enter offline mode,
    // unless we detect they have data?
    // Simplest: Show Auth view if not logged in. User can click Skip.
    // Show Auth View by default if not logged in
    authView.classList.remove("hidden");
    dashboardView.classList.add("hidden");

    syncStatusEl.textContent = "Offline";
    syncStatusEl.classList.remove("online");
    syncBtn.style.display = "none";
  }
}

function setupEventListeners() {
  // Auth Forms
  document.getElementById("show-signup").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("auth-forms").classList.add("hidden");
    document.getElementById("signup-forms").classList.remove("hidden");
    authMsg.textContent = "";
  });

  document.getElementById("show-login").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("signup-forms").classList.add("hidden");
    document.getElementById("auth-forms").classList.remove("hidden");
    authMsg.textContent = "";
  });

  document.getElementById("skip-login").addEventListener("click", () => {
    authView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector("button");
    const originalText = btn.innerText;
    btn.innerText = "Logging in...";
    btn.disabled = true;

    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-pass").value;
    const res = await loginUser(email, pass);

    if (res.error) authMsg.textContent = res.error;
    btn.innerText = originalText;
    btn.disabled = false;
  });

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = signupForm.querySelector("button");
    const originalText = btn.innerText;
    btn.innerText = "Creating Account...";
    btn.disabled = true;

    const email = document.getElementById("signup-email").value;
    const pass = document.getElementById("signup-pass").value;
    const res = await registerUser(email, pass);

    if (res.error) authMsg.textContent = res.error;
    btn.innerText = originalText;
    btn.disabled = false;
  });

  document.getElementById("logout-btn").addEventListener("click", async () => {
    if (currentUser) {
      await logoutUser();
      // Optional: Ask to clear local data?
      // "Full Local + Cloud Data Delete" is a feature.
      // Logout is just logout. Data persists locally?
      // Usually, multi-user on same device is bad for local-first without strict separation.
      // But requirement says "Firestore Rules = Per-user access only".
      // If I logout and another user logs in, they see old data?
      // Risk.
      // For MVP: Logout -> Redirect to Auth. Data stays.
      // If new user logs in -> Data merges? That's bad.
      // PROPER WAY: clear DB on logout?
      // "Users can fully export & delete data".
      // Let's just sign out.
      // Smooth Logout: Don't reload, just reset UI
      currentUser = null;
      updateUIState();
      // Optional: Clear transaction list or leave it?
      // Ideally clear it to prevent confusion if next user logs in
      // But for "Offline Mode" switching, maybe we keep it?
      // Safest for "Logout" is to clear the view.
      document.getElementById("txn-list").innerHTML = "";
      document.getElementById("net-balance").innerText = "₹0.00";
      document.getElementById("total-income").innerText = "₹0.00";
      document.getElementById("total-expense").innerText = "₹0.00";
      // window.location.reload(); // Disabled for smoother offline experience
      // The user issue was "blank screen on logout".
      // Now that we have Error Boundary + Auth View Fix + SW Cache for SDKs,
      // Reload SHOULD be safe.
      // But if specific offline requirement, let's stick to reload BUT
      // ensure we don't crash.
      // I'll keep reload for now as it's the most robust way to reset state.
      // WAIT: User specifically asked to "remove such errors ... on loging out".
      // If I remove reload, I avoid the risk of re-fetching failing.
      // So, manual reset is better for offline stability.
    } else {
      // If offline/skip mode, just show auth logic
      authView.classList.remove("hidden");
      dashboardView.classList.add("hidden");
    }
  });

  // Add Transaction
  addTxnForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const type = document.querySelector('input[name="type"]:checked').value;
    const amountStr = document.getElementById("amount-input").value;
    const category = document.getElementById("category-input").value;
    const note = document.getElementById("note-input").value;

    const amountPaise = toPaise(amountStr);
    if (amountPaise <= 0) return alert("Enter valid amount");

    const txn = {
      id: generateUUID(),
      amount_paise: amountPaise,
      type,
      category,
      note,
      created_at_utc: getUTCNow(),
      source: "pwa",
      synced: false,
      deleted: false,
      version: 1,
    };

    await DB.addTransaction(txn);
    addTxnForm.reset();
    refreshData();

    // Auto-sync if online
    if (currentUser) {
      Sync.push(); // fire and forget
    }
  });

  // Filters
  document.querySelectorAll(".filter-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-chip")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      refreshData();
    });
  });

  // Sync Btn
  syncBtn.addEventListener("click", async () => {
    syncBtn.classList.add("spin");
    try {
      await Sync.syncAll();
      refreshData();
    } catch (e) {
      console.error(e);
      alert("Sync Failed");
    }
    syncBtn.classList.remove("spin");
  });

  // Export
  document.getElementById("export-btn").addEventListener("click", () => {
    // Show options? Just default to CSV for button click
    exportCSV();
  });
}

// Render Logic
async function refreshData() {
  const allTxns = await DB.getAllTransactions();

  // Filter
  const filtered = allTxns.filter((t) => {
    if (currentFilter === "all") return true;
    return t.category === currentFilter;
  });

  // Stats
  let totalIncome = 0;
  let totalExpense = 0;

  allTxns.forEach((t) => {
    // Calc totals on ALL, or filtered? Usually ALL is better for "Net Balance"
    if (t.type === "income") totalIncome += t.amount_paise;
    else totalExpense += t.amount_paise;
  });

  netBalanceEl.innerText = fmtMoney(totalIncome - totalExpense);
  totalIncomeEl.innerText = fmtMoney(totalIncome);
  totalExpenseEl.innerText = fmtMoney(totalExpense);

  // Render List
  txnList.innerHTML = "";

  if (filtered.length === 0) {
    txnList.innerHTML = '<div class="empty-state">No transactions found.</div>';
    return;
  }

  // Group by Date
  const grouped = {};
  filtered.forEach((t) => {
    const dateKey = getDateKey(t.created_at_utc); // YYYY-MM-DD
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(t);
  });

  // Sort dates desc
  const sortedDates = Object.keys(grouped).sort().reverse();

  sortedDates.forEach((date) => {
    // Date Header
    const header = document.createElement("div");
    header.className = "date-header";
    // Format YYYY-MM-DD to readable
    const dateObj = new Date(date);
    header.innerText = dateObj.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    txnList.appendChild(header);

    grouped[date].forEach((t) => {
      const item = document.createElement("div");
      item.className = "txn-item";

      const emoji = getCategoryEmoji(t.category);
      const timeStr = new Date(t.created_at_utc).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      item.innerHTML = `
                <div class="txn-left">
                    <div class="txn-cat-emoji">${emoji}</div>
                    <div class="txn-info">
                        <h4>${t.category}</h4>
                        <p>${t.note || timeStr}</p>
                    </div>
                </div>
                <div class="txn-right">
                    <span class="txn-amount ${t.type}">
                        ${t.type === "expense" ? "-" : "+"} ${fmtMoney(
        t.amount_paise
      )}
                    </span>
                    <button class="delete-btn" data-id="${t.id}">×</button>
                </div>
            `;

      // Delete Listener
      item.querySelector(".delete-btn").addEventListener("click", async (e) => {
        if (confirm("Delete this transaction?")) {
          await DB.deleteTransaction(t.id);
          refreshData();
          if (currentUser) Sync.push();
        }
      });

      txnList.appendChild(item);
    });
  });
}

function getCategoryEmoji(cat) {
  const map = {
    food: "🍔",
    essentials: "🧴",
    clothes: "👕",
    fun: "🎉",
    others: "📦",
  };
  return map[cat] || "📦";
}

// Start
init();

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then(() => console.log("SW Registered"))
    .catch((err) => console.log("SW Fail", err));
}
