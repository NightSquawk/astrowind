import * as path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import cloudflare from '@astrojs/cloudflare';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration/index.js';
import clientOverridesPlugin from './vendor/integration/vite-plugin-client-overrides.js';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

// Site URL for sitemap generation
// Clients should set PUBLIC_SITE_URL environment variable or update this value
// Example: Set in .env file: PUBLIC_SITE_URL=https://yoursite.com
// Or update astro.config.ts to import from your config: site: config.site.url
const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://example.com';

export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  // Site URL for sitemap and canonical URLs
  site: siteUrl,
  trailingSlash: 'ignore',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      // Sitemap is automatically generated at build time
      // Includes all static pages and dynamic routes (podcast episodes, coupons, campaigns)
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Generate single sitemap.xml instead of sitemap-index.xml
      entryLimit: 50000, // High limit to prevent splitting into multiple files
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    plugins: [
      clientOverridesPlugin(),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
