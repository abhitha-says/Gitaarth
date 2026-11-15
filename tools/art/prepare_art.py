#!/usr/bin/env python3
"""Prepare one piece of artwork for the site.

    python3 -I tools/art/prepare_art.py --slot krishna-standing --src picture.png \
        [--crop x0,y0,x1,y1] [--focus x,y] [--max 1800] [--standin]

Writes  frontend/public/img/art/<slot>.webp      the picture (alpha kept when present)
        frontend/public/img/art/<slot>.map.webp  R = depth (white near), G = wind, B = 0
and updates frontend/src/scene/artMeta.json (other slots are left alone).

Source pictures:
  * a transparent PNG: its alpha is used, trimmed to the alpha box plus padding;
  * a picture on a flat pale background: kept opaque, nothing is cut out;
  * anything else that needs cutting out: pass --cutout birefnet (runs the
    BiRefNet matting model) and, if other things survive, --keep-largest and
    --erase x0,y0,x1,y1 (fractions of the cropped picture).

Models are optional and looked for in $GITAARTH_MODELS (default
~/.cache/gitaarth-work/models); without them the script falls back to a
"pillow" depth from the alpha, a vertical gradient for opaque pictures, and
Lanczos x2 upscaling. Models are tools only; they are never shipped.
Run with `python3 -I` when models are present (they are downloaded data).
Only PIL, numpy, scipy, cv2 and onnxruntime are used.
"""
import sys
import site

if site.getusersitepackages() not in sys.path:
    sys.path.append(site.getusersitepackages())

import argparse
import json
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parents[2]
ART_DIR = ROOT / 'frontend' / 'public' / 'img' / 'art'
META = ROOT / 'frontend' / 'src' / 'scene' / 'artMeta.json'
MODELS = Path(os.environ.get('GITAARTH_MODELS', Path.home() / '.cache' / 'gitaarth-work' / 'models'))
MODEL_FILES = {
    'birefnet': MODELS / 'birefnet' / 'BiRefNet-general-epoch_244.onnx',
    'birefnet-lite': MODELS / 'birefnet-lite' / 'BiRefNet-general-bb_swin_v1_tiny-epoch_232.onnx',
    'isnet-anime': MODELS / 'isnet-anime' / 'isnet-anime.onnx',
    'isnet-general-use': MODELS / 'isnet-general-use' / 'isnet-general-use.onnx',
    'depth': MODELS / 'depth-v2-small' / 'model.onnx',
    'esrgan': MODELS / 'realesrgan-x4plus' / 'real_esrgan_x4plus-onnx-float' / 'real_esrgan_x4plus.onnx',
    'swin2sr': MODELS / 'swin2sr-x2' / 'model.onnx',
}
MAP_SIZE = 512


def log(*a):
    print('[prepare_art]', *a, flush=True)


def fractions(text, n):
    vals = [float(v) for v in text.split(',')]
    if len(vals) != n or not all(-0.001 <= v <= 1.001 for v in vals):
        raise argparse.ArgumentTypeError(f'expected {n} comma-separated fractions 0..1, got {text!r}')
    return vals


def session(name):
    path = MODEL_FILES[name]
    if not path.exists():
        return None
    try:
        import onnxruntime as ort
    except ImportError:
        return None
    opts = ort.SessionOptions()
    opts.intra_op_num_threads = os.cpu_count() or 4
    opts.enable_cpu_mem_arena = False   # big models: keep peak memory down
    opts.enable_mem_pattern = False
    return ort.InferenceSession(str(path), opts, providers=['CPUExecutionProvider'])


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def norm01(x, mask=None):
    v = x[mask] if mask is not None and mask.any() else x
    lo, hi = np.percentile(v, 1), np.percentile(v, 99)
    return np.clip((x - lo) / max(hi - lo, 1e-6), 0, 1)


def resize_f(arr, size, resample=Image.LANCZOS):
    """Resize a float array (H, W) or (H, W, C) in 0..1 to size=(w, h)."""
    if arr.ndim == 2:
        return np.asarray(Image.fromarray(arr.astype(np.float32), 'F').resize(size, resample))
    return np.stack([resize_f(arr[..., c], size, resample) for c in range(arr.shape[2])], -1)


# ---------------------------------------------------------------- cut-out ---

