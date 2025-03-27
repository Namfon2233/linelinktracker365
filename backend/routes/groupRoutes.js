// backend/routes/groupRoutes.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const useragent = require("ua-parser-js");

const router = express.Router();

const GROUPS_PATH = path.resolve(__dirname, "../../data/groups.json");
const LOGS_PATH = path.resolve(__dirname, "../../data/logs.json");
const STATE_PATH = path.resolve(__dirname, "../../data/state.json");

// 🔁 โหลด group
function loadGroups() {
  if (!fs.existsSync(GROUPS_PATH)) return {};
  return JSON.parse(fs.readFileSync(GROUPS_PATH));
}

// 🧠 โหลดตำแหน่งล่าสุด
function loadState() {
  if (!fs.existsSync(STATE_PATH)) return {};
  return JSON.parse(fs.readFileSync(STATE_PATH));
}

// 💾 บันทึกตำแหน่ง
function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

// 🧠 โหลด log
function loadLogs() {
  if (!fs.existsSync(LOGS_PATH)) return [];
  return JSON.parse(fs.readFileSync(LOGS_PATH));
}

// 💾 บันทึก log
function saveLogs(logs) {
  fs.writeFileSync(LOGS_PATH, JSON.stringify(logs, null, 2));
}

// 📦 แปลง User-Agent เป็นข้อมูลอุปกรณ์
function parseUserAgent(uaString) {
  const parsed = useragent(uaString);
  return {
    os: parsed.os.name || "Unknown",
    browser: parsed.browser.name || "Unknown",
    device: parsed.device.model || "Desktop"
  };
}

// ✅ Round-robin redirect พร้อมเก็บข้อมูลครบถ้วน
router.get("/click/:groupId", (req, res) => {
  const groupId = req.params.groupId;
  const groups = loadGroups();
  const state = loadState();
  const logs = loadLogs();

  const links = groups[groupId];
  if (!links || links.length === 0) {
    return res.status(404).send("Group not found or empty");
  }

  const index = state[groupId] || 0;
  const selectedUrl = links[index];

  // 🧠 วน index
  state[groupId] = (index + 1) % links.length;
  saveState(state);

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const timestamp = new Date().toISOString();
  const device = parseUserAgent(userAgent);

  const logEntry = {
    group: groupId,
    url: selectedUrl,
    ip,
    userAgent,
    timestamp,
    location: {
      city: req.headers["x-vercel-ip-city"] || "-",
      country: req.headers["x-vercel-ip-country"] || "-"
    },
    device,
    trackingCode: uuidv4(),
    confirmed: false
  };

  logs.push(logEntry);
  saveLogs(logs);

  res.redirect(selectedUrl);
});

module.exports = router;
