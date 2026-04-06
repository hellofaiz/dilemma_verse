/**
 * useDilemmas – central state management hook connected to real Backend API
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';

// The backend endpoint
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/situation';

const CATEGORIES = ['Ethics', 'Game Theory', 'Moral Development', 'Metaphysics', 'Applied Ethics', 'Logic', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export function useDilemmas() {
  const [dilemmas, setDilemmas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [toasts, setToasts] = useState([]);

  // ── Toast helpers ──────────────────────────────────────────────
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Fetch Data ─────────────────────────────────────────────────
  const fetchDilemmas = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();
      // Ensure backend field mapping to frontend view expectations
      // Prisma uses "title", frontend UI expects "situation" mapped locally
      const mapped = json.data.map(d => ({
        ...d,
        situation: d.title, // map db 'title' to UI 'situation'
        createdAt: new Date(d.createdAt).toISOString().split('T')[0],
      }));
      setDilemmas(mapped);
    } catch (err) {
      console.error(err);
      addToast('Error loading data from server.', 'error');
    }
  }, [addToast]);

  // Load data immediately on component mount
  useEffect(() => {
    fetchDilemmas();
  }, [fetchDilemmas]);

  // ── CRUD ───────────────────────────────────────────────────────
  const addDilemma = useCallback(async (data) => {
    try {
      const payload = { ...data, title: data.situation, tags: [] };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create');
      
      addToast('Dilemma added successfully!', 'success');
      await fetchDilemmas(); // refresh list
    } catch (err) {
      console.error(err);
      addToast('Error saving to server.', 'error');
    }
  }, [addToast, fetchDilemmas]);

  const updateDilemma = useCallback(async (id, data) => {
    try {
      const payload = { ...data, title: data.situation, tags: [] };
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update');
      
      addToast('Dilemma updated successfully!', 'success');
      await fetchDilemmas(); // refresh list
    } catch (err) {
      console.error(err);
      addToast('Error updating on server.', 'error');
    }
  }, [addToast, fetchDilemmas]);

  const deleteDilemma = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      addToast('Dilemma deleted.', 'error');
      await fetchDilemmas(); // refresh list
    } catch (err) {
      console.error(err);
      addToast('Error deleting from server.', 'error');
    }
  }, [addToast, fetchDilemmas]);

  // ── Excel Import ───────────────────────────────────────────────
  const importFromExcel = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        const imported = rows.map((row) => ({
          title: String(row['Situation'] || row['situation'] || row['Title'] || row['title'] || 'Untitled'),
          description: String(row['Description'] || row['description'] || row['Details'] || row['details'] || ''),
          category: String(row['Category'] || row['category'] || 'Other'),
          difficulty: String(row['Difficulty'] || row['difficulty'] || 'Medium'),
          source: String(row['Source'] || row['source'] || ''),
          tags: row['Tags'] ? String(row['Tags']) : [],
        }));

        const res = await fetch(`${API_URL}/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(imported),
        });

        if (!res.ok) {
          throw new Error('Failed bulk insert');
        }

        const resData = await res.json();
        addToast(`Successfully imported ${resData.data.count} items!`, 'success');
        await fetchDilemmas();
      } catch (err) {
        console.error(err);
        addToast('Failed to parse and upload Excel file.', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }, [addToast, fetchDilemmas]);

  // ── Filtered list ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return dilemmas.filter(d => {
      const matchSearch = !q ||
        (d.situation && d.situation.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        (d.category && d.category.toLowerCase().includes(q));
      const matchCat = filterCategory === 'All' || d.category === filterCategory;
      const matchDiff = filterDifficulty === 'All' || d.difficulty === filterDifficulty;
      return matchSearch && matchCat && matchDiff;
    });
  }, [dilemmas, searchQuery, filterCategory, filterDifficulty]);

  // ── Stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const cats = [...new Set(dilemmas.map(d => d.category).filter(Boolean))];
    const hardCount = dilemmas.filter(d => d.difficulty === 'Hard').length;
    return { total: dilemmas.length, categories: cats.length, hard: hardCount };
  }, [dilemmas]);

  return {
    dilemmas: filtered,
    allDilemmas: dilemmas,
    stats,
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterDifficulty, setFilterDifficulty,
    addDilemma,
    updateDilemma,
    deleteDilemma,
    importFromExcel,
    toasts, addToast, removeToast,
    CATEGORIES,
    DIFFICULTIES,
  };
}
