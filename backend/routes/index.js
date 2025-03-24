// backend/routes/index.js
const express = require('express');
const router = express.Router();
const linkRoutes = require('./linkRoutes');

// เส้นทาง root
router.get('/', (req, res) => {
  res.send('✅ API is running from backend/routes/index.js');
});

// เชื่อมต่อเส้นทางลิงก์
router.use('/api', linkRoutes);

module.exports = router;
