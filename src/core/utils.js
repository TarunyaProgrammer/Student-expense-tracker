export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getUTCNow() {
  return new Date().toISOString();
}

export function formatDateTimeIST(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

export function getDateKey(isoString) {
  if (!isoString) return 'Unknown';
    // Use local time for date grouping, essentially
    const date = new Date(isoString);
    // YYYY-MM-DD
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - (offset*60*1000));
    return local.toISOString().split('T')[0];
}
