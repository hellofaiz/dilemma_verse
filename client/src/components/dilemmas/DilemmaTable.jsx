/**
 * DilemmaTable – spreadsheet-style table view
 */

import React from 'react';
import { Pencil, Trash2, BookOpen, Zap } from 'lucide-react';

const difficultyClass = {
  Easy:   'badge-success',
  Medium: 'badge-warning',
  Hard:   'badge-danger',
};

export default function DilemmaTable({ dilemmas, onEdit, onDelete }) {
  if (!dilemmas.length) return null;

  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table aria-label="Dilemmas list">
          <thead>
            <tr>
              <th>#</th>
              <th>Situation</th>
              <th>Description</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Source</th>
              <th>Added</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dilemmas.map((d, i) => (
              <tr key={d.id} id={`dilemma-row-${d.id}`}>
                {/* Index */}
                <td style={{ color: 'var(--text-muted)', fontWeight: 500, width: 48 }}>
                  {String(i + 1).padStart(2, '0')}
                </td>

                {/* Situation */}
                <td style={{
                  maxWidth: 220,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'normal',
                  lineHeight: 1.4,
                }}>
                  {d.situation}
                </td>

                {/* Description (truncated) */}
                <td style={{
                  maxWidth: 320,
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  whiteSpace: 'normal',
                }}>
                  {d.description.length > 120
                    ? d.description.slice(0, 120) + '…'
                    : d.description}
                </td>

                {/* Category */}
                <td>
                  <span className="badge badge-accent">
                    <BookOpen size={10} />
                    {d.category}
                  </span>
                </td>

                {/* Difficulty */}
                <td>
                  <span className={`badge ${difficultyClass[d.difficulty] || 'badge-default'}`}>
                    <Zap size={10} />
                    {d.difficulty}
                  </span>
                </td>

                {/* Source */}
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {d.source || '—'}
                </td>

                {/* Date */}
                <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  {d.createdAt}
                </td>

                {/* Actions */}
                <td>
                  <div className="td-actions" style={{ justifyContent: 'center' }}>
                    <button
                      className="btn btn-secondary btn-icon btn-sm"
                      onClick={() => onEdit(d)}
                      id={`edit-row-${d.id}`}
                      aria-label={`Edit ${d.situation}`}
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      className="btn btn-danger btn-icon btn-sm"
                      onClick={() => onDelete(d)}
                      id={`delete-row-${d.id}`}
                      aria-label={`Delete ${d.situation}`}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
