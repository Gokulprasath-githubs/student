# 🎓 Student Portal – Login & Student Roll Number Lookup System

A full-stack web application developed using **React.js, Node.js, Express.js, and SQLite**. The Student Portal provides a secure login interface and an interactive student information lookup system that retrieves academic and personal records from a relational SQL database.

The application allows administrators, faculty members, and students to access relevant student information through a user-friendly interface.

---

## 🛠️ Technologies Used

| Component | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | SQLite |
| Query Language | SQL |
| Development Tools | VS Code, npm |
| Version Control | Git & GitHub |

---

## 🗄️ Database Architecture

The application uses **SQLite** as its relational database, located at `server/database.sqlite`.

The database supports standard SQL operations such as `CREATE TABLE`, `INSERT`, and `SELECT` to manage and retrieve application data.

### Database Tables

**1. Users Table**

Stores login credentials and user account information.

- `id` – Unique user identifier.
- `username` – Unique login username.
- `password` – User password.
- `name` – Full name.
- `role` – User role (Admin, Faculty, or Student).
- `email` – Email address.

**2. Students Table**

Maintains student profiles and academic information.

- `id` – Unique student identifier.
- `roll_no` – Unique student roll number.
- `name` – Student name.
- `gender`, `dob`, `blood_group` – Personal details.
- `email`, `phone`, `address` – Contact information.
- `department`, `degree`, `batch`, `semester` – Academic details.
- `cgpa`, `attendance`, `status` – Academic performance.
- `mentor` – Assigned faculty mentor.
- `guardian_name`, `guardian_relation`, `guardian_phone` – Guardian information.
- `avatar` – Student profile image reference.

**3. Courses Table**

Contains course-related information for individual students.

- `id` – Unique course record ID.
- `student_roll_no` – References the student's roll number.
- `code` – Course code.
- `name` – Course name.
- `credits` – Course credit value.
- `grade` – Student's grade.
- `attendance` – Course attendance percentage.

**4. Achievements Table**

Stores student accomplishments and recognitions.

- `id` – Unique achievement ID.
- `student_roll_no` – References the student's roll number.
- `title` – Achievement description.

The courses and achievements tables are associated with student records through their roll numbers.

---

## 🔍 How to View SQL Database Records

The application provides three ways to inspect database information.

### Method 1: In-App SQL Database Viewer

- Open the Student Portal in your browser.
- Click the **SQL Database** option in the navigation bar.
- A database viewer displays the available tables.
- Explore records from the Users, Students, Courses, and Achievements tables.

### Method 2: Using PowerShell / Terminal

Navigate to the server directory:

```powershell
cd server
```

To display database records:

```bash
npm run db:view
```

To execute custom SQL queries:

```bash
node view_db.js "SELECT roll_no, name, cgpa FROM students WHERE cgpa > 9.0"
```

View all users:

```bash
node view_db.js "SELECT * FROM users"
```

View courses with an O grade:

```bash
node view_db.js "SELECT * FROM courses WHERE grade = 'O'"
```

### Method 3: Using REST API Endpoints

Start the backend server and access the following endpoints through your browser:

| API Endpoint | Description |
|---|---|
| `http://localhost:5000/api/db/inspect` | View database contents |
| `http://localhost:5000/api/students` | Retrieve all student records |
| `http://localhost:5000/api/students/CS101` | Retrieve a specific student by roll number |

---

## 🚀 How to Run the Application

### 1. Start the Backend Server

Open PowerShell and navigate to the server folder:

```powershell
cd server
```

Start the backend:

```bash
npm start
```

The Express server runs at:

`http://localhost:5000`

### 2. Start the React Frontend

Open another terminal and navigate to the client folder:

```powershell
cd client
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

`http://localhost:5173`

---

## 🔑 Demo Login Credentials

The application provides sample login accounts for different user roles.

| User Role | Username | Password |
|---|---|---|
| Administrator | `admin` | `password123` |
| Faculty Advisor | `faculty` | `faculty123` |
| Student | `student` | `student123` |

*Note: These are demonstration credentials. Use secure password hashing and change sample credentials before production deployment.*

---

## 📋 Sample Student Records

Use the following roll numbers to test the student lookup functionality.

| Roll Number | Student Name | Department | CGPA |
|---|---|---|---|
| `CS101` | Aarav Sharma | Computer Science & Engineering | 9.15 |
| `AI401` | Rohan Verma | AI & Data Science | 9.42 |
| `EC301` | Sneha Reddy | Electronics & Communication | 8.35 |
| `CS102` | Priya Patel | Computer Science & Engineering | 8.78 |
| `IT201` | Vikram Malhotra | Information Technology | 7.92 |

---

## ⭐ Key Features

- User authentication and login interface.
- Role-based user accounts.
- Student roll number search functionality.
- Detailed student profile information.
- Academic performance and CGPA tracking.
- Course and grade information.
- Student achievements management.
- SQLite relational database integration.
- REST API-based communication between frontend and backend.
- Interactive SQL database inspection.

---

## 🎯 Project Objective

The primary objective of this project is to simplify student information management by integrating a React-based frontend with a Node.js backend and an SQLite database.

It demonstrates full-stack application development, database management, REST API integration, and GitHub-based project collaboration.