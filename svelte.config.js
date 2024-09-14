import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		version: {
			name: 'mostpaster-' + new Date()
			// name: child_process.execSync('git rev-parse HEAD').toString().trim()
		}
	}
};

export default config;