def cutout_alpha(rgb, name):
    """Foreground matte (H, W) in 0..1 from a BiRefNet or ISNet model, or None.
    BiRefNet (full) needs ~6 GB of free RAM, the lite one ~4.5 GB, ISNet ~2 GB."""
    sess = session(name)
    if sess is None and name == 'birefnet':
        sess = session('birefnet-lite')
    if sess is None:
        return None
    inp = sess.get_inputs()[0]
    side = inp.shape[2] if isinstance(inp.shape[2], int) else 1024
    h, w = rgb.shape[:2]
    x = resize_f(rgb, (side, side), Image.BICUBIC)
    isnet = name.startswith('isnet')
    if isnet:   # DIS / ISNet preprocessing (as in rembg)
        x = x / max(float(x.max()), 1e-6) - 0.5
    else:
        x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    out = sess.run(None, {inp.name: x.transpose(2, 0, 1)[None].astype(np.float32)})[0]
    m = np.squeeze(out[0, 0] if out.ndim == 4 else out).astype(np.float32)
    if isnet:
        m = (m - m.min()) / max(float(m.max() - m.min()), 1e-6)
    elif m.min() < 0 or m.max() > 1:
        m = 1 / (1 + np.exp(-m))
    return np.clip(resize_f(m, (w, h), Image.BICUBIC), 0, 1)


def remove_halo(rgb, alpha, cx, cy, r_in, r_out, y_cut, protect=None, band='strict'):
    """Remove a nimbus (pale glow disc and ornamented gold ring) behind a head.
    Inside the circle (cx, cy, r_out) and above y_cut: pale cream pixels go, and in
    the ring band (r > r_in) everything that is not cool-coloured (skin, feathers)
    or dark (hair) goes. Holes inside the figure are filled back. cx, r_in, r_out
    are fractions of the picture width, cy and y_cut of its height.
    band='soft' only removes pale gold in the ring band (keeps a bow or a crown
    that crosses the ring); `protect` (bool mask) is never touched."""
    import cv2
    h, w = alpha.shape
    hsv = cv2.cvtColor(to_u8(rgb), cv2.COLOR_RGB2HSV).astype(np.float32)
    hue, sat, val = hsv[..., 0] * 2, hsv[..., 1] / 255, hsv[..., 2] / 255
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.hypot(xx - cx * w, yy - cy * h)
    zone = (r < r_out * w) & (yy < y_cut * h)
    if protect is not None:
        zone &= ~protect
    cool = (hue > 70) & (hue < 270) & (sat > 0.15)
    dark = val < 0.42
    lavender = (hue > 180) & (hue < 300) & (sat > 0.07)
    pale = (sat < 0.38) & (val > 0.80) & ~lavender & (((hue >= 30) & (hue <= 70)) | (sat < 0.12))
    if band == 'soft':
        ring = (hue >= 28) & (hue <= 65) & (val > 0.70) & (sat < 0.62) & ~cool & ~dark
    else:
        ring = ~cool & ~dark
    remove = zone & (pale | ((r > r_in * w) & ring))
    fig = (alpha > 0.5) & ~remove
    fig = ndi.binary_opening(fig, iterations=1)
    lab, n = ndi.label(fig)
    if n > 1:
        fig = lab == 1 + int(np.argmax(ndi.sum(fig, lab, range(1, n + 1))))
    fig = ndi.binary_fill_holes(ndi.binary_closing(fig, iterations=2))
    soft = ndi.gaussian_filter(fig.astype(np.float32), 1.0)
    return np.where(zone, alpha * soft, alpha)


def erase_mask(rgb, rects, warm_rects, pale_rects=()):
    """Soft-edged mask (1 = remove) from rectangles given as fractions."""
    import cv2
    h, w = rgb.shape[:2]
    m = np.zeros((h, w), np.float32)
    hsv = cv2.cvtColor(to_u8(rgb), cv2.COLOR_RGB2HSV).astype(np.float32)
    hue, sat, val = hsv[..., 0] * 2, hsv[..., 1] / 255, hsv[..., 2] / 255
    warm = ~(((hue > 70) & (hue < 300) & (sat > 0.12)) | (val < 0.42))
    pale = (((hue >= 32) & (hue <= 70) & (sat < 0.62)) | (sat < 0.12)) & (val > 0.70)
    jobs = [(r, None) for r in rects] + [(r, warm) for r in warm_rects] + [(r, pale) for r in pale_rects]
    for (x0, y0, x1, y1), sel in jobs:
        sl = (slice(int(y0 * h), int(round(y1 * h))), slice(int(x0 * w), int(round(x1 * w))))
        m[sl] = np.maximum(m[sl], 1 if sel is None else sel[sl].astype(np.float32))
    return np.clip(ndi.gaussian_filter(m, max(1.0, 0.004 * max(h, w))), 0, 1)


