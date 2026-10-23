# Ownbench — Listing Bench marketing site

The public marketing site for **Listing Bench**, a $29 one-time desktop app (macOS/Windows) that batch-conforms product photos for Etsy, eBay, Shopify, Amazon, Poshmark and social — fully offline.

**Live site:** https://kunknown321.github.io/ownbench-site/

## What's in here

- Vite + React + Tailwind v4 single-page marketing site.
- `src/components/FreeCheck.tsx` — the free in-browser single-photo check (runs entirely client-side; no uploads).
- `scripts/prerender.mjs` — build step that inlines the fully rendered HTML into `dist/index.html`, generates `robots.txt` + `sitemap.xml`, and substitutes the final site URL. Search engines, social scrapers and AI crawlers get real content, not an empty SPA shell.
- JSON-LD structured data (Organization, WebSite, SoftwareApplication offer, FAQPage) lives in `index.html`.

## Build

```sh
npm ci --legacy-peer-deps
npm run build          # vite build + prerender; SITE_URL env controls the public URL
npm run dev            # http://localhost:3000 (base = /)
```

## Deploy

Pushes to `main` auto-build and publish to GitHub Pages (`.github/workflows/deploy.yml`). The public URL is derived from the repository coordinates at build time, so renames of the repo keep the canonical URLs, sitemap and Open Graph image correct.

## Honest-commerce notes

- Checkout is intentionally closed until payment, license issuance and installer delivery work end-to-end. The waitlist form is the only collection point.
- Product claims on the page are measured values, not marketing roundings.
