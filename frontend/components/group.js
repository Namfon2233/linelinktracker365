import { renderClickChart } from './StatsChart.js';

let logs = [];

// โหลด logs จาก backend (ใช้แหล่งเดียวพอ)
async function fetchLogs() {
  const res = await fetch('/data/logs.json');
  const data = await res.json();
  logs = data;
  return data;
}

// แสดงตารางคลิกแยกตามกลุ่ม
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

// สลับโหมดกราฟ Timeline / Per Day
function setupChartModeSelector() {
  const chartModeSelector = document.getElementById('chartMode');
  chartModeSelector.addEventListener('change', () => {
    const mode = chartModeSelector.value;
    renderClickChart(logs, mode);
  });
}

// Export CSV
async function exportCsv() {
  try {
    const res = await fetch('/data/logs.json');
    const logs = await res.json();

    if (!logs.length) return alert('No logs found.');

    const headers = Object.keys(logs[0]).join(',');
    const rows = logs.map(log => Object.values(log).join(',')).join('\n');
    const csvContent = headers + '\n' + rows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'click_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('CSV Export Error:', error);
    alert('Failed to export logs');
  }
}

// ✅ รันเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', async () => {
  await fetchLogs();                     // โหลด logs แล้วเก็บไว้ใน global
  populateGroupSelector(logs);          // ใส่ options ลง dropdown
  renderGroupTable();                   // ตารางกลุ่ม
  setupChartModeSelector();             // dropdown ประเภทกราฟ
  renderClickChart(logs, 'timeline');   // กราฟ
  renderMap(logs);                      // แผนที่

  // ✅ ย้ายมาไว้ใน DOMContentLoaded เพื่อไม่ให้ error
  document.getElementById('groupSelector').addEventListener('change', () => {
    const group = document.getElementById('groupSelector').value;
    const filteredLogs = filterLogsByGroup(logs, group);

    renderClickChart(filteredLogs, document.getElementById('chartMode').value);
    renderMap(filteredLogs);
    renderGroupTable(filteredLogs);
  });

  document.getElementById('exportCsvBtn').addEventListener('click', exportCsv);
});

function renderMap(logs) {
  const mapContainer = document.getElementById('map');
  mapContainer.innerHTML = ''; // เคลียร์แผนที่เก่า (ถ้ามี)

  // ✅ สร้างแผนที่
  const map = L.map('map').setView([13.736717, 100.523186], 6); // Thailand center

  // ✅ โหลดแผนที่จาก OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // ✅ วนลูป logs และวาง marker
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
