/**
 * Money Logic for Budgettt
 * STRICTLY INTEGER PAISE ONLY
 */

// Format paise to INR string
// 12345 -> "₹123.45"
export function formatMoney(paise) {
  if (paise === null || paise === undefined || isNaN(paise)) return '₹0.00';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(rupees);
}

// Parse string/float to integer paise
// "123.45" -> 12345
// 123.45 -> 12345
export function toPaise(value) {
  if (!value) return 0;
  // If string, remove non-numeric chars except dot
  const num = parseFloat(value.toString().replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

// Safe Addition
export function add(a, b) {
  return (a || 0) + (b || 0);
}

// Safe Subtraction
export function sub(a, b) {
  return (a || 0) - (b || 0);
}
