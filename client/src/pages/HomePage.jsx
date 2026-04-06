/**
 * HomePage – main page bringing all pieces together
 */

import React, { useState } from 'react';
import { useDilemmas }        from '../hooks/useDilemmas';
import Navbar                 from '../components/layout/Navbar';
import StatsBar               from '../components/dilemmas/StatsBar';
import DilemmaList            from '../components/dilemmas/DilemmaList';
import DilemmaModal           from '../components/dilemmas/DilemmaModal';
import DeleteConfirmModal     from '../components/dilemmas/DeleteConfirmModal';
import UploadZone             from '../components/common/UploadZone';
import Toast                  from '../components/common/Toast';

export default function HomePage() {
  const {
    dilemmas,
    allDilemmas,
    stats,
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterDifficulty, setFilterDifficulty,
    addDilemma,
    updateDilemma,
    deleteDilemma,
    importFromExcel,
    toasts, removeToast,
    CATEGORIES,
    DIFFICULTIES,
  } = useDilemmas();

  // Modal state
  const [modalOpen, setModalOpen]     = useState(false);
  const [modalMode, setModalMode]     = useState('add');       // 'add' | 'edit'
  const [editTarget, setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Handlers ──────────────────────────────────────────────────
  const openAdd = () => {
    setModalMode('add');
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (dilemma) => {
    setModalMode('edit');
    setEditTarget(dilemma);
    setModalOpen(true);
  };

  const openDelete = (dilemma) => {
    setDeleteTarget(dilemma);
  };

  const handleSave = (formData) => {
    if (modalMode === 'edit' && editTarget) {
      updateDilemma(editTarget.id, formData);
    } else {
      addDilemma(formData);
    }
  };

  return (
    <>
      {/* ── Top Nav ─────────────────────────────────────────── */}
      <Navbar totalCount={allDilemmas.length} />

      {/* ── Page body ───────────────────────────────────────── */}
      <main className="main-content">
        {/* Page header */}
        <header className="page-header">
          <h1>
            Moral <span className="gradient-text">Dilemmas</span>
          </h1>
          <p>
            View, manage, and explore ethical situations — import from Excel or add your own.
          </p>
        </header>

        {/* Excel uploader */}
        <UploadZone onImport={importFromExcel} />

        {/* Stats */}
        <StatsBar stats={stats} filteredCount={dilemmas.length} />

        {/* Divider */}
        <div className="divider">Dilemma Collection</div>

        {/* Main list (search, filter, grid/table) */}
        <DilemmaList
          dilemmas={dilemmas}
          searchQuery={searchQuery}         setSearchQuery={setSearchQuery}
          filterCategory={filterCategory}   setFilterCategory={setFilterCategory}
          filterDifficulty={filterDifficulty} setFilterDifficulty={setFilterDifficulty}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={openDelete}
          CATEGORIES={CATEGORIES}
          DIFFICULTIES={DIFFICULTIES}
        />
      </main>

      {/* ── Modals ──────────────────────────────────────────── */}
      <DilemmaModal
        isOpen={modalOpen}
        mode={modalMode}
        initial={editTarget}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        CATEGORIES={CATEGORIES}
        DIFFICULTIES={DIFFICULTIES}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        dilemma={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteDilemma}
      />

      {/* ── Toast notifications ──────────────────────────────── */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}
