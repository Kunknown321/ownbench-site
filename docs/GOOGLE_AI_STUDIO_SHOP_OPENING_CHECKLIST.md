# Ownbench shop opening — Google AI Studio handoff

Use this as the implementation brief for the existing Ownbench website. Keep the current visual language and make the smallest complete changes. This is a checklist, not permission to publish the site or to invent product/legal terms.

## Source of truth and boundaries

- [ ] Read `../.hermes/marketing/PRODUCT_CONTEXT.md` (repo root: `.hermes/marketing/PRODUCT_CONTEXT.md`) before editing. Founder decisions: Listing Bench, $29 one-time, October 2026 target, $0 paid promotion.
- [ ] Inspect the current source in `src/` and preserve its design system and responsive behavior.
- [ ] Do not present `src/components/LiveWorkbench.tsx` as the desktop application. It is an illustrative browser demo. The real application is under `../../listing-bench/ui/` and uses Tauri commands.
- [ ] Do not make claims about sales lift, time saved, adoption, performance, zero network traffic, data privacy, supported OS versions, update duration, or refund terms unless they are verified against a release build and the actual operating policy.
- [ ] Do not publish or deploy anything from this handoff without the owner's explicit approval.

## 1. Make the shop honest and purchase-ready

- [ ] Replace every public-facing `$39` with `$29 USD` where it describes the current offer; search all site source and metadata for stale `$39`, `Q1 2027`, and old launch dates.
- [ ] Remove the simulated success path in `src/components/CheckoutModal.tsx`: it currently invents a key in the browser, claims a receipt was sent, and offers installer links that do not download installers. Do not cosmetically retain this as checkout.
- [ ] Keep purchase disabled or clearly labeled “Checkout opening soon” until a real checkout, order record, delivery flow, and license issuance path have been selected and verified end to end. Do not collect email addresses in a fake form.
- [ ] Before enabling checkout, verify that the chosen storefront can deliver the actual app and issue/hand off a license compatible with Listing Bench's offline Ed25519 verification (`../../listing-bench/crates/listingbench-core/src/licensing.rs`). Do not assume generic software license keys are compatible.
- [ ] Show the exact product version, OS/builds actually available, what the $29 includes, update coverage, support contact, refund policy, and delivery timing. Mark unknowns `[OWNER TO CONFIRM]`; do not invent answers.

## 2. The “Ownership Receipt” (Idea #2)

- [ ] Add a compact, scannable section/card explaining what the one-time payment buys, in plain language. It should read like a receipt for a considered purchase, not a manifesto.
- [ ] Include only confirmed line items: product name/version; price/currency; license scope; supported builds; included updates; delivery method; support route; refund terms; any future paid upgrades.
- [ ] For any unresolved line item, display a neutral “Details will be confirmed before checkout opens” or hide it until the owner confirms it. Do not promise “forever,” “lifetime,” or “all future versions” by implication.
- [ ] Link or anchor to the full license/refund/support terms once those documents exist.

## 3. No countdown / no manufactured urgency (Idea #3)

- [ ] Present $29 as the current price without a timer, crossed-out anchor price, fake “launch ends” date, stock counter, or fabricated scarcity.
- [ ] A short line can say: “No countdown. The price is shown plainly.” Do not promise that the price will never change.
- [ ] Keep the October 2026 target off the live sales page until the product, checkout, and delivery are actually ready. Avoid “available now” until then.

## 4. Open Objections Board (Idea #10)

- [ ] Add a visible FAQ/objections section near the price, with direct questions a cautious solo seller would ask. Use accessible disclosure/accordion controls or plain headings; answers must remain readable without interaction.
- [ ] Start with: “Will this upload my photos?” “What exactly does the $29 cover?” “Which computers can I use it on?” “Does it edit the product/photo or only prepare image files?” “What happens to GPS/device metadata?” “Can I try it before paying?” “How are updates and refunds handled?”
- [ ] Answer from verified product behavior and confirmed commercial terms only. For unresolved points, say the shop is not taking payment yet and the details will be published before checkout opens.
- [ ] Do not use fabricated buyer quotes, “customers ask us,” or testimonials. Label this as the founder's FAQ, not a customer-objection dataset.

