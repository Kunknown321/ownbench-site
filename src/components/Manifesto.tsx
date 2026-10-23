import React from 'react';
import { Logo } from './Logo';

export const Manifesto: React.FC = () => {
  return (
    <section id="manifesto" className="py-20 border-b border-[var(--ln)] bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--g)] mb-2">
            The Philosophy
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--tx)] mb-4">
            Why we call it a bench.
          </h2>
          <p className="text-base md:text-lg text-[var(--mut)] leading-relaxed">
            A bench is where you hold the work still so you can do it properly. Ownbench is the bench
            for a one-person shop. “Own” is the promise and the point of difference. Our tools run on
            your computer, you pay one time, and nothing gets rented back to you.
          </p>
        </div>

        {/* Brand Foundation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Logo Story Card */}
          <div className="bench-card p-6 md:p-8">
            <h3 className="font-display font-bold text-xl text-[var(--tx)] mb-3">
              The Anatomy of the Mark
            </h3>
            <p className="text-sm text-[var(--mut)] leading-relaxed mb-6">
              The green square is the cutting mat every maker already has on their desk. The chalk
              bar is the bench, and the yellow disc is the tool sitting on it. It is built from three
              flat shapes so it stays sharp at 24 pixels.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-[6px] border border-[var(--ln)] bg-[#FAFAF6] flex flex-col items-center justify-center">
                <Logo variant="full" />
                <span className="text-[11px] font-mono text-[#4A5A52] mt-3">On Chalk (#FAFAF6)</span>
              </div>

              <div className="p-4 rounded-[6px] border border-[#24402F] bg-[#0E3B2A] text-[#FAFAF6] flex flex-col items-center justify-center">
                <Logo variant="full" />
                <span className="text-[11px] font-mono text-[#A9BAB1] mt-3">On Deep Mat (#0E3B2A)</span>
              </div>
            </div>
          </div>

          {/* Design Language Rules */}
          <div className="bench-card p-6 md:p-8">
            <h3 className="font-display font-bold text-xl text-[var(--tx)] mb-3">
              Five Rules We Live By
            </h3>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[var(--tx)]">
              <li className="pl-3.5 border-l-2 border-[var(--g)]">
                <strong className="font-bold">The Mat Grid:</strong> A 1px Grid Line at 24px intervals
                marks the top of a page or section. It is the only pattern we use.
              </li>
              <li className="pl-3.5 border-l-2 border-[var(--y)]">
                <strong className="font-bold">One Highlight:</strong> Exactly one Tape Yellow element
                per screen. It tells people where to look without visual noise.
              </li>
              <li className="pl-3.5 border-l-2 border-[var(--g)]">
                <strong className="font-bold">Flat and Practical:</strong> 6px corners, 1px borders, no
                gradients, no shadows. Tools, not toys.
              </li>
              <li className="pl-3.5 border-l-2 border-[var(--y)]">
                <strong className="font-bold">Show the Tool Working:</strong> Real functional canvases
                and raw screenshots beat abstract marketing graphics.
              </li>
              <li className="pl-3.5 border-l-2 border-[var(--g)]">
                <strong className="font-bold">Plain Proof:</strong> State what it does, what it costs,
                what's included and what version a purchase covers.
              </li>
            </ul>
          </div>
        </div>

        {/* Color Palette Swatches */}
        <div className="bench-card p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="font-display font-bold text-lg text-[var(--tx)]">
                The Workshop Palette
              </h3>
              <p className="text-xs text-[var(--mut)]">
                Disciplined color roles from the Ownbench brand guidelines.
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--mut)]">Brand Guidelines v1</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-[6px] border border-[var(--ln)] overflow-hidden bg-[var(--panel)]">
              <div className="h-14 bg-[#1F7A55]" />
              <div className="p-2.5">
                <span className="font-display font-bold text-xs text-[var(--tx)] block">Mat Green</span>
                <span className="font-mono text-[10px] text-[var(--mut)]">#1F7A55</span>
                <span className="text-[10px] text-[var(--mut)] block mt-0.5">Primary actions</span>
              </div>
            </div>

            <div className="rounded-[6px] border border-[var(--ln)] overflow-hidden bg-[var(--panel)]">
              <div className="h-14 bg-[#0E3B2A]" />
              <div className="p-2.5">
                <span className="font-display font-bold text-xs text-[var(--tx)] block">Deep Mat</span>
                <span className="font-mono text-[10px] text-[var(--mut)]">#0E3B2A</span>
                <span className="text-[10px] text-[var(--mut)] block mt-0.5">Dark surfaces</span>
              </div>
            </div>

            <div className="rounded-[6px] border border-[var(--ln)] overflow-hidden bg-[var(--panel)]">
              <div className="h-14 bg-[#F2C230]" />
              <div className="p-2.5">
                <span className="font-display font-bold text-xs text-[var(--tx)] block">Tape Yellow</span>
                <span className="font-mono text-[10px] text-[var(--mut)]">#F2C230</span>
                <span className="text-[10px] text-[var(--mut)] block mt-0.5">The one highlight</span>
              </div>
            </div>

            <div className="rounded-[6px] border border-[var(--ln)] overflow-hidden bg-[var(--panel)]">
              <div className="h-14 bg-[#121A16]" />
              <div className="p-2.5">
                <span className="font-display font-bold text-xs text-[var(--tx)] block">Ink</span>
                <span className="font-mono text-[10px] text-[var(--mut)]">#121A16</span>
                <span className="text-[10px] text-[var(--mut)] block mt-0.5">Body text & mark</span>
              </div>
            </div>

            <div className="rounded-[6px] border border-[var(--ln)] overflow-hidden bg-[var(--panel)]">
              <div className="h-14 bg-[#FAFAF6] border-b border-[#CFE0D6]" />
              <div className="p-2.5">
                <span className="font-display font-bold text-xs text-[var(--tx)] block">Chalk</span>
                <span className="font-mono text-[10px] text-[var(--mut)]">#FAFAF6</span>
                <span className="text-[10px] text-[var(--mut)] block mt-0.5">Page canvas</span>
              </div>
            </div>

            <div className="rounded-[6px] border border-[var(--ln)] overflow-hidden bg-[var(--panel)]">
              <div className="h-14 bg-[#CFE0D6]" />
              <div className="p-2.5">
                <span className="font-display font-bold text-xs text-[var(--tx)] block">Grid Line</span>
                <span className="font-mono text-[10px] text-[var(--mut)]">#CFE0D6</span>
                <span className="text-[10px] text-[var(--mut)] block mt-0.5">1px dividers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
