// backend/routes/logRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 🔄 โหลด log ทั้งหมดจากไฟล์ logs.json
router.get('/', (req, res) => {
  try {
    const logsPath = path.join(__dirname, '../data/logs.json');
    const logs = JSON.parse(fs.readFileSync(logsPath, 'utf-8'));
    res.json(logs);
  } catch (error) {
    console.error('❌ ไม่สามารถโหลด logs ได้:', error);
    res.status(500).json({ error: 'ไม่สามารถโหลด logs ได้' });
  }
});

// 📝 เพิ่ม log ใหม่
router.post('/', (req, res) => {
  try {
    const newLog = req.body;
    const logsPath = path.join(__dirname, '../data/logs.json');

    // อ่าน log เก่า
    let logs = [];
    if (fs.existsSync(logsPath)) {
      logs = JSON.parse(fs.readFileSync(logsPath, 'utf-8'));
    }

    logs.push(newLog);
    fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2), 'utf-8');

    res.status(201).json({ message: 'เพิ่ม log สำเร็จ' });
  } catch (error) {
    console.error('❌ ไม่สามารถเพิ่ม log ได้:', error);
    res.status(500).json({ error: 'ไม่สามารถเพิ่ม log ได้' });
  }
});

module.exports = router;
