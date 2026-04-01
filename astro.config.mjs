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
            { label: 'Configuration', link: '/configuration/' },
          ],
        },
        {
          label: 'The Basics',
          items: [
            { label: 'Routing', link: '/routing/' },
            { label: 'Controllers', link: '/controllers/' },
            { label: 'Requests & Validation', link: '/requests/' },
            { label: 'Responses', link: '/responses/' },
          ],
        },
        {
          label: 'Database',
          items: [
            { label: 'Query Builder', link: '/database/' },
          ],
        },
        {
          label: 'Security',
          items: [
            { label: 'Authentication', link: '/authentication/' },
          ],
        },
      ],
      customCss: [
        './src/styles/starlight.css',
      ],
    }),
    react(),
    sitemap()
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});