def keep_largest(alpha):
    lab, n = ndi.label(alpha > 0.5)
    if n <= 1:
        return alpha
    sizes = ndi.sum(np.ones_like(lab), lab, range(1, n + 1))
    keep = lab == (1 + int(np.argmax(sizes)))
    # keep the soft edge that belongs to the kept piece, drop everything else
    near = ndi.binary_dilation(keep, iterations=4)
    return alpha * near


def refine_alpha(alpha, erode, feather):
    """Shrink the matte slightly and soften it, which removes pale fringes."""
    if erode > 0:
        alpha = ndi.grey_erosion(alpha, size=(2 * erode + 1, 2 * erode + 1))
    if feather > 0:
        alpha = ndi.gaussian_filter(alpha, feather)
    a = np.clip(alpha, 0, 1)
    a[a < 0.015] = 0
    return a


def decontaminate(rgb, alpha):
    """Edge pixels take the colour of the nearest solid pixel, so no background
    colour (checkerboard, glow, white) is left in the semi-transparent rim."""
    solid = alpha > 0.97
    if not solid.any() or solid.all():
        return rgb
    _, (iy, ix) = ndi.distance_transform_edt(~solid, return_indices=True)
    inner = rgb[iy, ix]
    w = smoothstep(0.97, 0.5, alpha)[..., None]
    return rgb * (1 - w) + inner * w


def trim(rgb, alpha, pad_frac):
    ys, xs = np.nonzero(alpha > 0.02)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    pad = int(round(pad_frac * max(y1 - y0, x1 - x0)))
    h, w = y1 - y0 + 2 * pad, x1 - x0 + 2 * pad
    out_rgb = np.zeros((h, w, 3), np.float32)
    out_a = np.zeros((h, w), np.float32)
    out_rgb[pad:pad + y1 - y0, pad:pad + x1 - x0] = rgb[y0:y1, x0:x1]
    out_a[pad:pad + y1 - y0, pad:pad + x1 - x0] = alpha[y0:y1, x0:x1]
    # fill the transparent area with nearby colour so resampling never pulls in black
    solid = out_a > 0.5
    if solid.any():
        _, (iy, ix) = ndi.distance_transform_edt(~solid, return_indices=True)
        out_rgb = np.where(solid[..., None], out_rgb, out_rgb[iy, ix])
    return out_rgb, out_a, (x0 - pad, y0 - pad, w, h)


# --------------------------------------------------------------- upscale ---

def tiled(rgb, fn, scale, tile, overlap, fixed):
    """Run fn on overlapping tiles and blend the results with soft weights."""
    h, w = rgb.shape[:2]
    out = np.zeros((h * scale, w * scale, 3), np.float32)
    wsum = np.zeros((h * scale, w * scale, 1), np.float32)
    step = tile - 2 * overlap
    ramp = np.minimum(np.arange(tile * scale) + 1, np.arange(tile * scale)[::-1] + 1)
    ramp = np.clip(ramp / (overlap * scale + 1e-6), 0.05, 1.0).astype(np.float32)
    for y in range(0, max(h - 2 * overlap, 1), step):
        for x in range(0, max(w - 2 * overlap, 1), step):
            y0, x0 = min(y, max(h - tile, 0)), min(x, max(w - tile, 0))
            patch = rgb[y0:y0 + tile, x0:x0 + tile]
            ph, pw = patch.shape[:2]
            if fixed and (ph < tile or pw < tile):
                patch = np.pad(patch, ((0, tile - ph), (0, tile - pw), (0, 0)), mode='reflect')
            res = fn(patch)[:ph * scale, :pw * scale]
            wt = (ramp[:ph * scale, None] * ramp[None, :pw * scale])[..., None]
            out[y0 * scale:(y0 + ph) * scale, x0 * scale:(x0 + pw) * scale] += res * wt
            wsum[y0 * scale:(y0 + ph) * scale, x0 * scale:(x0 + pw) * scale] += wt
    return out / np.maximum(wsum, 1e-6)


