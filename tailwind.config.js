/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBFAF5',
        surface: '#FFFFFF',
        leaf: {
          DEFAULT: '#2E5D34',
          light: '#4C8B52',
          dark: '#1E3F23',
          50: '#EEF4EB',
        },
        sprout: '#8FBF6B',
        harvest: '#C99A2E',
        ink: '#1B241C',
        muted: '#5F6F60',
        line: '#DDE5D6',
        rust: '#B3432B',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        soft: '0 2px 10px rgba(30, 63, 35, 0.06)',
      },
    },
  },
  plugins: [],
};
