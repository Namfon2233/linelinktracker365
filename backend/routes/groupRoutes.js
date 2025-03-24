const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const GROUPS_PATH = path.resolve(__dirname, '../data/groups.json');
console.log("📁 GROUPS_PATH = ", GROUPS_PATH);
console.log("📦 File exists? = ", fs.existsSync(GROUPS_PATH));
console.log("📄 File content = ", fs.readFileSync(GROUPS_PATH, "utf8"));
const LOGS_PATH = path.resolve(__dirname, '../data/logs.json');
const STATE_PATH = path.resolve(__dirname, '../data/state.json');

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

// ✅ Round-robin redirect
console.log("✅ Full GROUPS_PATH:", GROUPS_PATH);
console.log("✅ File exists:", fs.existsSync(GROUPS_PATH));
console.log("✅ Raw file content:", fs.readFileSync(GROUPS_PATH, "utf8"));
router.get("/click/:groupId", (req, res) => {
  const groupId = req.params.groupId;
  const groups = loadGroups();
  console.log("Loaded groups:", groups); // 👈 เพิ่มบรรทัดนี้

  const state = loadState();
  const logs = loadLogs();

  const links = groups[groupId]; // ✅ แก้ตรงนี้
  console.log("Requested group:", groupId); // 👈 เพิ่มบรรทัดนี้
  console.log("Links in group:", links); // 👈 เพิ่มบรรทัดนี้

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

  logs.push({ group: groupId, url: selectedUrl, ip, userAgent, timestamp });
  saveLogs(logs);

  res.redirect(selectedUrl);
});

module.exports = router;
