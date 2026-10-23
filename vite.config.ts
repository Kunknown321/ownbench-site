import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// SITE_URL is the final public URL, e.g. https://someone.github.io/ownbench.
// Its path becomes the build base so assets resolve under the Pages subpath.
// The default keeps local builds and `npm run preview` working unchanged.
const SITE_URL = process.env.SITE_URL ?? 'http://localhost:4173';
const SITE_PATH = new URL(SITE_URL).pathname.replace(/\/$/, '');

export default defineConfig(() => {
  return {
    base: SITE_PATH === '' ? '/' : SITE_PATH + '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
