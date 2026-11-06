import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import StudentSearch from './components/StudentSearch';
import StudentCard from './components/StudentCard';
import DbInspectorModal from './components/DbInspectorModal';
import { Search, AlertCircle, FileQuestion, GraduationCap } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('eduportal_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchedRollNo, setSearchedRollNo] = useState('');
  const [isDbInspectorOpen, setIsDbInspectorOpen] = useState(false);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('eduportal_user', JSON.stringify(userData));
    localStorage.setItem('eduportal_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    setStudent(null);
    setSearchError('');
    setSearchedRollNo('');
    localStorage.removeItem('eduportal_user');
    localStorage.removeItem('eduportal_token');
  };

  const fetchStudentDetails = async (rollNo) => {
    if (!rollNo) return;
    setLoading(true);
    setSearchError('');
    setSearchedRollNo(rollNo);

    try {
      const response = await fetch(`/api/students/${encodeURIComponent(rollNo)}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setStudent(null);
        setSearchError(data.message || `No record found for Roll Number "${rollNo}".`);
      } else {
        setStudent(data.student);
      }
    } catch (err) {
      setStudent(null);
      setSearchError('Unable to connect to the backend server. Please ensure the Node.js API server is running.');
    } finally {
      setLoading(false);
    }
  };

  // If user is not authenticated, render Login Page
  if (!user) {
    return (
      <div className="app-container">
        <Navbar
          user={null}
          onLogout={handleLogout}
          onOpenDbInspector={() => setIsDbInspectorOpen(true)}
        />
        <main className="main-content">
          <Login onLoginSuccess={handleLoginSuccess} />
        </main>
        <DbInspectorModal
          isOpen={isDbInspectorOpen}
          onClose={() => setIsDbInspectorOpen(false)}
        />
      </div>
    );
  }

  // Dashboard with Roll Number lookup and student details
  return (
    <div className="app-container">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenDbInspector={() => setIsDbInspectorOpen(true)}
      />

      <main className="main-content">
        {/* Search Bar Component */}
        <StudentSearch
          onSearch={fetchStudentDetails}
          loading={loading}
          currentRollNo={searchedRollNo}
        />

        {/* Error notification if student not found */}
        {searchError && (
          <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Lookup Error: </strong>
              {searchError}
            </div>
          </div>
        )}

        {/* Student Profile Card Display */}
        {student ? (
          <StudentCard student={student} />
        ) : !loading && !searchError ? (
          <div className="state-container">
            <div className="state-icon-box">
              <GraduationCap size={32} />
            </div>
            <h3>Ready to Look Up Student Records</h3>
            <p>
              Type any student's Roll Number in the search box above or click one of the suggestion chips (e.g. <strong>CS101</strong>, <strong>AI401</strong>, <strong>EC301</strong>) to view their verified academic profile.
            </p>
          </div>
        ) : null}
      </main>

      {/* SQL Database Inspector Modal */}
      <DbInspectorModal
        isOpen={isDbInspectorOpen}
        onClose={() => setIsDbInspectorOpen(false)}
      />
    </div>
  );
}
