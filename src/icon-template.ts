import { icons } from 'ayu/icons'

const sortObject = <T>(obj: Record<string, T>): Record<string, T> =>
  Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)))

interface IconDefinition {
  iconPath: string
}

interface IconTheme {
  iconDefinitions: Record<string, IconDefinition>
  file: string
  folder: string
  folderExpanded: string
  light: {
    folder: string
    folderExpanded: string
    fileExtensions?: Record<string, string>
    fileNames?: Record<string, string>
  }
  fileExtensions: Record<string, string>
  fileNames: Record<string, string>
  hidesExplorerArrows: boolean
  languageIds: Record<string, string>
}

export default function iconTemplate(): IconTheme {
  const iconDefinitions: Record<string, IconDefinition> = {}

  // Default file icon
  iconDefinitions['_file'] = { iconPath: `./icons/${icons.default}` }

  // Folder icons (dark and light variants)
  iconDefinitions['_folder_dark'] = { iconPath: `./icons/${icons.folder.dark.collapsed}` }
  iconDefinitions['_folder_light'] = { iconPath: `./icons/${icons.folder.light.collapsed}` }
  iconDefinitions['_folder_open_dark'] = { iconPath: `./icons/${icons.folder.dark.expanded}` }
  iconDefinitions['_folder_open_light'] = { iconPath: `./icons/${icons.folder.light.expanded}` }

  // File type icons (track which have light variants)
  const iconsWithLight = new Set<string>()
  for (const [id, file] of Object.entries(icons.files)) {
    if (typeof file === 'string') {
      iconDefinitions[id] = { iconPath: `./icons/${file}` }
    } else {
      iconDefinitions[id] = { iconPath: `./icons/${file.dark}` }
      iconDefinitions[`${id}_light`] = { iconPath: `./icons/${file.light}` }
      iconsWithLight.add(id)
    }
  }

  // Build fileExtensions mapping (extension -> icon id)
  const fileExtensions: Record<string, string> = {}
  for (const [ext, iconId] of Object.entries(icons.extensions)) {
    fileExtensions[ext] = iconId
  }

  // Build fileNames mapping (filename -> icon id)
  const fileNames: Record<string, string> = {}
  for (const [name, iconId] of Object.entries(icons.filenames)) {
    fileNames[name] = iconId
  }

  // Build light variants for extensions and filenames that use icons with light variants
  const lightFileExtensions: Record<string, string> = {}
  for (const [ext, iconId] of Object.entries(icons.extensions)) {
    if (iconsWithLight.has(iconId)) {
      lightFileExtensions[ext] = `${iconId}_light`
    }
  }

  const lightFileNames: Record<string, string> = {}
  for (const [name, iconId] of Object.entries(icons.filenames)) {
    if (iconsWithLight.has(iconId)) {
      lightFileNames[name] = `${iconId}_light`
    }
  }

  // VS Code language ID → extension mapping (VS Code-specific)
  const langToExt: Record<string, string> = {
    c: 'c',
    cpp: 'cpp',
    csharp: 'cs',
    css: 'css',
    dart: 'dart',
    go: 'go',
    html: 'html',
    java: 'java',
    javascript: 'js',
    javascriptreact: 'jsx',
    json: 'json',
    jsonc: 'json',
    kotlin: 'kt',
    lua: 'lua',
    markdown: 'md',
    perl: 'pl',
    php: 'php',
    powershell: 'ps1',
    python: 'py',
    r: 'r',
    ruby: 'rb',
    rust: 'rs',
    scss: 'scss',
    shellscript: 'sh',
    sql: 'sql',
    swift: 'swift',
    typescript: 'ts',
    typescriptreact: 'tsx',
    yaml: 'yaml',
    clojure: 'clj',
    coffeescript: 'coffee',
    dockerfile: 'dockerfile',
    elixir: 'ex',
    erlang: 'erl',
    fsharp: 'cs',
    graphql: 'gql',
    groovy: 'groovy',
    haml: 'haml',
    handlebars: 'mustache',
    haskell: 'hs',
    jade: 'pug',
    julia: 'jl',
    latex: 'tex',
    less: 'less',
    'objective-c': 'c',
    'objective-cpp': 'cpp',
    pug: 'pug',
    razor: 'html',
    sass: 'sass',
    scala: 'scala',
    stylus: 'styl',
    svelte: 'svelte',
    tex: 'tex',
    twig: 'twig',
    vue: 'vue',
    xml: 'xml',
  }

  // Build languageIds by looking up extensions
  const languageIds: Record<string, string> = {}
  for (const [langId, ext] of Object.entries(langToExt)) {
    const iconId = icons.extensions[ext]
    if (iconId) languageIds[langId] = iconId
  }

  const light: IconTheme['light'] = {
    folder: '_folder_light',
    folderExpanded: '_folder_open_light',
  }
  if (Object.keys(lightFileExtensions).length > 0) {
    light.fileExtensions = sortObject(lightFileExtensions)
  }
  if (Object.keys(lightFileNames).length > 0) {
    light.fileNames = sortObject(lightFileNames)
  }

  return {
    iconDefinitions: sortObject(iconDefinitions),
    file: '_file',
    folder: '_folder_dark',
    folderExpanded: '_folder_open_dark',
    light,
    fileExtensions: sortObject(fileExtensions),
    fileNames: sortObject(fileNames),
    hidesExplorerArrows: true,
    languageIds: sortObject(languageIds),
  }
}
