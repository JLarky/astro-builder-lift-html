import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import solid from '@astrojs/solid-js';

export default defineConfig({
  output: 'server',
  adapter: vercel({
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
