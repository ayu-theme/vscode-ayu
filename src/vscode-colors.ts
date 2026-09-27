import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'

export interface VSCodeColor {
  id: string
  description?: string
  deprecated?: string
}

const DEFAULT_APP = '/Applications/Visual Studio Code.app/Contents/Resources/app'
const ANCHOR_COLOR = 'editor.background'

const splitArgs = (source: string, start: number): string[] => {
  const args: string[] = []
  let depth = 0
  let quote: string | null = null
  let current = ''
  for (let i = start; i < source.length; i++) {
    const ch = source[i]
    if (quote) {
      current += ch
      if (ch === '\\') current += source[++i]
      else if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') quote = ch
    else if (ch === '(' || ch === '{' || ch === '[') depth++
    else if (ch === '}' || ch === ']') depth--
    else if (ch === ')') {
      if (depth === 0) return [...args, current]
      depth--
    } else if (ch === ',' && depth === 0) {
      args.push(current)
      current = ''
      continue
    }
    current += ch
  }
  return args
}

const resolveText = (arg: string | undefined, messages: string[]): string | undefined => {
  if (!arg) return undefined
  const localized = arg.match(/^[\w$]+\((\d+),/)
  if (localized) return messages[Number(localized[1])]
  if (/^["'`]/.test(arg)) return JSON.parse(`"${arg.slice(1, -1).replace(/"/g, '\\"')}"`)
  return undefined
}

export const extractColors = (bundle: string, messages: string[]): VSCodeColor[] => {
  const alias = bundle.match(new RegExp(`([\\w$]+)\\("${ANCHOR_COLOR.replace('.', '\\.')}",`))?.[1]
  if (!alias) throw new Error(`Could not locate the registerColor alias via "${ANCHOR_COLOR}"`)

  const call = new RegExp(`(?<![\\w$.])${alias.replace(/\$/g, '\\$')}\\("([a-zA-Z][\\w]*(?:\\.[\\w]+)*)",`, 'g')
  const colors = new Map<string, VSCodeColor>()
  for (const match of bundle.matchAll(call)) {
    const [, id] = match
    if (colors.has(id)) continue
    const [, , description, , deprecation] = splitArgs(bundle, match.index! + match[0].length - `"${id}",`.length)
    const text = resolveText(description, messages)
    if (text === undefined) continue
    colors.set(id, { id, description: text, deprecated: resolveText(deprecation, messages) })
  }
  return [...colors.values()]
}

const extensionColors = (appRoot: string): VSCodeColor[] =>
  readdirSync(join(appRoot, 'extensions')).flatMap((name) => {
    const dir = join(appRoot, 'extensions', name)
    if (!existsSync(join(dir, 'package.json'))) return []
    const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8'))
    const contributed: { id: string; description: string }[] = manifest.contributes?.colors ?? []
    if (contributed.length === 0) return []
    const nlsPath = join(dir, 'package.nls.json')
    const nls: Record<string, string> = existsSync(nlsPath) ? JSON.parse(readFileSync(nlsPath, 'utf-8')) : {}
    return contributed.map(({ id, description }) => ({ id, description: nls[description.replace(/^%|%$/g, '')] ?? description }))
  })

export const loadInstalledColors = (appRoot = process.env.VSCODE_APP ?? DEFAULT_APP) => {
  const read = (path: string) => readFileSync(join(appRoot, path), 'utf-8')
  const version: string = JSON.parse(read('package.json')).version
  const colors = [
    ...extractColors(read('out/vs/workbench/workbench.desktop.main.js'), JSON.parse(read('out/nls.messages.json'))),
    ...extensionColors(appRoot)
  ]
  return { version, colors }
}
