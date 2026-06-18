// Sci-Fi UI Pack — asset generator + rasterizer (Rainbow Bolt Studio)
// Generates SVG sources, rasterizes them to transparent PNGs, and writes
// sprite_meta.json (9-slice borders) consumed by the Unity AssetPostprocessor.
//
//   npm install        (once)
//   node build.mjs
//
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))      // src/_Build
const PKG = join(HERE, '..', 'SciFiUIPack')               // src/SciFiUIPack
const SVGROOT = join(HERE, 'svg')

const SPRITE_SCALE = 2      // PNG px = design px * scale
const ICON_SCALE = 2
const PPU = 100             // sprite pixels-per-unit

// ---- locked brand palette -------------------------------------------------
const C = {
  ink:   '#0A2329',  // panel base
  ink2:  '#0F2E34',  // button base
  deep:  '#08191E',  // input / track base
  blue:  '#34B7FF',
  blueDim: '#2E9FE0',
  green: '#3FD98A',
  greenDim: '#1F8F63',
  cyan:  '#7FE3FF',
  line:  '#243B41',
  muted: '#46555C',
}

// ---- geometry helpers -----------------------------------------------------
const r1 = n => Math.round(n * 10) / 10
const D2R = Math.PI / 180

// rounded rect with a chamfered (cut) top-right corner — the sci-fi signature
function chamfer(w, h, r = 9, ch = 14) {
  return `M${r} 0 H${w - ch} L${w} ${ch} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`
}
// tab shape: both top corners chamfered, flat bottom (sits on a panel edge)
function tab(w, h, ch = 14) {
  return `M0 ${h} V${ch} L${ch} 0 H${w - ch} L${w} ${ch} V${h} Z`
}
// circle as a sub-path (for evenodd holes)
function circleSub(cx, cy, r) {
  return `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`
}
function starPath(cx, cy, ro, ri, n = 5, rot = -90) {
  const p = []
  for (let i = 0; i < n * 2; i++) {
    const rr = i % 2 ? ri : ro
    const a = (rot + i * 180 / n) * D2R
    p.push(`${r1(cx + rr * Math.cos(a))} ${r1(cy + rr * Math.sin(a))}`)
  }
  return 'M' + p.join(' L') + ' Z'
}
function gearPath(cx, cy, ro, ri, teeth = 8, tw = 0.46) {
  const p = [], s = 360 / teeth
  for (let i = 0; i < teeth; i++) {
    const a0 = (i * s - s * tw / 2) * D2R, a1 = (i * s + s * tw / 2) * D2R
    const a2 = (i * s + s / 2 - s * tw / 2) * D2R, a3 = (i * s + s / 2 + s * tw / 2) * D2R
    p.push(
      `${r1(cx + ro * Math.cos(a0))} ${r1(cy + ro * Math.sin(a0))}`,
      `${r1(cx + ro * Math.cos(a1))} ${r1(cy + ro * Math.sin(a1))}`,
      `${r1(cx + ri * Math.cos(a2))} ${r1(cy + ri * Math.sin(a2))}`,
      `${r1(cx + ri * Math.cos(a3))} ${r1(cy + ri * Math.sin(a3))}`,
    )
  }
  return 'M' + p.join(' L') + ' Z'
}
function brackets(w, h, m, color) {
  const k = 12
  return `<g stroke="${color}" stroke-opacity="0.55" stroke-width="2" fill="none">` +
    `<path d="M${m} ${m + k} V${m} H${m + k}"/>` +
    `<path d="M${w - m - k} ${m} H${w - m} V${m + k}"/>` +
    `<path d="M${w - m} ${h - m - k} V${h - m} H${w - m - k}"/>` +
    `<path d="M${m + k} ${h - m} H${m} V${h - m - k}"/></g>`
}
const svgWrap = (w, h, inner, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${inner}</svg>`

// ---- sprite builders ------------------------------------------------------
function button(fill, stroke, sw, accent, opts = {}) {
  const w = 220, h = 64
  let s = `<path d="${chamfer(w, h)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
  s += `<rect x="12" y="18" width="5" height="28" rx="2.5" fill="${accent}"/>`
  if (opts.hi) s += `<path d="M14 3 H${w - 16}" stroke="${opts.hi}" stroke-width="1.5" stroke-opacity="0.5" fill="none"/>`
  if (opts.shadow) s += `<path d="M12 4 H${w - 14}" stroke="#000000" stroke-opacity="0.35" stroke-width="2" fill="none"/>`
  return svgWrap(w, h, s)
}
function panel() {
  const w = 240, h = 160
  const defs = `<defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.green}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient></defs>`
  let d = `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="14" fill="${C.ink}" fill-opacity="0.92" stroke="${C.blueDim}" stroke-opacity="0.5" stroke-width="2"/>`
  d += `<path d="M1 38 H${w - 1}" stroke="${C.blue}" stroke-opacity="0.35" fill="none"/>`
  d += `<rect x="14" y="14" width="64" height="10" rx="5" fill="url(#pg)"/>`
  d += `<circle cx="${w - 18}" cy="19" r="4" fill="${C.green}"/>`
  d += brackets(w, h, 10, C.cyan)
  return svgWrap(w, h, d, defs)
}
function tooltip() {
  const w = 160, h = 64
  let d = `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="10" fill="${C.ink}" fill-opacity="0.96" stroke="${C.blueDim}" stroke-opacity="0.55" stroke-width="2"/>`
  d += brackets(w, h, 8, C.cyan)
  return svgWrap(w, h, d)
}
function barBg() {
  const w = 200, h = 24
  return svgWrap(w, h, `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="11" fill="${C.deep}" stroke="${C.line}" stroke-width="2"/>`)
}
function barFill() {
  const w = 200, h = 24
  const defs = `<defs><linearGradient id="bf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C2D0D5"/></linearGradient></defs>`
  let d = `<rect x="0" y="0" width="${w}" height="${h}" rx="12" fill="url(#bf)"/>`
  d += `<path d="M8 5 H${w - 8}" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="2" stroke-linecap="round" fill="none"/>`
  return svgWrap(w, h, d, defs)
}
function inputField() {
  const w = 220, h = 48
  let d = `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="9" fill="${C.deep}" fill-opacity="0.9" stroke="${C.blueDim}" stroke-opacity="0.5" stroke-width="2"/>`
  d += `<rect x="12" y="14" width="3" height="20" rx="1.5" fill="${C.green}"/>`
  return svgWrap(w, h, d)
}
function checkbox(on) {
  const w = 40, h = 40
  let d = `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="8" fill="${on ? '#13414A' : C.ink}" stroke="${on ? C.green : C.blue}" stroke-opacity="${on ? 1 : 0.7}" stroke-width="2.5"/>`
  if (on) d += `<path d="M12 20 L18 26 L29 14" fill="none" stroke="${C.green}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`
  return svgWrap(w, h, d)
}
function toggleTrack() {
  const w = 64, h = 28
  return svgWrap(w, h, `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="13" fill="#15454D" stroke="${C.green}" stroke-width="2"/>`)
}
function toggleKnob() {
  const w = 28, h = 28
  const defs = `<defs><linearGradient id="kg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#CBD8DC"/></linearGradient></defs>`
  return svgWrap(w, h, `<circle cx="14" cy="14" r="12.5" fill="url(#kg)"/>`, defs)
}
function tabSprite(active) {
  const w = 140, h = 44
  let d = `<path d="${tab(w, h)}" fill="${active ? '#15454D' : '#0C262C'}" stroke="${active ? C.green : '#2E5A66'}" stroke-width="${active ? 2 : 1.5}"/>`
  if (active) d += `<path d="M16 4 H${w - 16}" stroke="${C.cyan}" stroke-width="2" stroke-opacity="0.7" fill="none"/>`
  return svgWrap(w, h, d)
}
function divider() {
  const w = 200, h = 8
  let d = `<rect x="20" y="3" width="160" height="2" rx="1" fill="${C.cyan}" fill-opacity="0.45"/>`
  d += `<path d="M8 4 l4 -4 l4 4 l-4 4 Z" fill="${C.green}"/>`
  d += `<path d="M${w - 16} 4 l4 -4 l4 4 l-4 4 Z" fill="${C.green}"/>`
  return svgWrap(w, h, d)
}
function badge() {
  const w = 56, h = 24
  const defs = `<defs><linearGradient id="bd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.green}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient></defs>`
  return svgWrap(w, h, `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="11" fill="url(#bd)"/>`, defs)
}

