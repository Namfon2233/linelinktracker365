// backend/main.js
const express = require('express');
const path = require('path');
const app = express();

const linkRoutes = require('./routes/linkRoutes');
const groupRoutes = require('./routes/groupRoutes'); // ✅ เพิ่ม

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/links', linkRoutes);
app.use('/', groupRoutes); // ✅ ใช้งาน groupRoutes

app.get('/', (req, res) => {
  res.send('✅ API is running from backend/main.js');
});

module.exports = app;
