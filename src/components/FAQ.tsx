import React from 'react';

const QUESTIONS: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Does it upload my photos anywhere?',
    a: (
      <>
        No. The engine has no network code path — during a full 50-photo batch we measured zero
        outbound connections, and that is the point of the product rather than a setting you have to
        find. Photos are read from the folder you pick and written to the folder you pick.
      </>
    ),
  },
  {
    q: 'What is actually free, and what is the catch?',
    a: (
      <>
        The check above is free forever: one photo at a time, no email, no account, nothing stored.
        There is no catch and no watermark on the file you download from it. The paid app is the
        batch: a whole folder, six marketplaces at once, files written to disk.
      </>
    ),
  },
  {
    q: 'Will it run on my machine?',
    a: (
      <>
        macOS on Apple Silicon and Intel, and Windows 10 or 11. The builds on this page were measured
        on Linux, which is our development target and not a supported download yet — if you are on
        Linux and want it, write to us rather than guessing.
      </>
    ),
  },
  {
    q: 'What does the $29 cover, in plain words?',
    a: (
      <>
        Version 1.x, including point updates like 1.1 and 1.2, on the computers you personally run
        the shop from. It does not expire. If a version 2.0 ever exists it would be a separate
        purchase, and we would say so long before you could buy it — no “lifetime” language here,
        because we have all been burned by it.
      </>
    ),
  },
  {
    q: 'Why 9.7 seconds and not the four seconds you used to claim?',
    a: (
      <>
        Because the old number was measured on 2.9-megapixel stand-ins, not real 24 MP DSLR frames.
        At true resolution the same 50-photo batch takes 9.66 seconds on four cores. The old figure
        is gone from the site and from the test suite; the{' '}
        <a href="#measured" className="text-[var(--g)] underline">
          measurement table
        </a>{' '}
        shows both.
      </>
    ),
  },
  {
    q: 'My camera shoots HEIC. Does that work?',
    a: (
      <>
        Not directly — the app reads JPEG, PNG and WebP. On an iPhone, set the camera to “Most
        Compatible” or export the shots as JPEG before dropping them in. The free check will tell
        you the same thing if you try to drop a HEIC file into it.
      </>
    ),
  },
  {
    q: 'Is the free check the same engine as the app?',
    a: (
      <>
        No, and we would rather say so. It is the same preset table, the same mat geometry and the
        same stamp placement, drawn in your browser with the browser&apos;s JPEG encoder. It handles
        one photo and cannot touch a folder. The app is a Rust pipeline with Lanczos3 resampling,
        a parallel batch and no browser underneath.
      </>
    ),
  },
  {
    q: 'Can it handle 200 photos in one go?',
    a: (
      <>
        The queue holds up to 1,000 paths, but memory is the real limit: at 24 MP we measured 568 MB
        peak for 50 photos, which is above our own 250 MB target. A 200-file run is not something we
        have measured, so it is not something we claim. Start with the folder you actually have and
        watch it — it will not silently drop files, it reports per-photo outcomes.
      </>
    ),
  },
  {
    q: 'When can I buy it, and what are the refund terms?',
    a: (
      <>
        When the installers are signed and the payment, the key and the download all work in one
        flow. Refund terms will be published on this page before the button is switched on, and they
        will be stated in the same breath as the price. Until then: support.openbench@gmail.com,
        answered by a person.
      </>
    ),
  },
];

export const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-20 border-b border-[var(--ln)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--g)] mb-2">
            Questions, answered plainly
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--tx)] mb-4">
            The things you would ask before paying.
          </h2>
          <p className="text-base md:text-lg text-[var(--mut)] leading-relaxed">
            If one of these is missing an answer you need, email us and it becomes a question on this
            page.
          </p>
        </div>

        <div className="bench-card divide-y divide-[var(--ln)] overflow-hidden">
          {QUESTIONS.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex items-start justify-between gap-4 p-4 md:p-5 cursor-pointer list-none hover:bg-[var(--bg)] transition-colors">
                <span className="font-display font-bold text-base md:text-lg text-[var(--tx)]">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="font-mono text-[var(--mut)] shrink-0 mt-0.5 group-open:hidden"
                >
                  +
                </span>
                <span
                  aria-hidden="true"
                  className="font-mono text-[var(--mut)] shrink-0 mt-0.5 hidden group-open:inline"
                >
                  −
                </span>
              </summary>
              <div className="px-4 md:px-5 pb-5 -mt-1 text-sm text-[var(--mut)] leading-relaxed max-w-3xl">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