// ---- icon set (monochrome white, 64x64, tinted in Unity) ------------------
const ICONS = {
  play: `<path d="M24 18 L46 32 L24 46 Z" fill="#fff"/>`,
  pause: `<rect x="23" y="18" width="7" height="28" rx="2" fill="#fff"/><rect x="34" y="18" width="7" height="28" rx="2" fill="#fff"/>`,
  stop: `<rect x="20" y="20" width="24" height="24" rx="3" fill="#fff"/>`,
  settings: `<path fill="#fff" fill-rule="evenodd" d="${gearPath(32, 32, 20, 14, 8)} ${circleSub(32, 32, 6)}"/>`,
  close: `<path d="M22 22 L42 42 M42 22 L22 42" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>`,
  check: `<path d="M20 33 L29 42 L45 23" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  plus: `<path d="M32 19 V45 M19 32 H45" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>`,
  minus: `<path d="M19 32 H45" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>`,
  arrow_right: `<path d="M20 32 H43 M34 23 L43 32 L34 41" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  arrow_left: `<path d="M44 32 H21 M30 23 L21 32 L30 41" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  chevron_down: `<path d="M21 27 L32 39 L43 27" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  home: `<path d="M19 32 L32 19 L45 32" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 30 V45 H41 V30" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>`,
  search: `<circle cx="29" cy="29" r="9" fill="none" stroke="#fff" stroke-width="4"/><path d="M36 36 L46 46" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>`,
  heart: `<path d="M32 45 C16 34 19 19 32 27 C45 19 48 34 32 45 Z" fill="#fff"/>`,
  shield: `<path d="M32 17 L46 23 V33 C46 41 32 47 32 47 C32 47 18 41 18 33 V23 Z" fill="#fff"/>`,
  bolt: `<path d="M35 15 L19 36 L30 36 L27 49 L45 27 L34 27 Z" fill="#fff"/>`,
  star: `<path d="${starPath(32, 31, 15, 6.6, 5)}" fill="#fff"/>`,
  lock: `<rect x="19" y="30" width="26" height="18" rx="3" fill="#fff"/><path d="M24 30 V25 a8 8 0 0 1 16 0 V30" fill="none" stroke="#fff" stroke-width="4"/>`,
  bell: `<path d="M32 16 a11 11 0 0 1 11 11 v6 l3 5 H18 l3 -5 v-6 a11 11 0 0 1 11 -11 Z" fill="#fff"/><circle cx="32" cy="49" r="3.4" fill="#fff"/>`,
  user: `<circle cx="32" cy="25" r="8" fill="#fff"/><path d="M17 47 a15 13 0 0 1 30 0 Z" fill="#fff"/>`,
  info: `<circle cx="32" cy="32" r="14" fill="none" stroke="#fff" stroke-width="4"/><circle cx="32" cy="25" r="2.6" fill="#fff"/><rect x="30" y="30" width="4" height="13" rx="2" fill="#fff"/>`,
  volume: `<path d="M20 27 H27 L36 20 V44 L27 37 H20 Z" fill="#fff"/><path d="M41 26 a9 9 0 0 1 0 12" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`,
  trophy: `<path d="M23 18 H41 V27 a9 9 0 0 1 -18 0 Z" fill="#fff"/><path d="M23 22 H17 a6 6 0 0 0 6 6" fill="none" stroke="#fff" stroke-width="3"/><path d="M41 22 H47 a6 6 0 0 1 -6 6" fill="none" stroke="#fff" stroke-width="3"/><rect x="29" y="35" width="6" height="6" fill="#fff"/><rect x="23" y="43" width="18" height="4" rx="2" fill="#fff"/>`,
  map: `<path d="M20 23 L28 27 L40 23 L46 27 V43 L40 39 L28 43 L20 39 Z" fill="none" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/><path d="M28 27 V43 M40 23 V39" stroke="#fff" stroke-width="3.2"/>`,
}

