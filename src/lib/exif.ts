/**
 * A small, defensive JPEG/TIFF EXIF reader for the free photo check.
 *
 * It reads only what the check needs to report: whether GPS coordinates are
 * embedded, whether the camera identifies itself (make / model / serials),
 * which software wrote the file, and whether XMP or IPTC blocks ride along.
 * The bytes are the ones the browser already holds in memory; nothing here
 * touches the network.
 *
 * Every offset is bounds-checked and every loop is capped, so a malformed or
 * hostile file degrades to "could not read metadata" instead of throwing.
 */

export interface PhotoMeta {
  format: 'jpeg' | 'png' | 'webp' | 'other';
  hasExif: boolean;
  gps: boolean;
  gpsFields: string[];
  make: string | null;
  model: string | null;
  serial: string | null;
  lensSerial: string | null;
  software: string | null;
  captured: string | null;
  makerNote: boolean;
  xmp: boolean;
  iptc: boolean;
  tagCount: number;
}

const GPS_NAMES: Record<number, string> = {
  0x0000: 'GPSVersionID',
  0x0001: 'GPSLatitudeRef',
  0x0002: 'GPSLatitude',
  0x0003: 'GPSLongitudeRef',
  0x0004: 'GPSLongitude',
  0x0005: 'GPSAltitudeRef',
  0x0006: 'GPSAltitude',
  0x0007: 'GPSTimeStamp',
  0x001d: 'GPSDateStamp',
  0x001f: 'GPSHPositioningError',
};

export function emptyMeta(format: PhotoMeta['format'] = 'other'): PhotoMeta {
  return {
    format,
    hasExif: false,
    gps: false,
    gpsFields: [],
    make: null,
    model: null,
    serial: null,
    lensSerial: null,
    software: null,
    captured: null,
    makerNote: false,
    xmp: false,
    iptc: false,
    tagCount: 0,
  };
}

function ascii(view: DataView, start: number, length: number): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    const byte = view.getUint8(start + i);
    if (byte === 0) break;
    out += String.fromCharCode(byte);
  }
  return out;
}

type IfdKind = 'ifd0' | 'exif' | 'gps' | 'ifd1';

function readTiff(view: DataView, base: number, meta: PhotoMeta): void {
  if (base + 8 > view.byteLength) return;

  const byteOrder = view.getUint16(base);
  if (byteOrder !== 0x4949 && byteOrder !== 0x4d4d) return;
  const little = byteOrder === 0x4949;
  const u16 = (offset: number) => view.getUint16(offset, little);
  const u32 = (offset: number) => view.getUint32(offset, little);

  if (u16(base + 2) !== 0x2a) return;
  const ifd0 = u32(base + 4);
  if (!ifd0) return;

  const strings = new Map<number, string>();

  const visit = (relative: number, kind: IfdKind, depth: number): void => {
    if (depth > 3) return;
    const start = base + relative;
    if (start + 2 > view.byteLength) return;

    const count = Math.min(u16(start), 400);
    let next = 0;
    for (let i = 0; i < count; i += 1) {
      const entry = start + 2 + i * 12;
      if (entry + 12 > view.byteLength) return;

      const tag = u16(entry);
      const type = u16(entry + 2);
      const length = u32(entry + 4);
      meta.tagCount += 1;

      // Exif sub-IFD and GPS sub-IFD pointers.
      if (tag === 0x8769 || tag === 0x8825) {
        const sub = u32(entry + 8);
        if (sub) visit(sub, tag === 0x8825 ? 'gps' : 'exif', depth + 1);
        continue;
      }
      if (tag === 0x927c) {
        meta.makerNote = true;
        continue;
      }
      if (kind === 'gps') {
        const name = GPS_NAMES[tag];
        if (name && !meta.gpsFields.includes(name)) meta.gpsFields.push(name);
        continue;
      }
      if (type !== 2) continue; // ASCII only

      let valueStart = entry + 8;
      if (length > 4) {
        const pointer = u32(entry + 8);
        if (!pointer) continue;
        valueStart = base + pointer;
      }
      if (valueStart < 0 || valueStart + Math.min(length, 512) > view.byteLength) continue;

      const text = ascii(view, valueStart, Math.min(length, 512)).trim();
      if (text) strings.set(tag, text);
    }

    if (kind === 'ifd0') {
      const nextPointer = start + 2 + count * 12 + 4;
      if (nextPointer + 4 <= view.byteLength) next = u32(nextPointer);
    }
    if (next) visit(next, 'ifd1', depth + 1); // IFD1 = embedded thumbnail
  };

  visit(ifd0, 'ifd0', 0);

  meta.make = strings.get(0x010f) ?? null;
  meta.model = strings.get(0x0110) ?? null;
  meta.software = strings.get(0x0131) ?? null;
  meta.captured = strings.get(0x9003) ?? strings.get(0x0132) ?? null;
  meta.serial = strings.get(0xa431) ?? null;
  meta.lensSerial = strings.get(0xa435) ?? null;
  meta.gps = meta.gpsFields.length > 0 || meta.gpsFields.some((f) => f.startsWith('GPSLat'));
}

