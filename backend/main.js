// backend/main.js
const express = require('express');
const path = require('path');
const app = express();

const linkRoutes = require('./routes/linkRoutes');
const groupRoutes = require('./routes/groupRoutes'); // ✅ เพิ่ม
const logRoutes = require('./routes/logRoutes'); // ✅ เพิ่ม logRoutes ใหม่
const confirmRoute = require('./routes/confirm'); // ✅ เพิ่มตรงนี้
const exportLogsRoute = require('./routes/exportLogs'); // ✅ เพิ่มตรงนี้

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ [แก้ไขตรงนี้] เสิร์ฟ frontend ที่เส้นทาง /frontend
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

app.use('/api/links', linkRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/confirm', confirmRoute);
app.use('/api/export-logs', exportLogsRoute);
app.use('/', groupRoutes);

app.get('/', (req, res) => {
  res.send('✅ API is running from backend/main.js');
});

module.exports = app;
