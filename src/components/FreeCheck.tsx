import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Download,
  Gauge,
  Image as ImageIcon,
  Loader2,
  MapPin,
  RotateCcw,
  Upload,
} from 'lucide-react';
import {
  MATTING_OPTIONS,
  PRESETS,
  formatBytes,
  judge,
  megapixels,
  ratio,
  type Matting,
} from '../lib/presets';
import { deviceName, privacyFindings, readPhotoMeta, type PhotoMeta } from '../lib/exif';
import { canvasToJpeg, drawConformed } from '../lib/conform';

interface Loaded {
  name: string;
  bytes: number;
  width: number;
  height: number;
  bitmap: ImageBitmap;
  meta: PhotoMeta;
  synthetic: boolean;
}

type Status = 'empty' | 'reading' | 'ready' | 'error';

const MAX_BYTES = 60 * 1024 * 1024;

export const FreeCheck: React.FC = () => {
  const [photo, setPhoto] = useState<Loaded | null>(null);
  const [status, setStatus] = useState<Status>('empty');
  const [error, setError] = useState<string | null>(null);
  const [presetId, setPresetId] = useState<string>('etsy');
  const [matting, setMatting] = useState<Matting>('chalk5');
  const [fill, setFill] = useState<'fit' | 'fill'>('fit');
  const [stamp, setStamp] = useState('');
  const [dragging, setDragging] = useState(false);
  const [saved, setSaved] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];

  const loadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setStatus('error');
      setError('That is not an image file. Drop a JPEG, PNG or WebP.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus('error');
      setError(`That file is ${formatBytes(file.size)}. This tab decodes it in memory, so it stops at 60 MB.`);
      return;
    }

    setStatus('reading');
    setError(null);
    setSaved(false);

    try {
      const buffer = await file.arrayBuffer();
      const meta = readPhotoMeta(buffer);
      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(file);
      } catch {
        throw new Error(
          'This browser cannot decode that format. iPhone HEIC files are the usual cause — export as JPEG (or set the camera to “Most Compatible”) and drop it again. The desktop app reads JPEG, PNG and WebP directly.',
        );
      }
      if (photo) photo.bitmap.close();
      setPhoto({
        name: file.name,
        bytes: file.size,
        width: bitmap.width,
        height: bitmap.height,
        bitmap,
        meta,
        synthetic: false,
      });
      setStatus('ready');
    } catch (cause) {
      setStatus('error');
      setError(cause instanceof Error ? cause.message : 'Could not read that file.');
    }
  }, [photo]);

  const loadSynthetic = useCallback(async () => {
    setStatus('reading');
    setError(null);
    setSaved(false);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 4000;
      canvas.height = 2667;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas is unavailable in this browser.');

      // A plainly synthetic still life: flat shapes, no camera involved.
      ctx.fillStyle = '#E9ECE7';
      ctx.fillRect(0, 0, 4000, 2667);
      ctx.fillStyle = '#DFE4DD';
      ctx.fillRect(0, 1750, 4000, 917);
      ctx.fillStyle = 'rgba(18, 26, 22, 0.16)';
      ctx.beginPath();
      ctx.ellipse(2100, 1860, 780, 120, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#B88665';
      ctx.beginPath();
      ctx.roundRect(1450, 830, 1180, 1030, [40, 40, 110, 110]);
      ctx.fill();
      ctx.fillStyle = '#7A482A';
      ctx.beginPath();
      ctx.roundRect(1450, 830, 1180, 330, [40, 40, 8, 8]);
      ctx.fill();
      ctx.strokeStyle = '#7A482A';
      ctx.lineWidth = 130;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(2740, 1350, 250, -Math.PI / 2.2, Math.PI / 2.2);
      ctx.stroke();
      ctx.fillStyle = '#E8DED2';
      ctx.beginPath();
      ctx.ellipse(2040, 830, 590, 92, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1F7A55';
      ctx.fillRect(700, 1900, 620, 60);
      ctx.fillStyle = '#F2C230';
      ctx.beginPath();
      ctx.arc(3150, 1450, 190, 0, Math.PI * 2);
      ctx.fill();

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((result) => resolve(result), 'image/jpeg', 0.9),
      );
      if (!blob) throw new Error('Could not build the test frame.');
      const file = new File([blob], 'ownbench-synthetic-frame.jpg', { type: 'image/jpeg' });
      await loadFile(file);
    } catch (cause) {
      setStatus('error');
      setError(cause instanceof Error ? cause.message : 'Could not build the test frame.');
    }
  }, [loadFile]);

  useEffect(() => {
    if (!photo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawConformed(canvas, photo.bitmap, photo.width, photo.height, preset, {
      matting,
      fill,
      stamp,
    });
  }, [photo, preset, matting, fill, stamp]);

  useEffect(() => {
    return () => {
      if (photo) photo.bitmap.close();
    };
    // Only on unmount: the bitmap is closed explicitly when a new file loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void loadFile(file);
  };

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await canvasToJpeg(canvas);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const stem = (photo?.name ?? 'photo').replace(/\.[^.]+$/, '');
    anchor.href = url;
    anchor.download = `${stem}-${preset.id}-${preset.width}x${preset.height}.jpg`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  };

  const findings = photo ? privacyFindings(photo.meta) : [];
  const judgement = photo ? judge(preset, photo.width, photo.height) : null;
  const cleanFile = photo ? findings.length === 0 : false;

  return (
    <section id="free-check" className="py-20 border-b border-[var(--ln)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--g)] mb-2">
            Free tool · no account · nothing uploaded
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--tx)] mb-4">
            Will this photo pass?
          </h2>
          <p className="text-base md:text-lg text-[var(--mut)] leading-relaxed">
            Drop one photo. Your browser reads it right here — the file is never sent to a server,
            so we could not look at it if we wanted to. You get the three things that quietly get
            listings rejected: the wrong size, the wrong shape, and metadata you never meant to
            publish.
          </p>
        </div>

        <div className="bench-card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* ---------------- Left: source and settings ---------------- */}
            <div className="lg:col-span-5 p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-[var(--ln)] bg-[var(--bg)]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-3">
                1 · Your photo
              </span>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`rounded-[6px] border border-dashed p-5 text-center transition-colors ${
                  dragging ? 'border-[var(--g)] bg-[#1F7A55]/5' : 'border-[var(--ln)] bg-[var(--panel)]'
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void loadFile(file);
                    event.target.value = '';
                  }}
                />

                {status === 'reading' ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-[var(--mut)] py-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reading the file…</span>
                  </div>
                ) : photo ? (
                  <div className="text-left">
                    <div className="flex items-start gap-2.5">
                      <ImageIcon className="w-4 h-4 text-[var(--g)] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--tx)] truncate">{photo.name}</p>
                        <p className="text-xs text-[var(--mut)] font-mono mt-0.5">
                          {photo.width} × {photo.height} · {megapixels(photo.width, photo.height)} MP ·{' '}
                          {formatBytes(photo.bytes)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                      <button
                        onClick={() => inputRef.current?.click()}
                        className="text-[var(--g)] font-semibold hover:underline cursor-pointer"
                      >
                        Replace photo
                      </button>
                      <button
                        onClick={() => {
                          photo.bitmap.close();
                          setPhoto(null);
                          setStatus('empty');
                          setError(null);
                        }}
                        className="text-[var(--mut)] hover:text-[var(--tx)] cursor-pointer inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-[var(--g)] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[var(--tx)] mb-1">
                      Drop a photo here
                    </p>
                    <p className="text-xs text-[var(--mut)] mb-3">
                      JPEG, PNG or WebP · up to 60 MB · one at a time
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <button
                        onClick={() => inputRef.current?.click()}
                        className="bench-btn-primary px-3.5 py-2 text-xs w-full sm:w-auto cursor-pointer"
                      >
                        Choose a file
                      </button>
                      <button
                        onClick={() => void loadSynthetic()}
                        className="px-3.5 py-2 text-xs font-semibold rounded-[6px] border border-[var(--ln)] bg-[var(--panel)] text-[var(--tx)] hover:bg-[var(--bg)] cursor-pointer w-full sm:w-auto"
                      >
                        Use a synthetic frame
                      </button>
                    </div>
                    <p className="text-[11px] text-[var(--mut)] mt-2">
                      No camera needed for the synthetic frame — it has no metadata, so you can see
                      the conform step only.
                    </p>
                  </>
                )}
              </div>

              {status === 'error' && error && (
                <div className="mt-3 p-3 rounded-[6px] border border-[var(--ln)] bg-[var(--panel)] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[var(--tx)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--mut)] leading-relaxed">{error}</p>
                </div>
              )}

              <div className="mt-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-2.5">
                  2 · Where it is going
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((option) => {
                    const active = option.id === preset.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setPresetId(option.id)}
                        className={`text-left p-2.5 rounded-[6px] border text-xs transition-colors cursor-pointer ${
                          active
                            ? 'border-[var(--g)] bg-[#1F7A55]/8 text-[var(--tx)]'
                            : 'border-[var(--ln)] bg-[var(--panel)] text-[var(--mut)] hover:text-[var(--tx)]'
                        }`}
                      >
                        <span className="block font-semibold text-[var(--tx)] truncate">
                          {option.marketplace}
                        </span>
                        <span className="block font-mono text-[11px] mt-0.5">
                          {option.width}×{option.height}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-1.5">
                    Mat
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MATTING_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setMatting(option.id)}
                        disabled={preset.strictWhite}
                        title={preset.strictWhite ? 'Amazon requires a pure white canvas' : option.hint}
                        className={`px-2.5 py-1.5 rounded-[6px] border text-[11px] font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          matting === option.id && !preset.strictWhite
                            ? 'border-[var(--g)] bg-[#1F7A55]/8 text-[var(--tx)]'
                            : 'border-[var(--ln)] bg-[var(--panel)] text-[var(--mut)]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {preset.strictWhite && (
                    <p className="text-[11px] text-[var(--mut)] mt-1.5">
                      Amazon preset forces pure #FFFFFF with a 5% inset.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-1.5">
                      Framing
                    </label>
                    <div className="flex gap-2">
                      {(['fit', 'fill'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setFill(mode)}
                          className={`px-2.5 py-1.5 rounded-[6px] border text-[11px] font-medium cursor-pointer capitalize ${
                            fill === mode
                              ? 'border-[var(--g)] bg-[#1F7A55]/8 text-[var(--tx)]'
                              : 'border-[var(--ln)] bg-[var(--panel)] text-[var(--mut)]'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="check-stamp"
                      className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-1.5"
                    >
                      Maker stamp
                    </label>
                    <input
                      id="check-stamp"
                      value={stamp}
                      onChange={(event) => setStamp(event.target.value.slice(0, 40))}
                      placeholder="© your shop"
                      className="w-full px-2.5 py-1.5 rounded-[6px] border border-[var(--ln)] bg-[var(--panel)] text-xs text-[var(--tx)] placeholder:text-[var(--mut)]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[var(--ln)]">
                <button
                  onClick={() => void download()}
                  disabled={!photo || status !== 'ready'}
                  className="w-full bench-btn-primary py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saved ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {saved ? 'Saved — check your downloads' : `Download the ${preset.marketplace} file`}
                </button>
                <p className="text-[11px] text-[var(--mut)] mt-2 leading-relaxed">
                  One JPEG at {preset.width} × {preset.height}, quality 92 — the app&apos;s default.
                  Your browser re-encodes it, so the download carries no EXIF, GPS or serial at all.
                </p>
              </div>
            </div>

            {/* ---------------- Right: the verdict ---------------- */}
            <div className="lg:col-span-7 p-5 md:p-6">
              {!photo || !judgement ? (
                <div className="h-full flex flex-col justify-center">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-3">
                    The report
                  </span>
                  <p className="font-display font-bold text-2xl text-[var(--tx)] mb-3">
                    Three checks, one photo, about a second.
                  </p>
                  <ul className="space-y-3 text-sm text-[var(--mut)]">
                    <li className="flex items-start gap-2.5">
                      <Gauge className="w-4 h-4 text-[var(--g)] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[var(--tx)]">Size.</strong> Whether the pixels are
                        enough for the marketplace you picked, or the Bench has to upsample.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <ImageIcon className="w-4 h-4 text-[var(--g)] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[var(--tx)]">Shape.</strong> Whether the aspect ratio
                        matches, so the thumbnail does not get auto-cropped mid-listing.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[var(--g)] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[var(--tx)]">Metadata.</strong> GPS coordinates,
                        camera serial, software tag, XMP and IPTC blocks still inside the file.
                      </span>
                    </li>
                  </ul>
                  <p className="text-xs text-[var(--mut)] mt-5">
                    Nothing is stored: reload the page and this report is gone.
                  </p>
                </div>
              ) : (
                <>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-3">
                    The report · {preset.marketplace}
                  </span>

                  <div
                    className={`p-4 rounded-[6px] border border-[var(--ln)] bg-[var(--panel)] border-l-[6px] mb-5 ${
                      cleanFile && judgement.verdict !== 'upscale'
                        ? 'border-l-[var(--g)]'
                        : 'border-l-[var(--tx)]'
                    }`}
                  >
                    <p className="font-display font-bold text-xl text-[var(--tx)] mb-1">
                      {judgement.verdict === 'ready' && cleanFile
                        ? 'This one passes as it is.'
                        : judgement.verdict === 'ready'
                          ? 'Right size. Wrong metadata.'
                          : judgement.headline}
                    </p>
                    <p className="text-sm text-[var(--mut)] leading-relaxed">{judgement.detail}</p>
                    {!cleanFile && (
                      <p className="text-sm text-[var(--tx)] leading-relaxed mt-2">
                        And it still carries {findings.length} thing
                        {findings.length === 1 ? '' : 's'} you would be publishing:{' '}
                        {findings.join(', ')}.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    <div className="p-3.5 rounded-[6px] border border-[var(--ln)] bg-[var(--bg)]">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-2">
                        The file
                      </span>
                      <dl className="space-y-1.5 text-xs">
                        <Row label="Pixels" value={`${photo.width} × ${photo.height}`} />
                        <Row label="Megapixels" value={`${megapixels(photo.width, photo.height)} MP`} />
                        <Row label="Aspect" value={ratio(photo.width, photo.height)} />
                        <Row label="Weight" value={formatBytes(photo.bytes)} />
                        <Row label="Format" value={photo.meta.format.toUpperCase()} />
                      </dl>
                    </div>

                    <div className="p-3.5 rounded-[6px] border border-[var(--ln)] bg-[var(--bg)]">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-2">
                        What travels inside
                      </span>
                      <dl className="space-y-1.5 text-xs">
                        <Row
                          label="GPS"
                          value={photo.meta.gps ? `Embedded (${photo.meta.gpsFields.length} tags)` : 'None found'}
                          flag={photo.meta.gps ? 'warn' : 'ok'}
                          dot
                        />
                        <Row
                          label="Camera"
                          value={deviceName(photo.meta) ?? 'None found'}
                          flag={photo.meta.make || photo.meta.model ? 'warn' : 'ok'}
                          dot
                        />
                        <Row label="Body serial" value={photo.meta.serial ?? 'None found'} flag={photo.meta.serial ? 'warn' : 'ok'} dot />
                        <Row label="Software" value={photo.meta.software ?? 'None found'} />
                        <Row label="Captured" value={photo.meta.captured ?? 'None found'} />
                        <Row
                          label="XMP / IPTC"
                          value={
                            [photo.meta.xmp ? 'XMP' : null, photo.meta.iptc ? 'IPTC' : null]
                              .filter(Boolean)
                              .join(' · ') || 'None found'
                          }
                        />
                      </dl>
                    </div>
                  </div>

                  <div className="mb-5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-2">
                      The same photo, per marketplace
                    </span>
                    <div className="rounded-[6px] border border-[var(--ln)] overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[var(--bg)] border-b border-[var(--ln)]">
                            <th className="p-2.5 font-bold text-[var(--tx)]">Marketplace</th>
                            <th className="p-2.5 font-bold text-[var(--tx)]">Output</th>
                            <th className="p-2.5 font-bold text-[var(--tx)]">What happens</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--ln)]">
                          {PRESETS.map((option) => {
                            const verdict = judge(option, photo.width, photo.height);
                            return (
                              <tr key={option.id} className={option.id === preset.id ? 'bg-[#1F7A55]/6' : ''}>
                                <td className="p-2.5 font-medium text-[var(--tx)] whitespace-nowrap">
                                  {option.marketplace}
                                </td>
                                <td className="p-2.5 font-mono text-[var(--mut)] whitespace-nowrap">
                                  {option.width}×{option.height}
                                </td>
                                <td className="p-2.5 text-[var(--mut)]">
                                  {verdict.verdict === 'ready'
                                    ? 'Already exact'
                                    : verdict.verdict === 'resize'
                                      ? 'Downscale only'
                                      : verdict.verdict === 'conform'
                                        ? 'Conform + mat'
                                        : 'Upsample'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 gap-3">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)]">
                        What the Bench writes
                      </span>
                      <span className="text-[11px] font-mono text-[var(--mut)]">
                        {preset.width} × {preset.height} · JPEG q92
                      </span>
                    </div>
                    <div className="rounded-[6px] border border-[var(--ln)] p-2 bg-[var(--bg)] flex items-center justify-center">
                      <canvas
                        ref={canvasRef}
                        className="block h-auto w-auto max-h-[360px] max-w-full bg-white"
                        aria-label={`Preview of ${preset.marketplace} output`}
                      />
                    </div>
                    <p className="text-[11px] text-[var(--mut)] mt-2 leading-relaxed">
                      Preview at real output size, drawn by the same rules the app uses: {preset.strictWhite ? 'pure white' : MATTING_OPTIONS.find((m) => m.id === matting)?.label.toLowerCase()}, {fill} framing{stamp.trim() ? ', maker stamp bottom-right' : ''}.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-[6px] border border-[var(--ln)] bg-[var(--bg)] flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="text-xs text-[var(--mut)] leading-relaxed max-w-2xl">
            <strong className="text-[var(--tx)]">What this free check is not:</strong> the desktop
            engine. It is one photo at a time, in a browser tab, with the same presets, mat geometry
            and stamp placement. It does not open a folder, does not write 50 files, and uses the
            browser&apos;s JPEG encoder instead of the app&apos;s Lanczos3 pipeline.
          </p>
          <a
            href="#pricing"
            className="text-xs font-semibold text-[var(--g)] hover:underline inline-flex items-center gap-1.5 shrink-0"
          >
            What the full app adds <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

const Row: React.FC<{
  label: string;
  value: string;
  flag?: 'ok' | 'warn';
  dot?: boolean;
}> = ({ label, value, flag, dot }) => (
  <div className="flex items-start justify-between gap-3">
    <dt className="text-[var(--mut)] shrink-0">{label}</dt>
    <dd
      className={`text-right font-mono truncate ${
        flag === 'warn' ? 'text-[var(--tx)]' : flag === 'ok' ? 'text-[var(--g)]' : 'text-[var(--tx)]'
      }`}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle ${
            flag === 'warn' ? 'bg-[var(--tx)]' : 'bg-[var(--g)]'
          }`}
        />
      )}
      {value}
    </dd>
  </div>
);
