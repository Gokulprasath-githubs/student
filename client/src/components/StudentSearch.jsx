import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, Loader2 } from 'lucide-react';

export default function StudentSearch({ onSearch, loading, currentRollNo }) {
  const [query, setQuery] = useState('');
  const [sampleStudents, setSampleStudents] = useState([]);

  // Fetch available students list for quick suggestions
  useEffect(() => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.students) {
          setSampleStudents(data.students);
        }
      })
      .catch((err) => {
        console.error('Error fetching student suggestions:', err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleChipClick = (rollNo) => {
    setQuery(rollNo);
    onSearch(rollNo);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="search-card">
      <div className="search-header">
        <h2>Student Roll Number Lookup</h2>
        <p>Search official academic records, CGPA, attendance, and semester registrations.</p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <Search size={20} className="search-input-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="ENTER ROLL NUMBER (E.G. CS101, AI401, EC301)"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            autoFocus
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button type="submit" className="btn-search" disabled={loading || !query.trim()}>
          {loading ? (
            <>
              <Loader2 size={18} className="spinner" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search size={18} />
              <span>Fetch Details</span>
            </>
          )}
        </button>
      </form>

      {sampleStudents.length > 0 && (
        <div className="chips-container">
          <span className="chips-label">
            <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            Try Roll Numbers:
          </span>
          {sampleStudents.map((s) => (
            <button
              key={s.rollNo}
              type="button"
              className={`chip-btn ${currentRollNo === s.rollNo ? 'active' : ''}`}
              onClick={() => handleChipClick(s.rollNo)}
            >
              <span className="chip-badge">{s.rollNo}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
