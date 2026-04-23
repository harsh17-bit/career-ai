export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          black: '#000000',
          gray: {
            50: '#F5F5F7',
            100: '#E8E8ED',
            200: '#D2D2D7',
            300: '#86868B',
            400: '#6E6E73',
            500: '#424245',
            600: '#333336',
            700: '#2D2D2D',
            800: '#1D1D1F',
            900: '#0A0A0A',
          },
          blue: '#1978A5',
          purple: '#1FBFB8',
          pink: '#05716C',
          green: '#1FBFB8',
          steel: '#05716C',
          orange: '#FF9F0A',
          teal: '#1FBFB8',
        },
      },
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          '"Inter"',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        mono: ['"SF Mono"', '"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        hero: [
          'clamp(3rem, 8vw, 8rem)',
          { lineHeight: '1', letterSpacing: '-0.04em' },
        ],
      },
      animation: {
        gradient: 'gradient 8s ease infinite',
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        marquee: 'marquee 40s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: {
        '3xl': '64px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