def upscale_model(rgb, name):
    sess = session(name)
    if sess is None:
        return None, 1
    inp = sess.get_inputs()[0]
    if name == 'esrgan':
        scale, tile, fixed = 4, 128, True
    else:
        scale, tile, fixed = 2, 96, False   # Swin2SR: ~2.2 GB of RAM at 96 px, ~3.8 GB at 128

    def fn(p):
        ph, pw = p.shape[:2]
        if not fixed:  # Swin2SR wants multiples of its window (8)
            p = np.pad(p, ((0, (-ph) % 8), (0, (-pw) % 8), (0, 0)), mode='reflect')
        y = sess.run(None, {inp.name: p.transpose(2, 0, 1)[None].astype(np.float32)})[0][0]
        return np.clip(y.transpose(1, 2, 0), 0, 1)

    return tiled(rgb, fn, scale, tile, 16, fixed), scale


def unsharp(rgb, radius, amount):
    blur = ndi.gaussian_filter(rgb, (radius, radius, 0))
    return np.clip(rgb + amount * (rgb - blur), 0, 1)


def upscale(rgb, alpha, target_long, method):
    """Returns rgb, alpha and the method actually used."""
    h, w = rgb.shape[:2]
    if method == 'none' or max(h, w) >= target_long * 0.9:
        return rgb, alpha, 'none'
    order = {'auto': ['swin2sr', 'esrgan', 'lanczos'], 'swin2sr': ['swin2sr', 'lanczos'],
             'esrgan': ['esrgan', 'lanczos'], 'lanczos': ['lanczos']}[method]
    for m in order:
        if m == 'lanczos':
            up = unsharp(resize_f(rgb, (w * 2, h * 2)), 1.2, 0.35)
            scale = 2
        else:
            up, scale = upscale_model(rgb, m)
            if up is None:
                continue
        up_a = np.clip(resize_f(alpha, (w * scale, h * scale)), 0, 1)
        return up, up_a, m
    return rgb, alpha, 'none'


# ----------------------------------------------------------------- depth ---

