/**
 * Marketplace presets and mat geometry.
 *
 * These values are copied from the engine's single source of truth,
 * `apps/listing-bench/crates/listingbench-core/src/processor.rs` (`PRESETS`,
 * `matting_canvas_bg`, the `margin` calculation and `strict_white` handling).
 * If one changes, the other must change with it — the free check is only
 * honest while it draws the same canvas the desktop app draws.
 */

export interface Preset {
  id: string;
  label: string;
  marketplace: string;
  width: number;
  height: number;
  /** Amazon's main image rule: a pure #FFFFFF canvas. */
  strictWhite: boolean;
  note: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'etsy',
    label: 'Etsy Square',
    marketplace: 'Etsy',
    width: 2000,
    height: 2000,
    strictWhite: false,
    note: 'Square main image',
  },
  {
    id: 'ebay',
    label: 'eBay Standard',
    marketplace: 'eBay',
    width: 1600,
    height: 1600,
    strictWhite: false,
    note: 'Square, 1600 px long edge',
  },
  {
    id: 'shopify',
    label: 'Shopify Collection',
    marketplace: 'Shopify',
    width: 2048,
    height: 1536,
    strictWhite: false,
    note: '4:3 collection banner and grid',
  },
  {
    id: 'amazon',
    label: 'Amazon Strict White',
    marketplace: 'Amazon',
    width: 2000,
    height: 2000,
    strictWhite: true,
    note: 'Pure #FFFFFF canvas',
  },
  {
    id: 'poshmark',
    label: 'Poshmark Square',
    marketplace: 'Poshmark',
    width: 1200,
    height: 1200,
    strictWhite: false,
    note: 'Square, 1200 px',
  },
  {
    id: 'social',
    label: 'Social Showcase',
    marketplace: 'Instagram / Pinterest',
    width: 1080,
    height: 1350,
    strictWhite: false,
    note: '4:5 portrait',
  },
];

export type Matting = 'borderless' | 'chalk5' | 'deep10';

export const MATTING_OPTIONS: { id: Matting; label: string; hint: string }[] = [
  { id: 'borderless', label: 'Borderless', hint: 'Photo to the edge, white canvas' },
  { id: 'chalk5', label: 'Chalk mat 5%', hint: 'Chalk #FAFAF6 + Grid Line hairline' },
  { id: 'deep10', label: 'Gallery 10%', hint: '10% inset, deeper neutral' },
];

/** Backgrounds from `matting_canvas_bg`. Borderless falls back to white. */
export const MATTING_BG: Record<Matting, string> = {
  borderless: '#FFFFFF',
  chalk5: '#FAFAF6',
  deep10: '#EAF2ED',
};

/** Hairline colours from `HAIRLINE_CHALK` / `HAIRLINE_DEEP`. */
export const MATTING_HAIRLINE: Partial<Record<Matting, string>> = {
  chalk5: '#CFE0D6',
  deep10: '#24402F',
};

/**
 * Inset = a fraction of the shorter canvas side, mirrored on both axes,
 * exactly as the engine computes `margin`.
 */
export function marginFor(preset: Preset, matting: Matting): number {
  const shorter = Math.min(preset.width, preset.height);
  if (matting === 'borderless') return 0;
  return Math.round(shorter * (matting === 'chalk5' ? 0.05 : 0.1));
}

export type Verdict = 'ready' | 'resize' | 'conform' | 'upscale';

export interface Judgement {
  verdict: Verdict;
  headline: string;
  detail: string;
}

/**
 * Judge one source photo against one preset. `fit` is the engine's default,
 * so "conform" means the Bench letterboxes it into the canvas rather than
 * cropping your product out of frame.
 */
export function judge(preset: Preset, width: number, height: number): Judgement {
  const sourceAr = width / height;
  const targetAr = preset.width / preset.height;
  const shapeOk = Math.abs(sourceAr - targetAr) <= 0.005;
  const bigEnough = width >= preset.width && height >= preset.height;
  const exact = width === preset.width && height === preset.height;

  if (exact) {
    return {
      verdict: 'ready',
      headline: `Already ${preset.width} × ${preset.height}.`,
      detail: 'The Bench would re-encode it for metadata removal and leave the framing alone.',
    };
  }
  if (bigEnough && shapeOk) {
    return {
      verdict: 'resize',
      headline: 'Right shape. Wrong size.',
      detail: `${width} × ${height} scales cleanly down to ${preset.width} × ${preset.height} — no crop, no bars.`,
    };
  }
  if (bigEnough && !shapeOk) {
    return {
      verdict: 'conform',
      headline: `${preset.marketplace} wants ${preset.width} × ${preset.height}.`,
      detail: `Your ${ratio(width, height)} frame gets conformed into a ${ratio(preset.width, preset.height)} canvas. With Fit, nothing is cropped; the mat fills the difference.`,
    };
  }
  return {
    verdict: 'upscale',
    headline: 'Smaller than this preset.',
    detail: `${width} × ${height} has to be upsampled to reach ${preset.width} × ${preset.height}. Upsampling softens detail — shoot or export larger next time.`,
  };
}

export function ratio(width: number, height: number): string {
  const g = gcd(width, height);
  return `${Math.round(width / g)}:${Math.round(height / g)}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function megapixels(width: number, height: number): string {
  return ((width * height) / 1_000_000).toFixed(1);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
