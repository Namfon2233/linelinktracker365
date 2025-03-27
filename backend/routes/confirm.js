const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const LOG_FILE = path.join(__dirname, '../../data/logs.json'); // ✅ ระวัง path ต้องชี้ไปยัง data

// ✅ POST /api/confirm → สำหรับยืนยันว่าเพิ่มเพื่อนแล้ว
router.post('/', (req, res) => {
  const { trackingCode } = req.body;

  // 🛑 ตรวจสอบว่าได้ส่ง trackingCode มาหรือไม่
  if (!trackingCode) {
    return res.status(400).json({
      success: false,
      message: 'Missing trackingCode'
    });
  }

  // 📖 อ่าน log ทั้งหมด
  let logs = [];
  try {
    logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to read logs'
    });
  }

  // 🔍 ค้นหา log ที่มี trackingCode ตรงกัน
  const logIndex = logs.findIndex(log => log.trackingCode === trackingCode);
  if (logIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Tracking code not found'
    });
  }

  // ✅ อัปเดตสถานะการยืนยัน
  logs[logIndex].confirmed = true;
  logs[logIndex].confirmedAt = new Date().toISOString();

  // 💾 เขียนกลับลงไฟล์
  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    return res.json({
      success: true,
      message: 'Friend confirmed'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update logs'
    });
  }
});

module.exports = router;
