import React from 'react';

interface Measurement {
  metric: string;
  result: string;
  method: string;
  miss?: boolean;
}

const MEASUREMENTS: Measurement[] = [
  {
    metric: 'Cold start to first window',
    result: '199 ms',
    method: 'release build, Linux / WebKitGTK, wall clock from process start to a mapped window',
  },
  {
    metric: 'Installed size (Linux x86_64)',
    result: '19 MB',
    method: 'the release binary on disk; macOS and Windows installers are not built yet',
  },
  {
    metric: '50 × 24 MP → 2000 × 2000, one batch',
    result: '9.66 s · 193 ms per photo',
    method: 'i5-8365U, 4 physical cores / 8 threads; 6000 × 4000 sources, Etsy preset, Chalk mat',
  },
  {
    metric: '50 × 2.9 MP regression gate',
    result: '3.27 s',
    method: 'cargo test --release, against a 4.0 s budget; this gate exists to catch regressions, not to be a headline',
  },
  {
    metric: 'Outbound connections during a full batch',
    result: '0',
    method: 'ss -tunap sampled while the app ran; the engine has no network code path at all',
  },
  {
    metric: 'Batch peak memory',
    result: '568 MB',
    method: 'RSS sampled every 50 ms across the 50-photo run — this misses our own 250 MB target',
    miss: true,
  },
  {
    metric: 'Idle memory',
    result: '139 MB app · 356 MB total on Linux',
    method: 'the second figure includes the system webview\u2019s own processes; the \u201cunder 45 MB\u201d line we used early on was wrong',
    miss: true,
  },
  {
    metric: 'GPS and device tags after export',
    result: '0 tags · ICC profile preserved',
    method: 'cargo test --release --test exif_scrub, reading the written file back',
  },
  {
    metric: 'Licence check',
    result: 'under 1 ms, offline',
    method: 'Ed25519 verify in-process; forged, truncated and tampered keys are rejected by unit tests',
  },
];

export const Measured: React.FC = () => {
  return (
    <section id="measured" className="py-20 border-b border-[var(--ln)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--g)] mb-2">
            The receipt
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--tx)] mb-4">
            What we measured — including the number we missed.
          </h2>
          <p className="text-base md:text-lg text-[var(--mut)] leading-relaxed">
            Every figure on this page comes from a release build on the machine below. Where a
            result fell short of the target we set ourselves, it is still in this table with the
            target beside it. A spec sheet you cannot check is just advertising.
          </p>
        </div>

        <div className="bench-card overflow-hidden mb-6">
          <div className="p-4 bg-[var(--bg)] border-b border-[var(--ln)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm font-bold text-[var(--tx)]">Measurement rig</span>
            <span className="text-xs font-mono text-[var(--mut)]">
              Core i5-8365U · 4 cores / 8 threads · Linux / WebKitGTK · release build · 22 Oct 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--panel)] border-b border-[var(--ln)]">
                  <th className="p-3.5 font-bold text-[var(--tx)]">Metric</th>
                  <th className="p-3.5 font-bold text-[var(--tx)]">Measured</th>
                  <th className="p-3.5 font-bold text-[var(--tx)]">How</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--ln)]">
                {MEASUREMENTS.map((row) => (
                  <tr key={row.metric} className={row.miss ? 'bg-[var(--bg)]' : ''}>
                    <td className="p-3.5 font-medium text-[var(--tx)] align-top">
                      {row.metric}
                      {row.miss && (
                        <span className="block text-[10px] font-mono uppercase tracking-wider text-[var(--mut)] mt-1 border border-[var(--ln)] rounded-[4px] px-1.5 py-0.5 w-fit">
                          Missed our target
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-[var(--tx)] align-top whitespace-nowrap">
                      {row.result}
                    </td>
                    <td className="p-3.5 text-[var(--mut)] align-top">{row.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-[6px] border-l-[6px] border-l-[var(--tx)] border border-[var(--ln)] bg-[var(--panel)]">
            <h3 className="font-display font-bold text-lg text-[var(--tx)] mb-2">
              The 4-second claim, and why it is gone
            </h3>
            <p className="text-sm text-[var(--mut)] leading-relaxed">
              An earlier version of our own spec sheet promised 50 DSLR photos in under four
              seconds. That test was written with 2.9-megapixel stand-ins — about an eighth of a
              24 MP frame. At real DSLR resolution the same batch takes 9.66 seconds on four cores.
              The old number has been removed from the site and from the test that enforced it,
              because a budget that describes the wrong input is worse than no budget.
            </p>
          </div>

          <div className="p-5 rounded-[6px] border border-[var(--ln)] bg-[var(--panel)]">
            <h3 className="font-display font-bold text-lg text-[var(--tx)] mb-2">
              How to read any batch claim
            </h3>
            <p className="text-sm text-[var(--mut)] leading-relaxed">
              A throughput number means nothing without three facts: how many megapixels each photo
              was, how many physical cores ran it, and whether the output was written to disk. Ours
              is 24 MP, four cores, written to disk — on a five-year-old ultrabook, not a
              workstation. Ask the same three questions of anything else you are quoted.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
