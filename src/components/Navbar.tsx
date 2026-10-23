import React from 'react';
import { Logo } from './Logo';
import { Moon, Sun } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenCheckout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, onToggleDarkMode, onOpenCheckout }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--ln)] bg-[var(--bg)]/95 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-3 shrink-0">
          <a href="#top" className="flex items-center text-[var(--tx)]">
            <Logo variant="full" />
          </a>
          <span className="hidden sm:inline text-[var(--ln)]" aria-hidden="true">
            /
          </span>
          <span className="hidden sm:inline font-display font-extrabold text-sm tracking-tight text-[var(--tx)]">
            Listing Bench
          </span>
          <span className="hidden md:inline text-[10px] font-mono uppercase tracking-wider text-[var(--mut)] border border-[var(--ln)] rounded-[4px] px-1.5 py-0.5">
            v1
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--mut)]">
          <a href="#free-check" className="hover:text-[var(--tx)] transition-colors whitespace-nowrap">
            Free check
          </a>
          <a href="#tool" className="hover:text-[var(--tx)] transition-colors whitespace-nowrap">
            What it does
          </a>
          <a href="#measured" className="hover:text-[var(--tx)] transition-colors whitespace-nowrap">
            Measured
          </a>
          <a href="#pricing" className="hover:text-[var(--tx)] transition-colors whitespace-nowrap">
            Price
          </a>
          <a href="#faq" className="hover:text-[var(--tx)] transition-colors whitespace-nowrap">
            Questions
          </a>
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-[6px] border border-[var(--ln)] text-[var(--mut)] hover:text-[var(--tx)] hover:bg-[var(--panel)] transition-colors cursor-pointer"
            title={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCheckout}
            className="bench-btn-primary px-3 sm:px-4 py-2 text-sm whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
            aria-label="Get Listing Bench for 29 dollars"
          >
            <span className="hidden sm:inline">Get Listing Bench</span>
            <span className="sm:hidden">Get it</span>
            <span className="text-xs px-1.5 py-0.5 rounded-[4px] bg-[#0E3B2A] text-[#FAFAF6] font-mono">
              $29
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