## 5. Evidence-led sample/demo (Idea #5)

- [ ] Use one synthetic/staged ceramic mug batch as the demo case: front, side/handle, detail, scale reference, packaging. Label assets “synthetic demo images,” never customer work or authentic Etsy listing photos.
- [ ] Show only the actual after-capture workflow supported by the desktop code: add a batch, select Etsy Square (2000×2000), compare Fit vs Fill, optionally set a mat/watermark, choose output folder, process/export, and report metadata scrubbing where the app exposes it.
- [ ] Do not imply the app photographs products, invents angles, removes backgrounds, retouches color, writes listings, predicts Etsy ranking, or guarantees sales. Do not recommend watermarks as an Etsy-growth tactic.
- [ ] Etsy's own guidance says listing photos should be at least 2000×2000 px and discusses thumbnail crop; Etsy also requires original images of the actual finished product, subject to limited exceptions. Treat generated examples as software test/demo material, not upload-ready listing photos. Sources: [Etsy image requirements](https://help.etsy.com/hc/en-us/articles/115015663347-Requirements-and-Best-Practices-for-Images-in-Your-Etsy-Shop?segment=selling), [Etsy listing image policy](https://www.etsy.com/ca/legal/policy/listing-image-requirements/253962679005).
- [ ] Keep this honest angle: “the repeatable final mile after the photos are already taken.” Seller posts found during research are anecdotes, not prevalence data or proof of product outcomes.

## 6. Short opening film (Idea #1)

- [ ] A vibe-coded animated teaser is feasible as a concept, but it must not pass off a browser mockup as a recording of the desktop app. Mark synthetic interface shots “Concept animation” until replaced with verified screen capture from a release build.
- [ ] Suggested 20-second cut: (0–4s) “Five photos. One repeatable last mile.” (4–9s) queue real sample photos and select Etsy Square; (9–14s) show Fit/Fill tradeoff and optional mat; (14–18s) show verified export and metadata result; (18–20s) “Listing Bench by Ownbench — $29 — checkout opening soon” (change CTA only after checkout works).
- [ ] Do not show fake speed numbers, fake completed orders, made-up testimonials, fabricated license keys, unverified privacy badges, or an invented “before/after” retouch.
- [ ] Replace demo artwork and UI with real assets/screens captured from the signed desktop build before publishing. Test the exact workflow on the release candidate first.

## Suggested files to update

- `src/components/Hero.tsx` — offer/availability language and CTA state.
- `src/components/CheckoutModal.tsx` — remove simulated transaction; gate until real checkout is connected.
- `src/components/PlainProof.tsx` — $29 and ownership receipt, with confirmed terms only.
- `src/components/Manifesto.tsx` — remove false urgency and unsupported comparisons.
- `src/components/LiveWorkbench.tsx` — identify as illustrative demo or link to the real desktop capture; don't imply it is the app.
- `src/components/SpecsheetModal.tsx` — remove “ready”/authoritative claims where the spec is aspirational rather than release-verified.
- `src/components/ObjectionsBoard.tsx` (new) — FAQ/objections if that keeps the existing components simpler.

## Definition of ready for owner review

- [ ] Search confirms no stale $39, old release date, fake checkout success, fake receipt, generated license key, or dead installer links remain on the public path.
- [ ] The $29 offer, checkout availability, product scope, and unresolved terms are clear on mobile and desktop.
- [ ] Every capability shown in screenshots/video matches the release candidate; synthetic assets are conspicuously labeled.
- [ ] Each FAQ answer has a source in the code/product/policy or is marked unresolved; no unsupported claims or invented social proof.
- [ ] Checkout, payment, download delivery, license issue/activation, support, refund, and tax/payout route are tested before switching the CTA to purchase.
- [ ] Return the changed-file list, unresolved owner decisions, and a preview link/screenshot for review. Do not publish.
