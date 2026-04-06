/**
 * DilemmaModal – Add / Edit modal form
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

const EMPTY = {
  situation: '',
  description: '',
  category: 'Ethics',
  difficulty: 'Medium',
  source: '',
};

export default function DilemmaModal({ isOpen, mode, initial, onClose, onSave, CATEGORIES, DIFFICULTIES }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
      setErrors({});
    }
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.situation.trim()) e.situation = 'Situation title is required';
    if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
    onClose();
  };

  const isEdit = mode === 'edit';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit dilemma' : 'Add dilemma'}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? '✏️ Edit Dilemma' : '+ Add New Dilemma'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Situation */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-situation">Situation Title *</label>
            <input
              id="modal-situation"
              className="form-input"
              type="text"
              placeholder="e.g. The Trolley Problem"
              value={form.situation}
              onChange={e => set('situation', e.target.value)}
              autoFocus
            />
            {errors.situation && (
              <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.situation}</p>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-description">Description *</label>
            <textarea
              id="modal-description"
              className="form-textarea"
              placeholder="Describe the moral dilemma, its context, and stakes..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={4}
            />
            {errors.description && (
              <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.description}</p>
            )}
          </div>

          {/* Row: Category + Difficulty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="modal-category">Category</label>
              <select
                id="modal-category"
                className="form-select"
                value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="modal-difficulty">Difficulty</label>
              <select
                id="modal-difficulty"
                className="form-select"
                value={form.difficulty}
                onChange={e => set('difficulty', e.target.value)}
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Source */}
          <div className="form-group" style={{ marginTop: 18 }}>
            <label className="form-label" htmlFor="modal-source">Source / Reference</label>
            <input
              id="modal-source"
              className="form-input"
              type="text"
              placeholder="e.g. Philosophy, Psychology, Literature..."
              value={form.source}
              onChange={e => set('source', e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id={isEdit ? 'modal-save-btn' : 'modal-add-btn'}>
              {isEdit ? <><Save size={15} /> Save Changes</> : <><Plus size={15} /> Add Dilemma</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
