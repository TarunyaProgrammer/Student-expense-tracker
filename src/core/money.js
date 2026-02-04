export function toPaise(amount) {
    if (!amount) return 0;
    const floatVal = parseFloat(amount);
    if (isNaN(floatVal)) return 0;
    return Math.round(floatVal * 100);
}

export function formatMoney(paise) {
  if (paise === null || paise === undefined || isNaN(paise)) return '₹0.00';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(rupees);
}
