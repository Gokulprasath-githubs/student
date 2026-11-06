const db = require('./db');

async function viewDatabase() {
  const customQuery = process.argv.slice(2).join(' ');

  // If user passes a custom SQL query in command line
  if (customQuery) {
    console.log(`\n🔍 Executing Custom SQL: "${customQuery}"\n`);
    try {
      const results = await db.allAsync(customQuery);
      if (results.length === 0) {
        console.log('Query returned 0 rows.');
      } else {
        console.table(results);
      }
    } catch (err) {
      console.error('❌ SQL Error:', err.message);
    }
    process.exit(0);
  }

  // Otherwise, display overview of all tables
  console.log('\n===============================================================');
  console.log('  🗄️  SQL DATABASE VIEWER (database.sqlite)');
  console.log('===============================================================\n');

  try {
    // 1. Users
    console.log('📋 TABLE: users');
    const users = await db.allAsync('SELECT id, username, password, name, role, email FROM users');
    console.table(users);

    // 2. Students
    console.log('\n📋 TABLE: students');
    const students = await db.allAsync(`
      SELECT roll_no, name, department, semester, cgpa, attendance, status, phone
      FROM students
    `);
    console.table(students);

    // 3. Courses
    console.log('\n📋 TABLE: courses');
    const courses = await db.allAsync(`
      SELECT id, student_roll_no, code, name, credits, grade, attendance
      FROM courses
    `);
    console.table(courses);

    // 4. Achievements
    console.log('\n📋 TABLE: achievements');
    const achievements = await db.allAsync('SELECT * FROM achievements');
    console.table(achievements);

    console.log('\n💡 TIP: You can run custom queries:');
    console.log('   node view_db.js "SELECT * FROM students WHERE cgpa > 9.0"');
    console.log('   node view_db.js "SELECT * FROM courses WHERE grade = \'O\'"\n');

  } catch (err) {
    console.error('Error viewing database:', err);
  }

  process.exit(0);
}

// Give SQLite a short moment to ensure schema initialization
setTimeout(viewDatabase, 500);
