import React, { useState, useEffect } from 'react';
import { Database, X, RefreshCw, Table, Loader2 } from 'lucide-react';

export default function DbInspectorModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('students');
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDbData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/db/inspect');
      const data = await res.json();
      if (data.success) {
        setDbData(data);
      } else {
        setError(data.message || 'Failed to inspect database');
      }
    } catch (err) {
      setError('Cannot connect to database inspection endpoint.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDbData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTable = dbData?.tables?.[activeTab];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              background: '#4f46e5',
              color: 'white',
              padding: '0.45rem',
              borderRadius: '8px',
              display: 'flex'
            }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                SQLite Database Inspector
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Source: <code>server/database.sqlite</code> (Live SQL Tables)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={fetchDbData}
              className="btn-logout"
              title="Refresh SQL tables"
              style={{ padding: '0.4rem 0.75rem' }}
            >
              <RefreshCw size={14} className={loading ? 'spinner' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '0.4rem',
                borderRadius: '6px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Table Selector Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff'
        }}>
          {['students', 'users', 'courses', 'achievements'].map((tab) => {
            const count = dbData?.tables?.[tab]?.count ?? 0;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: isActive ? '#4f46e5' : '#e2e8f0',
                  background: isActive ? '#4f46e5' : '#f8fafc',
                  color: isActive ? '#ffffff' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textTransform: 'capitalize'
                }}
              >
                <Table size={14} />
                <span>{tab}</span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '9999px',
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#475569'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Table Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {loading && !dbData && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Loader2 size={32} className="spinner" style={{ color: '#4f46e5', margin: '0 auto' }} />
              <p style={{ marginTop: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>Loading SQL records...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <span>{error}</span>
            </div>
          )}

          {currentTable && currentTable.data.length > 0 ? (
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table className="courses-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    {Object.keys(currentTable.data[0]).map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentTable.data.map((row, idx) => (
                    <tr key={idx}>
                      {Object.entries(row).map(([k, val], cIdx) => (
                        <td key={cIdx} style={{ fontSize: '0.825rem', whiteSpace: 'nowrap' }}>
                          {k === 'password' ? (
                            <span style={{ fontFamily: 'monospace', color: '#dc2626' }}>{String(val)}</span>
                          ) : val !== null && val !== undefined ? (
                            String(val)
                          ) : (
                            <span style={{ color: '#94a3b8' }}>NULL</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : !loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
              No rows found in this SQL table.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
