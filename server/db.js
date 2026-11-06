const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database at:', dbPath);
  }
});

// Promisified query helpers for async/await
db.getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Initialize schema and seed data
async function initDatabase() {
  db.serialize(async () => {
    // 1. Users table (for login)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT
      )
    `);

    // 2. Students table
    db.run(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roll_no TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        gender TEXT,
        dob TEXT,
        blood_group TEXT,
        email TEXT,
        phone TEXT,
        department TEXT NOT NULL,
        degree TEXT,
        batch TEXT,
        semester TEXT,
        cgpa REAL,
        attendance REAL,
        status TEXT DEFAULT 'Active',
        mentor TEXT,
        guardian_name TEXT,
        guardian_relation TEXT,
        guardian_phone TEXT,
        address TEXT,
        avatar TEXT
      )
    `);

    // 3. Courses table
    db.run(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_roll_no TEXT NOT NULL,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        credits INTEGER,
        grade TEXT,
        attendance REAL,
        FOREIGN KEY (student_roll_no) REFERENCES students(roll_no) ON DELETE CASCADE
      )
    `);

    // 4. Achievements table
    db.run(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_roll_no TEXT NOT NULL,
        title TEXT NOT NULL,
        FOREIGN KEY (student_roll_no) REFERENCES students(roll_no) ON DELETE CASCADE
      )
    `);

    // Seed Users if table is empty
    const userCount = await db.getAsync('SELECT COUNT(*) AS count FROM users');
    if (userCount.count === 0) {
      console.log('🌱 Seeding initial SQL users...');
      const insertUser = `INSERT INTO users (username, password, name, role, email) VALUES (?, ?, ?, ?, ?)`;
      await db.runAsync(insertUser, ['admin', 'password123', 'Prof. Alok Sharma', 'Administrator', 'admin@university.edu']);
      await db.runAsync(insertUser, ['faculty', 'faculty123', 'Dr. Sunita Rao', 'Faculty Advisor', 'sunita.rao@university.edu']);
      await db.runAsync(insertUser, ['student', 'student123', 'Demo Student', 'Student', 'student@university.edu']);
    }

    // Seed Students if table is empty
    const studentCount = await db.getAsync('SELECT COUNT(*) AS count FROM students');
    if (studentCount.count === 0) {
      console.log('🌱 Seeding initial SQL student records...');
      
      const insertStudent = `
        INSERT INTO students (
          roll_no, name, gender, dob, blood_group, email, phone,
          department, degree, batch, semester, cgpa, attendance,
          status, mentor, guardian_name, guardian_relation, guardian_phone,
          address, avatar
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const insertCourse = `
        INSERT INTO courses (student_roll_no, code, name, credits, grade, attendance)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const insertAchievement = `
        INSERT INTO achievements (student_roll_no, title)
        VALUES (?, ?)
      `;

      // Student 1: CS101 - Aarav Sharma
      await db.runAsync(insertStudent, [
        'CS101', 'Aarav Sharma', 'Male', '2004-05-14', 'O+', 'aarav.sharma@student.edu', '+91 98765 43210',
        'Computer Science & Engineering', 'B.Tech', '2022 - 2026', '6th Semester', 9.15, 94.5,
        'Active', 'Dr. Sunita Rao', 'Rajesh Sharma', 'Father', '+91 98765 00001',
        'Flat 304, Green Heights, Tech Park Road, Bengaluru, Karnataka',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav'
      ]);
      await db.runAsync(insertCourse, ['CS101', 'CS601', 'Distributed Systems', 4, 'A+', 96]);
      await db.runAsync(insertCourse, ['CS101', 'CS602', 'Machine Learning', 4, 'O', 95]);
      await db.runAsync(insertCourse, ['CS101', 'CS603', 'Cloud Computing & DevOps', 3, 'A', 92]);
      await db.runAsync(insertCourse, ['CS101', 'CS604', 'Network Security & Cryptography', 3, 'A+', 93]);
      await db.runAsync(insertCourse, ['CS101', 'CS605', 'Software Engineering Lab', 2, 'O', 98]);
      await db.runAsync(insertAchievement, ['CS101', '1st Prize in Hackathon 2024']);
      await db.runAsync(insertAchievement, ['CS101', 'Published research paper on Edge AI']);
      await db.runAsync(insertAchievement, ['CS101', "Dean's Merit List - Sem 4 & 5"]);

      // Student 2: CS102 - Priya Patel
      await db.runAsync(insertStudent, [
        'CS102', 'Priya Patel', 'Female', '2004-09-22', 'B+', 'priya.patel@student.edu', '+91 98765 43211',
        'Computer Science & Engineering', 'B.Tech', '2022 - 2026', '6th Semester', 8.78, 91.2,
        'Active', 'Dr. Sunita Rao', 'Kirit Patel', 'Father', '+91 98765 00002',
        '42, Shanti Niketan, SG Highway, Ahmedabad, Gujarat',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
      ]);
      await db.runAsync(insertCourse, ['CS102', 'CS601', 'Distributed Systems', 4, 'A', 90]);
      await db.runAsync(insertCourse, ['CS102', 'CS602', 'Machine Learning', 4, 'A+', 93]);
      await db.runAsync(insertCourse, ['CS102', 'CS603', 'Cloud Computing & DevOps', 3, 'B+', 88]);
      await db.runAsync(insertAchievement, ['CS102', 'Vice President - Women in Tech Society']);
      await db.runAsync(insertAchievement, ['CS102', 'Finalist at National Coding League']);

      // Student 3: AI401 - Rohan Verma
      await db.runAsync(insertStudent, [
        'AI401', 'Rohan Verma', 'Male', '2003-12-08', 'A+', 'rohan.verma@student.edu', '+91 98765 43212',
        'Artificial Intelligence & Data Science', 'B.Tech', '2021 - 2025', '8th Semester', 9.42, 96.0,
        'Active', 'Prof. Alok Sharma', 'Mahesh Verma', 'Father', '+91 98765 00003',
        'B-12, Sector 62, Noida, Uttar Pradesh',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan'
      ]);
      await db.runAsync(insertCourse, ['AI401', 'AI801', 'Deep Reinforcement Learning', 4, 'O', 98]);
      await db.runAsync(insertCourse, ['AI401', 'AI802', 'Natural Language Processing', 4, 'O', 97]);
      await db.runAsync(insertAchievement, ['AI401', 'Placed as AI Research Intern at Leading Tech Lab']);
      await db.runAsync(insertAchievement, ['AI401', 'Gold Medalist in University Mathematics Olympiad']);

      // Student 4: EC301 - Sneha Reddy
      await db.runAsync(insertStudent, [
        'EC301', 'Sneha Reddy', 'Female', '2004-03-18', 'AB+', 'sneha.reddy@student.edu', '+91 98765 43213',
        'Electronics & Communication', 'B.Tech', '2022 - 2026', '6th Semester', 8.35, 87.0,
        'Active', 'Dr. K. Srinivas', 'Venkatesh Reddy', 'Father', '+91 98765 00004',
        'Plot 105, Jubilee Hills, Hyderabad, Telangana',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha'
      ]);
      await db.runAsync(insertCourse, ['EC301', 'EC601', 'VLSI Design', 4, 'A', 88]);
      await db.runAsync(insertCourse, ['EC301', 'EC602', 'Digital Signal Processing', 4, 'B+', 84]);
      await db.runAsync(insertAchievement, ['EC301', 'Robotics Club Lead']);

      // Student 5: IT201 - Vikram Malhotra
      await db.runAsync(insertStudent, [
        'IT201', 'Vikram Malhotra', 'Male', '2004-11-30', 'O-', 'vikram.m@student.edu', '+91 98765 43214',
        'Information Technology', 'B.Tech', '2022 - 2026', '6th Semester', 7.92, 82.5,
        'Active', 'Prof. Meera Sen', 'Sanjay Malhotra', 'Father', '+91 98765 00005',
        '78, Marine Lines, Mumbai, Maharashtra',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram'
      ]);
      await db.runAsync(insertCourse, ['IT201', 'IT601', 'Web Technologies & Frameworks', 4, 'A', 85]);
      await db.runAsync(insertCourse, ['IT201', 'IT602', 'Information Storage & Retrieval', 3, 'B', 80]);
      await db.runAsync(insertAchievement, ['IT201', 'Open Source Contributor on GitHub']);

      console.log('✅ SQLite Database successfully initialized with tables and sample records.');
    }
  });
}

initDatabase();

module.exports = db;
