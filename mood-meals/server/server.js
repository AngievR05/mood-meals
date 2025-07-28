const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Mood Meals API running");
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
