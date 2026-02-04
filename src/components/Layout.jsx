import { useState } from 'react';
import { LayoutDashboard, Receipt, Wallet, PieChart, Settings, Plus, LogOut } from 'lucide-react';

export default function Layout({ children, onLogout, activeTab, onTabChange, onAddClick }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ];

  return (
    <div className="app-layout">
      {/* DESKTOP SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-area">
          <Wallet className="text-primary" size={28} />
          <span>Budgettt</span>
        </div>

        <nav className="nav-menu">
          {navItems.map(item => (
            <button 
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item text-danger" onClick={onLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {children}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-nav">
        {navItems.map(item => {
           // Skip if we have too many
           return (
             <button
                key={item.id}
                className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => onTabChange(item.id)}
             >
                <item.icon size={20} />
                <span>{item.label}</span>
             </button>
           )
        })}
        {/* FAB for Add */}
        <div style={{ position: 'relative', width: 0 }}>
             <button className="fab" onClick={onAddClick}>
                <Plus size={24} />
             </button>
        </div>
      </nav>
    </div>
  );
}
