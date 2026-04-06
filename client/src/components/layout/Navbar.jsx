/**
 * Navbar – top navigation bar
 */

import React from 'react';
import { Brain } from 'lucide-react';

export default function Navbar({ totalCount }) {
  return (
    <nav className="navbar">
      <a className="navbar-brand" href="/">
        <div className="navbar-brand-icon">
          <Brain size={18} color="white" />
        </div>
        Dilemma_Verse
      </a>

      <div className="navbar-actions">
        <span className="navbar-badge">
          {totalCount} Dilemma{totalCount !== 1 ? 's' : ''}
        </span>
      </div>
    </nav>
  );
}
