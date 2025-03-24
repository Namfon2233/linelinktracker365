// ฟังก์ชันแปลง JSON เป็น CSV
function jsonToCsv(jsonData) {
    const header = Object.keys(jsonData[0]).join(',');
    const rows = jsonData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
    return [header, ...rows].join('\r\n');
}

// ฟังก์ชัน export logs เฉพาะกลุ่มที่เลือก
async function exportGroupLogs() {
    const selectedGroup = document.getElementById('groupSelector').value;

    // ดึงข้อมูล logs ทั้งหมดจาก API หรือไฟล์ที่เก็บข้อมูล (เช่น logs.json)
    const response = await fetch('/api/logs'); // แก้ endpoint ให้ถูกต้องกับระบบคุณ
    const logs = await response.json();

    // กรองข้อมูลเฉพาะกลุ่มที่เลือก
    const filteredLogs = logs.filter(log => log.group === selectedGroup);

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (filteredLogs.length === 0) {
        alert("ไม่มีข้อมูลสำหรับกลุ่มนี้");
        return;
    }

    // แปลง JSON เป็น CSV
    const csvData = jsonToCsv(filteredLogs);

    // สร้าง Blob และลิงก์ดาวน์โหลด
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${selectedGroup}-logs.csv`;

    // คลิกลิงก์อัตโนมัติแล้วลบลิงก์ออก
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// เชื่อมปุ่มกับฟังก์ชัน Export CSV
document.getElementById('exportCsvBtn').addEventListener('click', exportGroupLogs);
