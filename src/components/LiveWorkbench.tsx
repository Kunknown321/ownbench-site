import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Upload,
  ShieldCheck,
  Check,
  Maximize2,
  Sliders,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  marketplace: string;
  width: number;
  height: number;
  ratio: string;
}

const PRESETS: Preset[] = [
  { id: 'etsy', name: 'Etsy Square', marketplace: 'Etsy', width: 2000, height: 2000, ratio: '1:1' },
  { id: 'ebay', name: 'eBay Standard', marketplace: 'eBay', width: 1600, height: 1600, ratio: '1:1' },
  { id: 'shopify', name: 'Shopify Collection', marketplace: 'Shopify', width: 2048, height: 1536, ratio: '4:3' },
  { id: 'social', name: 'Social Showcase', marketplace: 'Instagram / Pin', width: 1080, height: 1350, ratio: '4:5' },
];

interface SampleItem {
  id: string;
  title: string;
  category: string;
  color: string;
  accent: string;
  type: 'ceramic' | 'leather' | 'brass' | 'linen';
}

const SAMPLES: SampleItem[] = [
  { id: 'mug', title: 'Artisan Ceramic Mug', category: 'Handmade Pottery', color: '#B88665', accent: '#7A482A', type: 'ceramic' },
  { id: 'wallet', title: 'Full Grain Leather Bifold', category: 'Leather Goods', color: '#5C3826', accent: '#30180D', type: 'leather' },
  { id: 'compass', title: 'Solid Brass Pocket Compass', category: 'Vintage Hardware', color: '#C8A251', accent: '#8C6C26', type: 'brass' },
  { id: 'linen', title: 'Botanical Fern Linen Print', category: 'Printmaking', color: '#4A6953', accent: '#274430', type: 'linen' },
];

