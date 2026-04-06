/**
 * DilemmaCard – single card in the grid view
 */

import React from 'react';
import { Pencil, Trash2, BookOpen, Zap } from 'lucide-react';

const difficultyBadge = {
  Easy:   'badge-success',
  Medium: 'badge-warning',
  Hard:   'badge-danger',
};

const categoryColors = {
  'Ethics':           '#6366f1',
  'Game Theory':      '#8b5cf6',
  'Moral Development':'#06b6d4',
  'Metaphysics':      '#f59e0b',
  'Applied Ethics':   '#10b981',
  'Logic':            '#ec4899',
  'Other':            '#64748b',
};

export default function DilemmaCard({ dilemma, index, onEdit, onDelete }) {
  const accentColor = categoryColors[dilemma.category] || categoryColors['Other'];

  return (
    <article
      className="dilemma-card"
      id={`dilemma-card-${dilemma.id}`}
      style={{ '--card-accent': accentColor }}
    >
      {/* Gradient top accent bar */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
          borderRadius: '16px 16px 0 0',
        }}
      />

      {/* Row: index + actions */}
      <div className="card-header-row">
        <span className="card-number" style={{ color: accentColor }}>
          #{String(index + 1).padStart(2, '0')}
        </span>
        <div className="card-actions">
          <button
            className="btn btn-secondary btn-icon btn-sm"
            onClick={() => onEdit(dilemma)}
            aria-label={`Edit ${dilemma.situation}`}
            id={`edit-card-${dilemma.id}`}
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            className="btn btn-danger btn-icon btn-sm"
            onClick={() => onDelete(dilemma)}
            aria-label={`Delete ${dilemma.situation}`}
            id={`delete-card-${dilemma.id}`}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="card-title">{dilemma.situation}</h3>

      {/* Description */}
      <p className="card-description">{dilemma.description}</p>

      {/* Footer */}
      <div className="card-footer">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className={`badge badge-accent`} style={{ '--badge-color': accentColor }}>
            <BookOpen size={10} />
            {dilemma.category}
          </span>
          <span className={`badge ${difficultyBadge[dilemma.difficulty] || 'badge-default'}`}>
            <Zap size={10} />
            {dilemma.difficulty}
          </span>
        </div>
        {dilemma.source && (
          <span className="badge badge-default" style={{ fontSize: '0.68rem' }}>
            {dilemma.source}
          </span>
        )}
      </div>
    </article>
  );
}
