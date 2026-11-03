import { test } from 'node:test'
import assert from 'node:assert/strict'
import template, { SchemeName } from './template'

const rgba = (hex: string) => {
  const n = hex.slice(1)
  return [0, 2, 4, 6].map((i) => (i < n.length ? parseInt(n.slice(i, i + 2), 16) / 255 : 1))
}

const composite = (fg: string, bg: string) => {
  const f = rgba(fg)
  const b = rgba(bg)
  return [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3]))
}

const luminance = (rgb: number[]) => {
  const [r, g, b] = rgb.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (fg: string, bg: string) => {
  const a = luminance(composite(fg, bg))
  const b = luminance(rgba(bg))
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

const variants: SchemeName[] = ['light', 'mirage', 'dark']

for (const variant of variants) {
  for (const bordered of [true, false]) {
    test(`${variant} ${bordered ? 'bordered' : 'unbordered'}: the command center outline shows on the title bar`, () => {
      const colors = template(variant, bordered).colors as Record<string, string>
      const titleBar = colors['titleBar.activeBackground']
      for (const key of ['commandCenter.border', 'commandCenter.inactiveBorder']) {
        assert.ok(
          contrast(colors[key], titleBar) >= 1.1,
          `${key} ${colors[key]} on ${titleBar} is ${contrast(colors[key], titleBar).toFixed(3)}:1`
        )
      }
    })
  }
}
