import { cpSync, writeFileSync } from 'fs'
import { join } from 'path'
import template, { SchemeName } from './template'
import iconTemplate from './icon-template'

const cwd = process.cwd()

// Copy icon files from ayu-colors
cpSync(join(cwd, 'node_modules/ayu/icons'), join(cwd, 'icons'), { recursive: true })
console.log('Copied icons')

// Generate color themes
for (const variant of ['light', 'dark', 'mirage'] as SchemeName[]) {
  writeFileSync(join(cwd, `ayu-${variant}.json`), JSON.stringify(template(variant, true), null, '\t'))
  writeFileSync(join(cwd, `ayu-${variant}-unbordered.json`), JSON.stringify(template(variant, false), null, '\t'))
  console.log(`Updated ${variant}`)
}

// Generate icon theme
writeFileSync(join(cwd, 'ayu-icons.json'), JSON.stringify(iconTemplate(), null, '\t'))
console.log('Updated icon theme')
