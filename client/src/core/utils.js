/**
 * Core Utilities for Budgettt
 */

// Generate a UUID v4 compliant string
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get current UTC ISO string
export function getUTCNow() {
  return new Date().toISOString();
}

// Format ISO string to readable Indian date (IST)
// e.g., "12 Dec 2025, 10:30 AM"
export function formatDateTimeIST(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Asia/Kolkata' // Enforce IST
  }).format(date);
}

// Get standard date string for grouping (e.g., "2025-12-08")
export function getDateKey(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
     // We want grouping by LOCAL day (IST) usually, or UTC?
     // User said "Display Time = IST", so grouping should logically be by IST day.
    return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD
}
