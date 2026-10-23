import React from 'react';
import { ArrowRight, CalendarClock, Copy, MapPinOff } from 'lucide-react';

const PAINS = [
  {
    icon: Copy,
    number: '01',
    title: 'Six sizes for one photo.',
    body: 'Etsy wants 2000 px square. eBay 1600. Shopify 4:3 at 2048. Amazon 2000 with a pure white background. Poshmark 1200. Social 4:5. Fifty listings means three hundred exports, by hand, on a Sunday.',
  },
  {
    icon: MapPinOff,
    number: '02',
    title: 'Metadata you did not mean to publish.',
    body: 'Your camera writes the body serial and capture time into every frame. Your phone writes the coordinates of the room you shoot in. Those tags ride along inside the file you upload.',
  },
  {
    icon: CalendarClock,
    number: '03',
    title: 'Rent for a crop tool.',
    body: 'The web tools that do this charge $20–$30 a month — $240–$360 a year, every year, for something that crops a photo. They also stop working the moment your connection does.',
  },
];

export const Problem: React.FC = () => {
  return (
    <section className="py-20 border-b border-[var(--ln)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--g)] mb-2">
            The tax on a good photo
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--tx)] mb-4">
            The shoot takes an hour. The export takes the evening.
          </h2>
          <p className="text-base md:text-lg text-[var(--mut)] leading-relaxed">
            Saturday morning you photograph fifty pieces. By Sunday night the same fifty files are
            open in six browser tabs — one per marketplace — and each one gets dragged, cropped,
            re-exported and renamed. None of it makes the product better. All of it is why listing
            day feels like a chore instead of a launch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {PAINS.map((pain) => {
            const Icon = pain.icon;
            return (
              <article key={pain.number} className="bench-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm font-bold text-[var(--g)]">{pain.number}</span>
                  <Icon className="w-5 h-5 text-[var(--mut)]" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-xl text-[var(--tx)] mb-2">{pain.title}</h3>
                <p className="text-sm text-[var(--mut)] leading-relaxed">{pain.body}</p>
              </article>
            );
          })}
        </div>

        <div className="bench-card p-5 md:p-6 bg-[var(--g)] text-[#FAFAF6] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-sm md:text-base leading-relaxed max-w-3xl">
            Listing Bench is one 19 MB program on your own machine that does all three jobs in a
            single pass. Before you pay anything, the check below runs on one of your photos and
            tells you what it would do to it.
          </p>
          <a
            href="#free-check"
            className="inline-flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-[6px] bg-[#FAFAF6] text-[var(--dk)] text-sm font-bold hover:bg-white transition-colors"
          >
            Run the free check <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
