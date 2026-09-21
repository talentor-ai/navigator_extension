/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  prefix: 'tai',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
        border1: 'var(--bg1)',
        txt1: 'var(--txt1)',
        txt2: 'var(--txt2)',
        txt3: 'var(--txt3)',
        highlight: 'var(--highlight)',
        errorColor: 'var(--error-color)',
        successColor: 'var(--success-color)',
        infoColor: 'var(--info-color)',
      },
      fontSize: {
        small: 'calc(0.9rem * 0.78)',
        medium: '0.9rem',
        large: 'calc(0.9rem * 1.22)',
        icon: '1rem',
      },
      spacing: {
        boxHeight: '2.3rem',
        boxRound: '1rem',
      },
    },
  },
  plugins: [],
};
