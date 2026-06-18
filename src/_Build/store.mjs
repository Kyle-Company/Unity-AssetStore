// Sci-Fi UI Pack — Asset Store marketing images (Rainbow Bolt Studio)
// Renders key images + feature graphics at exact Asset Store pixel specs into
// src/_Store/images. Reuses the locked visual language and the bundled Orbitron font.
//
//   node store.mjs
//
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..', '_Store', 'images')
const ICONDIR = join(HERE, 'svg', 'icons')
const ORBITRON = join(HERE, '..', 'SciFiUIPack', 'Fonts', 'Orbitron.ttf')
mkdirSync(OUT, { recursive: true })

const C = {
  blue: '#34B7FF', blueDim: '#2E9FE0', green: '#3FD98A', greenDim: '#1F8F63',
  cyan: '#7FE3FF', ink: '#0A2329', ink2: '#0F2E34', muted: '#5E9AA0', text: '#E6FCFF',
}
const TITLE = "Orbitron, 'Helvetica Neue', sans-serif"
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "Menlo, monospace"

const r1 = n => Math.round(n * 10) / 10
const D2R = Math.PI / 180
const chamfer = (w, h, r = 10, ch = 16) =>
  `M${r} 0 H${w - ch} L${w} ${ch} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`
const circleSub = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`
function star(cx, cy, ro, ri, n = 5, rot = -90) {
  const p = []
  for (let i = 0; i < n * 2; i++) { const rr = i % 2 ? ri : ro, a = (rot + i * 180 / n) * D2R; p.push(`${r1(cx + rr * Math.cos(a))} ${r1(cy + rr * Math.sin(a))}`) }
  return 'M' + p.join(' L') + ' Z'
}
const brackets = (x, y, w, h, m, col) => {
  const k = 20
  return `<g stroke="${col}" stroke-opacity="0.6" stroke-width="2.5" fill="none">` +
    `<path d="M${x + m} ${y + m + k} V${y + m} H${x + m + k}"/>` +
    `<path d="M${x + w - m - k} ${y + m} H${x + w - m} V${y + m + k}"/>` +
    `<path d="M${x + w - m} ${y + h - m - k} V${y + h - m} H${x + w - m - k}"/>` +
    `<path d="M${x + m + k} ${y + h - m} H${x + m} V${y + h - m - k}"/></g>`
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const text = (x, y, s, size, fill, { f = SANS, w = 400, a = 'start', ls = 0, op = 1 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${f}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${a}" letter-spacing="${ls}" opacity="${op}">${esc(s)}</text>`

const DEFS = `<defs>
<linearGradient id="screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C2026"/><stop offset="1" stop-color="#06121A"/></linearGradient>
<linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.green}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient>
<linearGradient id="cyan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient>
<linearGradient id="green" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.green}"/><stop offset="1" stop-color="${C.greenDim}"/></linearGradient>
<linearGradient id="blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.blue}"/><stop offset="1" stop-color="#1E5FA5"/></linearGradient>
<linearGradient id="spectrum" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF5A5F"/><stop offset="0.22" stop-color="#FFA63D"/><stop offset="0.44" stop-color="#FFD23D"/><stop offset="0.66" stop-color="${C.green}"/><stop offset="0.84" stop-color="${C.blue}"/><stop offset="1" stop-color="#9B6BFF"/></linearGradient>
<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#7A5AFF" stop-opacity="0.30"/><stop offset="0.5" stop-color="#34B7FF" stop-opacity="0.12"/><stop offset="1" stop-color="#34B7FF" stop-opacity="0"/></radialGradient>
</defs>`

