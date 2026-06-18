# Unity-AssetStore — Rainbow Bolt Studio

Publisher monorepo for **Rainbow Bolt Studio**'s Unity Asset Store products.

## Layout

| Path | What |
|---|---|
| `docs/` | Publisher website (GitHub Pages) — the Asset Store's required "active website". |
| `src/SciFiUIPack/` | **Product #1 — Sci-Fi UI Pack.** Drop into a Unity project at `Assets/RainbowBolt/SciFiUIPack/`. |
| `src/_Build/` | Node asset generator (SVG → PNG + 9-slice meta). Dev-only, not shipped. |
| `src/_Store/` | Store-listing art & copy. Dev-only, not shipped. |
| `reference/` | Market research (git-ignored). |
| `for-sale/` | Packaged `.unitypackage` builds (git-ignored). |

## Regenerating the Sci-Fi UI Pack art

```bash
cd src/_Build
npm install        # once — installs @resvg/resvg-js
node build.mjs     # writes SVG sources, PNGs, and sprite_meta.json into ../SciFiUIPack
node qa_sheet.mjs  # optional: dark-background contact sheets for visual QA
```

## Using the pack in Unity

See [`src/SciFiUIPack/README.md`](src/SciFiUIPack/README.md). In short: create a URP
Unity 6 project, copy `SciFiUIPack` into `Assets/RainbowBolt/`, then run
**`Rainbow Bolt ▸ Build Sci-Fi UI Pack`** and open the demo scene.

© 2026 Rainbow Bolt Studio
