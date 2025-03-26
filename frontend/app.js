// ✅ โหลดลิงก์ทั้งหมดจาก backend และแสดงในหน้า Dashboard
async function loadLinks() {
    try {
      const res = await fetch('/api/links');
      const links = await res.json();
  
      const container = document.getElementById('linkList');
      container.innerHTML = '';
  
      if (!links.length) {
        container.innerHTML = '<p class="text-gray-500">ยังไม่มีลิงก์ในระบบ</p>';
        return;
      }
  
      links.forEach((link, index) => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded shadow';
  
        card.innerHTML = `
          <p class="text-sm text-gray-600 mb-1">ลิงก์ #${index + 1}</p>
          <p class="text-blue-600 break-all font-medium mb-2">${link.url}</p>
          <div class="flex items-center space-x-2">
            <button class="copyBtn bg-blue-500 text-white px-2 py-1 rounded text-sm" data-url="${link.url}">Copy</button>
            <a href="${link.url}" target="_blank" class="text-sm text-green-600 underline">Open</a>
          </div>
        `;
  
        container.appendChild(card);
      });
  
      // ✅ เชื่อมปุ่ม Copy ทุกรายการ
      document.querySelectorAll('.copyBtn').forEach(btn => {
        btn.addEventListener('click', () => {
          const url = btn.getAttribute('data-url');
          navigator.clipboard.writeText(url);
          btn.textContent = 'Copied!';
          setTimeout(() => (btn.textContent = 'Copy'), 1000);
        });
      });
    } catch (error) {
      console.error('Error loading links:', error);
    }
  }
  
  // ✅ เมื่อโหลดหน้าเว็บ
  document.addEventListener('DOMContentLoaded', () => {
    loadLinks();
    
    // ✅ [เพิ่ม] เชื่อมปุ่ม Export Logs เป็น CSV
    document.getElementById('exportCsvBtn').addEventListener('click', () => {
      window.open('/api/export-logs', '_blank');
    });
  });
  