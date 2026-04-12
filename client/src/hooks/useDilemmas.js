/**
 * useDilemmas – central state management hook connected to real Backend API
 * All fetch calls include credentials:'include' to send the httpOnly cookie.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { tokenStorage } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/situation';

// Returns auth headers with Bearer token from localStorage
const getAuthHeaders = (extra = {}) => ({
  ...extra,
  ...(tokenStorage.get() ? { Authorization: `Bearer ${tokenStorage.get()}` } : {}),
});

const CATEGORIES  = ['Ethics', 'Game Theory', 'Moral Development', 'Metaphysics', 'Applied Ethics', 'Logic', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export function useDilemmas() {
  const [dilemmas, setDilemmas]               = useState([]);
  const [searchQuery, setSearchQuery]         = useState('');
  const [filterCategory, setFilterCategory]   = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [toasts, setToasts]                   = useState([]);

  // ── Toast helpers ──────────────────────────────────────────────
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Fetch all situations from DB ───────────────────────────────
  const fetchDilemmas = useCallback(async () => {
    try {
      const res  = await fetch(API_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const mapped = json.data.map(d => ({
        ...d,
        situation: d.title,
        createdAt: new Date(d.createdAt).toISOString().split('T')[0],
      }));
      setDilemmas(mapped);
    } catch (err) {
      console.error('[fetchDilemmas]', err);
      addToast('Error loading data from server.', 'error');
    }
  }, [addToast]);

  useEffect(() => { fetchDilemmas(); }, [fetchDilemmas]);

  // ── CRUD ───────────────────────────────────────────────────────
  const addDilemma = useCallback(async (data) => {
    try {
      const res = await fetch(API_URL, {
        method:  'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body:    JSON.stringify({ ...data, title: data.situation, tags: [] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast('Dilemma added successfully!', 'success');
      await fetchDilemmas();
    } catch (err) {
      console.error('[addDilemma]', err);
      addToast('Error saving to server.', 'error');
    }
  }, [addToast, fetchDilemmas]);

  const updateDilemma = useCallback(async (id, data) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method:  'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body:    JSON.stringify({ ...data, title: data.situation, tags: [] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast('Dilemma updated successfully!', 'success');
      await fetchDilemmas();
    } catch (err) {
      console.error('[updateDilemma]', err);
      addToast('Error updating on server.', 'error');
    }
  }, [addToast, fetchDilemmas]);

  const deleteDilemma = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast('Dilemma deleted.', 'error');
      await fetchDilemmas();
    } catch (err) {
      console.error('[deleteDilemma]', err);
      addToast('Error deleting from server.', 'error');
    }
  }, [addToast, fetchDilemmas]);

  // ── Excel Import (bulk) ────────────────────────────────────────
  const importFromExcel = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const sheet    = workbook.Sheets[workbook.SheetNames[0]];
        const rows     = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        const imported = rows.map(row => ({
          title:       String(row['Situation'] || row['situation'] || row['Title'] || row['title'] || 'Untitled'),
          description: String(row['Description'] || row['description'] || ''),
          category:    String(row['Category']    || row['category']    || 'Other'),
          difficulty:  String(row['Difficulty']  || row['difficulty']  || 'Medium'),
          source:      String(row['Source']      || row['source']      || ''),
          tags:        row['Tags'] ? String(row['Tags']) : [],
        }));

        const res = await fetch(`${API_URL}/bulk`, {
          method:  'POST',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body:    JSON.stringify(imported),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        addToast(`Imported ${json.data.count} situation(s) successfully!`, 'success');
        await fetchDilemmas();
      } catch (err) {
        console.error('[importFromExcel]', err);
        addToast('Failed to upload Excel file.', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }, [addToast, fetchDilemmas]);

  // ── Filtered view ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return dilemmas.filter(d => {
      const matchSearch = !q ||
        d.situation?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.category?.toLowerCase().includes(q);
      const matchCat  = filterCategory   === 'All' || d.category   === filterCategory;
      const matchDiff = filterDifficulty === 'All' || d.difficulty  === filterDifficulty;
      return matchSearch && matchCat && matchDiff;
    });
  }, [dilemmas, searchQuery, filterCategory, filterDifficulty]);

  // ── Stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const cats      = [...new Set(dilemmas.map(d => d.category).filter(Boolean))];
    const hardCount = dilemmas.filter(d => d.difficulty === 'Hard').length;
    return { total: dilemmas.length, categories: cats.length, hard: hardCount };
  }, [dilemmas]);

  return {
    dilemmas: filtered,
    allDilemmas: dilemmas,
    stats,
    searchQuery,      setSearchQuery,
    filterCategory,   setFilterCategory,
    filterDifficulty, setFilterDifficulty,
    addDilemma, updateDilemma, deleteDilemma, importFromExcel,
    toasts, addToast, removeToast,
    CATEGORIES, DIFFICULTIES,
  };
}
