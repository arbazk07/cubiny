/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green:  { DEFAULT:'#22C55E', dark:'#16A34A', light:'#DCFCE7', mid:'#86EFAC' },
        cobalt: { DEFAULT:'#2563EB', dark:'#1D4ED8', light:'#DBEAFE', mid:'#93C5FD' },
        slate:  { 50:'#F8FAFC',100:'#F1F5F9',200:'#E2E8F0',300:'#CBD5E1',400:'#94A3B8',500:'#64748B',600:'#475569',700:'#334155',800:'#1E293B',900:'#0F172A' },
      },
      fontFamily: { sans:['Inter','-apple-system','BlinkMacSystemFont','Segoe UI','sans-serif'] },
      boxShadow: {
        xs:   '0 1px 2px rgba(15,23,42,0.05)',
        card: '0 2px 8px rgba(15,23,42,0.07),0 1px 2px rgba(15,23,42,0.04)',
        md:   '0 4px 16px rgba(15,23,42,0.09),0 2px 4px rgba(15,23,42,0.04)',
        lg:   '0 8px 32px rgba(15,23,42,0.11),0 2px 8px rgba(15,23,42,0.05)',
        xl:   '0 16px 48px rgba(15,23,42,0.13),0 4px 16px rgba(15,23,42,0.06)',
        green:'0 4px 20px rgba(34,197,94,0.30)',
        blue: '0 4px 20px rgba(37,99,235,0.28)',
        float:'0 20px 60px rgba(15,23,42,0.15),0 4px 16px rgba(15,23,42,0.07)',
      },
      borderRadius: { sm:'6px', DEFAULT:'10px', lg:'14px', xl:'20px', '2xl':'28px' },
      animation: {
        'fade-up':'fade-up 0.4s cubic-bezier(0.4,0,0.2,1) both',
        'spin-s':'spin-s 0.75s linear infinite',
      },
      keyframes: {
        'fade-up':{ from:{opacity:0,transform:'translateY(18px)'},to:{opacity:1,transform:'translateY(0)'} },
        'spin-s':{ to:{transform:'rotate(360deg)'} },
      },
    },
  },
  plugins: [],
};
