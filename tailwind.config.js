export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
    extend: {
      keyframes: {
        zoomSlow: {
          '0%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1.25)' }
        },
        fadeInUp: {
            '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
            },
            '100%': {
                opacity: 1,
                transform: 'translateY(0)'
            }
        }
      },
      animation: {
        zoomSlow: 'zoomSlow 20s ease-in-out infinite alternate',
        fadeInUp: 'fadeInUp 1s ease forwards'
      }
    }
  }
}