// frontend/components/StatsChart.js

export function renderClickChart(logs, mode = 'timeline') {
  const ctx = document.getElementById('clickChart').getContext('2d');

  let labels = [];
  let data = [];

  if (mode === 'perDay') {
    // 🔁 รวมจำนวนคลิกตามวัน
    const clickCounts = {};
    logs.forEach(log => {
      const date = new Date(log.timestamp).toLocaleDateString();
      clickCounts[date] = (clickCounts[date] || 0) + 1;
    });
    labels = Object.keys(clickCounts);
    data = Object.values(clickCounts);
  } else {
    // ⏱️ เรียงตามเวลาแต่ละคลิก
    labels = logs.map(log => new Date(log.timestamp).toLocaleString());
    data = logs.map((_, i) => i + 1);
  }

  // 🧼 ลบกราฟเก่า
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  // ✅ ตรวจโหมดมืดจาก <html class="dark">
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#f9fafb' : '#1f2937';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const bgColor = isDark ? '#1e293b' : '#ffffff';

  // 📊 สร้างกราฟใหม่
  window.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: mode === 'perDay' ? 'Clicks per Day' : 'Click Timeline',
        data,
        borderColor: '#3b82f6',
        backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: textColor
          }
        },
        title: {
          display: true,
          text: mode === 'perDay' ? '📊 Clicks Per Day' : '📈 Click Timeline',
          color: textColor
        },
        tooltip: {
          bodyColor: textColor,
          titleColor: textColor,
          backgroundColor: isDark ? '#334155' : '#f9fafb',
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 60,
            minRotation: 30,
            color: textColor
          },
          grid: {
            color: gridColor
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColor
          },
          grid: {
            color: gridColor
          }
        }
      }
    }
  });
}
