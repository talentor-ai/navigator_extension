/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
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
      },
      fontSize: {
        small: '0.7rem',
        medium: '1rem',
        large: '1.3rem',
      },
      spacing: {
        boxHeight: '2.4rem',
        boxRound: '1rem',
      },
    },
  },
  plugins: [],
};
