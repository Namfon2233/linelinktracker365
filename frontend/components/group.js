import { renderClickChart } from './StatsChart.js';

let logs = [];

// ✅ [เพิ่ม] ฟังก์ชันแปลง JSON เป็น CSV
function jsonToCsv(jsonData) {
  const header = Object.keys(jsonData[0]).join(',');
  const rows = jsonData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
  return [header, ...rows].join('\r\n');
}

// ✅ [เพิ่ม] ฟังก์ชัน export logs เฉพาะกลุ่มที่เลือก
async function exportGroupLogs() {
  const selectedGroup = document.getElementById('groupSelector').value;

  const response = await fetch('/api/logs');
  const logs = await response.json();

  const filteredLogs = logs.filter(log => log.group === selectedGroup);

  if (filteredLogs.length === 0) {
    alert("ไม่มีข้อมูลสำหรับกลุ่มนี้");
    return;
  }

  const csvData = jsonToCsv(filteredLogs);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${selectedGroup}-logs.csv`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// โหลด logs จาก backend
async function fetchLogs() {
  const res = await fetch('/data/logs.json');
  const data = await res.json();
  logs = data;
  return data;
}

function renderGroupTable(filteredLogs = logs) {
  const groupClicks = {};
  filteredLogs.forEach(log => {
    const group = log.group || 'unknown';
    groupClicks[group] = (groupClicks[group] || 0) + 1;
  });

  const table = document.getElementById('groupTableBody');
  table.innerHTML = '';

  Object.entries(groupClicks).forEach(([group, count], index) => {
    const row = `
      <tr class="border-b">
        <td class="py-2 px-4">${index + 1}</td>
        <td class="py-2 px-4 font-semibold">${group}</td>
        <td class="py-2 px-4 text-center">${count}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

function setupChartModeSelector() {
  const chartModeSelector = document.getElementById('chartMode');
  chartModeSelector.addEventListener('change', () => {
    const mode = chartModeSelector.value;
    renderClickChart(logs, mode);
  });
}

function renderMap(logs) {
  const mapContainer = document.getElementById('map');
  mapContainer.innerHTML = '';
  const map = L.map('map').setView([13.736717, 100.523186], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  logs.forEach(log => {
    const lat = parseFloat(log.latitude || log.lat);
    const lon = parseFloat(log.longitude || log.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      const marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup(`
        <strong>Group:</strong> ${log.group || 'unknown'}<br>
        <strong>IP:</strong> ${log.ip || '-'}
      `);
    }
  });
}

function populateGroupSelector(logs) {
  const groupSelector = document.getElementById('groupSelector');
  const groups = new Set(logs.map(log => log.group || 'unknown'));

  groupSelector.innerHTML = `<option value="">🔽 All Groups</option>`;
  groups.forEach(group => {
    const option = document.createElement('option');
    option.value = group;
    option.textContent = group;
    groupSelector.appendChild(option);
  });
}

function filterLogsByGroup(logs, group) {
  if (!group) return logs;
  return logs.filter(log => log.group === group);
}

// ✅ รันเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', async () => {
  await fetchLogs();
  populateGroupSelector(logs);
  renderGroupTable();
  setupChartModeSelector();
  renderClickChart(logs, 'timeline');
  renderMap(logs);

  document.getElementById('groupSelector').addEventListener('change', () => {
    const group = document.getElementById('groupSelector').value;
    const filteredLogs = filterLogsByGroup(logs, group);
    renderClickChart(filteredLogs, document.getElementById('chartMode').value);
    renderMap(filteredLogs);
    renderGroupTable(filteredLogs);
  });

  // ✅ [เพิ่ม] เชื่อมปุ่ม Export CSV กับฟังก์ชันใหม่
  document.getElementById('exportCsvBtn').addEventListener('click', exportGroupLogs);
});