function background(w, h, { grid = true } = {}) {
  let s = `<rect width="${w}" height="${h}" fill="url(#screen)"/>`
  s += `<rect width="${w}" height="6" fill="url(#spectrum)"/>`
  s += `<ellipse cx="${w * 0.82}" cy="${h * 0.12}" rx="${w * 0.5}" ry="${h * 0.5}" fill="url(#glow)"/>`
  if (grid) {
    s += `<g stroke="${C.cyan}" stroke-opacity="0.05" stroke-width="1">`
    for (let gx = 0; gx <= w; gx += 80) s += `<path d="M${gx} 0 V${h}"/>`
    for (let gy = 0; gy <= h; gy += 80) s += `<path d="M0 ${gy} H${w}"/>`
    s += `</g>`
  }
  return s
}

function hudRing(cx, cy, r) {
  return `<g transform="translate(${cx} ${cy})" fill="none">` +
    `<circle r="${r}" stroke="#1E6FB8" stroke-width="${r * 0.16}" stroke-opacity="0.35"/>` +
    `<circle r="${r}" stroke="url(#cyan)" stroke-width="${r * 0.11}" stroke-dasharray="${r * 1.6} ${r * 5}" stroke-linecap="round" transform="rotate(-90)"/>` +
    `<circle r="${r * 0.66}" stroke="${C.green}" stroke-width="2" stroke-dasharray="3 8" stroke-opacity="0.7"/>` +
    `<circle r="${r * 0.3}" stroke="${C.cyan}" stroke-width="2" stroke-opacity="0.6"/>` +
    `<circle r="${r * 0.1}" fill="${C.green}"/></g>`
}
function bar(x, y, w, h, pct, grad) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="#08191E" stroke="#243B41" stroke-width="2"/>` +
    `<rect x="${x}" y="${y}" width="${r1(w * pct)}" height="${h}" rx="${h / 2}" fill="url(#${grad})"/>` +
    `<path d="M${x + h / 2} ${y + h * 0.28} H${x + r1(w * pct) - h / 2}" stroke="#fff" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>`
}
function chamferBtn(x, y, w, h, fill, stroke, accent, label, labelColor, fontPx, sw = 3) {
  return `<g transform="translate(${x} ${y})">` +
    `<path d="${chamfer(w, h)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>` +
    `<rect x="14" y="${h * 0.28}" width="6" height="${h * 0.44}" rx="3" fill="${accent}"/>` +
    text(w / 2 + 8, h / 2 + fontPx * 0.35, label, fontPx, labelColor, { f: TITLE, w: 700, a: 'middle', ls: 2 }) +
    `</g>`
}
function chip(x, y, label) {
  const w = 26 + label.length * 11
  return `<g transform="translate(${x} ${y})"><rect width="${w}" height="40" rx="20" fill="#10333A" stroke="${C.blueDim}" stroke-opacity="0.5"/>` +
    text(w / 2, 26, label, 17, C.cyan, { f: MONO, a: 'middle' }) + `</g>` + `__W${w}`
}
function chips(x, y, labels) {
  let cx = x, out = ''
  for (const l of labels) { const r = chip(cx, y, l); const [svg, wstr] = r.split('__W'); out += svg; cx += parseInt(wstr) + 16 }
  return out
}

