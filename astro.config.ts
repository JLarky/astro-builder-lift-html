import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import solid from '@astrojs/solid-js';

const localPreview = Boolean(process.env.LOCAL_PREVIEW);

// Make sure that JSX is compiled with Solid for components inside the solid folder and with React for everything else.
const solidFiles = '**/solid/**';

export default defineConfig({
	output: 'server',
	// Redirects `/path/` before the page runs (301 for GET).
	trailingSlash: 'never',
	adapter: localPreview
		? node({
				mode: 'standalone',
			})
		: vercel({}),
	integrations: [
		react({
			exclude: [solidFiles],
		}),
		solid({
			include: [solidFiles],
		}),
	],
});
