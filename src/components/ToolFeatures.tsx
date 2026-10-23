import React from 'react';
import { Layers, CheckCircle2, Shield, Cpu, RefreshCw } from 'lucide-react';

export const ToolFeatures: React.FC = () => {
  const features = [
    {
      number: '01',
      title: 'Batch Image Prep in Seconds',
      description:
        'Drop a folder of 100 raw product photos straight from your camera. Listing Bench crops, formats, and compresses every image simultaneously using your multi-core CPU.',
      proof: 'Runs entirely on your own CPU. No uploads, no queue, no waiting on a server.',
      icon: Layers,
    },
    {
      number: '02',
      title: 'Strict Marketplace Conformity',
      description:
        'Pre-calibrated ratios and dimension rules for Etsy, eBay, Shopify, Amazon, Poshmark, and social. Never get listing upload errors or awkward thumbnail auto-cropping again.',
      proof: 'Built-in presets eliminate marketplace rejection errors.',
      icon: CheckCircle2,
    },
    {
      number: '03',
      title: 'Maker Mark & Watermark Stamp',
      description:
        'Add your studio name or logo to a batch in one pass. Place subtle corner stamps or a centred copyright mark, at the size and opacity you choose.',
      proof: 'Custom opacity, font styling, and automated corner anchoring.',
      icon: Shield,
    },
    {
      number: '04',
      title: 'Home Workshop EXIF Scrubber',
      description:
        'Smartphone and camera photos embed GPS coordinates, device details, and serial numbers. Listing Bench strips this metadata before your images go live.',
      proof: 'Verified by test: zero GPS or device tags survive in the output.',
      icon: RefreshCw,
    },
    {
      number: '05',
      title: 'No Browser Bloat, No Background Noise',
      description:
        'A native desktop app, not a web page in a wrapper. No Chromium runtime, no background telemetry, and no internet checks — it opens and works whether or not you are online.',
      proof: 'No network requests. Verified by design and by test.',
      icon: Cpu,
    },
  ];

  return (
    <section id="tool" className="py-20 border-b border-[var(--ln)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--g)] mb-2">
            Detailed Walkthrough
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--tx)] mb-4">
            Built to do one job well.
          </h2>
          <p className="text-base md:text-lg text-[var(--mut)]">
            Most listing tools are slow cloud websites that charge you $20 every single month to do
            simple image cropping. Listing Bench is an honest desktop utility: you buy it once, it sits
            on your dock, and it works whenever you need it.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.number}
                className="bench-card p-6 flex flex-col justify-between hover:border-[var(--g)] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-sm font-bold text-[var(--g)]">
                      {feat.number}
                    </span>
                    <Icon className="w-5 h-5 text-[var(--mut)]" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-[var(--tx)] mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-[var(--mut)] leading-relaxed mb-4">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--ln)] text-xs font-mono text-[var(--tx)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--g)] shrink-0" />
                  <span>{feat.proof}</span>
                </div>
              </div>
            );
          })}

          {/* Callout Card */}
          <div className="bench-card p-6 bg-[var(--g)] text-[#FAFAF6] flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider opacity-80 block mb-2">
                The Ownbench Promise
              </span>
              <h3 className="font-display font-bold text-2xl mb-3 text-white">
                No recurring rent. No accounts.
              </h3>
              <p className="text-sm text-[#E2EDE7] leading-relaxed">
                When you buy a hammer at the hardware store, you don't pay a monthly subscription to
                keep it in your toolbox. Software for solo makers should work the exact same way.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#FAFAF6]/20 text-xs font-mono">
              Pay $29 once · Version 1.x license
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
