import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  UserCheck, 
  CheckCircle2, 
  Printer, 
  Copy, 
  Check 
} from 'lucide-react';

export default function StudentCard({ student }) {
  const [copied, setCopied] = React.useState(false);

  if (!student) return null;

  const handleCopyRoll = () => {
    navigator.clipboard.writeText(student.rollNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getGradeClass = (grade) => {
    if (grade === 'O' || grade === 'A+') return 'grade-badge grade-o';
    if (grade === 'A') return 'grade-badge grade-a';
    return 'grade-badge';
  };

  return (
    <div className="student-profile">
      {/* Hero Header */}
      <div className="profile-hero">
        <div className="hero-left">
          <div className="profile-avatar-box">
            <img
              src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
              alt={student.name}
              className="profile-avatar-img"
            />
          </div>
          <div className="hero-text">
            <h2>{student.name}</h2>
            <div className="hero-subtags">
              <span className="roll-badge">ROLL NO: {student.rollNo}</span>
              <span className="dept-badge">{student.department}</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="status-badge">
            <ShieldCheck size={14} />
            <span>{student.status || 'Active Student'}</span>
          </div>
          <span className="degree-label">{student.degree} • {student.batch}</span>
        </div>
      </div>

      {/* Key Stats Ribbon */}
      <div className="stats-ribbon">
        <div className="stat-item">
          <span className="stat-item-label">Cumulative GPA</span>
          <div className="stat-item-value">
            {student.cgpa}
            <span className="stat-item-sub">/ 10.0</span>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-item-label">Overall Attendance</span>
          <div className="stat-item-value">
            {student.attendance}%
            <span className="stat-item-sub" style={{ color: student.attendance >= 85 ? 'var(--success)' : 'var(--warning)' }}>
              {student.attendance >= 85 ? '• Optimal' : '• Warning'}
            </span>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-item-label">Current Academic Level</span>
          <div className="stat-item-value" style={{ fontSize: '1.25rem' }}>
            {student.semester}
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-item-label">Registered Subjects</span>
          <div className="stat-item-value">
            {student.courses?.length || 0}
            <span className="stat-item-sub">Courses</span>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="profile-body">
        {/* Left Column: Personal & Contact Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="section-card">
            <h3 className="section-title">
              <User size={18} style={{ color: 'var(--primary)' }} />
              Personal & Contact Information
            </h3>

            <div className="info-grid">
              <div className="info-row">
                <span className="info-label"><Mail size={15} /> Email</span>
                <span className="info-value">{student.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Phone size={15} /> Phone</span>
                <span className="info-value">{student.phone}</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Calendar size={15} /> Date of Birth</span>
                <span className="info-value">{student.dob}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Gender</span>
                <span className="info-value">{student.gender}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Blood Group</span>
                <span className="info-value">{student.bloodGroup || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label"><MapPin size={15} /> Permanent Address</span>
                <span className="info-value" style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                  {student.address}
                </span>
              </div>
            </div>
          </div>

          <div className="section-card">
            <h3 className="section-title">
              <UserCheck size={18} style={{ color: 'var(--primary)' }} />
              Guardian & Mentorship
            </h3>

            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Faculty Mentor</span>
                <span className="info-value">{student.mentor || 'Assigned Department Mentor'}</span>
              </div>
              {student.guardian && (
                <>
                  <div className="info-row">
                    <span className="info-label">Guardian Name</span>
                    <span className="info-value">{student.guardian.name} ({student.guardian.relation})</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Guardian Phone</span>
                    <span className="info-value">{student.guardian.phone}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Action Tools */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleCopyRoll}
              className="btn-logout"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {copied ? <Check size={15} color="green" /> : <Copy size={15} />}
              <span>{copied ? 'Copied Roll No!' : 'Copy Roll No'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-logout"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Printer size={15} />
              <span>Print Record</span>
            </button>
          </div>
        </div>

        {/* Right Column: Academic Courses & Performance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="section-card">
            <h3 className="section-title">
              <BookOpen size={18} style={{ color: 'var(--primary)' }} />
              Enrolled Courses & Semester Grades
            </h3>

            {student.courses && student.courses.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Course Title</th>
                      <th style={{ textAlign: 'center' }}>Credits</th>
                      <th style={{ textAlign: 'center' }}>Attendance</th>
                      <th style={{ textAlign: 'center' }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.courses.map((c, idx) => (
                      <tr key={idx}>
                        <td className="course-code">{c.code}</td>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td style={{ textAlign: 'center' }}>{c.credits}</td>
                        <td style={{ textAlign: 'center' }}>{c.attendance}%</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={getGradeClass(c.grade)}>{c.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No active courses registered for this semester.
              </p>
            )}
          </div>

          {student.achievements && student.achievements.length > 0 && (
            <div className="section-card">
              <h3 className="section-title">
                <Award size={18} style={{ color: 'var(--warning)' }} />
                Honors & Key Achievements
              </h3>

              <ul className="achievements-list">
                {student.achievements.map((ach, idx) => (
                  <li key={idx} className="achievement-item">
                    <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
