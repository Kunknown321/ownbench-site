/**
 * Prerender build step.
 *
 * The site is a client-rendered React SPA. Search engines, social scrapers
 * (Facebook/LinkedIn/Discord) and AI crawlers do not reliably execute
 * JavaScript, so `vite build` alone publishes an almost-empty index.html.
 * This script server-renders the app and inlines the HTML into dist/index.html,
 * and generates dist/robots.txt and dist/sitemap.xml.
 *
 * SITE_URL (e.g. https://someone.github.io/ownbench) must point at the final
 * public URL: it fixes the __SITE_URL__ placeholders in index.html and is used
 * for the canonical URL, the sitemap and robots.txt.
 *
 * Run after `vite build` (see package.json "build"). No-op risk: it exits
 * non-zero if anything is missing, so a broken deploy cannot go out silently.
 */
import { build } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const ssrDir = path.join(root, '.ssr-build');

const SITE_URL =
  process.env.SITE_URL ?? 'http://localhost:4173';

const isDefaultSiteUrl = !process.env.SITE_URL;
if (isDefaultSiteUrl) {
  console.warn(
    '[prerender] SITE_URL is not set — using the localhost default. ' +
      'Canonical URLs in this build are NOT fit for publishing.',
  );
}

const siteUrl = SITE_URL.replace(/\/+$/, '');

// ---------------------------------------------------------------------------
// 1. SSR build of the app entry.
// ---------------------------------------------------------------------------
await build({
  root,
  configFile: path.join(root, 'vite.config.ts'),
  plugins: [react(), tailwindcss()],
  logLevel: 'warn',
  build: {
    ssr: path.resolve(root, 'src/App.tsx'),
    outDir: ssrDir,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Stable file name so the import below cannot drift.
        entryFileNames: 'app.ssr.mjs',
        format: 'es',
      },
    },
  },
});

// ---------------------------------------------------------------------------
// 2. Render the app to static HTML.
// ---------------------------------------------------------------------------
const { default: App } = await import(
  path.join(ssrDir, 'app.ssr.mjs')
);
const appHtml = renderToString(createElement(App));

// ---------------------------------------------------------------------------
// 3. Inject into the client build and fix the URL placeholders.
// ---------------------------------------------------------------------------
const indexHtml = path.join(distDir, 'index.html');
let html = fs.readFileSync(indexHtml, 'utf8');

if (!html.includes('<div id="root"></div>')) {
  throw new Error(
    'dist/index.html no longer contains an empty #root div — did index.html change? ' +
      ' prerender.mjs needs that exact element to inject the static markup.',
  );
}
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
html = html.replaceAll('__SITE_URL__', siteUrl);

if (html.includes('__SITE_URL__')) {
  throw new Error('A __SITE_URL__ placeholder survived the rewrite — aborting.');
}

fs.writeFileSync(indexHtml, html);
fs.rmSync(ssrDir, { recursive: true, force: true });

// ---------------------------------------------------------------------------
// 4. robots.txt + sitemap.xml (generated, not static, so the URL is correct).
// ---------------------------------------------------------------------------
fs.writeFileSync(
  path.join(distDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

fs.writeFileSync(
  path.join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
);

console.log(
  `[prerender] done — server-rendered markup inlined into dist/index.html for ${siteUrl}`,
);