// ---- sprite registry (border is design px [left,bottom,right,top]) --------
const SPRITES = [
  { cat: 'Buttons', name: 'button_normal',   w: 220, h: 64, border: [24, 24, 24, 24], svg: button(C.ink2, C.blueDim, 3, C.green) },
  { cat: 'Buttons', name: 'button_hover',    w: 220, h: 64, border: [24, 24, 24, 24], svg: button('#15454D', C.green, 4, C.cyan, { hi: '#9BF0C8' }) },
  { cat: 'Buttons', name: 'button_pressed',  w: 220, h: 64, border: [24, 24, 24, 24], svg: button('#0A2329', '#246E9E', 3, C.greenDim, { shadow: true }) },
  { cat: 'Buttons', name: 'button_disabled', w: 220, h: 64, border: [24, 24, 24, 24], svg: button('#11242A', C.muted, 3, C.muted) },
  { cat: 'Panels',  name: 'panel',           w: 240, h: 160, border: [24, 24, 24, 40], svg: panel() },
  { cat: 'Panels',  name: 'tooltip',         w: 160, h: 64,  border: [20, 20, 20, 20], svg: tooltip() },
  { cat: 'Bars',    name: 'bar_bg',          w: 200, h: 24,  border: [12, 12, 12, 12], svg: barBg() },
  { cat: 'Bars',    name: 'bar_fill',        w: 200, h: 24,  border: [12, 12, 12, 12], svg: barFill() },
  { cat: 'Inputs',  name: 'input_field',     w: 220, h: 48,  border: [16, 16, 16, 16], svg: inputField() },
  { cat: 'Inputs',  name: 'checkbox_off',    w: 40,  h: 40,  border: [12, 12, 12, 12], svg: checkbox(false) },
  { cat: 'Inputs',  name: 'checkbox_on',     w: 40,  h: 40,  border: [12, 12, 12, 12], svg: checkbox(true) },
  { cat: 'Inputs',  name: 'toggle_track',    w: 64,  h: 28,  border: [14, 14, 14, 14], svg: toggleTrack() },
  { cat: 'Inputs',  name: 'toggle_knob',     w: 28,  h: 28,  border: [0, 0, 0, 0],     svg: toggleKnob() },
  { cat: 'Tabs',    name: 'tab_active',      w: 140, h: 44,  border: [18, 0, 18, 18],  svg: tabSprite(true) },
  { cat: 'Tabs',    name: 'tab_inactive',    w: 140, h: 44,  border: [18, 0, 18, 18],  svg: tabSprite(false) },
  { cat: 'Frames',  name: 'divider',         w: 200, h: 8,   border: [20, 0, 20, 0],   svg: divider() },
  { cat: 'Misc',    name: 'badge',           w: 56,  h: 24,  border: [12, 12, 12, 12], svg: badge() },
]

