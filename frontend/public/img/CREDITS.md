# Image credits

| File | Source | Licence |
| --- | --- | --- |
| `art/krishna-standing.webp`, `art/krishna-face.webp`, `art/krishna-feet.webp`, `art/rama-standing.webp` (and their `.map.webp`) | Stand-ins cut from `public/gitaarth-hero-divine.png`, the project owner's own picture | Owner's own work |
| `art/arjuna-kneeling.webp` (and its `.map.webp`) | Stand-in cut from `public/img/vishwaroop-wide.webp`, the project owner's own picture | Owner's own work |
| `art/mist-a.webp`, `art/mist-b.webp` | Generated procedurally by `tools/art/make_mist.py` (Fourier-domain fractal noise) | Made for this project |
| `vishwaroop-wide.webp`, `vishwaroop-portal.webp` | Project owner's own pictures | Owner's own work |

The stand-ins are marked `"standIn": true` in `src/scene/artMeta.json` and will be replaced by the owner's final pictures (see `IMAGE_PROMPTS.md`) through `tools/art/prepare_art.py`.

## Tools used to prepare artwork

These models were run locally (CPU, ONNX Runtime) while preparing the pictures. They are tools only; none of them is shipped with the site.

| Tool | Used for | Licence |
| --- | --- | --- |
| [IS-Net / DIS](https://github.com/xuebinqin/DIS) `isnet-general-use`, ONNX build from the [rembg releases](https://github.com/danielgatis/rembg/releases) | Cutting the figures out of the hero picture | Apache-2.0 (rembg: MIT) |
| [Depth Anything V2 Small](https://github.com/DepthAnything/Depth-Anything-V2), ONNX build [onnx-community/depth-anything-v2-small](https://huggingface.co/onnx-community/depth-anything-v2-small) | Depth channel of the `.map.webp` files | Apache-2.0 |
| [Swin2SR](https://github.com/mv-lab/swin2sr) classical x2, ONNX build [Xenova/swin2SR-classical-sr-x2-64](https://huggingface.co/Xenova/swin2SR-classical-sr-x2-64) | 2x upscaling of the stand-in figures | Apache-2.0 |
| [ONNX Runtime](https://github.com/microsoft/onnxruntime) | Running the models | MIT |

## Entrance film (stand-in, permission pending)

| Files | Source | Licence |
| --- | --- | --- |
| `entrance/f/*.avif`, `entrance/f/*.webp`, `entrance/hero.*` | Frames of an AI-made reel by the Instagram creator **@mahakaal.ai_** (`IMG_9090.MP4`, supplied by the project owner). Turned upright, burned-in title removed, otherwise unaltered | **Not cleared.** A stand-in for local development only: do not publish until the creator has given permission or the frames are replaced (`tools/entrance/build_frames.py`) |
