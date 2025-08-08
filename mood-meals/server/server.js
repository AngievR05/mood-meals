const express = require('express'); 
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // your password here
  database: 'mood_meals_db'
});

db.connect((err) => {
  if (err) {
    console.error('DB Connection Failed:', err);
  } else {
    console.log('✅ MySQL Connected!');
  }
});

app.get('/', (req, res) => {
  res.send('Mood Meals backend is alive 🚀');
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

