import { DB } from './db.js';
import { formatDateTimeIST } from './utils.js';
import { formatMoney } from './money.js';

export async function exportCSV() {
    const txns = await DB.getAllTransactions();
    if (txns.length === 0) {
        alert("No transactions to export");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Type,Category,Amount,Note,ID\n";

    txns.forEach(t => {
        const row = [
            formatDateTimeIST(t.created_at_utc).replace(',', ''),
            t.type,
            t.category,
            (t.amount_paise / 100).toFixed(2), // Export as float for user utility
            `"${t.note || ''}"`,
            t.id
        ];
        csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "budgettt_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
