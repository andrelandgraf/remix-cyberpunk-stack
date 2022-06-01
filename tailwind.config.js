module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#B82D33',
        primaryDark: '#ffd300',
        secondary: '#005678',
        background: '#e2dddf',
        backgroundDark: '#01012b',
      },
      fontFamily: {
        cyberpunk: [
          'Orbitron',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
    },
  },
  plugins: [],
};