// ---- run ------------------------------------------------------------------
function ensureDir(p) { mkdirSync(p, { recursive: true }) }
function rasterize(svgString, scale, outPng) {
  const resvg = new Resvg(svgString, { fitTo: { mode: 'zoom', value: scale }, font: { loadSystemFonts: false } })
  writeFileSync(outPng, resvg.render().asPng())
}

// fresh svg tree (PNGs overwrite in place)
rmSync(SVGROOT, { recursive: true, force: true })

const entries = []
let nSpr = 0, nIco = 0

for (const s of SPRITES) {
  const svgPath = join(SVGROOT, 'sprites', s.cat, `${s.name}.svg`)
  const pngRel = `Sprites/${s.cat}/${s.name}.png`
  const pngPath = join(PKG, pngRel)
  ensureDir(dirname(svgPath)); ensureDir(dirname(pngPath))
  writeFileSync(svgPath, s.svg)
  rasterize(s.svg, SPRITE_SCALE, pngPath)
  entries.push({
    path: pngRel,
    border: s.border.map(b => b * SPRITE_SCALE),
    pixelsPerUnit: PPU,
    ninePatch: s.border.some(b => b > 0),
  })
  nSpr++
}

for (const [name, inner] of Object.entries(ICONS)) {
  const svg = svgWrap(64, 64, inner)
  const svgPath = join(SVGROOT, 'icons', `${name}.svg`)
  const pngRel = `Icons/${name}.png`
  const pngPath = join(PKG, pngRel)
  ensureDir(dirname(svgPath)); ensureDir(dirname(pngPath))
  writeFileSync(svgPath, svg)
  rasterize(svg, ICON_SCALE, pngPath)
  entries.push({ path: pngRel, border: [0, 0, 0, 0], pixelsPerUnit: PPU, ninePatch: false })
  nIco++
}

writeFileSync(join(PKG, 'sprite_meta.json'), JSON.stringify({ entries }, null, 2) + '\n')

console.log(`Generated ${nSpr} sprites + ${nIco} icons (${nSpr + nIco} PNGs).`)
console.log(`  sprites scale x${SPRITE_SCALE}, icons scale x${ICON_SCALE}, ppu ${PPU}`)
console.log(`  -> ${PKG}`)
console.log(`  -> sprite_meta.json (${entries.length} entries)`)
