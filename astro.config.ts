import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import solid from '@astrojs/solid-js';

const localPreview = Boolean(process.env.LOCAL_PREVIEW);

// Files under solid/ are custom elements, and everything else in src/builder is React.
const solidFiles = '**/solid/**';

export default defineConfig({
	output: 'server',
	adapter: localPreview
		? node({
				mode: 'standalone',
			})
		: vercel({
				imageService: true,
				webAnalytics: {
					enabled: true,
				},
			}),
	integrations: [
		react({
			exclude: [solidFiles],
		}),
		solid({
			include: [solidFiles],
		}),
	],
});
