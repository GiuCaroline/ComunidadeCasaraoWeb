/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        'branco': '#FAFAFA',
        'preto': {
          DEFAULT: '#000',
          dark: '#121212',
        },
        'input': {
          DEFAULT: '#F0F0F0',
          dark: '#646464',
        },
        'placeInput': '#5e5e5e',
        'vermelho': {
          DEFAULT: '#BB1C00',
          opaci: '#bb1c0073'
        },
        'masc': {
          DEFAULT: '#BCCFFF',
          icon: '#2E9AFF'  
        },
        'fem': {
          DEFAUL: '#FFBDF1',
          icon: '#C700A2'
        },
        
        // Cor de erro/sucesso fundo
        'success': '#D8FFCE',
        'error': '#FFAD9E'
      },
    },
  },
  plugins: [],
}
