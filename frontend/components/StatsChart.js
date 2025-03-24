// frontend/components/StatsChart.js
export function renderClickChart(logs) {
    const ctx = document.getElementById('clickChart').getContext('2d');
  
    // 🔁 รวมคลิกตามวัน
    const clickCounts = {};
    logs.forEach(log => {
      const date = new Date(log.timestamp).toLocaleDateString();
      clickCounts[date] = (clickCounts[date] || 0) + 1;
    });
  
    const labels = Object.keys(clickCounts);
    const data = Object.values(clickCounts);
  
    // 🎯 ลบกราฟเดิมก่อนสร้างใหม่
    if (window.chartInstance) {
      window.chartInstance.destroy();
    }
  
    window.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Clicks per Day',
          data,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: '📈 Clicks Over Time' }
        }
      }
    });
  }
  