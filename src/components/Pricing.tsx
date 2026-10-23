import React from 'react';
import { Check, Info } from 'lucide-react';

interface PricingProps {
  onOpenCheckout: () => void;
}

const INCLUDED = [
  'A licence for version 1.x, all six presets, unlimited batches',
  'Point updates to 1.x included',
  'macOS (Apple Silicon and Intel) and Windows 10 / 11 installers',
  'Offline activation: a key checked on your machine, never a login',
  'Install on every computer you personally run the shop from',
  'No account, no telemetry, no expiry date',
];

const COMPARISON: { dimension: string; owned: string; rented: string }[] = [
  {
    dimension: 'Year 1',
    owned: '$29 once',
    rented: '$240 – $360',
  },
  {
    dimension: 'Year 2',
    owned: '$0',
    rented: '$240 – $360',
  },
  {
    dimension: 'Offline',
    owned: 'Works on a train, a market stall, a bad hotel Wi-Fi',
    rented: 'Stops when the connection or their servers do',
  },
  {
    dimension: 'Your photos',
    owned: 'Never leave your disk',
    rented: 'Uploaded to someone else\u2019s cloud',
  },
  {
    dimension: 'If you stop paying',
    owned: 'The app you bought keeps working',
    rented: 'Account closed, tool gone',
  },
  {
    dimension: 'Tracking',
    owned: 'None. There is no analytics code in the binary',
    rented: 'Session recording, ads, “product improvement”',
  },
];

export const Pricing: React.FC<PricingProps> = ({ onOpenCheckout }) => {
  return (
    <section id="pricing" className="py-20 border-b border-[var(--ln)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--g)] mb-2">
            The price
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--tx)] mb-4">
            $29. Version 1.x. No renewal.
          </h2>
          <p className="text-base md:text-lg text-[var(--mut)] leading-relaxed">
            One payment for the version you get today and its point updates. Not a subscription, not
            a credits pack, and no “pro” tier hiding the batch button behind a second invoice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bench-card p-6 md:p-7 bg-[var(--panel)]">
            <div className="flex items-start justify-between pb-4 border-b border-[var(--ln)] gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] block">
                  Single maker licence
                </span>
                <h3 className="font-display font-bold text-2xl text-[var(--tx)]">Listing Bench v1.x</h3>
              </div>
              <div className="text-right">
                <span className="font-display font-extrabold text-4xl text-[var(--tx)] leading-none block">
                  $29
                </span>
                <span className="block text-[11px] font-mono text-[var(--mut)] mt-1">USD, once</span>
              </div>
            </div>

            <ul className="space-y-2.5 my-5 text-xs sm:text-sm text-[var(--tx)]">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[var(--g)] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onOpenCheckout}
              className="w-full bench-btn-primary py-3 text-base cursor-pointer"
            >
              See what $29 covers
            </button>

            <div className="mt-4 flex items-start gap-2.5 p-3 rounded-[6px] border border-[var(--ln)] bg-[var(--bg)]">
              <Info className="w-4 h-4 text-[var(--mut)] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[11px] text-[var(--mut)] leading-relaxed">
                Checkout is not open yet. The installers still need code signing, and we will not
                take money until the payment, the key and the download work together in one go. The
                free check above is open right now.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bench-card overflow-hidden">
            <div className="p-4 sm:p-5 bg-[var(--bg)] border-b border-[var(--ln)]">
              <h3 className="font-display font-bold text-lg text-[var(--tx)]">
                Owning it versus renting it
              </h3>
              <p className="text-xs text-[var(--mut)] mt-0.5">
                The going rate for the web tools is $20–$30 a month. Here is what three years of
                that looks like next to one payment.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--panel)] border-b border-[var(--ln)]">
                    <th className="p-3.5 font-bold text-[var(--tx)] w-1/4"> </th>
                    <th className="p-3.5 font-bold text-[var(--g)]">Listing Bench</th>
                    <th className="p-3.5 font-bold text-[var(--mut)]">Typical web tool</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--ln)]">
                  {COMPARISON.map((row) => (
                    <tr key={row.dimension}>
                      <td className="p-3.5 font-medium text-[var(--tx)]">{row.dimension}</td>
                      <td className="p-3.5 text-[var(--g)] font-medium">{row.owned}</td>
                      <td className="p-3.5 text-[var(--mut)]">{row.rented}</td>
                    </tr>
                  ))}
                  <tr className="bg-[var(--bg)]">
                    <td className="p-3.5 font-bold text-[var(--tx)]">Three years</td>
                    <td className="p-3.5 font-bold text-[var(--g)]">$29 total</td>
                    <td className="p-3.5 font-bold text-[var(--mut)]">$720 – $1,080</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
