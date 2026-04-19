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
          50: '#cdddf2',    // Sky Sync (light blue)
          100: '#ACC6E9',   // Light sky
          200: '#2F578C',   // Mid blue
          300: '#1434CB',   // Bright blue (accent)
          400: '#1B3158',   // Protocol Navy (primary brand)
          500: '#1B3158',   // Protocol Navy
          600: '#152847',   // Darker navy
          700: '#0f1d35',   // Deep navy
          800: '#0a1424',   // Near black navy
          900: '#060d17',   // Darkest
        },
        // Gradient accents from brand kit
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
