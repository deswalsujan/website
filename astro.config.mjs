// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sujandeswal.com',
  adapter: cloudflare(),
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
      transformers: [
        {
          pre(node) {
            const style = node.properties.style;
            if (typeof style === 'string') {
              node.properties.style = style
                .split(';')
                .filter((d) => !d.trim().startsWith('background-color'))
                .join(';');
            }
          },
        },
      ],
    }
  }
});