import template, { SchemeName } from './template'
import { loadInstalledColors, VSCodeColor } from './vscode-colors'

const MODERN_UI = /^(modern|surface\.|editor\.border$|statusBarItem\.compact)/

const { version, colors } = loadInstalledColors()
const registered = new Map(colors.map((c) => [c.id, c]))

const defined = new Set<string>()
for (const variant of ['light', 'dark', 'mirage'] as SchemeName[]) {
  for (const bordered of [true, false]) {
    Object.keys(template(variant, bordered).colors).forEach((key) => defined.add(key))
  }
}

const missing = colors.filter((c) => !c.deprecated && !defined.has(c.id))
const deprecated = [...defined].filter((key) => registered.get(key)?.deprecated)
const unknown = [...defined].filter((key) => !registered.has(key))

const list = (title: string, items: VSCodeColor[]) => {
  if (items.length === 0) return
  console.log(`\n${title} (${items.length})`)
  for (const c of items) console.log(`  ${c.id.padEnd(48)} ${c.description ?? ''}`)
}

console.log(`VS Code ${version}: ${colors.length} registered colors, ayu sets ${defined.size}`)
list('Modern UI colors not set by ayu', missing.filter((c) => MODERN_UI.test(c.id)))
list('Other colors not set by ayu', missing.filter((c) => !MODERN_UI.test(c.id)))
list('Deprecated colors ayu still sets', deprecated.map((id) => registered.get(id)!))
list('Colors ayu sets that were not found (removed, or registered dynamically)', unknown.map((id) => ({ id })))
