const express = require('express');
const fs = require('fs');
const { parse } = require('json2csv');
const router = express.Router();

const LOG_FILE = './data/logs.json';

router.get('/', (req, res) => {
  try {
    const logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));

    const fields = ['timestamp', 'ip', 'userAgent', 'location.city', 'location.region', 'location.country', 'device.os', 'device.browser', 'linkId'];
    const opts = { fields, defaultValue: 'N/A' };
    const csv = parse(logs, opts);

    res.setHeader('Content-disposition', 'attachment; filename=logs.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } catch (err) {
    console.error('Error exporting logs:', err);
    res.status(500).json({ error: 'Failed to export logs' });
  }
});

module.exports = router;
