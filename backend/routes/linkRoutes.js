// backend/routes/linkRoutes.js
const express = require('express');
const router = express.Router(); // ✅ ประกาศ router

const fs = require('fs');
const path = require('path');

const LINKS_PATH = path.join(__dirname, '../../data/links.json');
const LOGS_PATH = path.join(__dirname, '../../data/logs.json');

// 🔁 โหลดลิงก์
function loadLinks() {
  if (!fs.existsSync(LINKS_PATH)) return [];
  return JSON.parse(fs.readFileSync(LINKS_PATH));
}

// 📥 เซฟลิงก์
function saveLinks(data) {
  fs.writeFileSync(LINKS_PATH, JSON.stringify(data, null, 2));
}

// 🔁 โหลด log
function loadLogs() {
  if (!fs.existsSync(LOGS_PATH)) return [];
  return JSON.parse(fs.readFileSync(LOGS_PATH));
}

// 📥 เซฟ log
function saveLogs(data) {
  fs.writeFileSync(LOGS_PATH, JSON.stringify(data, null, 2));
}

// ✅ GET ลิงก์ทั้งหมด
router.get('/', (req, res) => {
  const links = loadLinks();
  res.json(links);
});

// ✅ POST เพิ่มลิงก์ใหม่
router.post('/', (req, res) => {
  const links = loadLinks();
  const newLink = {
    id: Date.now().toString(),
    url: req.body.url,
    title: req.body.title || `Link ${links.length + 1}`,
    group: req.body.group || 'default'
  };
  links.push(newLink);
  saveLinks(links);
  res.status(201).json(newLink);
});

// ✅ DELETE ลิงก์ตาม id
router.delete('/:id', (req, res) => {
  const links = loadLinks();
  const filtered = links.filter(l => l.id !== req.params.id);
  if (filtered.length === links.length) {
    return res.status(404).json({ error: 'Link not found' });
  }
  saveLinks(filtered);
  res.json({ message: 'ลบลิงก์แล้ว' });
});

// ✅ Redirect พร้อมบันทึก log
router.get('/click/:id', (req, res) => {
  const links = loadLinks();
  const logs = loadLogs();
  const link = links.find(l => l.id === req.params.id);

  if (!link) return res.status(404).send({ error: 'Link not found' });

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const timestamp = new Date().toISOString();

  logs.push({
    id: link.id,
    title: link.title,
    group: link.group || 'default',
    ip,
    userAgent,
    timestamp
  });

  saveLogs(logs);
  res.redirect(link.url);
});

module.exports = router;
