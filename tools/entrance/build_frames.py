"""
Build the entrance film from a clean source video.

    python3 -I tools/entrance/build_frames.py

The entrance is one timeline of frames cut from the film, in the order the
visitor meets them: an arrival that plays on its own while the site loads,
then shots that the scroll runs forward and back. For every frame:
turn the picture upright, take out the burned-in title (rebuilt from its
surroundings), and write it at the film's full size with no grade, no
resize and no darkening:

  frontend/public/entrance/f/NNN.avif   every frame (AV1 still, crf 22)
  frontend/public/entrance/f/NNN.webp   every second frame, for browsers without AVIF
  frontend/public/entrance/hero[-tall].avif / .webp  the picture the entrance rests on (the Home hero),
                                         cut above the old title and upscaled 2x with Real-ESRGAN
  frontend/src/entrance/frames.json      the timeline the site reads

    python3 -I tools/entrance/build_frames.py --hero-only   rebuilds just the hero (about 8 minutes on CPU)

To replace the film, change SOURCES (and the times in SHOTS) and run again.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
DL = Path('/mnt/chromeos/MyFiles/Downloads')

# pre: ffmpeg filter that makes the picture upright; size after it.
# overlay: dark stretches where the burned-in title shows alone, and the box it sits in (x0, y0, x1, y1).
SOURCES = {
    'film': {
        'file': DL / 'IMG_9090.MP4', 'pre': 'transpose=2', 'size': (1280, 720),
        'overlay': {'dark': [(36.9, 37.85), (8.32, 8.5)], 'box': (440, 595, 840, 700)},
    },
}

# id, source, start s, end s, frames a second, phone focus x at start and end (0..1),
# share of the scroll (None for the arrival, which plays on the clock)
SHOTS = [
    ('arrive', 'film', 8.25, 12.62, 24, (0.50, 0.50), None),   # black, golden haze, the face comes out of it
    ('reveal', 'film', 12.71, 15.00, 12, (0.48, 0.52), 0.12),  # crown, discus and conch: he is all there
    ('finger', 'film', 24.00, 26.75, 12, (0.36, 0.44), 0.16),  # the discus spinning on a fingertip
    ('conch', 'film', 26.83, 29.75, 12, (0.62, 0.55), 0.16),   # Panchajanya in cloud
    ('ignite', 'film', 0.00, 5.42, 12, (0.44, 0.54), 0.24),    # the arm rises, the discus ignites
    ('form', 'film', 5.46, 8.17, 12, (0.50, 0.50), 0.18),      # through the dark: the whole four-armed form
    ('light', 'film', 22.00, 23.92, 12, (0.50, 0.50), 0.14),   # light floods from behind him
]
# The Home hero: the four-armed form, cut above the burned-in title. x, y, w, h in the upright frame.
HERO = ('film', 7.30, {'hero': (248, 0, 784, 588), 'hero-tall': (405, 0, 470, 588)})
# Spare close-ups, unused: chest gem 15.0-16.4, discus macro 16.5-18.4, garland 18.5-20.2, crown 20.3-21.9, eyes 29.8-30.9

AVIF_CRF = 22
WEBP_Q = 86
OUT = ROOT / 'frontend/public/entrance'
MANIFEST = ROOT / 'frontend/src/entrance/frames.json'


def decode(src, t0, t1=None, fps=None, frames=None):
    s = SOURCES[src]
    w, h = s['size']
    vf = ','.join(f for f in [s['pre'], f'fps={fps}' if fps else None] if f)
    cmd = ['ffmpeg', '-v', 'error', '-ss', f'{t0:.3f}']
    if t1 is not None:
        cmd += ['-to', f'{t1:.3f}']
    cmd += ['-i', str(s['file']), '-vf', vf]
    if frames:
        cmd += ['-frames:v', str(frames)]
    cmd += ['-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)


_masks = {}


def overlay_mask(src):
    """Where the burned-in title is: the static part of the dark frames, standing above their background."""
    if src not in _masks:
        o = SOURCES[src]['overlay']
        dark = np.concatenate([decode(src, a, b) for a, b in o['dark']]).astype(np.float32)
        lum = np.median(dark, axis=0).mean(axis=2)
        bg = cv2.medianBlur(np.clip(lum, 0, 255).astype(np.uint8), 31).astype(np.float32)
        x0, y0, x1, y1 = o['box']
        d = np.zeros_like(lum)
        d[y0:y1, x0:x1] = np.clip(lum - bg, 0, None)[y0:y1, x0:x1]
        m = (d / 220.0 > 0.03).astype(np.uint8)
        m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        _masks[src] = (m, (x0 - 40, y0 - 40, x1 + 40, min(y1 + 40, lum.shape[0])))
    return _masks[src]


def clean(rgb, src):
    if 'overlay' not in SOURCES[src]:
        return rgb
    m, (x0, y0, x1, y1) = overlay_mask(src)
    out = rgb.copy()
    band = np.ascontiguousarray(rgb[y0:y1, x0:x1])
    out[y0:y1, x0:x1] = cv2.inpaint(band, m[y0:y1, x0:x1], 5, cv2.INPAINT_TELEA)
    return out


def encode(png, stem, webp):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(png), '-c:v', 'libaom-av1', '-still-picture', '1',
                    '-crf', str(AVIF_CRF), '-cpu-used', '4', '-pix_fmt', 'yuv420p', f'{stem}.avif'], check=True)
    if webp:
        Image.open(png).save(f'{stem}.webp', 'WEBP', quality=WEBP_Q, method=4)


def upscale2x(rgb):
    """Real-ESRGAN x4 (tools/art, ONNX on CPU), brought back to 2x with Lanczos; plain Lanczos if the model is missing."""
    h, w = rgb.shape[:2]
    try:
        sys.path.insert(0, str(ROOT / 'tools/art'))
        import prepare_art
        up, _ = prepare_art.upscale_model(rgb.astype(np.float32) / 255, 'esrgan')
    except Exception as e:  # noqa: BLE001 - any failure falls back to plain resizing
        print(f'  Real-ESRGAN unavailable ({e}); using Lanczos', file=sys.stderr)
        up = None
    if up is None:
        return Image.fromarray(rgb).resize((w * 2, h * 2), Image.LANCZOS)
    return Image.fromarray((np.clip(up, 0, 1) * 255 + 0.5).astype(np.uint8)).resize((w * 2, h * 2), Image.LANCZOS)


def build_hero():
    src, t, crops = HERO
    frame = decode(src, t, frames=1)[0]
    with tempfile.TemporaryDirectory() as tmp:
        for name, (x, y, w, h) in crops.items():
            png = Path(tmp) / f'{name}.png'
            upscale2x(np.ascontiguousarray(frame[y:y + h, x:x + w])).save(png)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(png), '-c:v', 'libaom-av1', '-still-picture', '1',
                            '-crf', '20', '-cpu-used', '4', '-pix_fmt', 'yuv444p', str(OUT / f'{name}.avif')], check=True)
            Image.open(png).save(OUT / f'{name}.webp', 'WEBP', quality=90, method=5)
            print(f'{name:9s} {w * 2}x{h * 2}', file=sys.stderr)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--hero-only', action='store_true')
    if ap.parse_args().hero_only:
        build_hero()
        return
    fdir = OUT / 'f'
    if OUT.exists():
        shutil.rmtree(OUT)                        # the old frame folders go with it
    fdir.mkdir(parents=True)
    timeline, jobs, index = [], [], 0
    with tempfile.TemporaryDirectory() as tmp, ThreadPoolExecutor(os.cpu_count() or 4) as pool:
        for sid, src, t0, t1, fps, focus, share in SHOTS:
            frames = decode(src, t0, t1, fps)
            timeline.append({'id': sid, 'start': index, 'count': len(frames), 'fps': fps,
                             'focus': list(focus), 'share': share, 'from': t0, 'to': t1})
            for f in frames:
                png = Path(tmp) / f'{index:03d}.png'
                Image.fromarray(clean(f, src)).save(png, compress_level=1)
                jobs.append(pool.submit(encode, png, fdir / f'{index:03d}', index % 2 == 0))
                index += 1
            print(f'{sid:8s} {len(frames):3d} frames', file=sys.stderr)
        for j in jobs:
            j.result()
    build_hero()
    w, h = SOURCES[SHOTS[0][1]]['size']
    MANIFEST.write_text(json.dumps({
        'size': [w, h], 'count': index, 'webpStep': 2, 'shots': timeline,
        'source': SOURCES[SHOTS[0][1]]['file'].name, 'hero': HERO[1],
    }, indent=2) + '\n')
    total = sum(p.stat().st_size for p in OUT.rglob('*') if p.is_file())
    avif = sum(p.stat().st_size for p in OUT.rglob('*.avif'))
    print(f'{index} frames; avif {avif / 1e6:.1f} MB, all files {total / 1e6:.1f} MB', file=sys.stderr)


if __name__ == '__main__':
    main()
