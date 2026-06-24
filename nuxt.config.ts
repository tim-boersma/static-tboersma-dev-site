import { fileURLToPath } from 'node:url';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export default defineNuxtConfig({
  compatibilityDate: '2026-06-15',
  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@nuxt/eslint',
    '@nuxtjs/color-mode'
  ],
  vite: {
    optimizeDeps: {
      include: [
        '@pinia/colada',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'axios'
      ]
    },
    server: {
      watch: {
        usePolling: true
      }
    }
  },
  primevue: {
    importTheme: { from: '@/assets/themes/tbtheme.ts' },
  },
  devtools: {
    enabled: true,
  },
  debug: false,
  alias: {
    '@': fileURLToPath(new URL('./app/', import.meta.url)),
    '~': fileURLToPath(new URL('./', import.meta.url)),
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  css: [
    './app/assets/css/main.css',
    'primeicons/primeicons.css',
  ],
  runtimeConfig: {
    //.env variables prefixed with NUXT_ are automatically filled in
    public: {
      //.env variables prefixed with NUXT_PUBLIC_ are automatically added
    },
  },
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      failOnError: true,
    }
  },
  srcDir: 'app',
});