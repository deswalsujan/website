// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
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