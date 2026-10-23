import React from 'react';
import { Check, X, Shield, HelpCircle } from 'lucide-react';

interface PlainProofProps {
  onOpenCheckout: () => void;
}

export const PlainProof: React.FC<PlainProofProps> = ({ onOpenCheckout }) => {
  return (
    <section id="plain-proof" className="py-20 border-b border-[var(--ln)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--g)] mb-2">
            Clear Terms & Inclusions
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--tx)] mb-4">
            Plain proof. Here is exactly what you get.
          </h2>
          <p className="text-base md:text-lg text-[var(--mut)]">
            We don’t use marketing buzzwords or hide terms in fine print. Here is what your $29
            purchase covers, what is included, and how our version guarantee works.
          </p>
        </div>

        {/* Pricing Card & Version Coverage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Main Price Card */}
          <div className="lg:col-span-5 bench-card p-6 md:p-8 bg-[var(--panel)]">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--ln)]">
              <div>
                <span className="text-xs font-mono text-[var(--mut)] uppercase tracking-wider block">
                  Product License
                </span>
                <h3 className="font-display font-bold text-2xl text-[var(--tx)]">
                  Listing Bench v1.x
                </h3>
              </div>
              <div className="text-right">
                <span className="font-display font-extrabold text-4xl text-[var(--tx)]">$29</span>
                <span className="block text-xs font-mono text-[var(--mut)]">Pay once USD</span>
              </div>
            </div>

            <p className="text-sm text-[var(--mut)] my-5 leading-relaxed">
              Full desktop license for Version 1.x. Runs 100% locally on your computer with zero
              monthly subscriptions or cloud account requirements.
            </p>

            <ul className="space-y-3 mb-6 text-xs sm:text-sm text-[var(--tx)]">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[var(--g)] shrink-0" />
                <span>License for Version 1.x</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[var(--g)] shrink-0" />
                <span>Point updates to 1.x included</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[var(--g)] shrink-0" />
                <span>macOS (Apple Silicon & Intel) + Windows 10/11</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[var(--g)] shrink-0" />
                <span>Offline license key activation (0 internet phone-homes)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[var(--g)] shrink-0" />
                <span>Install on all personal computers you operate</span>
              </li>
            </ul>

            <button
              onClick={onOpenCheckout}
              className="w-full bench-btn-primary py-3 text-base text-center cursor-pointer block"
            >
              See What $29 Covers
            </button>

            <p className="text-center text-xs text-[var(--mut)] mt-3">
              Checkout opens soon. Refund and delivery terms are published before it does.
            </p>
          </div>

          {/* Comparison Table: SaaS Rent Trap vs Ownbench */}
          <div className="lg:col-span-7 bench-card overflow-hidden">
            <div className="p-4 sm:p-5 bg-[var(--bg)] border-b border-[var(--ln)]">
              <h3 className="font-display font-bold text-lg text-[var(--tx)]">
                The Subscription Comparison
              </h3>
              <p className="text-xs text-[var(--mut)] mt-0.5">
                How owning a tool compares to paying software rent every single month.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--ln)] bg-[var(--panel)]">
                    <th className="p-3.5 font-bold text-[var(--tx)]">Dimension</th>
                    <th className="p-3.5 font-bold text-[var(--g)]">Ownbench</th>
                    <th className="p-3.5 font-bold text-[var(--mut)]">Typical SaaS Web Tool</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--ln)]">
                  <tr>
                    <td className="p-3.5 font-medium text-[var(--tx)]">Annual Cost</td>
                    <td className="p-3.5 font-bold text-[var(--g)]">$29 total (Year 1, 2, 3...)</td>
                    <td className="p-3.5 text-[var(--mut)]">$240 to $360 per year ($20–$30/mo)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-[var(--tx)]">Offline Reliability</td>
                    <td className="p-3.5 text-[var(--g)] font-medium">
                      Works on an airplane or cabin without WiFi
                    </td>
                    <td className="p-3.5 text-[var(--mut)]">
                      Fails completely when offline or servers are down
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-[var(--tx)]">Image Privacy</td>
                    <td className="p-3.5 text-[var(--g)] font-medium">
                      0 bytes uploaded to external servers
                    </td>
                    <td className="p-3.5 text-[var(--mut)]">
                      Photos uploaded to third-party cloud servers
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-[var(--tx)]">If you stop paying</td>
                    <td className="p-3.5 text-[var(--g)] font-medium">
                      You own it. It keeps working on your computer.
                    </td>
                    <td className="p-3.5 text-[var(--mut)]">
                      Account locked; software revoked immediately
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-[var(--tx)]">Telemetry & Trackers</td>
                    <td className="p-3.5 text-[var(--g)] font-medium">Zero tracking or analytics</td>
                    <td className="p-3.5 text-[var(--mut)]">
                      Behavior trackers, session recordings, ads
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Brand Voice Guide: We Say vs We Don't Say */}
        <div className="bench-card p-6 md:p-8 bg-[var(--panel)]">
          <h3 className="font-display font-bold text-xl text-[var(--tx)] mb-2">
            Our Voice: Plain talk for solo makers
          </h3>
          <p className="text-xs sm:text-sm text-[var(--mut)] mb-6 max-w-2xl">
            Never use the word “lifetime” unless the exact version or term it covers is named in the
            same sentence. Our audience has been burned by that promise before.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--g)] font-bold block">
                What we say (Direct & honest)
              </span>
              <div className="p-3 rounded-[6px] bg-[#1F7A55]/10 border border-[#1F7A55]/30 text-xs sm:text-sm text-[var(--tx)] flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--g)] shrink-0 mt-0.5" />
                <span>Pay once. It’s yours.</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[#1F7A55]/10 border border-[#1F7A55]/30 text-xs sm:text-sm text-[var(--tx)] flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--g)] shrink-0 mt-0.5" />
                <span>Runs on your computer, works offline.</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[#1F7A55]/10 border border-[#1F7A55]/30 text-xs sm:text-sm text-[var(--tx)] flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--g)] shrink-0 mt-0.5" />
                <span>Covers version 1. Here’s what updates include.</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[#1F7A55]/10 border border-[#1F7A55]/30 text-xs sm:text-sm text-[var(--tx)] flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--g)] shrink-0 mt-0.5" />
                <span>Does one job well.</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--mut)] font-bold block">
                What we don’t say (Hype & empty promises)
              </span>
              <div className="p-3 rounded-[6px] bg-[var(--bg)] border border-[var(--ln)] text-xs sm:text-sm text-[var(--mut)] flex items-start gap-2 line-through opacity-75">
                <X className="w-4 h-4 text-[var(--mut)] shrink-0 mt-0.5" />
                <span>Unlock unlimited value with AI disruption.</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[var(--bg)] border border-[var(--ln)] text-xs sm:text-sm text-[var(--mut)] flex items-start gap-2 line-through opacity-75">
                <X className="w-4 h-4 text-[var(--mut)] shrink-0 mt-0.5" />
                <span>Revolutionary cloud-powered ecosystem.</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[var(--bg)] border border-[var(--ln)] text-xs sm:text-sm text-[var(--mut)] flex items-start gap-2 line-through opacity-75">
                <X className="w-4 h-4 text-[var(--mut)] shrink-0 mt-0.5" />
                <span>Lifetime access, with nothing explained.</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[var(--bg)] border border-[var(--ln)] text-xs sm:text-sm text-[var(--mut)] flex items-start gap-2 line-through opacity-75">
                <X className="w-4 h-4 text-[var(--mut)] shrink-0 mt-0.5" />
                <span>The all-in-one super-app for your business.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
