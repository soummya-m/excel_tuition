const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',      // your DB host, often localhost
  user: 'root',           // your MySQL username
  password: '',           // your MySQL password
  database: 'excel_tuition'   // your database name
});

conn.connect((err) => {
  if (err) {
    console.error('DB connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

module.exports = conn;