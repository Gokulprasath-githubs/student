# 🎓 Student Portal: Login & Roll Number Lookup System (SQL Backend)

A modern full-stack web application built with **React.js** on the frontend and **Node.js (Express + SQLite SQL)** on the backend. It features an authentication login page and an interactive student roll number lookup interface that retrieves rich student academic records directly from a relational SQL database.

---

## 🗄️ SQL Database Architecture

The backend uses **SQLite (`server/database.sqlite`)** with standard SQL queries (`SELECT`, `INSERT`, `CREATE TABLE`).

### Tables Schema:
1. **`users`**:
   - `id INTEGER PRIMARY KEY AUTOINCREMENT`
   - `username TEXT UNIQUE NOT NULL`
   - `password TEXT NOT NULL`
   - `name TEXT NOT NULL`
   - `role TEXT NOT NULL`
   - `email TEXT`

2. **`students`**:
   - `id INTEGER PRIMARY KEY AUTOINCREMENT`
   - `roll_no TEXT UNIQUE NOT NULL`
   - `name TEXT NOT NULL`
   - `gender TEXT`, `dob TEXT`, `blood_group TEXT`
   - `email TEXT`, `phone TEXT`, `address TEXT`
   - `department TEXT NOT NULL`, `degree TEXT`, `batch TEXT`, `semester TEXT`
   - `cgpa REAL`, `attendance REAL`, `status TEXT`
   - `mentor TEXT`, `guardian_name TEXT`, `guardian_relation TEXT`, `guardian_phone TEXT`
   - `avatar TEXT`

3. **`courses`**:
   - `id INTEGER PRIMARY KEY AUTOINCREMENT`
   - `student_roll_no TEXT NOT NULL` *(Foreign Key -> `students.roll_no`)*
   - `code TEXT`, `name TEXT`, `credits INTEGER`, `grade TEXT`, `attendance REAL`

4. **`achievements`**:
   - `id INTEGER PRIMARY KEY AUTOINCREMENT`
   - `student_roll_no TEXT NOT NULL` *(Foreign Key -> `students.roll_no`)*
   - `title TEXT NOT NULL`

---

## 🔍 How to Check / View the SQL Database Values

You have **3 convenient ways** to inspect and query the database values:

### Method 1: Interactive In-App "SQL Database" Inspector (Easiest)
- In the React frontend, click the **`SQL Database`** button in the top navigation bar.
- It opens a live modal viewer displaying all tables (`students`, `users`, `courses`, `achievements`) and rows in real-time.

### Method 2: From the Terminal with the Database CLI Tool
Run the included database viewer in the `server` directory:

```powershell
cd server

# 1. View all tables nicely formatted in ASCII tables
npm run db:view

# 2. Or run ANY custom SQL query:
node view_db.js "SELECT roll_no, name, cgpa FROM students WHERE cgpa > 9.0"
node view_db.js "SELECT * FROM users"
node view_db.js "SELECT * FROM courses WHERE grade = 'O'"
```

### Method 3: In Your Web Browser (via REST API)
While the server is running (`npm start`):
- **Full DB Dump**: [`http://localhost:5000/api/db/inspect`](http://localhost:5000/api/db/inspect)
- **All Students**: [`http://localhost:5000/api/students`](http://localhost:5000/api/students)
- **Specific Student by Roll No**: [`http://localhost:5000/api/students/CS101`](http://localhost:5000/api/students/CS101)

---

## 🚀 Running the Application

### 1. Start the Backend API (Node.js Express + SQL)
```powershell
cd d:\ai\login_stu\server
npm start
```
The server runs on **`http://localhost:5000`** and connects to `database.sqlite`.

### 2. Start the Frontend (React.js + Vite)
```powershell
cd d:\ai\login_stu\client
npm run dev
```
Open your browser at **`http://localhost:5173`**.

---

## 🔑 Demo Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin` | `password123` |
| **Faculty Advisor** | `faculty` | `faculty123` |
| **Student** | `student` | `student123` |

---

## 📋 Sample Roll Numbers to Try
- **`CS101`** – Aarav Sharma (*Computer Science & Engineering* - CGPA: 9.15)
- **`AI401`** – Rohan Verma (*AI & Data Science* - CGPA: 9.42)
- **`EC301`** – Sneha Reddy (*Electronics & Communication* - CGPA: 8.35)
- **`CS102`** – Priya Patel (*Computer Science & Engineering* - CGPA: 8.78)
- **`IT201`** – Vikram Malhotra (*Information Technology* - CGPA: 7.92)
