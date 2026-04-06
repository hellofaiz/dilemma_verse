/**
 * UploadZone – drag-and-drop / click-to-upload Excel file importer
 */

import React, { useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';

export default function UploadZone({ onImport }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      alert('Please upload a valid Excel (.xlsx / .xls) or CSV file.');
      return;
    }
    onImport(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onChange = (e) => handleFile(e.target.files?.[0]);

  return (
    <div
      className={`upload-zone${dragging ? ' drag-over' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      role="button"
      tabIndex={0}
      aria-label="Upload Excel file"
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: 'none' }}
        onChange={onChange}
        id="excel-file-input"
      />

      <div className="upload-icon">
        {dragging
          ? <FileSpreadsheet size={26} />
          : <UploadCloud size={26} />
        }
      </div>

      <p className="upload-title">
        {dragging ? 'Release to import' : 'Import from Excel'}
      </p>
      <p className="upload-subtitle">
        Drag & drop your file here, or <strong style={{ color: 'var(--accent-light)' }}>click to browse</strong>
      </p>
      <p className="upload-hint">Supports .xlsx · .xls · .csv</p>
    </div>
  );
}
