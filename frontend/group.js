// frontend/components/group.js
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
async function renderGroupTable() {
  const logs = await fetchLogs();
  const groupClicks = {};

  logs.forEach(log => {
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

// รันเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', async () => {
  await renderGroupTable();
  setupChartModeSelector();
  renderClickChart(logs, 'timeline'); // เริ่มต้นด้วย timeline
  document.getElementById('exportCsvBtn').addEventListener('click', exportCsv);
});
