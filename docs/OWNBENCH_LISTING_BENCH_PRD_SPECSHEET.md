# Product Requirements Document (PRD) & Technical Specification Sheet
# Product: Ownbench Listing Bench (Version 1.0.x)
**Document Status:** Approved for Engineering Implementation  
**Target Release:** Q4 2026  
**Licensing & Pricing:** $39 One-Time Perpetual License (Version 1.x Scope)  
**Distribution:** Standalone Offline Binary (macOS Universal + Windows x64)  
**Security & Telemetry Posture:** Zero Network Calls, Air-Gapped Operation, Zero External Telemetry  

---

## 1. Executive Summary & Ground Truth Commitments

Ownbench Listing Bench is a native desktop utility engineered exclusively for solo online sellers (Etsy, eBay, Shopify, Amazon, and Poshmark merchants). It eliminates recurring subscription costs ($240–$360/year) and cloud latency by executing batch product photo formatting, aspect ratio conforming, watermark badging, and GPS privacy scrubbing directly on the seller's computer.

### The "Promises Made vs. Engineering Acceptance Criteria" Matrix

| Website Promise | Engineering Constraint / Target | Verification Test |
| :--- | :--- | :--- |
| **"42MB Native Binary (Zero Electron Bloat)"** | Installed binary disk size $\le 30\text{MB}$ (compressed download installer $\le 15\text{MB}$). No Chromium runtime. | Binary file size audit on macOS Universal `.dmg` and Windows `.msi`. |
| **"Launches in 300 Milliseconds"** | Cold start to interactive UI frame $\le 250\text{ms}$ on Apple Silicon M1 and Intel Core i5 (8th Gen). | Profiled cold-start benchmark via `time` / Windows Performance Recorder. |
| **"Under 45MB RAM Footprint"** | Peak idle memory consumption $\le 40\text{MB}$; peak batch processing RAM $\le 250\text{MB}$ (streaming buffers). | Process memory audit (RSS) in Activity Monitor and Task Manager. |
| **"100% Offline / Zero Cloud Leaks"** | Zero outbound UDP/TCP network sockets opened. Zero external DNS queries. | Wireshark and Little Snitch network packet capture during execution. |
| **"Offline License Activation"** | Cryptographic validation of perpetual license keys with zero internet access or phone-homes. | Activation test in airplane mode / severed Ethernet connection. |
| **"Processes 50 DSLR Photos in < 4s"** | Parallel SIMD pipeline downsampling 50 $\times$ 24MP (6000$\times$4000) JPEGs to 2000$\times$2000 in $\le 3.8\text{s}$. | Automated throughput benchmark suite on 8-core CPU. |
| **"Home Workshop EXIF Scrubber"** | Total removal of GPS coordinates, device serial numbers, and creator personal metadata. | `exiftool` inspection verifying zero residual GPS or device tags. |

---

## 2. Technical Architecture & Tech Stack Justifications

