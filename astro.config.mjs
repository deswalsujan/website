// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sujandeswal.com',
  adapter: cloudflare(),
  integrations: [sitemap()],
  // Fonts are downloaded from Google at build time and served from our own domain,
  // so visitors never wait on fonts.googleapis.com. Same families and weights as before.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Zalando Sans',
      cssVariable: '--font-zalando-sans',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      display: 'swap',
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      display: 'swap',
      fallbacks: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
    },
  ],
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