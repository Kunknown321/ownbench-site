import React, { useState } from 'react';
import { X, ShieldCheck, HardDrive, Apple, Info, Mail, MessagesSquare, Bell, Check } from 'lucide-react';
import { Logo } from './Logo';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Checkout — currently CLOSED.
 *
 * The previous version of this modal invented a license key with
 * `Math.random()`, claimed a receipt had been emailed, and offered installer
 * links that downloaded nothing. That is a fake transaction: it showed a
 * buyer a key the desktop app rejects (the real key format is `OBLB1-` plus
 * 125 base32 characters, not the 12-character `OB-LB1-XXXX-…` the modal used
 * to display) and it collected an email address with nothing behind it.
 *
 * Until a payment processor, an order record, a delivery path, and a
 * server-side license issuer are connected and verified end to end, this
 * modal states the offer and the terms and does not take money.
 */
export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistName.trim() || !waitlistEmail.trim()) return;

    setWaitlistSubmitting(true);
    // Simulate API call - replace with actual endpoint when ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    setWaitlistSubmitting(false);
    setWaitlistSubmitted(true);
    // In production: send to backend / API here
    console.log('Waitlist signup:', { name: waitlistName, email: waitlistEmail });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <div className="relative w-full max-w-lg bench-card p-6 md:p-8 bg-[var(--panel)] border border-[var(--ln)] shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-[4px] text-[var(--mut)] hover:text-[var(--tx)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Logo variant="mark" />
            <div>
              <h3 className="font-display font-extrabold text-2xl text-[var(--tx)]">
                Get Listing Bench
              </h3>
              <span className="text-xs font-mono text-[var(--g)] font-bold">
                Version 1.x License
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-[6px] border border-[var(--ln)] bg-[var(--bg)] mb-6 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-[var(--tx)] block">
                Listing Bench v1.x (macOS + Windows)
              </span>
              <span className="text-xs text-[var(--mut)]">Single maker license</span>
            </div>
            <div className="text-right">
              <span className="font-display font-extrabold text-2xl text-[var(--tx)]">$29</span>
              <span className="block text-[11px] font-mono text-[var(--mut)]">one-time</span>
            </div>
          </div>

          {/* Status notice */}
          <div className="flex items-start gap-3 p-4 rounded-[6px] border border-[#F2C230]/40 bg-[#F2C230]/10 mb-6">
            <Info className="w-4 h-4 text-[#8A4A17] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[var(--tx)] mb-1">
                Checkout is not open yet.
              </p>
              <p className="text-xs text-[var(--mut)] leading-relaxed">
                We are finishing the purchase flow so that payment, the license key, and the
                installer download are all delivered together and actually work. We are not
                taking payments until that is true.
              </p>
            </div>
          </div>

          {/* Waitlist */}
          <div className="mb-6">
            <p className="text-xs text-[var(--mut)] text-center mb-3">Be first to know when checkout opens.</p>
            <button
              onClick={() => setShowWaitlist(true)}
              className="w-full py-3 rounded-[6px] bg-[var(--g)] text-[var(--bg)] font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Notify me when it's ready
            </button>
          </div>

          {/* How to reach us while checkout is closed */}
          <div className="p-4 rounded-[6px] border border-[var(--ln)] bg-[var(--bg)] mb-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-2.5">
              Questions before you buy?
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="mailto:support.openbench@gmail.com"
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] border border-[var(--ln)] text-xs font-bold text-[var(--tx)] hover:bg-[var(--panel)] transition-colors break-all"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--g)] shrink-0" />
                support.openbench@gmail.com
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] border border-[var(--ln)] text-xs font-bold text-[var(--tx)] hover:bg-[var(--panel)] transition-colors shrink-0"
              >
                <MessagesSquare className="w-3.5 h-3.5 text-[var(--g)] shrink-0" />
                Join the Discord
              </a>
            </div>
          </div>

          {/* What you get */}
          <div className="mb-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-2">
              What the $29 covers
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--tx)]">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--g)] shrink-0 mt-1.5" />
                <span>A Version 1.x license for Listing Bench.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--g)] shrink-0 mt-1.5" />
                <span>macOS and Windows installers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--g)] shrink-0 mt-1.5" />
                <span>An offline activation key, checked on your own computer.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--g)] shrink-0 mt-1.5" />
                <span>Point updates to 1.x included.</span>
              </li>
            </ul>
          </div>

          {/* What's still being confirmed */}
          <div className="p-4 rounded-[6px] border border-[var(--ln)] bg-[var(--bg)] mb-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block mb-2">
              Being confirmed before checkout opens
            </span>
            <ul className="space-y-1.5 text-xs text-[var(--mut)]">
              <li>· Refund terms</li>
              <li>· Supported OS versions and exact installer builds</li>
              <li>· Delivery timing and download hosting</li>
              <li>· Whether a major version 2.0 is sold separately</li>
            </ul>
            <p className="text-[11px] text-[var(--mut)] mt-3 leading-relaxed">
              These will be published here before the buy button is switched on. We would rather
              show you an honest gap than a polished guess.
            </p>
          </div>

          {/* Non-transactional footer */}
          <div className="flex items-center justify-center gap-4 text-xs text-[var(--mut)] pt-2 mb-5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--g)]" />
              <span>Offline activation</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-[var(--g)]" />
              <span>No account needed</span>
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-[var(--mut)] pb-2">
            <span className="flex items-center gap-1">
              <Apple className="w-3.5 h-3.5 text-[var(--g)]" />
              <span>macOS</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-[var(--g)]" />
              <span>Windows</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-[6px] border border-[var(--ln)] text-xs font-bold text-[var(--tx)] hover:bg-[var(--bg)] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    {/* Waitlist Modal */}
    {showWaitlist && (
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-md bench-card p-6 md:p-8 bg-[var(--panel)] border border-[var(--ln)] shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowWaitlist(false)}
            className="absolute top-5 right-5 p-1 rounded-[4px] text-[var(--mut)] hover:text-[var(--tx)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
            aria-label="Close waitlist"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--g)]/10 text-[var(--g)] mb-4">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-[var(--tx)] mb-2">Notify me when it's ready</h3>
            <p className="text-sm text-[var(--mut)]">We'll email you the moment checkout opens — no spam, just the news.</p>
          </div>

          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <div>
              <label htmlFor="waitlist-name" className="block text-xs font-medium text-[var(--mut)] mb-1.5">
                Name
              </label>
              <input
                type="text"
                id="waitlist-name"
                name="name"
                value={waitlistName}
                onChange={(e) => setWaitlistName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-[6px] border border-[var(--ln)] bg-[var(--bg)] text-[var(--tx)] placeholder-[var(--mut)] focus:outline-none focus:ring-2 focus:ring-[var(--g)] focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="waitlist-email" className="block text-xs font-medium text-[var(--mut)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="waitlist-email"
                name="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-[6px] border border-[var(--ln)] bg-[var(--bg)] text-[var(--tx)] placeholder-[var(--mut)] focus:outline-none focus:ring-2 focus:ring-[var(--g)] focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={waitlistSubmitting || !waitlistName.trim() || !waitlistEmail.trim()}
              className="w-full py-3 rounded-[6px] bg-[var(--g)] text-[var(--bg)] font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {waitlistSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Joining...
                </>
              ) : waitlistSubmitted ? (
                <>
                  <Check className="w-4 h-4" />
                  You're on the list!
                </>
              ) : (
                'Join the waitlist'
              )}
            </button>

            {waitlistSubmitted && (
              <p className="text-xs text-[var(--g)] text-center">
                We'll email you at <span className="font-mono">{waitlistEmail}</span> when checkout opens.
              </p>
            )}
          </form>

          <p className="text-[11px] text-[var(--mut)] text-center mt-4">
            Your email is only used for the launch notification. No marketing lists, ever.
          </p>
        </div>
      </div>
    )}
    </>
  );
};
