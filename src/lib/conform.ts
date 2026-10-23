/**
 * Canvas conform renderer.
 *
 * Mirrors `process_bytes` in the engine: same presets, same margin maths,
 * same hairline colours, same fit/fill decision, same stamp geometry
 * (watermark.rs: px = canvasW * scalePct / 100 / 0.7, margin = max(w/25, 24),
 * stamp pad = 0.7 * px). The result is a genuine JPEG re-encode, so the file
 * you download has no EXIF block at all — which is the whole point of the
 * scrub step.
 */

import {
  MATTING_BG,
  MATTING_HAIRLINE,
  marginFor,
  type Matting,
  type Preset,
} from './presets';

export interface ConformOptions {
  matting: Matting;
  fill: 'fit' | 'fill';
  stamp: string;
}

export function drawConformed(
  canvas: HTMLCanvasElement,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  preset: Preset,
  options: ConformOptions,
): void {
  const context = canvas.getContext('2d');
  if (!context) return;

  const tw = preset.width;
  const th = preset.height;
  canvas.width = tw;
  canvas.height = th;

  // Amazon's rule overrides both the background and the mat style: pure white,
  // 5% inset, no brand hairline (engine: `strict_white_canvas`).
  const matting: Matting = preset.strictWhite ? 'chalk5' : options.matting;
  const background = preset.strictWhite ? '#FFFFFF' : MATTING_BG[matting];
  const margin = marginFor(preset, matting);
  const innerWidth = Math.max(16, tw - margin * 2);
  const innerHeight = Math.max(16, th - margin * 2);

  context.fillStyle = background;
  context.fillRect(0, 0, tw, th);

  if (options.fill === 'fill') {
    const scale = Math.max(innerWidth / sourceWidth, innerHeight / sourceHeight);
    const cropWidth = innerWidth / scale;
    const cropHeight = innerHeight / scale;
    const sx = (sourceWidth - cropWidth) / 2;
    const sy = (sourceHeight - cropHeight) / 2;
    context.drawImage(source, sx, sy, cropWidth, cropHeight, margin, margin, innerWidth, innerHeight);
  } else {
    const scale = Math.min(innerWidth / sourceWidth, innerHeight / sourceHeight);
    const drawnWidth = Math.round(sourceWidth * scale);
    const drawnHeight = Math.round(sourceHeight * scale);
    const dx = margin + Math.round((innerWidth - drawnWidth) / 2);
    const dy = margin + Math.round((innerHeight - drawnHeight) / 2);
    context.drawImage(source, dx, dy, drawnWidth, drawnHeight);
  }

  const hairline = MATTING_HAIRLINE[matting];
  if (hairline && !preset.strictWhite) {
    context.strokeStyle = hairline;
    context.lineWidth = 1;
    context.strokeRect(margin + 0.5, margin + 0.5, innerWidth - 1, innerHeight - 1);
  }

  const stamp = options.stamp.trim();
  if (stamp) {
    const px = Math.max(12, (tw * 2.6) / 100 / 0.7);
    const pad = Math.max(14, px) * 0.7;
    context.font = `600 ${px}px "Public Sans", sans-serif`;
    context.textBaseline = 'alphabetic';
    const metrics = context.measureText(stamp);
    const textWidth = metrics.width;
    const textHeight = px; // PxScale em box, as ab_glyph uses
    const boxWidth = textWidth + pad * 2;
    const boxHeight = textHeight + pad * 2;
    const edge = Math.max(24, Math.round(tw / 25));
    const boxX = tw - boxWidth - edge;
    const boxY = th - boxHeight - edge;

    // Ink underlay one pixel down-right so chalk text reads on any photo.
    context.fillStyle = 'rgba(18, 26, 22, 0.75)';
    context.fillText(stamp, boxX + pad + 1, boxY + pad + textHeight * 0.82 + 1);
    context.fillStyle = '#FAFAF6';
    context.fillText(stamp, boxX + pad, boxY + pad + textHeight * 0.82);
  }
}

/** Same quality the app writes by default (Settings::default). */
export const JPEG_QUALITY = 0.92;

export function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg', JPEG_QUALITY));
}
