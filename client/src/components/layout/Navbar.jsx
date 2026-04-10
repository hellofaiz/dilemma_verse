/**
 * components/layout/Navbar.jsx — with auth user display + logout
 */

import React from 'react';
import { Brain, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ totalCount }) {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <nav className="navbar">
      <a className="navbar-brand" href="/">
        <div className="navbar-brand-icon">
          <Brain size={18} color="white" />
        </div>
        DilemmaVerse
      </a>

      <div className="navbar-actions">
        <span className="navbar-badge">
          {totalCount} Dilemma{totalCount !== 1 ? 's' : ''}
        </span>

        {user && (
          <div className="navbar-user">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="navbar-avatar" referrerPolicy="no-referrer" />
              : <div className="navbar-avatar-fallback">{initials}</div>
            }
            <span className="navbar-user-name">{user.name.split(' ')[0]}</span>
            <button
              id="logout-btn"
              className="btn btn-secondary btn-sm btn-icon"
              onClick={logout}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