// self-contained UI vignette in a 760x560 box
function showcase() {
  let s = `<g>`
  s += `<rect x="2" y="2" width="756" height="556" rx="22" fill="${C.ink}" fill-opacity="0.95" stroke="${C.blueDim}" stroke-opacity="0.5" stroke-width="3"/>`
  s += `<rect x="2" y="2" width="756" height="60" rx="22" fill="#0E3A42"/>`
  s += `<path d="M2 62 H758" stroke="${C.blue}" stroke-opacity="0.4" fill="none"/>`
  s += text(34, 42, 'SYSTEM PANEL', 28, C.cyan, { f: TITLE, w: 700, ls: 3 })
  s += `<circle cx="724" cy="32" r="7" fill="${C.green}"/>`
  s += chamferBtn(34, 96, 300, 78, '#15454D', C.green, C.cyan, 'PLAY', '#EAFFF6', 30, 4)
  s += chamferBtn(360, 96, 300, 78, C.ink2, C.blueDim, C.green, 'SETTINGS', '#CFF3FF', 26)
  s += text(34, 222, 'HEALTH', 20, C.muted, { f: MONO, ls: 2 }) + bar(34, 234, 380, 26, 0.72, 'green')
  s += text(34, 290, 'ENERGY', 20, C.muted, { f: MONO, ls: 2 }) + bar(34, 302, 380, 26, 0.48, 'blue')
  s += text(34, 358, 'SHIELD', 20, C.muted, { f: MONO, ls: 2 }) + bar(34, 370, 380, 26, 0.33, 'cyan')
  s += hudRing(600, 300, 96)
  const ic = ['play', 'heart', 'shield', 'bolt', 'star', 'settings', 'trophy']
  ic.forEach((n, i) => {
    s += `<g transform="translate(${34 + i * 76} 446)"><rect width="60" height="60" rx="14" fill="#0E2E34" stroke="${C.blueDim}" stroke-opacity="0.5"/>` +
      `<g transform="translate(-2 -2) scale(1.0)">${icon(n, C.cyan)}</g></g>`
  })
  s += brackets(2, 2, 756, 556, 16, C.cyan)
  s += `</g>`
  return s
}

function icon(name, tint) {
  const raw = readFileSync(join(ICONDIR, name + '.svg'), 'utf8')
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/#fff/gi, tint)
  return inner
}

