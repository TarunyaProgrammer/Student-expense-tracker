/**
 * Export Utility
 */
import { DB } from "./db.js";
import { formatDateTimeIST } from "./utils.js";

// FIX IMPORT
import { formatMoney as fmtMoney } from "./money.js";

export async function exportCSV() {
  const txns = await DB.getAllTransactions();
  if (!txns.length) return alert("No transactions to export.");

  const headers = [
    "ID",
    "Date (UTC)",
    "Type",
    "Category",
    "Amount (Paise)",
    "Amount (INR)",
    "Note",
    "Source",
  ];
  const rows = txns.map((t) => [
    t.id,
    t.created_at_utc,
    t.type,
    t.category,
    t.amount_paise,
    fmtMoney(t.amount_paise), // Using the imported function
    `"${(t.note || "").replace(/"/g, '""')}"`, // Escape quotes
    t.source,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );

  downloadFile(
    csvContent,
    `budgettt_export_${new Date().toISOString().slice(0, 10)}.csv`,
    "text/csv"
  );
}

export async function exportJSON() {
  const txns = await DB.getAllTransactions();
  const jsonContent = JSON.stringify(txns, null, 2);
  downloadFile(
    jsonContent,
    `budgettt_backup_${new Date().toISOString().slice(0, 10)}.json`,
    "application/json"
  );
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
