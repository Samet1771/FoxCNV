# Third-Party Licenses

FoxCNV's own code is proprietary (see [`../LICENSE`](../LICENSE)). It is built on
open-source components whose licenses are reproduced here. This folder is shipped
with the installer to satisfy those licenses' notice requirements.

## How components are used

- **Rust crates** (the app's engine, e.g. `image`, `comrak`, `lopdf`, `symphonia`,
  `rav1e`, `hound`, `audiopus`) are statically compiled in. Their licenses are
  permissive (MIT / Apache-2.0 / BSD) or file-level copyleft (MPL-2.0), which do
  **not** affect FoxCNV's proprietary licensing.
- **FFmpeg** (added in a later milestone) is bundled as a **separate, unmodified
  `ffmpeg.exe`** and invoked as a child process — never linked into the app. We
  ship a **LGPL-only** build (no GPL `--enable-gpl` components such as x264/x265,
  and never `--enable-nonfree`). Per the FFmpeg license we will include here:
  - the LGPL v2.1 license text,
  - a link to the exact upstream source and the build/configure options used, and
  - the binary is kept user-replaceable (you may substitute your own `ffmpeg.exe`).

## Status

The bundled binary components (FFmpeg, OpenH264, etc.) are introduced in the
audio/video milestones. Their full license texts will be added to this folder
when those binaries are first included in a build. The Rust-crate license texts
are generated at build time via `cargo about` / `cargo deny` and collected here.

> Nothing here grants any right over FoxCNV itself. See the root `LICENSE`.
