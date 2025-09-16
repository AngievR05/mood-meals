const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ ok: true, msg: 'groceries route working' });
});

module.exports = router;
