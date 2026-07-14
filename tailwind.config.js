import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                peach: {
                    DEFAULT: '#fdf8f4',
                    light: '#fffaf7',
                    dark: '#fadbd8',
                },
                sage: {
                    DEFAULT: '#8b9c7b',
                    light: '#a3b194',
                    dark: '#738363',
                },
                tangerine: {
                    DEFAULT: '#f48c66',
                    light: '#f7a485',
                    dark: '#df7148',
                },
                rose: {
                    DEFAULT: '#d4727a',
                    light: '#f9e8ea',
                    dark: '#b85560',
                }
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
            },
        },
    },

    plugins: [forms],
};