export const LiveWorkbench: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [selectedSample, setSelectedSample] = useState<SampleItem>(SAMPLES[0]);
  const [customImage, setCustomImage] = useState<HTMLImageElement | null>(null);
  const [watermarkText, setWatermarkText] = useState('© Oak & Iron Workshop');
  const [watermarkPosition, setWatermarkPosition] = useState<'br' | 'bl' | 'tr' | 'center'>('br');
  const [watermarkOpacity, setWatermarkOpacity] = useState(80);
  const [mattingMode, setMattingMode] = useState<'none' | 'chalk' | 'charcoal'>('chalk');
  const [stripExif, setStripExif] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle custom image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setCustomImage(img);
    };
    img.src = URL.createObjectURL(file);
  };

  // Render canvas whenever parameters change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetWidth = selectedPreset.width;
    const targetHeight = selectedPreset.height;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // 1. Background fill based on matting mode
    let bgColor = '#FFFFFF';
    if (mattingMode === 'chalk') bgColor = '#FAFAF6';
    if (mattingMode === 'charcoal') bgColor = '#121A16';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // 2. Draw Image or Sample Artisan Graphic
    const padding = mattingMode === 'none' ? 0 : Math.round(targetWidth * 0.06);
    const drawWidth = targetWidth - padding * 2;
    const drawHeight = targetHeight - padding * 2;
    const drawX = padding;
    const drawY = padding;

    if (customImage) {
      // Scale and center custom image
      const imgRatio = customImage.width / customImage.height;
      const targetRatio = drawWidth / drawHeight;
      let sWidth = customImage.width;
      let sHeight = customImage.height;
      let sx = 0;
      let sy = 0;

      if (imgRatio > targetRatio) {
        sWidth = customImage.height * targetRatio;
        sx = (customImage.width - sWidth) / 2;
      } else {
        sHeight = customImage.width / targetRatio;
        sy = (customImage.height - sHeight) / 2;
      }

      ctx.drawImage(customImage, sx, sy, sWidth, sHeight, drawX, drawY, drawWidth, drawHeight);
    } else {
      // Draw rich tactile artisan product graphic representing the sample item
      ctx.save();
      ctx.beginPath();
      ctx.rect(drawX, drawY, drawWidth, drawHeight);
      ctx.clip();

      // Studio backdrop lighting gradient
      const bgGrad = ctx.createRadialGradient(
        targetWidth / 2,
        targetHeight * 0.45,
        targetWidth * 0.1,
        targetWidth / 2,
        targetHeight / 2,
        targetWidth * 0.65
      );
      bgGrad.addColorStop(0, '#EAECE8');
      bgGrad.addColorStop(1, '#D8DCD5');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(drawX, drawY, drawWidth, drawHeight);

      // Subtle workshop cutting mat grid in background of photo
      ctx.strokeStyle = 'rgba(31, 122, 85, 0.12)';
      ctx.lineWidth = 1;
      const gridSpacing = targetWidth / 30;
      for (let x = drawX; x <= drawX + drawWidth; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, drawY);
        ctx.lineTo(x, drawY + drawHeight);
        ctx.stroke();
      }
      for (let y = drawY; y <= drawY + drawHeight; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(drawX, y);
        ctx.lineTo(drawX + drawWidth, y);
        ctx.stroke();
      }

      // Draw artisan object based on sample type
      const cx = targetWidth / 2;
      const cy = targetHeight / 2;

      // Soft ground contact shadow
      ctx.fillStyle = 'rgba(18, 26, 22, 0.22)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + targetHeight * 0.24, targetWidth * 0.28, targetHeight * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();

      if (selectedSample.type === 'ceramic') {
        // Ceramic mug silhouette with handle
        ctx.fillStyle = selectedSample.color;
        // Mug body
        ctx.beginPath();
        ctx.roundRect(cx - targetWidth * 0.16, cy - targetHeight * 0.18, targetWidth * 0.32, targetHeight * 0.38, [12, 12, 36, 36]);
        ctx.fill();

        // Glaze drip accent
        ctx.fillStyle = selectedSample.accent;
        ctx.beginPath();
        ctx.roundRect(cx - targetWidth * 0.16, cy - targetHeight * 0.18, targetWidth * 0.32, targetHeight * 0.14, [12, 12, 4, 4]);
        ctx.fill();

        // Mug Handle
        ctx.strokeStyle = selectedSample.accent;
        ctx.lineWidth = targetWidth * 0.04;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx + targetWidth * 0.17, cy + targetHeight * 0.01, targetWidth * 0.08, -Math.PI / 2.2, Math.PI / 2.2);
        ctx.stroke();

        // Rim
        ctx.fillStyle = '#E8DED2';
        ctx.beginPath();
        ctx.ellipse(cx, cy - targetHeight * 0.18, targetWidth * 0.16, targetHeight * 0.035, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (selectedSample.type === 'leather') {
        // Leather wallet
        ctx.fillStyle = selectedSample.color;
        ctx.beginPath();
        ctx.roundRect(cx - targetWidth * 0.22, cy - targetHeight * 0.15, targetWidth * 0.44, targetHeight * 0.3, [8, 8, 8, 8]);
        ctx.fill();

        // Stitching line
        ctx.strokeStyle = '#D9A74A';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.roundRect(cx - targetWidth * 0.2, cy - targetHeight * 0.13, targetWidth * 0.4, targetHeight * 0.26, [6, 6, 6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Fold line
        ctx.strokeStyle = selectedSample.accent;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy - targetHeight * 0.15);
        ctx.lineTo(cx, cy + targetHeight * 0.15);
        ctx.stroke();
      } else if (selectedSample.type === 'brass') {
        // Brass compass casing
        ctx.fillStyle = selectedSample.color;
        ctx.beginPath();
        ctx.arc(cx, cy, targetWidth * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // Inner dial
        ctx.fillStyle = '#FAFAF6';
        ctx.beginPath();
        ctx.arc(cx, cy, targetWidth * 0.18, 0, Math.PI * 2);
        ctx.fill();

        // Needle (Tape yellow & Ink)
        ctx.fillStyle = '#1F7A55';
        ctx.beginPath();
        ctx.moveTo(cx, cy - targetHeight * 0.14);
        ctx.lineTo(cx + targetWidth * 0.035, cy);
        ctx.lineTo(cx - targetWidth * 0.035, cy);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#121A16';
        ctx.beginPath();
        ctx.moveTo(cx, cy + targetHeight * 0.14);
        ctx.lineTo(cx + targetWidth * 0.035, cy);
        ctx.lineTo(cx - targetWidth * 0.035, cy);
        ctx.closePath();
        ctx.fill();

        // Center pivot
        ctx.fillStyle = '#F2C230';
        ctx.beginPath();
        ctx.arc(cx, cy, targetWidth * 0.025, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Botanical print on deckled paper
        ctx.fillStyle = '#FAFAF6';
        ctx.beginPath();
        ctx.roundRect(cx - targetWidth * 0.2, cy - targetHeight * 0.22, targetWidth * 0.4, targetHeight * 0.44, 4);
        ctx.fill();

        // Botanical stem
        ctx.strokeStyle = selectedSample.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx, cy + targetHeight * 0.18);
        ctx.quadraticCurveTo(cx - 20, cy, cx, cy - targetHeight * 0.16);
        ctx.stroke();

        // Fern leaves
        ctx.fillStyle = selectedSample.accent;
        for (let i = -3; i <= 3; i++) {
          const ly = cy + i * (targetHeight * 0.04);
          ctx.beginPath();
          ctx.ellipse(cx + (i % 2 === 0 ? 30 : -30), ly, targetWidth * 0.035, targetHeight * 0.015, i % 2 === 0 ? 0.4 : -0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    // 3. Matting hairline border if matting is applied
    if (mattingMode !== 'none') {
      ctx.strokeStyle = mattingMode === 'chalk' ? '#CFE0D6' : '#24402F';
      ctx.lineWidth = 1;
      ctx.strokeRect(drawX, drawY, drawWidth, drawHeight);
    }

    // 4. Watermark / Maker Mark Stamp
    if (watermarkText.trim()) {
      ctx.save();
      const fontSize = Math.max(18, Math.round(targetWidth * 0.024));
      ctx.font = `600 ${fontSize}px "Public Sans", sans-serif`;

      const textMetrics = ctx.measureText(watermarkText);
      const textPadding = Math.round(fontSize * 0.7);
      const badgeWidth = textMetrics.width + textPadding * 2;
      const badgeHeight = fontSize * 1.8;

      let badgeX = targetWidth - badgeWidth - padding - 24;
      let badgeY = targetHeight - badgeHeight - padding - 24;

      if (watermarkPosition === 'bl') {
        badgeX = padding + 24;
        badgeY = targetHeight - badgeHeight - padding - 24;
      } else if (watermarkPosition === 'tr') {
        badgeX = targetWidth - badgeWidth - padding - 24;
        badgeY = padding + 24;
      } else if (watermarkPosition === 'center') {
        badgeX = (targetWidth - badgeWidth) / 2;
        badgeY = (targetHeight - badgeHeight) / 2;
      }

      const alpha = watermarkOpacity / 100;
      ctx.globalAlpha = alpha;

      // Dark badge container for high contrast
      ctx.fillStyle = '#121A16';
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 4);
      ctx.fill();

      // Chalk text
      ctx.fillStyle = '#FAFAF6';
      ctx.textBaseline = 'middle';
      ctx.fillText(watermarkText, badgeX + textPadding, badgeY + badgeHeight / 2);

      ctx.restore();
    }
  }, [
    selectedPreset,
    selectedSample,
    customImage,
    watermarkText,
    watermarkPosition,
    watermarkOpacity,
    mattingMode,
  ]);

  // Real client-side file download
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setExportedSuccess(false);

    setTimeout(() => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsExporting(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const filename = `ownbench-${selectedPreset.id}-${Date.now()}.jpg`;
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          setIsExporting(false);
          setExportedSuccess(true);
          setTimeout(() => setExportedSuccess(false), 4000);
        },
        'image/jpeg',
        0.92
      );
    }, 250);
  };

  return (
    <section id="workbench" className="py-20 border-b border-[var(--ln)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--g)] font-bold uppercase tracking-wider mb-2">
              <span>Interactive Simulator</span>
              <span aria-hidden="true">·</span>
              <span>Runs 100% in your browser</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--tx)]">
              Listing Bench: Live In-Browser Workbench
            </h2>
            <p className="text-sm md:text-base text-[var(--mut)] max-w-2xl mt-1">
              Test how Listing Bench prepares, sizes, mats, and stamps product photos before
              exporting. Everything executes directly on your hardware. Zero data leaves your machine.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[var(--mut)] bg-[var(--panel)] border border-[var(--ln)] px-3 py-1.5 rounded-[6px]">
            <span className="w-2 h-2 rounded-full bg-[var(--g)]" />
            <span>Client Hardware Engine: Active</span>
          </div>
        </div>

        {/* The Workbench Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Control Box 1: Sample or Custom Image */}
            <div className="bench-card p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--tx)] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--g)]" />
                  <span>1. Source Photo</span>
                </label>
                {customImage && (
                  <button
                    onClick={() => setCustomImage(null)}
                    className="text-xs text-[var(--g)] hover:underline cursor-pointer"
                  >
                    Reset to Samples
                  </button>
                )}
              </div>

              {!customImage ? (
                <div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {SAMPLES.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => setSelectedSample(sample)}
                        className={`text-left p-2.5 rounded-[6px] border text-xs transition-colors cursor-pointer ${
                          selectedSample.id === sample.id
                            ? 'border-[var(--g)] bg-[var(--g)]/10 text-[var(--tx)] font-semibold'
                            : 'border-[var(--ln)] bg-[var(--bg)] text-[var(--mut)] hover:text-[var(--tx)]'
                        }`}
                      >
                        <div className="truncate font-medium">{sample.title}</div>
                        <div className="text-[11px] text-[var(--mut)] mt-0.5">{sample.category}</div>
                      </button>
                    ))}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-[6px] border border-dashed border-[var(--ln)] hover:border-[var(--g)] bg-[var(--bg)] text-[var(--tx)] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[var(--g)]" />
                    <span>Upload Your Own Listing Photo</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-[var(--bg)] rounded-[6px] border border-[var(--ln)] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-semibold text-[var(--tx)]">Custom Photo Loaded</span>
                    <span className="block text-[11px] text-[var(--mut)]">
                      {customImage.naturalWidth} × {customImage.naturalHeight} px
                    </span>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[var(--g)] underline cursor-pointer"
                  >
                    Replace
                  </button>
                </div>
              )}
            </div>

            {/* Control Box 2: Marketplace Presets */}
            <div className="bench-card p-5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--tx)] flex items-center gap-1.5 mb-3">
                <Maximize2 className="w-3.5 h-3.5 text-[var(--g)]" />
                <span>2. Marketplace Target Preset</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset)}
                    className={`text-left p-3 rounded-[6px] border text-xs transition-colors cursor-pointer ${
                      selectedPreset.id === preset.id
                        ? 'border-[var(--g)] bg-[var(--g)]/10 text-[var(--tx)] font-semibold'
                        : 'border-[var(--ln)] bg-[var(--bg)] text-[var(--mut)] hover:text-[var(--tx)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{preset.name}</span>
                      <span className="font-mono text-[10px] text-[var(--mut)]">{preset.ratio}</span>
                    </div>
                    <div className="font-mono text-[11px] text-[var(--mut)] mt-1">
                      {preset.width} × {preset.height} px
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Control Box 3: Matting & Watermark Stamp */}
            <div className="bench-card p-5 space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--tx)] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[var(--g)]" />
                <span>3. Frame & Maker Mark</span>
              </label>

              {/* Matting Mode */}
              <div>
                <span className="text-xs font-medium text-[var(--mut)] block mb-1.5">
                  Studio Mat Framing:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'Borderless' },
                    { id: 'chalk', label: 'Chalk Mat (5%)' },
                    { id: 'charcoal', label: 'Dark Mat (5%)' },
                  ].map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setMattingMode(mat.id as any)}
                      className={`py-1.5 px-2 text-xs rounded-[6px] border text-center transition-colors cursor-pointer ${
                        mattingMode === mat.id
                          ? 'border-[var(--g)] bg-[var(--g)]/10 text-[var(--tx)] font-semibold'
                          : 'border-[var(--ln)] bg-[var(--bg)] text-[var(--mut)] hover:text-[var(--tx)]'
                      }`}
                    >
                      {mat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Watermark Text */}
              <div>
                <span className="text-xs font-medium text-[var(--mut)] block mb-1.5">
                  Maker Attribution Stamp:
                </span>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. © Your Studio Name"
                  className="w-full text-xs px-3 py-2 rounded-[6px] border border-[var(--ln)] bg-[var(--bg)] text-[var(--tx)] focus:outline-hidden focus:border-[var(--g)]"
                />
              </div>

              {/* Position & Opacity */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] text-[var(--mut)] block mb-1">Position:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'br', label: 'Btm-Right' },
                      { id: 'bl', label: 'Btm-Left' },
                      { id: 'tr', label: 'Top-Right' },
                      { id: 'center', label: 'Center' },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() => setWatermarkPosition(pos.id as any)}
                        className={`py-1 text-[11px] rounded-[4px] border text-center cursor-pointer ${
                          watermarkPosition === pos.id
                            ? 'border-[var(--g)] bg-[var(--g)]/15 text-[var(--tx)] font-bold'
                            : 'border-[var(--ln)] bg-[var(--bg)] text-[var(--mut)]'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-[var(--mut)] mb-1">
                    <span>Opacity:</span>
                    <span className="font-mono">{watermarkOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                    className="w-full accent-[var(--g)] cursor-pointer mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Scrubber Toggle */}
            <div className="bench-card p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[var(--g)] shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-[var(--tx)] block">
                    Privacy EXIF & GPS Scrubber
                  </span>
                  <span className="text-[11px] text-[var(--mut)]">
                    Strips home workshop coordinates & camera serials
                  </span>
                </div>
              </div>
              <button
                onClick={() => setStripExif(!stripExif)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  stripExif ? 'bg-[var(--g)]' : 'bg-[var(--ln)]'
                }`}
                role="switch"
                aria-checked={stripExif}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    stripExif ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Column: Live Canvas Viewport & Export Output */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full bench-card p-4 sm:p-6 bg-[var(--bg)]">
              {/* Canvas Container with aspect ratio containment */}
              <div className="relative w-full aspect-square max-w-[520px] mx-auto bg-[#E6ECE8] dark:bg-[#06100D] border border-[var(--ln)] rounded-[4px] p-2 flex items-center justify-center overflow-hidden">
                {/* Visual grid in canvas frame */}
                <div className="absolute inset-0 mat-grid opacity-30 pointer-events-none" />

                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain border border-[var(--ln)] shadow-xs rounded-[2px]"
                />
              </div>

              {/* Technical Readout Strip */}
              <div className="mt-4 pt-3 border-t border-[var(--ln)] flex flex-wrap items-center justify-between text-xs font-mono text-[var(--mut)] gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--tx)]">Target:</span>
                  <span>
                    {selectedPreset.width} × {selectedPreset.height} px ({selectedPreset.ratio})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--tx)]">Est. File Size:</span>
                  <span>~380 KB (92% quality)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--tx)]">EXIF:</span>
                  <span className={stripExif ? 'text-[var(--g)]' : 'text-[var(--mut)]'}>
                    {stripExif ? 'Scrubbed (0 leaks)' : 'Preserved'}
                  </span>
                </div>
              </div>

              {/* Export Action Strip */}
              <div className="mt-5 pt-4 border-t border-[var(--ln)] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-[var(--mut)] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[var(--g)] shrink-0" />
                  <span>Real canvas export. Downloads directly to your downloads folder.</span>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className={`bench-btn-primary px-5 py-2.5 text-sm cursor-pointer whitespace-nowrap inline-flex items-center gap-2 shrink-0 ${
                    isExporting ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  {exportedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-[#F2C230]" />
                      <span>Saved to Computer!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{isExporting ? 'Rendering Canvas...' : 'Download Prepared Image'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Offline Execution Proof Callout */}
            <div className="w-full mt-4 p-4 rounded-[6px] border border-[var(--ln)] bg-[var(--panel)] text-xs text-[var(--mut)] flex items-center justify-between">
              <div>
                <strong className="text-[var(--tx)] font-display font-bold">
                  Notice how fast that was?
                </strong>{' '}
                No cloud queuing, no subscription meter, no login required. Listing Bench does this
                for 1,000 photos in a batch on your desktop.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
