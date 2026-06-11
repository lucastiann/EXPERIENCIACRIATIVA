/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // paleta da plataforma — inspirada na coloracao dos cromossomos X em FISH
        cream: {
          50: '#fbfaf7',
          100: '#f5f2eb',
          200: '#e9e3d6',
        },
        ink: {
          50: '#f7f6f4',
          100: '#e3e1dd',
          200: '#c4c1bb',
          400: '#6b6862',
          600: '#3a3833',
          900: '#0e0c1d',
        },
        violet2: {
          50: '#f6f3ff',
          100: '#ebe5ff',
          200: '#d1c3ff',
          300: '#b39bff',
          400: '#8e6bff',
          500: '#6d3df5',
          600: '#572ad6',
          700: '#4520a8',
          800: '#321878',
          900: '#1c0d4a',
        },
        coral: {
          50: '#fff3f1',
          100: '#ffe2dc',
          300: '#ffb1a1',
          500: '#fb7185',
          600: '#e0496a',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28, 13, 74, 0.04), 0 8px 24px rgba(28, 13, 74, 0.05)',
        glow: '0 0 0 6px rgba(109, 61, 245, 0.12)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
