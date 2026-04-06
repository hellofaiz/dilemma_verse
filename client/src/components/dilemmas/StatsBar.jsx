/**
 * StatsBar – live summary metrics at the top of the page
 */

import React from 'react';
import { Brain, Tag, Flame, FileText } from 'lucide-react';

export default function StatsBar({ stats, filteredCount }) {
  const cards = [
    {
      label: 'Total Dilemmas',
      value: stats.total,
      sub: 'in your collection',
      icon: <Brain size={18} color="var(--accent-light)" />,
    },
    {
      label: 'Filtered Results',
      value: filteredCount,
      sub: 'matching current view',
      icon: <FileText size={18} color="#06b6d4" />,
    },
    {
      label: 'Categories',
      value: stats.categories,
      sub: 'unique topics covered',
      icon: <Tag size={18} color="#8b5cf6" />,
    },
    {
      label: 'Hard Level',
      value: stats.hard,
      sub: 'most challenging',
      icon: <Flame size={18} color="var(--danger)" />,
    },
  ];

  return (
    <div className="stats-bar" id="stats-bar">
      {cards.map(card => (
        <div key={card.label} className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">{card.label}</span>
            {card.icon}
          </div>
          <span className="stat-value">{card.value}</span>
          <span className="stat-sub">{card.sub}</span>
        </div>
      ))}
    </div>
  );
}
