import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        arc: {
          50: '#f5f8fc',     // Page background
          100: '#e8eef6',    // Card hover
          200: '#cdddf2',    // Sky Sync (borders, subtle bg)
          300: '#ACC6E9',    // Light accent
          400: '#2F578C',    // Mid blue
          500: '#1434CB',    // Bright blue (links, buttons)
          600: '#1B3158',    // Protocol Navy (headings, primary text)
          700: '#152847',    // Darker navy
          800: '#0f1d35',    // Deep navy
          900: '#060d17',    // Darkest
        },
        'arc-purple': '#3E2B63',
        'arc-magenta': '#942753',
        'arc-peach': '#F3966F',
        'arc-gold': '#F3CA94',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'arc-gradient': 'linear-gradient(135deg, #1B3158 0%, #3E2B63 50%, #942753 100%)',
        'arc-gold-gradient': 'linear-gradient(135deg, #F3966F 0%, #F3CA94 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
