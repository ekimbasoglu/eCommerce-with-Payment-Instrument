const _ = require('lodash');
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  mode: 'jit',
  purge: ['./src/**/*.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        main: '#32445a', 
        twitter: '#1da1f2',
        bordercolor: '#413f3f',
        react: '#61dbfb',
        tailwind: '#00b4b6',
        nodejs: '#83ba63',
        mongodb: '#4db33d',
        aws: '#ff9900'
      },
      spacing: {
        '15': '3.75rem'
      },
      zIndex: {
        '-1': '-1',
      },
      borderWidth: {
        '1': '1px'
      }
    },
  },
  variants: {
  },
  plugins: [
    plugin(function ({ addUtilities, theme, e }) {
      const calcUtilities = _.map(theme('spacing'), (value, key) => {
        return {
          [`.${e(`calc-h-full-${key}`)}`]: {
            height: `calc(100% - ${value})`
          },
          [`.${e(`calc-w-full-${key}`)}`]: {
            width: `calc(100% - ${value})`
          }
        }
      })

      addUtilities(calcUtilities, {
        variants: ['responsive', 'hover'],
      })
    })
  ],
}
