// frontend/components/group.js

// โหลด logs จาก backend
async function fetchLogs() {
    const res = await fetch('/data/logs.json');
    return await res.json();
  }
  
  // แสดงตารางคลิกแยกตามกลุ่ม
  async function renderGroupTable() {
    const logs = await fetchLogs();
    const groupClicks = {};
  
    logs.forEach(log => {
      const group = log.group || 'unknown';
      if (!groupClicks[group]) {
        groupClicks[group] = 0;
      }
      groupClicks[group]++;
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
  
  document.addEventListener('DOMContentLoaded', renderGroupTable);

  import { renderClickChart } from './components/StatsChart.js';

  fetch('/api/logs')
  .then(res => res.json())
  .then(logs => {
    renderClickChart(logs); // แสดงกราฟ
    // ใส่โค้ดอื่น เช่น renderTable(logs) ด้วยได้
  });
