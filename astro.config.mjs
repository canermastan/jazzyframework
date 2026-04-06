// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://canermastan.github.io',
  base: '/jazzyframework',
  integrations: [
    starlight({
      title: 'Jazzy Framework',
      social: {
        github: 'https://github.com/canermastan/jazzy-framework',
      },
      defaultLocale: 'en',
      locales: {
        en: {
          label: 'English',
          lang: 'en',
        },
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/' },
            { label: 'Installation', link: '/installation/' },
            { label: 'Getting Started', link: '/getting-started/' },
          ],
        },
        {
          label: 'The Basics',
          items: [
            { label: 'Routing', link: '/routing/' },
            { label: 'Middleware', link: '/middleware/' },
            { label: 'Controllers', link: '/controllers/' },
            { label: 'Context', link: '/context/' },
            { label: 'Requests', link: '/requests/' },
            { label: 'Validation', link: '/validation/' },
            { label: 'Responses', link: '/responses/' },
            { label: 'Static Files', link: '/static-files/' },
            { label: 'Cache', link: '/cache/' },
            { label: 'Client IP', link: '/client-ip/' },
          ],
        },
        {
          label: 'Database',
          items: [
            { label: 'Query Builder', link: '/database/' },
            { label: 'Schema', link: '/schema/' },
          ],
        },
        {
          label: 'Security',
          items: [
            { label: 'Authentication', link: '/authentication/' },
            { label: 'CORS', link: '/cors/' },
            { label: 'Rate Limiting', link: '/rate-limiting/' },
          ],
        },
        {
          label: 'Advanced',
          items: [
            { label: 'Logging & Tracking', link: '/logging/' },
            { label: 'Dev UI', link: '/dev-ui/' },
          ],
        },
      ],
      customCss: [
        './src/styles/starlight.css',
      ],
      head: [
        // This domain belongs to Caner Mastan. It is not a malicious domain.
        {
          tag: 'script',
          attrs: {
            'data-goatcounter': 'https://stats.mindora.net.tr/count',
            async: true,
            src: 'https://stats.mindora.net.tr/count.js',
          },
        },
      ],
    }),
    react(),
    sitemap()
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});