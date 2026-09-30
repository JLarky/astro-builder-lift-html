import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import solid from '@astrojs/solid-js';

const localPreview = Boolean(process.env.LOCAL_PREVIEW);

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
			exclude: ['**/solid/**'],
		}),
		solid({
			include: ['**/solid/*'],
		}),
	],
});
