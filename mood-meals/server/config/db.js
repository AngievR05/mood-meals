const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password',
  database: 'moodmeals',
});
