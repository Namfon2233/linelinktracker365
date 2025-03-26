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
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/links', linkRoutes);
app.use('/api/logs', logRoutes); // ✅ เพิ่ม Endpoint /api/logs
app.use('/api/confirm', confirmRoute); // ✅ ใช้งาน API confirm
app.use('/api/export-logs', exportLogsRoute); // ✅ เพิ่มตรงนี้
app.use('/', groupRoutes); // ✅ ใช้งาน groupRoutes

app.get('/', (req, res) => {
  res.send('✅ API is running from backend/main.js');
});

module.exports = app;
