import React from 'react';
import { GraduationCap, LogOut, Database } from 'lucide-react';

export default function Navbar({ user, onLogout, onOpenDbInspector }) {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>
          <div className="brand-text">
            <h1>EduPortal</h1>
            <span>Student Academic Information System</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* SQL DB Inspector button visible to all */}
          <button
            onClick={onOpenDbInspector}
            className="btn-logout"
            title="Inspect SQL Database Tables"
            style={{ borderColor: '#c7d2fe', color: '#4f46e5', background: '#eef2ff' }}
          >
            <Database size={15} />
            <span>SQL Database</span>
          </button>

          {user && (
            <div className="user-nav">
              <div className="user-badge">
                <div className="user-avatar-mini">{getInitials(user.name)}</div>
                <div className="user-info-mini">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>

              <button className="btn-logout" onClick={onLogout} title="Sign Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
