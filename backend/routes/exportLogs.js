const express = require('express');
const fs = require('fs');
const { parse } = require('json2csv');
const router = express.Router();

const LOG_FILE = './data/logs.json';

// ✅ Export Logs เป็นไฟล์ CSV
router.get('/', (req, res) => {
  try {
    const logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));

    // 🎯 กำหนดฟิลด์ที่จะ export
    const fields = [
      'timestamp',
      'ip',
      'userAgent',
      'location.city',
      'location.region',
      'location.country',
      'device.os',
      'device.browser',
      'linkId'
    ];

    // 🛠️ ตั้งค่าการ export
    const opts = {
      fields,
      defaultValue: 'N/A'
    };

    // 📦 แปลงเป็น CSV
    const csv = parse(logs, opts);

    // 📤 ส่งไฟล์ให้ผู้ใช้ดาวน์โหลด
    res.setHeader('Content-disposition', 'attachment; filename=logs.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } catch (err) {
    console.error('❌ Error exporting logs:', err);
    res.status(500).json({ error: 'Failed to export logs' });
  }
});

module.exports = router;
