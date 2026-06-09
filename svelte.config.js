import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		paths: {
			// GitHub Pages project sites are served from /<repo-name>
			base: process.env.BASE_PATH || ''
		},
		prerender: {
			// Generated assets (covers, audio) may lag content; warn instead of failing the build.
			handleHttpError: ({ status, path, message }) => {
				if (status === 404 && (path.startsWith('/img/') || path.startsWith('/audio/'))) {
					console.warn(`prerender: missing asset ${path} (generate it before deploy)`);
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
