/**
 * DilemmaList – toolbar + grid/table view + empty state
 * Orchestrates all dilemma display logic.
 */

import React, { useState } from 'react';
import {
  Plus, Search, LayoutGrid, List,
  SlidersHorizontal, Filter
} from 'lucide-react';

import DilemmaCard  from './DilemmaCard';
import DilemmaTable from './DilemmaTable';

export default function DilemmaList({
  dilemmas,
  searchQuery, setSearchQuery,
  filterCategory, setFilterCategory,
  filterDifficulty, setFilterDifficulty,
  onAdd, onEdit, onDelete,
  CATEGORIES, DIFFICULTIES,
}) {
  const [view, setView] = useState('grid'); // 'grid' | 'table'
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section id="dilemma-list-section">
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="toolbar">
        {/* Left: search + filter toggle */}
        <div className="toolbar-left">
          <div className="search-wrapper">
            <Search size={15} className="search-icon" />
            <input
              id="dilemma-search-input"
              className="search-input"
              type="search"
              placeholder="Search situations, categories…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search dilemmas"
            />
          </div>

          <button
            id="filter-toggle-btn"
            className={`btn btn-secondary btn-sm${showFilters ? ' active' : ''}`}
            onClick={() => setShowFilters(p => !p)}
            title="Toggle filters"
            style={showFilters ? { borderColor: 'var(--border-active)', color: 'var(--accent-light)' } : {}}
          >
            <Filter size={14} />
            Filters
            {(filterCategory !== 'All' || filterDifficulty !== 'All') && (
              <span style={{
                background: 'var(--accent)',
                color: 'white',
                borderRadius: '99px',
                padding: '0 6px',
                fontSize: '0.68rem',
                fontWeight: 700,
              }}>
                {[filterCategory !== 'All', filterDifficulty !== 'All'].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Right: view toggle + add button */}
        <div className="toolbar-right">
          {/* View toggle */}
          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              id="grid-view-btn"
              className={`view-btn${view === 'grid' ? ' active' : ''}`}
              onClick={() => setView('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              id="table-view-btn"
              className={`view-btn${view === 'table' ? ' active' : ''}`}
              onClick={() => setView('table')}
              aria-label="Table view"
              title="Table view"
            >
              <List size={15} />
            </button>
          </div>

          {/* Add button */}
          <button
            id="add-dilemma-btn"
            className="btn btn-primary"
            onClick={onAdd}
          >
            <Plus size={16} />
            Add Dilemma
          </button>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      {showFilters && (
        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 20,
          padding: '16px 18px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          animation: 'fadeIn 0.15s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SlidersHorizontal size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Filter by:
            </span>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label
              htmlFor="filter-category"
              style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}
            >
              Category
            </label>
            <select
              id="filter-category"
              className="form-select"
              style={{ width: 'auto', minWidth: 140, padding: '6px 32px 6px 10px', fontSize: '0.82rem' }}
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Difficulty filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label
              htmlFor="filter-difficulty"
              style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}
            >
              Difficulty
            </label>
            <select
              id="filter-difficulty"
              className="form-select"
              style={{ width: 'auto', minWidth: 130, padding: '6px 32px 6px 10px', fontSize: '0.82rem' }}
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value)}
            >
              <option value="All">All Levels</option>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Reset */}
          {(filterCategory !== 'All' || filterDifficulty !== 'All') && (
            <button
              id="reset-filters-btn"
              className="btn btn-secondary btn-sm"
              onClick={() => { setFilterCategory('All'); setFilterDifficulty('All'); }}
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* ── Results count ────────────────────────────────────── */}
      {dilemmas.length > 0 && (
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginBottom: 16,
        }}>
          Showing <strong style={{ color: 'var(--text-secondary)' }}>{dilemmas.length}</strong> dilemma{dilemmas.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* ── Empty State ──────────────────────────────────────── */}
      {dilemmas.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <Search size={30} />
          </div>
          <h3>No dilemmas found</h3>
          <p>
            Try adjusting your search or filters, or add a new dilemma to get started.
          </p>
          <button className="btn btn-primary" onClick={onAdd} id="empty-add-btn">
            <Plus size={15} />
            Add your first dilemma
          </button>
        </div>
      )}

      {/* ── Grid View ────────────────────────────────────────── */}
      {dilemmas.length > 0 && view === 'grid' && (
        <div className="cards-grid" id="dilemmas-grid">
          {dilemmas.map((d, i) => (
            <DilemmaCard
              key={d.id}
              dilemma={d}
              index={i}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* ── Table View ───────────────────────────────────────── */}
      {dilemmas.length > 0 && view === 'table' && (
        <DilemmaTable
          dilemmas={dilemmas}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </section>
  );
}
