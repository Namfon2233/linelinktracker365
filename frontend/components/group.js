import { renderClickChart } from './StatsChart.js';

let logs = [];

// ✅ [เพิ่ม] ฟังก์ชันแปลง JSON เป็น CSV
function jsonToCsv(jsonData) {
  const header = Object.keys(jsonData[0]).join(',');
  const rows = jsonData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
  return [header, ...rows].join('\r\n');
}

// ✅ [เพิ่ม] ฟังก์ชัน export logs เฉพาะกลุ่ม + วันที่ที่เลือก
async function exportGroupLogs() {
  const selectedGroup = document.getElementById('groupSelector').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!startDate || !endDate) {
    alert("⛔ กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด");
    return;
  }

  const response = await fetch('/api/logs');
  const allLogs = await response.json();

  const filteredLogs = allLogs.filter(log => {
    const groupMatch = !selectedGroup || log.group === selectedGroup;
    const logDate = new Date(log.timestamp).toISOString().split("T")[0];
    const dateMatch = logDate >= startDate && logDate <= endDate;
    return groupMatch && dateMatch;
  });

  if (filteredLogs.length === 0) {
    alert("ไม่มีข้อมูลในช่วงเวลาที่เลือก");
    return;
  }

  const csvData = jsonToCsv(filteredLogs);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${selectedGroup || 'all'}-logs-${startDate}_to_${endDate}.csv`;

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

// ✅ [อัปเดต] เพิ่ม Tooltip บนแผนที่
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

      const popupContent = `
        <div class="text-sm leading-snug">
          <div><strong>👥 กลุ่ม:</strong> ${log.group || 'unknown'}</div>
          <div><strong>🌐 IP:</strong> ${log.ip || '-'}</div>
          <div><strong>📍 พิกัด:</strong> ${log.city || '-'}, ${log.country || '-'}</div>
          <div><strong>🕒 เวลา:</strong> ${new Date(log.timestamp).toLocaleString()}</div>
          <div><strong>📱 อุปกรณ์:</strong> ${log.device?.device || '-'} (${log.device?.os || '-'})</div>
          <div><strong>🔎 เบราว์เซอร์:</strong> ${log.device?.browser || '-'}</div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup'
      });
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

// ✅ [เพิ่ม] ฟังก์ชันแสดง Date Picker
function renderDateFilters() {
  const dateControls = document.getElementById('dateFilterControls');
  if (!dateControls) return;

  dateControls.innerHTML = `
    <div class="flex gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium">📅 Start Date</label>
        <input type="date" id="startDate" class="border rounded px-2 py-1" />
      </div>
      <div>
        <label class="block text-sm font-medium">📅 End Date</label>
        <input type="date" id="endDate" class="border rounded px-2 py-1" />
      </div>
      <button id="exportCsvBtn" class="bg-blue-600 text-white px-4 py-2 rounded mt-6 hover:bg-blue-700">
        Export Logs
      </button>
    </div>
  `;
}

// ✅ รันเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', async () => {
  await fetchLogs();
  populateGroupSelector(logs);
  renderDateFilters(); // ✅ เรียกฟังก์ชันแสดง Date Picker
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

  // ✅ เชื่อมปุ่ม Export CSV กับฟังก์ชันใหม่
  document.addEventListener('click', e => {
    if (e.target.id === 'exportCsvBtn') {
      exportGroupLogs();
    }
  });
});
