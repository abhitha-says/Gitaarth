#!/usr/bin/env python3
"""Generate the two ground-mist textures (no downloads, fully procedural).

    python3 tools/art/make_mist.py [--seed 7]

Writes frontend/public/img/art/mist-a.webp and mist-b.webp, 1536x768 each:
colour #fffdf8 everywhere, the mist lives in the alpha channel (0 .. ~0.85).
The noise is built in the Fourier domain, so it wraps seamlessly left to
right; it is stretched about 3:1 horizontally and fades to fully transparent
at the top and bottom edges.
  a: large, slow banks      b: finer, thinner wisps
"""
import sys
import site

if site.getusersitepackages() not in sys.path:
    sys.path.append(site.getusersitepackages())

import argparse
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
ART_DIR = ROOT / 'frontend' / 'public' / 'img' / 'art'
W, H = 1536, 768
COLOUR = (0xFF, 0xFD, 0xF8)


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def periodic_noise(rng, beta, cut_lo, cut_hi, stretch):
    """Fractal (1/f^beta) noise that wraps on both axes. Frequencies in cycles
    per pixel; features are `stretch` times wider than they are tall."""
    fy = np.fft.fftfreq(H)[:, None]
    fx = np.fft.rfftfreq(W)[None, :]
    k = np.sqrt((stretch * fx) ** 2 + fy ** 2)
    k[0, 0] = 1.0
    amp = k ** (-beta)
    amp *= 1 - np.exp(-(k / cut_lo) ** 2)        # no features larger than ~1/cut_lo
    amp *= np.exp(-(k / cut_hi) ** 2)            # nothing finer than ~1/cut_hi
    amp[0, 0] = 0
    spec = amp * (rng.normal(size=amp.shape) + 1j * rng.normal(size=amp.shape))
    n = np.fft.irfft2(spec, s=(H, W))
    return (n - n.mean()) / n.std()


def envelope(y0, peak0, peak1, y1):
    """Vertical fade: 0 at the top and bottom edges, full between peak0..peak1."""
    y = (np.arange(H) + 0.5) / H
    e = smoothstep(y0, peak0, y) * smoothstep(y1, peak1, y)
    e[0] = e[-1] = 0
    return e[:, None]


def mist_a(rng):
    n = periodic_noise(rng, 2.6, 1 / 1100, 1 / 50, 3.6)
    n += 0.22 * periodic_noise(rng, 1.7, 1 / 260, 1 / 14, 3.6)
    a = smoothstep(-1.3, 2.1, n) ** 1.4
    return a * envelope(0.03, 0.38, 0.72, 0.98)


def mist_b(rng):
    n = periodic_noise(rng, 1.8, 1 / 240, 1 / 6, 4.0)
    streak = smoothstep(-0.5, 1.9, n) ** 1.5       # thin drifting streaks
    body = smoothstep(-1.4, 1.4, periodic_noise(rng, 2.3, 1 / 900, 1 / 80, 3.0))
    a = streak * (0.4 + 0.6 * body)
    return a * envelope(0.05, 0.30, 0.80, 0.97)


def save(alpha, path, levels):
    a = np.clip(alpha / max(alpha.max(), 1e-6), 0, 1) * 0.85
    a8 = np.round(a * 255 / (256 // levels)) * (256 // levels)   # fewer levels compress far better
    rgba = np.empty((H, W, 4), np.uint8)
    rgba[..., :3] = COLOUR
    rgba[..., 3] = np.clip(a8, 0, 255).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').save(path, 'WEBP', quality=80, method=6)
    return path.stat().st_size


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--seed', type=int, default=7)
    ap.add_argument('--levels', type=int, default=64, help='alpha levels kept (fewer = smaller file)')
    args = ap.parse_args()
    ART_DIR.mkdir(parents=True, exist_ok=True)
    for name, fn, seed in (('mist-a', mist_a, args.seed), ('mist-b', mist_b, args.seed + 1)):
        size = save(fn(np.random.default_rng(seed)), ART_DIR / f'{name}.webp', args.levels)
        print(f'{name}.webp {W}x{H} {size // 1024} KB')


if __name__ == '__main__':
    main()
