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

  // 📊 สร้างกราฟใหม่
  window.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: mode === 'perDay' ? 'Clicks per Day' : 'Click Timeline',
        data,
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: mode === 'perDay' ? '📊 Clicks Per Day' : '📈 Click Timeline'
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 60,
            minRotation: 30
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
