// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUser, updateUser } = require('../controllers/userController');

router.get('/me', auth, getUser);
router.put('/me', auth, updateUser);

module.exports = router;