const wrap = (w, h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${DEFS}${inner}</svg>`

// ---- images ---------------------------------------------------------------
function cover() {
  const w = 1950, h = 1300
  let s = background(w, h)
  s += text(140, 175, '// RAINBOW BOLT STUDIO', 26, C.muted, { f: MONO, ls: 4 })
  s += `<text x="136" y="360" font-family="${TITLE}" font-size="150" font-weight="800" fill="url(#spectrum)" letter-spacing="2">SCI-FI</text>`
  s += `<text x="140" y="500" font-family="${TITLE}" font-size="150" font-weight="800" fill="${C.text}" letter-spacing="2">UI PACK</text>`
  s += text(146, 590, 'Production-ready, themeable UI for Unity.', 36, C.cyan, { f: SANS, w: 500 })
  s += chips(146, 660, ['40+ SPRITES & ICONS', 'URP · UNITY 6', '9-SLICE', 'TEXTMESHPRO'])
  s += text(146, 1210, 'rainbowbolt.studio', 28, C.muted, { f: MONO, ls: 2 })
  s += `<g transform="translate(1030 470) scale(1.08)">${showcase()}</g>`
  return wrap(w, h, s)
}
function social() {
  const w = 1200, h = 630
  let s = background(w, h)
  s += text(90, 120, '// RAINBOW BOLT STUDIO', 22, C.muted, { f: MONO, ls: 4 })
  s += `<text x="86" y="250" font-family="${TITLE}" font-size="96" font-weight="800" fill="url(#spectrum)">SCI-FI</text>`
  s += `<text x="90" y="345" font-family="${TITLE}" font-size="96" font-weight="800" fill="${C.text}">UI PACK</text>`
  s += text(94, 410, 'Drop-in · themeable · URP · Unity 6', 28, C.cyan, { f: SANS, w: 500 })
  s += chips(94, 460, ['40+ ASSETS', '9-SLICE', 'TMP'])
  s += `<g transform="translate(640 120) scale(0.62)">${showcase()}</g>`
  return wrap(w, h, s)
}
function card() {
  const w = 420, h = 280
  let s = background(w, h, { grid: false })
  s += boltMark(40, 60, 64)
  s += `<text x="120" y="115" font-family="${TITLE}" font-size="40" font-weight="800" fill="${C.text}">SCI-FI</text>`
  s += `<text x="120" y="160" font-family="${TITLE}" font-size="40" font-weight="800" fill="url(#accent)">UI PACK</text>`
  s += text(42, 230, 'Rainbow Bolt Studio · URP · Unity 6', 16, C.muted, { f: MONO })
  s += chamferBtn(250, 195, 130, 44, '#15454D', C.green, C.cyan, 'PLAY', '#EAFFF6', 18, 2.5)
  return wrap(w, h, s)
}
function boltMark(x, y, size) {
  const s = size / 200
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M120,16 L60,112 L100,112 L80,184 L150,76 L108,76 Z" fill="url(#spectrum)"/></g>`
}
function appIcon() {
  const w = 160, h = 160
  let s = `<rect width="${w}" height="${h}" rx="34" fill="url(#screen)"/>`
  s += `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="32" fill="none" stroke="${C.blueDim}" stroke-opacity="0.5" stroke-width="2"/>`
  s += brackets(0, 0, w, h, 18, C.cyan)
  s += boltMark(48, 26, 108)
  return wrap(w, h, s)
}
function featureComponents() {
  const w = 1920, h = 1080
  let s = background(w, h)
  s += text(120, 130, 'EVERY STATE, READY TO DROP IN', 60, C.text, { f: TITLE, w: 800, ls: 2 })
  s += text(124, 185, 'Nine-sliced buttons, panels, bars, inputs — clean and consistent.', 32, C.cyan, { f: SANS })
  const states = [['NORMAL', C.ink2, C.blueDim, C.green, '#CFF3FF'], ['HOVER', '#15454D', C.green, C.cyan, '#EAFFF6'], ['PRESSED', '#0A2329', '#246E9E', C.greenDim, '#9FD8E6'], ['DISABLED', '#11242A', C.muted, C.muted, '#6E828A']]
  states.forEach((st, i) => {
    const x = 130 + i * 430
    s += chamferBtn(x, 300, 360, 96, st[1], st[2], st[3], 'PLAY', st[4], 34, 4)
    s += text(x + 180, 470, st[0], 24, C.muted, { f: MONO, a: 'middle', ls: 3 })
  })
  s += `<g transform="translate(130 545) scale(0.82)">${showcase()}</g>`
  s += hudRing(1500, 740, 200)
  return wrap(w, h, s)
}
function featureIcons() {
  const w = 1920, h = 1080
  let s = background(w, h)
  s += text(120, 130, '24 TINTABLE ICONS', 60, C.text, { f: TITLE, w: 800, ls: 2 })
  s += text(124, 185, 'Monochrome and crisp — tint to any color in seconds.', 32, C.cyan, { f: SANS })
  const names = ['play', 'pause', 'stop', 'settings', 'close', 'check', 'plus', 'minus', 'arrow_right', 'arrow_left', 'chevron_down', 'home', 'search', 'heart', 'shield', 'bolt', 'star', 'lock', 'bell', 'user', 'info', 'volume', 'trophy', 'map']
  const tints = [C.cyan, C.green, C.blue]
  const cols = 8, cell = 200, ox = 160, oy = 280
  names.forEach((n, i) => {
    const tint = tints[Math.floor(i / cols) % tints.length]
    const x = ox + (i % cols) * cell, y = oy + Math.floor(i / cols) * cell
    s += `<g transform="translate(${x} ${y})"><rect width="150" height="150" rx="26" fill="#0E2E34" stroke="${C.blueDim}" stroke-opacity="0.45"/>` +
      `<g transform="translate(43 43) scale(1.0)">${icon(n, tint)}</g></g>`
  })
  return wrap(w, h, s)
}

const IMAGES = {
  'icon_160': appIcon(),
  'card_420x280': card(),
  'cover_1950x1300': cover(),
  'social_1200x630': social(),
  'feature_01_components_1920x1080': featureComponents(),
  'feature_02_icons_1920x1080': featureIcons(),
}

const font = { fontFiles: [ORBITRON], loadSystemFonts: true, defaultFontFamily: 'Helvetica Neue' }
let n = 0
for (const [name, svg] of Object.entries(IMAGES)) {
  writeFileSync(join(OUT, name + '.svg'), svg)
  writeFileSync(join(OUT, name + '.png'), new Resvg(svg, { font }).render().asPng())
  n++
}
console.log(`Rendered ${n} store images -> ${OUT}`)
