import type { Config } from 'tailwindcss';
import catppuccin from '@catppuccin/tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		colors: {
			transparent: '#00000000'
		},
		extend: {}
	},

	plugins: [catppuccin]
} as Config;
