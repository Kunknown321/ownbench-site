import React from 'react';
import { ArrowRight, Timer } from 'lucide-react';

interface HeroProps {
  onOpenCheckout: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCheckout }) => {
  return (
    <section className="relative mat-grid border-b border-[var(--ln)] pt-16 pb-14 md:pt-20 md:pb-16 overflow-hidden">
      {/* The single Tape Yellow element on this screen. Brand guidelines v1. */}
      <div className="absolute left-6 top-0 w-24 h-3.5 bg-[#F2C230] z-10" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--g)] mb-3">
            Ownbench presents · Listing Bench v1 · a desktop app
          </p>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-[68px] leading-[1.02] tracking-tight text-[var(--tx)] mb-5 text-balance">
            Stop resizing the same photo six times.
          </h1>

          <p className="text-lg md:text-xl text-[var(--mut)] leading-relaxed mb-7 max-w-2xl">
            Listing Bench takes one folder of camera shots and writes every marketplace size in a
            single pass — conformed, matted, stamped and stripped of GPS. Fifty 24-megapixel photos
            in <strong className="text-[var(--tx)]">9.7 seconds</strong>, measured on a four-core
            laptop. Nothing leaves the machine.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <a
              href="#free-check"
              className="bench-btn-primary px-5 py-3 text-base inline-flex items-center gap-2"
            >
              <span>Check one photo, free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={onOpenCheckout}
              className="px-5 py-3 text-sm font-semibold rounded-[6px] border border-[var(--ln)] bg-[var(--panel)] text-[var(--tx)] hover:bg-[var(--bg)] transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>What $29 covers</span>
              <span className="font-mono text-xs text-[var(--mut)]">once · v1.x</span>
            </button>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5 pt-6 border-t border-[var(--ln)]">
            <Stat value="9.7 s" label="50 × 24 MP in one batch" />
            <Stat value="19 MB" label="Native binary, no Chromium" />
            <Stat value="0" label="Outbound connections" />
            <Stat value="$29" label="Once, for version 1.x" />
          </dl>

          <p className="text-[11px] font-mono text-[var(--mut)] mt-4 flex items-center gap-1.5">
            <Timer className="w-3 h-3" aria-hidden="true" />
            Measured 22 Oct 2026 · i5-8365U, 4 cores / 8 threads · release build ·{' '}
            <a href="#measured" className="underline hover:text-[var(--g)]">
              see every number, including the ones we missed
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div>
    <dt className="font-display font-extrabold text-2xl md:text-3xl text-[var(--tx)] leading-none">
      {value}
    </dt>
    <dd className="text-xs text-[var(--mut)] mt-1.5 leading-snug">{label}</dd>
  </div>
);
