// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), mdx()],
  output: 'server',
  image: {
    service: passthroughImageService()
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  })
});