const colors = require('tailwindcss/colors')

module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            background: '#282828',
            'background-dark': '#212121',
            foreground: '#EBDBB2',
            'foreground-light': '#efe2c1',
            gray: '#545454',
            red: '#FB4934',
            green: '#B8BB26',
            yellow: '#FABD2F',
            blue: '#83A598',
            'bright-blue': '#1DA1F2',
            purple: '#D3869B',
            aqua: '#8EC07C',
            orange: '#FE8019',
            brand: {
                github: '#4078c0',
                'buy-me-a-coffee': '#FFDD00'
            }
        },
        fontFamily: {
            sans: ['Twemoji Country Flags', 'Roboto', 'sans-serif'],
            serif: ['Twemoji Country Flags', 'Merriweather', 'serif']
        },
        container: {
            center: true
        },
        extend: {
            keyframes: {
                'double-spin': {
                    from: {transform: 'rotate(0deg)'},
                    to: {transform: 'rotate(720deg)'}
                },
                wiggle: {
                    '0%, 100%': {transform: 'rotate(-3deg)'},
                    '50%': {transform: 'rotate(3deg)'}
                }
            },
            animation: {
                'double-spin': 'double-spin 0.6s ease-in-out',
                wiggle: 'wiggle 1s ease-in-out infinite'
            }
        }
    },
    plugins: [require('@tailwindcss/forms')]
}
