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
  const theme = JSON.stringify(template(variant), null, '\t')
  writeFileSync(join(cwd, `ayu-${variant}.json`), theme)
  writeFileSync(join(cwd, `ayu-${variant}-unbordered.json`), theme)
  console.log(`Updated ${variant}`)
}

// Generate icon theme
writeFileSync(join(cwd, 'ayu-icons.json'), JSON.stringify(iconTemplate(), null, '\t'))
console.log('Updated icon theme')
