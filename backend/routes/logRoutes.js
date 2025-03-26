const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// อ่านไฟล์ logs.json
const LOGS_PATH = path.join(__dirname, '../data/logs.json');

router.get('/', (req, res) => {
  if (fs.existsSync(LOGS_PATH)) {
    const logs = JSON.parse(fs.readFileSync(LOGS_PATH));
    res.json(logs);
  } else {
    res.status(404).json({ message: 'Logs not found' });
  }
});

module.exports = router;
