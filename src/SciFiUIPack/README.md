# Sci-Fi UI Pack — Rainbow Bolt Studio

A clean, production-ready sci-fi UI kit for Unity. Nine-sliced sprites, tintable icons,
a holographic UI shader, a one-click theme system, and drop-in components — built for
URP and Unity 6, documented, and ready to ship in your game.

---

## Quick start (about a minute)

1. **Import** this package into your project.
2. Run **`Rainbow Bolt ▸ Build Sci-Fi UI Pack`** from the menu bar.
   This imports the sprites with correct 9-slice borders, creates a theme + material,
   and builds a demo scene.
3. Open **`Demo/SciFiUIDemo.unity`** and press **Play**.

> First time using TextMeshPro in this project? Run
> **`Window ▸ TextMeshPro ▸ Import TMP Essential Resources`** once so text renders.

---

## Requirements

- **Unity 6 (6000.x)** or newer
- **Universal Render Pipeline (URP)** — the UI shader is also Built-in compatible
- **TextMeshPro** (ships with Unity; import Essentials once, as above)
- Works with both the legacy Input Manager and the Input System package. If you use the
  Input System package *only*, swap the demo's `Standalone Input Module` for an
  `Input System UI Input Module` (Unity will offer to do this for you).

---

## What's inside

| | |
|---|---|
| **17 sprites** | Buttons (4 states), panel, tooltip, status bar (bg + fill), input field, checkbox, toggle, tabs, divider, badge — all 9-sliced |
| **24 icons** | Monochrome, tint to any color: play, pause, settings, close, check, arrows, heart, shield, bolt, star, lock, bell, user, info, volume, trophy, map, and more |
| **1 shader** | `RainbowBolt/SciFiUI` — Canvas-compatible, with optional scanlines, edge glow and holo flicker |
| **Components** | `HoloButton`, `AnimatedBar`, `HoloPanel`, `ThemeApplier` + `UIThemeSO` |
| **Editor tools** | One-click builder, auto 9-slice importer, demo-scene generator, pack validator |
| **Demo scene** | A themed showcase wired up and ready to play |

---

## Components

- **HoloButton** — `Button` with smooth hover/press scale, an accent graphic that
  recolors on highlight, and optional hover/click sounds. Supports sprite-swap across
  the four button states out of the box.
- **AnimatedBar** — health/energy/progress bar that eases toward its value and recolors
  along a gradient. Drive it with `bar.SetValue(0.5f)`.
- **HoloPanel** — animated show/hide (scale + fade) on a `CanvasGroup`, using unscaled
  time so it works in paused menus. `panel.Open()` / `Close()` / `Toggle()`.
- **ThemeApplier + UIThemeSO** — one ScriptableObject holds your palette + font; put a
  `ThemeApplier` on your Canvas to recolor every themed component and TMP label at once.

See `Documentation/SciFiUIPack_Manual.md` for the full reference.

---

## Theming

Create a theme via **`Create ▸ Rainbow Bolt ▸ Sci-Fi UI Theme`** (the builder also makes
one for you at `Theme/SciFiTheme.asset`). Adjust the colors, then add a `ThemeApplier`
to your Canvas and assign the theme. Right-click the component ▸ **Apply Theme**, or it
applies automatically on enable.

## 9-slice

You never need to hand-slice anything — every sprite's border is applied automatically
on import from `sprite_meta.json`. Use `Image.Type = Sliced` (the demo already does).

---

## Support & license

- Questions or requests: **hello@rainbowbolt.studio**
- Distributed under the **Unity Asset Store EULA**. See `LICENSE.md`.
- Third-party + AI-content disclosure: see `Third-Party-Notices.md`.

© 2026 Rainbow Bolt Studio
