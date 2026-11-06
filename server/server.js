const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Student Portal API Server (SQLite SQL Backend) is running smoothly.' });
});

// Authentication: Login using SQL query
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password are required.' 
    });
  }

  try {
    // SQL: Find user by username and password
    const sql = `SELECT id, username, name, role, email FROM users WHERE LOWER(username) = LOWER(?) AND password = ?`;
    const user = await db.getAsync(sql, [username.trim(), password]);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password. Check demo credentials!' 
      });
    }

    const token = `token_${Buffer.from(user.username + ':' + Date.now()).toString('base64')}`;

    return res.json({
      success: true,
      message: 'Login successful via SQL Database!',
      token,
      user
    });
  } catch (error) {
    console.error('SQL Login error:', error);
    res.status(500).json({ success: false, message: 'Database query error during login.' });
  }
});

// Get summary list of all students (for roll number suggestion chips)
app.get('/api/students', async (req, res) => {
  try {
    // SQL: Select list of students
    const sql = `SELECT roll_no AS rollNo, name, department, semester FROM students ORDER BY roll_no ASC`;
    const students = await db.allAsync(sql);
    
    res.json({ success: true, count: students.length, students });
  } catch (error) {
    console.error('SQL fetch students error:', error);
    res.status(500).json({ success: false, message: 'Failed to read student records from SQL database.' });
  }
});

// Get single student details by Roll Number using SQL joins / queries
app.get('/api/students/:rollNo', async (req, res) => {
  try {
    const rollNo = req.params.rollNo.trim().toUpperCase();

    // 1. Fetch Student from SQL
    const studentSql = `SELECT * FROM students WHERE UPPER(roll_no) = ?`;
    const row = await db.getAsync(studentSql, [rollNo]);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: `No student record found with Roll Number "${rollNo}". Please verify and try again.`
      });
    }

    // 2. Fetch Enrolled Courses from SQL
    const coursesSql = `SELECT code, name, credits, grade, attendance FROM courses WHERE student_roll_no = ?`;
    const courses = await db.allAsync(coursesSql, [row.roll_no]);

    // 3. Fetch Achievements from SQL
    const achievementsSql = `SELECT title FROM achievements WHERE student_roll_no = ?`;
    const achievementRows = await db.allAsync(achievementsSql, [row.roll_no]);

    // Format student object matching UI expectations
    const student = {
      rollNo: row.roll_no,
      name: row.name,
      gender: row.gender,
      dob: row.dob,
      bloodGroup: row.blood_group,
      email: row.email,
      phone: row.phone,
      department: row.department,
      degree: row.degree,
      batch: row.batch,
      semester: row.semester,
      cgpa: row.cgpa,
      attendance: row.attendance,
      status: row.status,
      mentor: row.mentor,
      guardian: {
        name: row.guardian_name,
        relation: row.guardian_relation,
        phone: row.guardian_phone
      },
      address: row.address,
      avatar: row.avatar,
      courses,
      achievements: achievementRows.map((a) => a.title)
    };

    res.json({
      success: true,
      student
    });
  } catch (error) {
    console.error('SQL student details error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching student details from SQL.' });
  }
});

// Database Inspector Endpoint: Allows viewing all tables and values directly
app.get('/api/db/inspect', async (req, res) => {
  try {
    const users = await db.allAsync('SELECT id, username, password, name, role, email FROM users');
    const students = await db.allAsync('SELECT roll_no, name, department, semester, cgpa, attendance, phone FROM students');
    const courses = await db.allAsync('SELECT * FROM courses');
    const achievements = await db.allAsync('SELECT * FROM achievements');

    res.json({
      success: true,
      databaseType: 'SQLite SQL',
      databaseFile: 'server/database.sqlite',
      tables: {
        users: { count: users.length, data: users },
        students: { count: students.length, data: students },
        courses: { count: courses.length, data: courses },
        achievements: { count: achievements.length, data: achievements }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Student Portal API Server (SQLite SQL) running on http://localhost:${PORT}`);
});
