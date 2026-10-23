import React from 'react';
import { Crop, Frame, ShieldOff, Stamp, HardDrive } from 'lucide-react';
import { PRESETS } from '../lib/presets';

const MODULES = [
  {
    icon: Crop,
    number: '01',
    title: 'Conform',
    body: 'Six marketplace presets and a custom box from 200 to 6000 px. Fit letterboxes into the canvas; Fill crops to the edge; centre or top anchor. Lanczos3 for hero images, Catmull-Rom when you want the batch to move.',
  },
  {
    icon: Frame,
    number: '02',
    title: 'Mat',
    body: 'Borderless, a 5% Chalk mat, a 10% gallery mat, or any hex at a 0–25% inset. The Chalk mat carries a 1 px Grid Line hairline at the inner edge — the same frame we use on our own product shots.',
  },
  {
    icon: Stamp,
    number: '03',
    title: 'Stamp',
    body: 'Maker text or a transparent PNG logo, four anchors or centre, 10–100% opacity, 1.5–4% of canvas width. An optional ink scrim keeps a light stamp legible over bright or dark product surfaces.',
  },
  {
    icon: ShieldOff,
    number: '04',
    title: 'Scrub',
    body: 'GPS, body serial, lens serial, software tag, maker note: removed from the file that is written. The ICC profile is kept, so colours do not shift between your edit and the listing. Verified by an automated test, not by hope.',
  },
  {
    icon: HardDrive,
    number: '05',
    title: 'Own',
    body: 'One native binary, no bundled browser, no telemetry and no licence server. The activation key is Ed25519-signed and verified on your machine in under a millisecond — which is why it works with the Wi-Fi switched off.',
  },
];

export const Modules: React.FC = () => {
  return (
    <section id="tool" className="py-20 border-b border-[var(--ln)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--g)] mb-2">
            What is inside
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--tx)] mb-4">
            Five jobs. One pass.
          </h2>
          <p className="text-base md:text-lg text-[var(--mut)] leading-relaxed">
            Every setting below applies to the whole batch at once. You point it at a folder, pick
            six presets, and get six folders of finished files back — the order they are listed here
            is the order they are applied to each photo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <article key={module.number} className="bench-card p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm font-bold text-[var(--g)]">{module.number}</span>
                  <Icon className="w-5 h-5 text-[var(--mut)]" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-xl text-[var(--tx)] mb-2">{module.title}</h3>
                <p className="text-sm text-[var(--mut)] leading-relaxed">{module.body}</p>
              </article>
            );
          })}

          <article className="bench-card p-6 bg-[var(--dk)] text-[#FAFAF6] flex flex-col justify-between">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#A9BAB1] block mb-3">
                Also in the box
              </span>
              <h3 className="font-display font-bold text-xl mb-3 text-white">Custom dimensions</h3>
              <p className="text-sm text-[#D9E5DE] leading-relaxed">
                Any width and height from 200 to 6000 px, with the same mat and stamp pipeline. For
                the marketplace that changes its mind, or the size nobody has a preset for yet.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#FAFAF6]/20 text-xs font-mono text-[#D9E5DE]">
              JPEG quality 40–100 · default 92
            </div>
          </article>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <h3 className="font-display font-bold text-xl text-[var(--tx)] mb-1">
              The preset table, exactly as it ships
            </h3>
            <p className="text-xs text-[var(--mut)] mb-3">
              These are the numbers in the engine, not the ones in a marketing deck. The free check
              above uses the same table.
            </p>
            <div className="bench-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg)] border-b border-[var(--ln)]">
                      <th className="p-3 font-bold text-[var(--tx)]">Marketplace</th>
                      <th className="p-3 font-bold text-[var(--tx)]">Output</th>
                      <th className="p-3 font-bold text-[var(--tx)]">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--ln)]">
                    {PRESETS.map((preset) => (
                      <tr key={preset.id}>
                        <td className="p-3 font-medium text-[var(--tx)] whitespace-nowrap">
                          {preset.marketplace}
                        </td>
                        <td className="p-3 font-mono text-[var(--tx)] whitespace-nowrap">
                          {preset.width} × {preset.height}
                        </td>
                        <td className="p-3 text-[var(--mut)]">{preset.note}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="p-3 font-medium text-[var(--tx)]">Custom</td>
                      <td className="p-3 font-mono text-[var(--tx)]">200–6000 px</td>
                      <td className="p-3 text-[var(--mut)]">Per side, fit or fill</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bench-card p-6 bg-[var(--panel)]">
            <h3 className="font-display font-bold text-lg text-[var(--tx)] mb-2">
              A batch, end to end
            </h3>
            <ol className="space-y-3 text-sm text-[var(--mut)] list-decimal list-inside marker:text-[var(--g)] marker:font-bold">
              <li>Drag the folder of camera files onto the window.</li>
              <li>Tick the marketplaces you sell on.</li>
              <li>Pick a mat, type your maker name, leave the scrub on.</li>
              <li>Choose an export folder. Press Process.</li>
              <li>
                Fifty 24 MP photos take about ten seconds; you get one subfolder per marketplace,
                with the GPS and serials gone.
              </li>
            </ol>
            <p className="text-xs text-[var(--mut)] mt-5 pt-4 border-t border-[var(--ln)] leading-relaxed">
              No queue, no upload bar, no account screen. If the folder is on a slow external drive,
              the disk is the bottleneck, not the CPU.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
