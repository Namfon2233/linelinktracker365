const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const linkRoutes = require('./routes/linkRoutes');
const groupRoutes = require('./routes/groupRoutes');
app.use('/api/links', linkRoutes);
app.use('/', groupRoutes);

app.get('/', (req, res) => {
  res.send('✅ API is running from backend/main.js');
});

module.exports = app;
