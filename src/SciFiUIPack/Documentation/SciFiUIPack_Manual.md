# Sci-Fi UI Pack — Manual

Rainbow Bolt Studio · v1.0.0

---

## 1. Installation

1. Import the package (`Assets ▸ Import Package`, or from the Asset Store window).
2. Menu: **`Rainbow Bolt ▸ Build Sci-Fi UI Pack`**.
3. Open `Demo/SciFiUIDemo.unity` and press Play.

If text doesn't render, import TextMeshPro essentials once:
**`Window ▸ TextMeshPro ▸ Import TMP Essential Resources`**.

---

## 2. Menu reference (`Rainbow Bolt ▸ …`)

| Item | What it does |
|---|---|
| **Build Sci-Fi UI Pack** | Reimports sprites with 9-slice borders, creates `Theme/SciFiTheme.asset` and `Materials/SciFiUI.mat`, and generates `Demo/SciFiUIDemo.unity`. Safe to run repeatedly. |
| **Generate TMP Font (Orbitron)** | Builds an SDF font asset from the bundled Orbitron `.ttf` and assigns it to the theme. |
| **Validate Pack** | Checks that every sprite imported correctly, borders match the spec, the shader compiled, and the build artifacts exist. Prints a report. |

---

## 3. Components

### HoloButton  (`RainbowBolt.SciFiUI.HoloButton`)
Extends UGUI `Button`.

| Field | Purpose |
|---|---|
| `hoverScale` / `pressScale` | Scale multipliers for hover and press. |
| `tweenSpeed` | Easing speed of the scale animation (unscaled time). |
| `accentGraphic` | Optional graphic recolored on highlight (e.g. an icon). |
| `normalAccent` / `highlightAccent` | Accent colors (overwritten by the theme). |
| `audioSource`, `hoverClip`, `clickClip` | Optional UI sounds. |

Tip: set `Transition = Sprite Swap` and assign the four `button_*` sprites for instant
state visuals (the demo does this).

### AnimatedBar  (`RainbowBolt.SciFiUI.AnimatedBar`)
| Field | Purpose |
|---|---|
| `fill` | The `Image` whose `fillAmount` shows the value (uses `bar_fill`). Set to Filled ▸ Horizontal automatically. |
| `value` | Target 0..1. |
| `speed` | Animation speed (unscaled). |
| `useGradient` / `gradient` / `flatColor` | Color by value, or a flat color. |

```csharp
healthBar.SetValue(currentHp / maxHp);          // animates
healthBar.SetValue(1f, instant: true);          // snaps
```

### HoloPanel  (`RainbowBolt.SciFiUI.HoloPanel`)
Animated show/hide on a `CanvasGroup`.

```csharp
panel.Open();      // scale-up + fade-in
panel.Close();     // reverse (optionally deactivates)
panel.Toggle();
```
`openOnEnable`, `duration`, `fromScale`, `deactivateOnClose` are exposed.

### ThemeApplier + UIThemeSO
`UIThemeSO` holds the palette, semantic colors, font and default shader-effect
strengths. Put a `ThemeApplier` on your Canvas, assign a theme, and it pushes colors to
every `IThemed` component and the font to every TMP label beneath it. Re-apply via the
component's context menu **Apply Theme** or `applier.Apply()`.

Implement `IThemed` on your own components to participate in theming.

---

## 4. The SciFiUI shader

`RainbowBolt/SciFiUI` is a Canvas-compatible unlit/transparent shader built on Unity's
UI-Default template (full stencil + 2D clip-rect support, so it behaves inside masks and
scroll rects). All effects default to **0**, so it looks exactly like `UI/Default` until
you dial them in:

| Property | Effect |
|---|---|
| `_ScanlineStrength`, `_ScanlineCount`, `_ScanlineSpeed`, `_ScanlineColor` | Animated scanlines. |
| `_GlowStrength`, `_GlowColor` | Emissive rim on anti-aliased alpha edges. |
| `_Flicker` | Subtle holographic brightness wobble. |

Assign `Materials/SciFiUI.mat` to any `Image`. The build sets the material's defaults from
the theme.

---

## 5. 9-slice & importing

Borders are applied automatically on import by `SpriteImportSettings` (an
`AssetPostprocessor`) reading `sprite_meta.json`. Sprites import as: Sprite (Single),
Full Rect mesh, no mipmaps, clamp, uncompressed, with the correct border. Use
`Image.Type = Sliced` and resize freely.

To re-derive the source art or change resolution/borders, see `_Build/` in the publisher
project (Node generator) — not shipped with the package.

---

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| Text invisible | Import TMP Essentials; optionally generate the Orbitron SDF font. |
| Buttons not clickable | Ensure an `EventSystem` exists; check the Canvas `GraphicRaycaster`. |
| Bar doesn't fill | The `fill` Image must be `Type = Filled`, `Horizontal` (auto-set by the component). |
| Sprites look stretched at corners | Confirm `Image.Type = Sliced`; run `Validate Pack`. |
| Input System project warns about Standalone Input Module | Replace it with `Input System UI Input Module`. |

---

## 7. Support

**hello@rainbowbolt.studio** — bug reports, feature requests, and custom work welcome.
© 2026 Rainbow Bolt Studio.
