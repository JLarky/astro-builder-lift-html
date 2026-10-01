import { defineConfig, memoryCache } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import { cacheVercel } from '@astrojs/vercel/cache';
import react from '@astrojs/react';
import solid from '@astrojs/solid-js';

const localPreview = Boolean(process.env.LOCAL_PREVIEW);

// Make sure that JSX is compiled with Solid for components inside the solid folder and with React for everything else.
const solidFiles = '**/solid/**';

export default defineConfig({
	output: 'server',
	// `trailingSlash: 'never'` redirects `/path/` before the page runs (301 for
	// GET). The catch-all also 308s if a slash still reaches it.
	trailingSlash: 'never',
	// Route cache, not adapter `isr`. ISR rewrites through `/_isr` and drops
	// Builder editor params (`__builder_editing__`, `builder.overrides.*`).
	cache: { provider: localPreview ? memoryCache() : cacheVercel() },
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
