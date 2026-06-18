# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Publisher monorepo for **Rainbow Bolt Studio**, a Unity Asset Store seller. Product #1 is
the **Sci-Fi UI Pack** (`src/SciFiUIPack/`), a themed UGUI kit targeting **URP + Unity 6.0
LTS** (compatibility floor: Unity 2022.3). Direction is driven by the market research in
`reference/` (favor themed UI kits / stylized VFX; avoid generic textures/icons/low-poly).

## Environment constraints (read first)

- **Unity is not installed in this dev environment, and there is no SVG→PNG converter.**
  Node + `@resvg/resvg-js` do all rasterization. C# **cannot be compiled here** — it is
  written against real Unity 6 / UGUI / TextMeshPro APIs and verified on the user's machine.
- Final Unity assembly (materials, prefabs, demo scene, `.unitypackage` export) happens in
  the user's Unity Editor, largely automated by the package's own Editor scripts.

## Commands

All tooling is Node, under `src/_Build/`:

```bash
cd src/_Build
npm install            # once — installs @resvg/resvg-js
node build.mjs         # regenerate ALL sprites + icons + sprite_meta.json into ../SciFiUIPack
node qa_sheet.mjs      # dev QA: dark-background contact sheets (qa_icons.png, qa_sprites.png)
node store.mjs         # render Asset Store marketing images into ../_Store/images
```

Visual QC of generated PNGs: read the file (icons are white-on-transparent — use
`qa_sheet.mjs`'s dark sheets, not the raw PNGs), or `sips -g pixelWidth -g pixelHeight -g hasAlpha <png>`.

Unity-side (on the user's machine), all via the menu bar:
- `Rainbow Bolt ▸ Build Sci-Fi UI Pack` — reimports sprites, creates theme + material, builds the demo scene
- `Rainbow Bolt ▸ Validate Pack` — asserts sprites imported, 9-slice borders applied, shader compiled
- `Rainbow Bolt ▸ Generate TMP Font (Orbitron)` — builds the SDF font asset

## Architecture — the asset pipeline

The art is **generated, not hand-drawn**. Do not hand-edit the PNGs/SVGs under
`src/SciFiUIPack/Sprites|Icons` — they are build artifacts. To change art, edit the
generator and re-run `node build.mjs`.

```
build.mjs  ──>  SVG sources (src/_Build/svg/**)  ──>  PNGs (src/SciFiUIPack/Sprites|Icons)
   │                                              └──>  sprite_meta.json  (9-slice borders)
   ▼ (encodes the locked design language: chamfered buttons, brackets, HUD ring, palette)
```

`sprite_meta.json` is the **contract** between the generator and Unity. On import,
`Editor/SpriteImportSettings.cs` (an `AssetPostprocessor`) reads it and applies sprite type,
pixels-per-unit, and the exact **9-slice border** — so sprites are never hand-sliced.
`Editor/PackMeta.cs` is the shared loader/locator for that file.

The package **ships scripts that build the binary assets**, rather than fragile `.unity` /
`.prefab` / `.mat` files. `Editor/PackBuilder.cs` (the `Build` menu) creates the material
from the shader, a `UIThemeSO` theme asset, and calls `Editor/DemoSceneBuilder.cs`, which
constructs the entire demo scene programmatically (Canvas, EventSystem, themed panel,
button, bar, icons) so it always references freshly-imported sprite GUIDs.

### Runtime design (`src/SciFiUIPack/Runtime/`)
- **Theming**: `UIThemeSO` (palette + font ScriptableObject) → `ThemeApplier` (put on a
  Canvas) pushes colors/font onto every child implementing the `IThemed` interface and every
  TMP label. New components participate by implementing `IThemed`.
- **Components**: `HoloButton` (extends UGUI `Button`), `AnimatedBar`, `HoloPanel`. All
  implement `IThemed`. Animations use **unscaled time** (work in paused menus).
- **Shader** (`Shaders/SciFiUI.shader`): built on Unity's UI-Default template (full stencil
  + 2D clip-rect, so it behaves inside masks/scroll views). All effects default to 0, so it
  is a safe drop-in that looks like `UI/Default` until dialed in.

### src ↔ Unity mapping
`src/SciFiUIPack/` mirrors the in-project path `Assets/RainbowBolt/SciFiUIPack/`. The repo
root `.gitignore` is the official Unity template — the root is intended to become (or host)
the Unity project. For a tight edit-debug loop, symlink the project's
`Assets/RainbowBolt/SciFiUIPack` to this repo's `src/SciFiUIPack` so edits here are live in
Unity.

## Conventions & gotchas

- **Brand palette is duplicated and must stay in sync**: the `C` object in `build.mjs` /
  `store.mjs` and the default colors in `Runtime/Theme/UIThemeSO.cs`. Base `#0F2E34`, green
  `#3FD98A`, blue `#34B7FF`, cyan `#7FE3FF`, spectrum `#FF5A5F→#9B6BFF`. Established in
  `docs/index.html`.
- Sprites are **textless and transparent** (labels come from TMP at runtime); icons are
  **monochrome `#fff`** so they tint per-context. `store.mjs` recolors icons by string-replacing `#fff`.
- In `store.mjs`, SVG text must be **XML-escaped** (`&` → `&amp;`; see `esc`), and resvg
  needs a font file to render text (Orbitron is loaded). `build.mjs` art is textless, so it needs no font.
- Commit Unity `.meta` files when they appear — Asset Store packages ship them for stable GUIDs.
- `Editor/` C# is gated to the Editor assembly (`RainbowBolt.SciFiUI.Editor.asmdef`,
  `includePlatforms: ["Editor"]`); both asmdefs reference `UnityEngine.UI` + `Unity.TextMeshPro`.

## Repo layout

| Path | Role | Shipped? |
|---|---|---|
| `src/SciFiUIPack/` | The Unity package (art, shader, C#, docs, font) | yes (`.unitypackage`) |
| `src/_Build/` | Node generators (`build.mjs`, `qa_sheet.mjs`, `store.mjs`) | no — dev only |
| `src/_Store/` | Marketing images (`images/`) + `listing.md` (store copy) | no — dev only |
| `docs/` | Publisher website (GitHub Pages) — the Asset Store's required "active website" | n/a |
| `reference/` | Market research | git-ignored |
| `for-sale/` | Packaged `.unitypackage` builds | git-ignored |

## Project state

Plan/roadmap lives at `~/.claude/plans/reference-compass-artifact-wf-0af97202-valiant-papert.md`.
Phase A (art pipeline, shader, components, Editor automation, docs) is complete. Phase B
(full sprite/icon/component breadth + 3 demo scenes) and Phase C (store images + listing +
submission) are in progress. User communicates in Chinese.
