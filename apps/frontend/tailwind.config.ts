import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0d0f14',
        surface: '#161920',
        card: '#1e2130',
        border: '#2a2f42',
        text: '#e8eaf0',
        muted: '#7880a0',
        accent: '#5c6ef7',
      },
    },
  },
  plugins: [],
};

export default config;
