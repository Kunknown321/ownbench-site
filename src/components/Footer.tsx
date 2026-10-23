import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="py-14 border-t border-[var(--ln)] bg-[var(--bg)] text-[var(--mut)] text-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pb-10 border-b border-[var(--ln)]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <Logo variant="full" />
              <span className="text-[var(--ln)]" aria-hidden="true">
                /
              </span>
              <span className="font-display font-extrabold text-sm text-[var(--tx)]">
                Listing Bench
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Ownbench makes offline desktop tools for one-person shops. Pay once, own them, run them
              on your own machine. Listing Bench is the first one.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-5 text-xs">
            <div>
              <span className="font-mono uppercase tracking-wider text-[var(--mut)] text-[10px] block mb-2">
                Product
              </span>
              <ul className="space-y-1.5">
                <li>
                  <a href="#free-check" className="hover:text-[var(--tx)]">
                    Free photo check
                  </a>
                </li>
                <li>
                  <a href="#tool" className="hover:text-[var(--tx)]">
                    What it does
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[var(--tx)]">
                    Price and licence
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[var(--tx)]">
                    Questions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-mono uppercase tracking-wider text-[var(--mut)] text-[10px] block mb-2">
                Honest numbers
              </span>
              <ul className="space-y-1.5">
                <li>
                  <a href="#measured" className="hover:text-[var(--tx)]">
                    Measurement table
                  </a>
                </li>
                <li>
                  <a href="#measured" className="hover:text-[var(--tx)]">
                    The claim we withdrew
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[var(--tx)]">
                    Memory limits
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-mono uppercase tracking-wider text-[var(--mut)] text-[10px] block mb-2">
                Contact
              </span>
              <ul className="space-y-1.5">
                <li>
                  <a href="mailto:support.openbench@gmail.com" className="hover:text-[var(--tx)] break-all">
                    support.openbench@gmail.com
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[var(--tx)]">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--tx)]">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-[var(--mut)]">
          <p>
            Measured on a Core i5-8365U, 4 cores / 8 threads, Linux / WebKitGTK, release build,
            22 October 2026.
          </p>
          <p>© {new Date().getFullYear()} Ownbench. Runs on your computer.</p>
        </div>
      </div>
    </footer>
  );
};
