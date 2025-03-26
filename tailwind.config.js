/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // เปิดใช้งาน Dark Mode
    content: [
      "./frontend/**/*.{html,js}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#4f46e5',    // สีหลัก (indigo-600)
          secondary: '#6366f1',  // สีรอง (indigo-500)
          success: '#22c55e',    // สีสำเร็จ (green-500)
          error: '#ef4444',      // สีข้อผิดพลาด (red-500)
          warning: '#facc15',    // สีคำเตือน (yellow-400)
          darkbg: '#1f2937',     // สีพื้นหลัง dark mode (gray-800)
          darktext: '#f9fafb',   // สีข้อความ dark mode (gray-50)
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
  