def depth_model(rgb, alpha):
    sess = session('depth')
    if sess is None:
        return None
    h, w = rgb.shape[:2]
    base = rgb if alpha is None else rgb * alpha[..., None] + np.array([0.98, 0.96, 0.92]) * (1 - alpha[..., None])
    s = 518 / max(h, w)
    dw, dh = max(14, int(round(w * s / 14)) * 14), max(14, int(round(h * s / 14)) * 14)
    x = (resize_f(base, (dw, dh), Image.BICUBIC) - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    inp = sess.get_inputs()[0]
    d = np.squeeze(sess.run(None, {inp.name: x.transpose(2, 0, 1)[None].astype(np.float32)})[0])
    return d.astype(np.float32)  # relative inverse depth: larger is nearer


def pillow_depth(mask):
    d = ndi.distance_transform_edt(mask)
    d = np.sqrt(d / max(d.max(), 1e-6))
    return ndi.gaussian_filter(d, max(mask.shape) / 80)


def make_depth(rgb, alpha, size, use_model):
    """Depth at map size (w, h): 1 = nearest to the viewer."""
    w, h = size
    a = None if alpha is None else np.clip(resize_f(alpha, size), 0, 1)
    raw = depth_model(rgb, alpha) if use_model else None
    used = 'depth-anything-v2-small' if raw is not None else None
    if raw is not None:
        raw = resize_f(raw, size, Image.BICUBIC)
    if a is None:
        if raw is None:
            used = 'gradient'
            return np.tile(np.linspace(0.15, 1.0, h, dtype=np.float32)[:, None], (1, w)), used
        return norm01(raw), used
    mask = a > 0.5
    pil = pillow_depth(mask)
    if raw is None:
        d, used = pil, 'pillow'
    else:
        d = 0.65 * norm01(raw, mask) + 0.35 * pil
    d = 0.08 + 0.92 * norm01(d, mask)
    # outside the figure: carry the nearest edge value outward, slightly further away,
    # so displacement near the silhouette never tears
    if mask.any() and not mask.all():
        dist, (iy, ix) = ndi.distance_transform_edt(~mask, return_indices=True)
        d = np.where(mask, d, d[iy, ix] * np.exp(-dist / (0.08 * max(w, h))))
    return np.clip(ndi.gaussian_filter(d, 1.2), 0, 1).astype(np.float32), used


# ------------------------------------------------------------------ wind ---

def make_wind(rgb, alpha, size, focus, wind_from, face_radius, gain):
    """Soft mask of what may sway: saturated saffron / yellow / red cloth, toward
    the silhouette and the lower ends. Skin and the face zone are always zero."""
    import cv2
    w, h = size
    small = np.clip(resize_f(rgb, size, Image.BILINEAR), 0, 1)
    hsv = cv2.cvtColor((small * 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
    hue, sat, val = hsv[..., 0] * 2, hsv[..., 1] / 255, hsv[..., 2] / 255  # hue in degrees
    warm = ((hue <= 58) | (hue >= 330)).astype(np.float32)
    colour = warm * smoothstep(0.42, 0.68, sat) * smoothstep(0.30, 0.50, val)
    skin = ((hue >= 5) & (hue <= 40)).astype(np.float32) * smoothstep(0.62, 0.48, sat) * (val > 0.3)
    colour *= 1 - skin
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    vertical = smoothstep(wind_from, min(wind_from + 0.3, 1.0), yy / h)
    fx, fy = focus[0] * w, focus[1] * h
    r = face_radius * h
    face = ((xx - fx) / (0.8 * r)) ** 2 + ((yy - fy) / r) ** 2 < 1.0
    above = yy < fy + r  # nothing at or above the face sways
    if alpha is not None:
        a = np.clip(resize_f(alpha, size), 0, 1)
        inside = a > 0.5
        dist = ndi.distance_transform_edt(inside)
        edge = 0.35 + 0.65 * smoothstep(0.10 * w, 0.0, dist)
        colour *= edge * (a > 0.2)
    else:
        colour *= 0.6
    wind = colour * vertical
    if face_radius <= 0:   # no face in the picture (e.g. the feet): nothing to protect
        face[:] = False
        above[:] = False
    wind[face | above] = 0
    wind = ndi.grey_opening(wind, size=(3, 3))           # drop speckles (jewels, sparkles)
    wind = ndi.gaussian_filter(wind, max(w, h) / 110)   # soft edges
    wind = np.clip(wind * gain, 0, 1)
    if face_radius > 0:
        wind[face] = 0
        wind[(yy < fy + 0.6 * r)] = 0
    return wind.astype(np.float32)


# ---------------------------------------------------------------- output ---

def to_u8(x):
    return (np.clip(x, 0, 1) * 255 + 0.5).astype(np.uint8)


def save_webp(img, path, quality):
    img.save(path, 'WEBP', quality=quality, method=6)


def update_meta(slot, entry):
    meta = {}
    if META.exists() and META.read_text().strip():
        meta = json.loads(META.read_text())
    meta[slot] = entry
    META.parent.mkdir(parents=True, exist_ok=True)
    tmp = META.with_suffix('.json.tmp')
    tmp.write_text(json.dumps(dict(sorted(meta.items())), indent=2) + '\n')
    tmp.replace(META)


def guess_focus(alpha):
    """Rough default for a figure: the centre of the head (top tenth of the silhouette)."""
    if alpha is None:
        return 0.5, 0.45
    ys, xs = np.nonzero(alpha > 0.5)
    top, bottom = ys.min(), ys.max()
    band = ys < top + 0.12 * (bottom - top)
    h, w = alpha.shape
    return float(np.median(xs[band]) / w), float((top + 0.08 * (bottom - top)) / h)


def preview(path, rgb, alpha, depth, wind):
    """Side-by-side check image: picture on ivory and on dark grey, depth, wind."""
    h = 512
    s = h / rgb.shape[0]
    size = (max(1, int(rgb.shape[1] * s)), h)
    p = resize_f(rgb, size)
    a = np.ones(size[::-1], np.float32) if alpha is None else resize_f(alpha, size)
    ivory = p * a[..., None] + np.array([0.984, 0.969, 0.933]) * (1 - a[..., None])
    dark = p * a[..., None] + 0.25 * (1 - a[..., None])
    d = np.repeat(resize_f(depth, size)[..., None], 3, -1)
    wd = resize_f(wind, size)
    wv = ivory * 0.5 + np.stack([wd, wd * 0.2, wd * 0.2], -1) * 0.8
    Image.fromarray(to_u8(np.concatenate([ivory, dark, d, wv], 1))).save(path)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--slot', required=True, help='slot name, e.g. krishna-standing')
    ap.add_argument('--src', required=True, type=Path)
    ap.add_argument('--crop', type=lambda t: fractions(t, 4), help='x0,y0,x1,y1 fractions of the source')
    ap.add_argument('--focus', type=lambda t: fractions(t, 2), help='x,y fractions of the output')
    ap.add_argument('--max', type=int, default=1800, help='longest side of the output picture')
    ap.add_argument('--standin', action='store_true', help='mark the slot as a stand-in')
    ap.add_argument('--cutout', default='none',
                    choices=['none', 'birefnet', 'birefnet-lite', 'isnet-anime', 'isnet-general-use'],
                    help='cut the subject out of an opaque picture with a BiRefNet model')
    ap.add_argument('--save-cutout', type=Path, help='also save the cut-out (source resolution) as PNG')
    ap.add_argument('--save-upscaled', type=Path,
                    help='also save the final picture as a lossless PNG (a source for close-up slots)')
    ap.add_argument('--erase', action='append', type=lambda t: fractions(t, 4), default=[],
                    help='x0,y0,x1,y1 (fractions of the cropped picture) to make transparent; repeatable')
    ap.add_argument('--halo-band', choices=['strict', 'soft'], default='strict',
                    help='strict: everything warm in the ring band goes; soft: only pale gold')
    ap.add_argument('--protect', action='append', type=lambda t: fractions(t, 4), default=[],
                    help='x0,y0,x1,y1 (fractions of the cropped picture) that --halo never touches')
    ap.add_argument('--erase-warm', action='append', type=lambda t: fractions(t, 4), default=[],
                    help='like --erase, but only warm/pale pixels go (keeps blue skin, dark hair); repeatable')
    ap.add_argument('--erase-pale', action='append', type=lambda t: fractions(t, 4), default=[],
                    help='like --erase, but only pale glow (cream, pale gold, white) goes; repeatable')
    ap.add_argument('--keep-largest', action='store_true', help='keep only the largest opaque piece')
    ap.add_argument('--halo', type=lambda t: fractions(t, 5),
                    help='cx,cy,r_in,r_out,y_cut: remove a nimbus behind the head (see remove_halo)')
    ap.add_argument('--fade-bottom', type=float, default=0,
                    help='fade the alpha out over this bottom fraction of the cropped picture')
    ap.add_argument('--fade-top', type=float, default=0,
                    help='fade the alpha in over this top fraction of the cropped picture')
    ap.add_argument('--erode', type=int, default=1, help='alpha erosion in source pixels (fringe removal)')
    ap.add_argument('--feather', type=float, default=0.8, help='alpha blur sigma in source pixels')
    ap.add_argument('--pad', type=float, default=0.04, help='padding around the alpha box')
    ap.add_argument('--upscale', choices=['auto', 'swin2sr', 'esrgan', 'lanczos', 'none'], default='auto')
    ap.add_argument('--depth', choices=['auto', 'simple'], default='auto',
                    help='auto: Depth Anything V2 if present; simple: pillow / gradient only')
    ap.add_argument('--wind-from', type=float, default=0.45, help='height fraction where sway may begin')
    ap.add_argument('--face-radius', type=float, default=0.12, help='no-wind radius around focus (of height); 0 = no face in the picture')
    ap.add_argument('--wind-gain', type=float, default=1.6)
    ap.add_argument('--quality', type=int, default=86)
    ap.add_argument('--preview', type=Path, help='also write a check image here')
    args = ap.parse_args()

    src = Image.open(args.src)
    src.load()
    rgba = np.asarray(src.convert('RGBA'), np.float32) / 255
    rgb, alpha = rgba[..., :3], rgba[..., 3]
    has_alpha = 'A' in src.getbands() and (alpha < 0.98).mean() > 0.01
    if args.crop:
        H, W = alpha.shape
        x0, y0, x1, y1 = args.crop
        sl = (slice(int(y0 * H), int(round(y1 * H))), slice(int(x0 * W), int(round(x1 * W))))
        rgb, alpha = rgb[sl], alpha[sl]
    if args.cutout != 'none':
        matte = cutout_alpha(rgb, args.cutout)
        if matte is None:
            sys.exit(f'BiRefNet model not found at {MODEL_FILES[args.cutout]}')
        alpha = matte * alpha if has_alpha else matte
        has_alpha = True
    if args.halo and has_alpha:
        prot = np.zeros(alpha.shape, bool)
        for x0, y0, x1, y1 in args.protect:
            prot[int(y0 * prot.shape[0]):int(round(y1 * prot.shape[0])), int(x0 * prot.shape[1]):int(round(x1 * prot.shape[1]))] = True
        alpha = remove_halo(rgb, alpha, *args.halo, protect=prot, band=args.halo_band)
    if args.fade_bottom > 0 and has_alpha:
        h = alpha.shape[0]
        y = (np.arange(h) + 0.5) / h
        alpha = alpha * smoothstep(1.0, 1.0 - args.fade_bottom, y)[:, None]
    if args.fade_top > 0 and has_alpha:
        y = (np.arange(alpha.shape[0]) + 0.5) / alpha.shape[0]
        alpha = alpha * smoothstep(0.0, args.fade_top, y)[:, None]
    if has_alpha:
        h, w = alpha.shape
        alpha = alpha * (1 - erase_mask(rgb, args.erase, args.erase_warm, args.erase_pale))
        if args.keep_largest:
            alpha = keep_largest(alpha)
        alpha = refine_alpha(alpha, args.erode, args.feather)
        rgb = decontaminate(rgb, alpha)
        rgb, alpha, box = trim(rgb, alpha, args.pad)
        log(f'trim box in the cropped picture: x={box[0]} y={box[1]} w={box[2]} h={box[3]}')
        if args.save_cutout:
            Image.fromarray(np.dstack([to_u8(rgb), to_u8(alpha)]), 'RGBA').save(args.save_cutout)
    else:
        alpha = None
    log(f'{args.slot}: source part {rgb.shape[1]}x{rgb.shape[0]}, alpha={has_alpha}')

    a_in = alpha if alpha is not None else np.ones(rgb.shape[:2], np.float32)
    rgb, a_up, method = upscale(rgb, a_in, args.max, args.upscale)
    alpha = a_up if alpha is not None else None
    h, w = rgb.shape[:2]
    if max(h, w) > args.max:
        s = args.max / max(h, w)
        size = (max(1, round(w * s)), max(1, round(h * s)))
        rgb = np.clip(resize_f(rgb, size), 0, 1)
        alpha = None if alpha is None else np.clip(resize_f(alpha, size), 0, 1)
    h, w = rgb.shape[:2]
    log(f'upscale: {method}; output {w}x{h}')
    if args.save_upscaled:
        bands = [to_u8(rgb)] + ([] if alpha is None else [to_u8(alpha)])
        Image.fromarray(np.dstack(bands), 'RGBA' if alpha is not None else 'RGB').save(args.save_upscaled)

    focus = args.focus or guess_focus(alpha)
    if not args.focus:
        log(f'focus guessed at {focus[0]:.3f},{focus[1]:.3f}; pass --focus to set it')
    ms = MAP_SIZE / max(w, h)
    msize = (max(1, round(w * ms)), max(1, round(h * ms)))
    depth, dmethod = make_depth(rgb, alpha, msize, args.depth == 'auto')
    wind = make_wind(rgb, alpha, msize, focus, args.wind_from, args.face_radius, args.wind_gain)
    log(f'depth: {dmethod}; wind coverage {float((wind > 0.2).mean()):.3f}')

    ART_DIR.mkdir(parents=True, exist_ok=True)
    out = ART_DIR / f'{args.slot}.webp'
    out_map = ART_DIR / f'{args.slot}.map.webp'
    if alpha is not None:
        img = Image.fromarray(np.dstack([to_u8(rgb), to_u8(alpha)]), 'RGBA')
    else:
        img = Image.fromarray(to_u8(rgb), 'RGB')
    save_webp(img, out, args.quality)
    mp = np.dstack([to_u8(depth), to_u8(wind), np.zeros_like(to_u8(depth))])
    save_webp(Image.fromarray(mp, 'RGB'), out_map, 90)
    update_meta(args.slot, {
        'src': f'/img/art/{args.slot}.webp', 'map': f'/img/art/{args.slot}.map.webp',
        'w': w, 'h': h, 'alpha': alpha is not None,
        'focus': {'x': round(focus[0], 3), 'y': round(focus[1], 3)}, 'standIn': bool(args.standin),
    })
    if args.preview:
        preview(args.preview, rgb, alpha, depth, wind)
    log(f'wrote {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB), '
        f'{out_map.relative_to(ROOT)} ({out_map.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
