const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const GROUPS_PATH = path.resolve(__dirname, '../../data/groups.json');
const LOGS_PATH = path.resolve(__dirname, '../../data/logs.json');
const STATE_PATH = path.resolve(__dirname, '../../data/state.json');

// 🪵 Debug Log
console.log("📁 GROUPS_PATH = ", GROUPS_PATH);
console.log('📦 File exists? = ', fs.existsSync(GROUPS_PATH));
console.log("📄 File content = ", fs.readFileSync(GROUPS_PATH, "utf8"));

// 🔁 โหลด group
function loadGroups() {
  if (!fs.existsSync(GROUPS_PATH)) return {};
  return JSON.parse(fs.readFileSync(GROUPS_PATH));
}

// 🧠 โหลดตำแหน่งล่าสุดของการสลับลิงก์ (round-robin)
function loadState() {
  if (!fs.existsSync(STATE_PATH)) return {};
  return JSON.parse(fs.readFileSync(STATE_PATH));
}

// 💾 บันทึกตำแหน่ง index ล่าสุด
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

// ✅ Round-robin redirect: เปลี่ยนลิงก์ทุกครั้งที่คลิก
router.get("/click/:groupId", (req, res) => {
  const groupId = req.params.groupId;
  const groups = loadGroups();
  const state = loadState();
  const logs = loadLogs();

  console.log("✅ Requested group:", groupId);
  console.log("🔁 Group data:", groups[groupId]);

  const links = groups[groupId]; // ลิงก์ทั้งหมดในกลุ่มนั้น

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

  logs.push({
    group: groupId,
    url: selectedUrl,
    ip,
    userAgent,
    timestamp,
  });
  saveLogs(logs);

  // 🔀 Redirect ไปยังลิงก์ที่ถูกเลือก
  res.redirect(selectedUrl);
});

module.exports = router;
