import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [mdx(), sitemap({
      // Keep unlisted / noindex pages out of the sitemap.
      filter: (page) => !["/rehabber-resources/", "/get-permitted/"].some((p) => page.endsWith(p)),
    })],
  site: 'https://www.southeastreptile.org',
});
