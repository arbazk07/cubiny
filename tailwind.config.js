/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green:  { DEFAULT:'#22C55E', dark:'#16A34A', light:'#DCFCE7', mid:'#86EFAC', dim:'#F0FDF4' },
        cobalt: { DEFAULT:'#2563EB', dark:'#1D4ED8', light:'#DBEAFE', dim:'#EFF6FF' },
      },
      fontFamily: { sans:['Inter','-apple-system','BlinkMacSystemFont','Segoe UI','sans-serif'] },
      borderRadius: { sm:'8px', DEFAULT:'12px', lg:'16px', xl:'20px', '2xl':'24px', '3xl':'32px' },
      boxShadow: {
        xs:    '0 1px 2px rgba(17,24,39,0.05)',
        card:  '0 2px 8px rgba(17,24,39,0.07)',
        md:    '0 4px 16px rgba(17,24,39,0.09)',
        lg:    '0 10px 24px rgba(17,24,39,0.11)',
        xl:    '0 20px 40px rgba(17,24,39,0.13)',
        panel: '0 8px 32px rgba(17,24,39,0.12),0 2px 8px rgba(17,24,39,0.06)',
        green: '0 4px 14px rgba(34,197,94,0.35)',
        blue:  '0 4px 14px rgba(37,99,235,0.30)',
      },
    },
  },
  plugins: [],
};
