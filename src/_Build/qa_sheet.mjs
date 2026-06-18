// Dev-only QA: compose generated SVGs onto a dark sheet so white/translucent
// assets are actually visible. Not shipped. Run after build.mjs.
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SVGROOT = join(HERE, 'svg')
const innerOf = s => s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')

function sheet(items, cell, cols, out) {
  const rows = Math.ceil(items.length / cols)
  const W = cols * cell, H = rows * cell
  let g = `<rect width="${W}" height="${H}" fill="#0B1E24"/>`
  g += `<g stroke="#22424A" stroke-width="1">`
  for (let c = 0; c <= cols; c++) g += `<path d="M${c * cell} 0 V${H}"/>`
  for (let r = 0; r <= rows; r++) g += `<path d="M0 ${r * cell} H${W}"/>`
  g += `</g>`
  items.forEach((it, i) => {
    const x = (i % cols) * cell, y = Math.floor(i / cols) * cell
    const pad = (cell - it.box) / 2
    g += `<g transform="translate(${x + pad},${y + pad})">${innerOf(it.svg)}</g>`
  })
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${g}</svg>`
  writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng())
  console.log(`${out}  (${items.length} items, ${W}x${H})`)
}

// icons (uniform 64 box)
const iconDir = join(SVGROOT, 'icons')
const icons = readdirSync(iconDir).filter(f => f.endsWith('.svg')).sort()
  .map(f => ({ svg: readFileSync(join(iconDir, f), 'utf8'), box: 64 }))
sheet(icons, 84, 8, join(HERE, 'qa_icons.png'))

// sprites — scale each into a uniform 256 cell so big/small sit together
const sprRoot = join(SVGROOT, 'sprites')
const sprites = []
for (const cat of readdirSync(sprRoot)) {
  for (const f of readdirSync(join(sprRoot, cat)).filter(f => f.endsWith('.svg')).sort()) {
    const raw = readFileSync(join(sprRoot, cat, f), 'utf8')
    const m = raw.match(/viewBox="0 0 (\d+) (\d+)"/)
    const w = +m[1], h = +m[2], s = Math.min(220 / w, 120 / h)
    const placed = `<svg width="${w * s}" height="${h * s}" viewBox="0 0 ${w} ${h}">${innerOf(raw)}</svg>`
    sprites.push({ svg: `<svg viewBox="0 0 240 240">${placed.replace('<svg', `<svg x="${(240 - w * s) / 2}" y="${(240 - h * s) / 2}"`)}</svg>`, box: 240 })
  }
}
sheet(sprites, 252, 5, join(HERE, 'qa_sprites.png'))
