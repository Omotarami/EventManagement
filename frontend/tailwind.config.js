/** @type {import('tailwindcss').Config} */
export default {
    
  
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#2A9D8F',
            light: '#3cafa1',
            dark: '#1f877a',
          },
          secondary: {
            DEFAULT: '#F4A261',
            light: '#f7b682',
            dark: '#e58b40',
          },
          dark: {
            100: '#0F172A',
            200: '#1E293B',
            300: '#334155',
            400: '#475569',
          },
          light: {
            100: '#F8FAFC',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
          },
          success: '#10B981',
          warning: '#FBBF24',
          error: '#EF4444',
          info: '#3B82F6',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          gideon: ['"Gideon Roman"', 'cursive'],
        },
    
        boxShadow: {
          'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    plugins: [
    //   require('@tailwindcss/forms'),
    //   require('@tailwindcss/typography'),
    //   require('@tailwindcss/aspect-ratio'),
    ],
  }