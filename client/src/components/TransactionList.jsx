import { getDateKey, formatDateTimeIST } from '../core/utils';
import { formatMoney } from '../core/money';

export default function TransactionList({ transactions, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return <div className="empty-state">No transactions found.</div>;
  }

  // Group by Date
  const grouped = {};
  transactions.forEach((t) => {
    const dateKey = getDateKey(t.created_at_utc); // YYYY-MM-DD
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(t);
  });

  // Sort dates desc
  const sortedDates = Object.keys(grouped).sort().reverse();

  return (
    <div id="txn-list" className="txn-list">
      {sortedDates.map((date) => (
        <div key={date}>
          <DateHeader dateKey={date} />
          {grouped[date].map((t) => (
            <TransactionItem key={t.id} t={t} onDelete={onDelete} />
          ))}
        </div>
      ))}
    </div>
  );
}

function DateHeader({ dateKey }) {
  const dateObj = new Date(dateKey); // YYYY-MM-DD works in Date constructor
  const dateStr = dateObj.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  
  return <div className="date-header">{dateStr}</div>;
}

function TransactionItem({ t, onDelete }) {
  const emoji = getCategoryEmoji(t.category);
  const timeStr = new Date(t.created_at_utc).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
  });

  return (
    <div className="txn-item">
      <div className="txn-left">
        <div className="txn-cat-emoji">{emoji}</div>
        <div className="txn-info">
          <h4>{t.category}</h4>
          <p>{t.note || timeStr}</p>
        </div>
      </div>
      <div className="txn-right">
        <span className={`txn-amount ${t.type}`}>
          {t.type === "expense" ? "-" : "+"} {formatMoney(t.amount_paise)}
        </span>
        <button 
            className="delete-btn" 
            onClick={() => onDelete(t.id)}
            aria-label="Delete transaction"
        >
          ×
        </button>
      </div>
    </div>
  );
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
