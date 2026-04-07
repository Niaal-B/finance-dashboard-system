/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        midnight: '#0a0f1e',
        navy: '#0d1526',
        charcoal: '#111827',
        'glass-dark': 'rgba(15, 23, 42, 0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-blue': 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        'gradient-emerald': 'linear-gradient(135deg, #10b981, #3b82f6)',
        'mesh': "radial-gradient(at 40% 20%, hsla(217,100%,56%,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(263,100%,60%,0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,52%,0.06) 0px, transparent 50%)",
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'count-up': 'countUp 1s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-hover': '0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        'blue-glow': '0 0 40px rgba(59,130,246,0.25)',
        'emerald-glow': '0 0 40px rgba(16,185,129,0.2)',
      },
      borderColor: {
        'glass': 'rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
}
