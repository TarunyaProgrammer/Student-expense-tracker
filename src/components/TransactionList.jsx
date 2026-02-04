import { getDateKey, formatDateTimeIST } from '../core/utils';
import { formatMoney } from '../core/money';
import { Coffee, ShoppingBag, Shirt, PartyPopper, Package, Trash2 } from 'lucide-react';

export default function TransactionList({ transactions, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return <div className="empty-state text-muted" style={{textAlign:'center', padding:'30px'}}>No transactions found.</div>;
  }

  const grouped = {};
  transactions.forEach((t) => {
    const dateKey = getDateKey(t.created_at_utc);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(t);
  });

  const sortedDates = Object.keys(grouped).sort().reverse();

  return (
    <div className="txn-list">
      {sortedDates.map((date) => (
        <div key={date}>
          <div className="text-muted" style={{fontSize:'0.75rem', textTransform:'uppercase', margin:'15px 0 5px', letterSpacing:'1px'}}>
              {new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
          </div>
          {grouped[date].map((t) => (
            <TransactionItem key={t.id} t={t} onDelete={onDelete} />
          ))}
        </div>
      ))}
    </div>
  );
}

function TransactionItem({ t, onDelete }) {
  const Icon = getCategoryIcon(t.category);
  const isExpense = t.type === 'expense';

  return (
    <div className="txn-item">
      <div className="txn-left">
        <div className="icon-box">
             <Icon size={20} />
        </div>
        <div className="txn-info">
          <h4>{t.category.charAt(0).toUpperCase() + t.category.slice(1)}</h4>
          <p>{t.note || "No note"}</p>
        </div>
      </div>
      <div className="txn-right" style={{textAlign:'right'}}>
        <div className={`txn-amount ${isExpense ? '' : 'text-success'}`}>
          {isExpense ? "-" : "+"} {formatMoney(t.amount_paise)}
        </div>
        {/* Only show delete on hover or add overflow handling separately - keeping simple for now */}
      </div>
    </div>
  );
}

function getCategoryIcon(cat) {
  const map = {
    food: Coffee,
    essentials: ShoppingBag,
    clothes: Shirt,
    fun: PartyPopper,
    others: Package,
  };
  return map[cat] || Package;
}