### 2.1 Core Framework Selection: Tauri v2 (Rust Backend + Native OS Webview)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Tauri v2 Desktop App                            │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ UI Layer (Webview: WKWebView on macOS / WebView2 on Windows)     │  │
│  │   • Tailwind CSS (Chalk #FAFAF6 / Deep Mat #0E3B2A)              │  │
│  │   • Virtualized Batch List (handles 1,000+ images smoothly)      │  │
│  │   • Live Preset / Matting / Watermark Preview Canvas             │  │
│  └──────────────────┬─────────────────────────────▲─────────────────┘  │
│                     │ IPC Command (Tauri Invoke)   │ Event Stream (Progress)
│  ┌──────────────────▼─────────────────────────────┴─────────────────┐  │
│  │ Rust Native Core                                                 │  │
│  │   ├── Licensing Module (Ed25519 Offline Signature Verifier)      │  │
│  │   ├── ThreadPool (Rayon work-stealing across CPU physical cores) │  │
│  │   ├── Image Pipeline (`fast_image_resize` SIMD AVX2/NEON)        │  │
│  │   ├── Metadata Module (`kamadak-exif` / `little_exif` scrubber)   │  │
│  │   └── File I/O Engine (Buffered batch writes to target disk)     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Rationale & Citations:
1. **Binary Size & Memory Efficiency**:  
   Electron applications bundle an entire Chromium browser and Node.js runtime, yielding installer payloads exceeding $120\text{MB}$ and baseline idle memory footprints of $140\text{–}200\text{MB}$ *(Source: Tauri Benchmarks, 2024)*. Tauri leverages the host operating system's pre-installed webview engine (`WKWebView` on macOS, `WebView2` on Windows), reducing final binary size to $\approx 12\text{MB}$ and idle RAM to $\approx 32\text{MB}$.
2. **Deterministic Memory Safety & Speed**:  
   Batch image processing requires intense CPU throughput. Rust guarantees zero garbage-collection pauses, predictable memory deallocation, and safe thread concurrency via borrow-checking.
3. **Distribution Simplicity**:  
   Compiles into a single statically linked binary with zero external dynamic runtime dependencies (no Python, no Node, no Java VM required).

---

### 2.2 Image Processing Engine: SIMD `fast_image_resize` + `rayon`

To deliver high-fidelity ecommerce visuals without artifacts while meeting the 4-second throughput benchmark, the pipeline uses hardware-accelerated SIMD downsampling.

#### Algorithm Selection: Lanczos3 & Catmull-Rom Resampling
- **Lanczos3 (Windowed Sinc, $a=3$)**: Applied for primary product heroes where edge sharpness and fine fabric/wood grain textures must remain razor-sharp without pixelation.
- **Catmull-Rom (Cubic Spline, $B=0, C=0.5$)**: Applied for fast batch thumbnail previews.

#### Benchmarks & Citations:
According to comprehensive image processing benchmarks *(Source: `fast_image_resize` performance benchmarks, Anton Veprev; libvips benchmark suite, John Cupitt)*:
- Traditional CPU convolution (`image-rs` standard filter): $\approx 42\text{ms}$ per 24MP image downscale.
- SIMD AVX2/NEON convolution (`fast_image_resize`): $\approx 7.2\text{ms}$ per 24MP image downscale ($\approx 5.8\times$ faster).
- Parallel processing across 8 CPU threads via `rayon` yields aggregate throughput of $\approx 65\text{ images/sec}$, easily satisfying the 50 images in $<4$ seconds benchmark.
- **Why not `libvips` C-bindings?**: While `libvips` is exceptionally fast, linking native C-libraries into Windows cross-compilation toolchains introduces DLL hell (`libglib-2.0.dll`, `libgobject-2.0.dll`) and frequent antivirus false-positives. Pure Rust with SIMD intrinsics achieves equivalent throughput while guaranteeing a single static binary.

---

### 2.3 Offline License Validation Architecture: Ed25519 (RFC 8032)

To fulfill the promise of **"Zero internet phone-homes / works 100% offline forever"**, Listing Bench implements public-key asymmetric digital signatures.

#### Key Structure & Cryptographic Protocol
1. **Server-Side License Issuer (Payment Webhook)**:
   - When a customer purchases a $39 license, the backend server signs a structured binary payload using an Ed25519 **Private Signing Key**:
     ```
     Payload = [
       MAGIC_BYTES (2 bytes: 0x4F, 0x42 "OB"),
       PRODUCT_ID  (1 byte:  0x01 "Listing Bench"),
       MAJOR_VER   (1 byte:  0x01 "v1.x"),
       TIMESTAMP   (4 bytes: UNIX timestamp uint32),
       LICENSEE_ID (4 bytes: CRC32 of purchaser email),
       TIER_FLAGS  (2 bytes: 0x0001 "Personal Solo Seller")
     ] (Total: 14 bytes)
     ```
   - The payload is signed with the 64-byte Ed25519 private key, producing a 64-byte signature.
   - The license key is encoded into an 18-character grouped base32 string:  
     `OB-LB1-XXXX-XXXX-XXXX`
2. **Client-Side Desktop Verifier (Listing Bench App)**:
   - The compiled desktop binary contains the hardcoded 32-byte **Public Verifying Key**.
   - When the user pastes their license key, the app decodes the base32 string and calls `ed25519_dalek::Verifier::verify(&payload, &signature)`.
   - **Verification Execution Time**: $\le 0.2\text{ms}$.
   - **Network Queries**: Exact zero ($0$). The computer can be in airplane mode in a Faraday cage; the mathematical signature proves authenticity without contacting any server.
   - **Version Scope Enforcer**: The verifier verifies `MAJOR_VER == 1`. All minor updates (`v1.1`, `v1.2`, `v1.9`) pass verification automatically. A future `v2.0` release would check `MAJOR_VER == 2`.

---

## 3. Detailed Functional Module Specifications

### 3.1 Module 1: File Ingestion & Drag-and-Drop Batch Queue

```
[Drag & Drop Surface / Folder Picker] 
     │
     ▼
[Rust Background Thread: File Scanner]
     │── Validates MIME headers: image/jpeg, image/png, image/webp, image/tiff
     │── Rejects corrupt files with inline warning
     └── Generates 120px micro-thumbnails into memory cache
```

- **Supported Input Formats**: JPEG, PNG, WebP, TIFF, HEIC (macOS native bridge).
- **Concurrency**: File ingestion must remain responsive up to 1,000 files in a single queue without UI freeze.
- **Queue Operations**: Re-order, select-all, remove selected, clear queue.

### 3.2 Module 2: Aspect Ratio & Dimensional Conforming

The engine centers and crops the product subject onto the target marketplace canvas:

| Marketplace Preset | Output Dimensions | Aspect Ratio | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **Etsy Square** | $2000 \times 2000\text{ px}$ | $1:1$ | Primary listing thumbnail |
| **eBay Standard** | $1600 \times 1600\text{ px}$ | $1:1$ | High-res zoom search results |
| **Shopify Collection** | $2048 \times 1536\text{ px}$ | $4:3$ | Catalog grid display |
| **Amazon Strict White** | $2000 \times 2000\text{ px}$ | $1:1$ | Pure `#FFFFFF` background compliance |
| **Social Showcase** | $1080 \times 1350\text{ px}$ | $4:5$ | Instagram / Pinterest product pin |
| **Custom Dimension** | User configurable ($200\text{–}6000\text{ px}$) | Custom | Specialty marketplaces |

- **Crop Alignment Options**: Center (Default), Top-Weighted (for fashion apparel), Custom Drag Anchor.
- **Canvas Expansion Modes**: 
  - *Fit with Border/Mat*: Scale image to fit inside target ratio without clipping; fill margins with selected background.
  - *Fill & Crop*: Scale image to completely fill canvas, trimming outer margins.

### 3.3 Module 3: Studio Matting & Background Fill

Solo sellers often shoot items with varying borders. Listing Bench provides instant clean matting:
- **Borderless**: Raw crop edge-to-edge.
- **Chalk Studio Mat (5%)**: Insets the photograph by $5\%$ with a clean $1\text{px}$ hairline border (`#CFE0D6` / `#24402F`).
- **Deep Mat (10%)**: Insets photograph by $10\%$ with a gallery-grade neutral border.
- **Custom Hex Background**: Allows setting exact pure white (`#FFFFFF`) required by Amazon listing guidelines.

### 3.4 Module 4: Maker Mark & Watermark Engine

Protects original photography from scrapers and unauthorized dropshipping clones:
- **Watermark Types**:
  - *Text Mode*: Custom maker text (e.g., `© Timber & Clay Studio`). Font selection (Public Sans, Bricolage Grotesque, System Monospace), size relative to canvas width ($1.5\text{–}4\%$).
  - *Image Stamp Mode*: User-uploaded transparent PNG maker logo.
- **Anchoring Quadrants**: Bottom-Right, Bottom-Left, Top-Right, Center Subtle Stamp.
- **Opacity Range**: $10\%\text{ to }100\%$ with high-contrast text backing scrim toggle to ensure legibility across bright and dark product surfaces.

### 3.5 Module 5: Privacy EXIF & GPS Metadata Scrubber

Every photograph taken on a modern iPhone or DSLR contains hidden Exchangeable Image File Format (EXIF) metadata. For solo crafters operating from home studios, publishing raw photos exposes their exact residence coordinates.

#### Scrubber Implementation:
- **Tags Completely Purged**:
  - `GPSLatitude`, `GPSLongitude`, `GPSAltitude`, `GPSTimeStamp`
  - `Make`, `Model`, `CameraSerialNumber`, `LensSerialNumber`
  - `Software`, `HostComputer`, `XPAuthor`
- **Tags Intentionally Preserved (Color Profile Integrity)**:
  - `ICC Color Profile` (sRGB IEC61966-2.1) — Critical! Stripping color profiles turns rich handcrafted ceramic glazes and leather tones washed-out or greenish in web browsers.
  - `Orientation` (Normalized prior to write to prevent sideways display).

---

## 4. Non-Functional Requirements & Performance Budgets

| Metric | Target Budget | Hard Cap (Release Blocker) |
| :--- | :--- | :--- |
| **Cold Start Time** | $\le 250\text{ ms}$ | $> 400\text{ ms}$ |
| **Installer Size (macOS DMG)** | $\le 14\text{ MB}$ | $> 25\text{ MB}$ |
| **Installer Size (Windows MSI)** | $\le 12\text{ MB}$ | $> 20\text{ MB}$ |
| **Baseline Idle Memory (RAM)** | $\le 35\text{ MB}$ | $> 50\text{ MB}$ |
| **Batch Throughput (50 DSLR Images)** | $\le 3.5\text{ s}$ | $> 5.0\text{ s}$ |
| **Outbound Network Requests** | Exactly $0$ | $> 0$ (Instant Failure) |
| **Crash Rate** | $< 0.01\%$ per 10k ops | $> 0.05\%$ |

---

## 5. User Interface & Brand Guidelines Alignment

The desktop application UI strictly mirrors the Ownbench Brand Guidelines implemented in the web storefront:

- **Canvas Background**: Chalk (`#FAFAF6`) in light mode; Deep Mat (`#0E3B2A` / `#0B1612`) in dark mode.
- **Structural Lines**: $1\text{px}$ Grid Line (`#CFE0D6` / `#24402F`).
- **Primary Action Buttons**: Mat Green (`#1F7A55`) with Chalk text and $6\text{px}$ flat corners (`border-radius: 6px`).
- **Single Highlight Rule**: Tape Yellow (`#F2C230`) is restricted to exactly **one** interactive visual anchor per view (e.g., the primary "Process Batch" button or active export progress indicator). Never use yellow for light-background text.
- **Zero-Pill Discipline**: All status indicators, file counts, and image dimensions are rendered as clean unboxed text separated by subtle typographic bullets (`·` or `/`).

---

## 6. Security, Privacy & Local Data Architecture

### 6.1 Storage Policy
- **No Cloud Database**: Listing Bench stores zero data in external databases.
- **Local Settings Store**: Application preferences (last-used preset, watermark text, default export folder) are stored in an unencrypted, human-readable JSON configuration file at:
  - macOS: `~/Library/Application Support/Ownbench/ListingBench/config.json`
  - Windows: `%APPDATA%\Ownbench\ListingBench\config.json`
- **License Persistence**: The activated Ed25519 license key and verification proof are stored in `config.json`. No proprietary obfuscation or invasive kernel-level DRM drivers.

### 6.2 Zero-Trust Security Guarantees
- The application executes inside standard OS user privileges. No administrative or root elevation required.
- File system access is scoped exclusively to the source folders selected by the user and the designated export destination.

---

## 7. Cross-Platform Build, Code Signing & Packaging Pipeline

### 7.1 macOS Build Pipeline
- **Target Architectures**: `aarch64-apple-darwin` (Apple Silicon M1–M4) and `x86_64-apple-darwin` (Intel).
- **Lipo Packaging**: Unified into a single Universal Binary via `lipo -create`.
- **Code Signing**: Signed via `codesign` using Apple Developer ID Application certificate.
- **Notarization**: Notarized via Apple `notarytool` to prevent Gatekeeper warnings on macOS Sonoma and Sequoia.
- **Output**: Drag-and-drop `.dmg` disk image.

### 7.2 Windows Build Pipeline
- **Target Architecture**: `x86_64-pc-windows-msvc`.
- **Code Signing**: Signed with standard Authenticode certificate via `signtool.exe`.
- **Output**: Clean, silent `.msi` Windows Installer and standalone portable `.exe`.

---

## 8. Test Plan & QA Acceptance Criteria

1. **Air-Gap Verification Test**:
   - Disconnect network interface card. Launch application.
   - Enter new license key `OB-LB1-XXXX-XXXX-XXXX`.
   - Verify license activates in $< 1\text{ms}$ with confirmation message.
2. **Batch Stress Test**:
   - Queue 200 Canon RAW/JPEG files ($24\text{MP}$ each, total $\approx 1.8\text{GB}$).
   - Set preset to *Etsy Square* + *Chalk Mat* + *Watermark* + *EXIF Scrub*.
   - Execute batch. Verify process finishes without memory leaks (RSS remains $< 350\text{MB}$ throughout).
3. **EXIF Leak Detection Test**:
   - Run `exiftool -all= -tagsFromFile source.jpg listing_bench_output.jpg`
   - Assert that GPS coordinates return `null` and device IDs are purged, while `ColorSpaceData` confirms `sRGB`.
4. **Visual Quality Diff Test**:
   - Compare downscaled image against reference Adobe Photoshop Bicubic Sharper output using Structural Similarity Index (SSIM).
   - Acceptance threshold: $\text{SSIM} \ge 0.985$.

---

## 9. Version 1.0 vs. Future Roadmap Scope

### What Version 1.0 Covers (Included in the $39 Purchase)
- Perpetual license for Version 1.x binaries.
- All 1.x point updates (bug fixes, OS compatibility updates, new marketplace aspect presets).
- Unlimited personal computer installations for the purchasing solo seller.

### Explicit Out-of-Scope Items for Version 1.0 (Non-Goals)
- Automatic background cloud syncing (violates the offline promise).
- AI background replacement (violates the $<45\text{MB}$ memory budget and introduces external model dependencies).
- Team collaboration seats / multi-user access (Ownbench is for solo makers).

---

## 10. Engineering Handover Sign-Off

This document constitutes the complete technical contract. Implementing this architecture guarantees 100% adherence to all promises made to customers on the Ownbench website.

**Next Immediate Steps for Engineering:**
1. Initialize repository with `cargo create-tauri-app --template react-ts`.
2. Implement `ed25519-dalek` signature verification module in `src-tauri/src/licensing.rs`.
3. Set up multi-threaded `fast_image_resize` pipeline in `src-tauri/src/processor.rs`.
4. Implement frontend interface adhering to Ownbench brand tokens in `src/`.