function scanJpeg(view: DataView, meta: PhotoMeta): void {
  let offset = 2;
  let guard = 0;
  while (offset + 4 <= view.byteLength && guard < 512) {
    guard += 1;
    if (view.getUint8(offset) !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = view.getUint8(offset + 1);
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    if (marker === 0xda || marker === 0xd9) break; // start of scan / end of image

    const length = view.getUint16(offset + 2);
    if (length < 2) break;
    const segmentStart = offset + 4;
    const segmentEnd = offset + 2 + length;
    if (segmentEnd > view.byteLength) break;

    if (marker === 0xe1) {
      // APP1: "Exif\0\0" payload, or an XMP packet.
      if (segmentEnd - segmentStart > 6 && ascii(view, segmentStart, 4) === 'Exif') {
        meta.hasExif = true;
        readTiff(view, segmentStart + 6, meta);
      } else if (segmentEnd - segmentStart > 4 && view.getUint8(segmentStart) === 0x3c) {
        meta.xmp = true;
      }
    } else if (marker === 0xed && ascii(view, segmentStart, 10) === 'Photoshop ') {
      meta.iptc = true;
    }

    offset = segmentEnd;
  }
}

function sniffFormat(view: DataView): PhotoMeta['format'] {
  if (view.byteLength < 12) return 'other';
  if (view.getUint8(0) === 0xff && view.getUint8(1) === 0xd8) return 'jpeg';
  if (view.getUint32(0) === 0x89504e47) return 'png';
  if (ascii(view, 0, 4) === 'RIFF' && ascii(view, 8, 4) === 'WEBP') return 'webp';
  return 'other';
}

export function readPhotoMeta(buffer: ArrayBuffer): PhotoMeta {
  const view = new DataView(buffer);
  const format = sniffFormat(view);
  const meta = emptyMeta(format);

  try {
    if (format === 'jpeg') {
      scanJpeg(view, meta);
    } else if (format === 'png') {
      // PNG carries EXIF in an eXIf chunk, if at all.
      const head = ascii(view, 0, Math.min(view.byteLength, 65536));
      meta.hasExif = head.includes('eXIf');
    } else if (format === 'webp') {
      const head = ascii(view, 0, Math.min(view.byteLength, 65536));
      meta.hasExif = head.includes('EXIF');
    }
  } catch {
    // A malformed file is not an error worth surfacing: report what we have.
  }

  meta.gps = meta.gpsFields.length > 0;
  return meta;
}

/** Camera name without repeating the make when the model already contains it. */
export function deviceName(meta: PhotoMeta): string | null {
  const make = meta.make?.trim();
  const model = meta.model?.trim();
  if (make && model) {
    return model.toLowerCase().startsWith(make.toLowerCase()) ? model : `${make} ${model}`;
  }
  return model ?? make ?? null;
}

/** Human summary of what would be stripped, in plain language. */
export function privacyFindings(meta: PhotoMeta): string[] {
  const findings: string[] = [];
  if (meta.gps) findings.push('GPS coordinates');
  if (meta.serial) findings.push('camera body serial');
  if (meta.lensSerial) findings.push('lens serial');
  if (meta.make || meta.model) {
    findings.push(`camera identity (${deviceName(meta) ?? 'make/model'})`);
  }
  if (meta.software) findings.push(`software tag (${meta.software})`);
  if (meta.captured) findings.push('capture timestamp');
  if (meta.makerNote) findings.push('maker note block');
  if (meta.xmp) findings.push('XMP block');
  if (meta.iptc) findings.push('IPTC block');
  return findings;
}
