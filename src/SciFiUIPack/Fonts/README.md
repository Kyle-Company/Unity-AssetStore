# Fonts

## Orbitron (bundled)

`Orbitron.ttf` is a geometric sci-fi typeface by Matt McInerney, licensed under the
**SIL Open Font License 1.1** (`OFL.txt`). It pairs naturally with this UI kit.

### Generating the TextMeshPro font asset

TextMeshPro needs an SDF font asset (not just the `.ttf`). Two options:

- **Automatic:** run **`Rainbow Bolt ▸ Generate TMP Font (Orbitron)`**. This creates
  `Orbitron SDF.asset` here and assigns it to the pack theme.
- **Manual:** `Window ▸ TextMeshPro ▸ Font Asset Creator`, source font = `Orbitron`,
  generate, and save the asset into this folder.

If no Orbitron SDF asset exists, the components fall back to TextMeshPro's default font —
everything still works, it just won't use the sci-fi typeface until you generate it.

You can of course assign any other TMP font in the theme (`Theme/SciFiTheme.asset`).
