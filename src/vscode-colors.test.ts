import { test } from 'node:test'
import assert from 'node:assert/strict'
import { extractColors } from './vscode-colors'

const messages = ['Editor background.', 'Tab surface, when hovering.', 'Old tab color.', 'Use tab.new instead.']

const bundle = [
  'var a=1;',
  'Q=se("editor.background",{dark:"#1E1E1E",light:"#fff",hcDark:"#000",hcLight:"#fff"},d(0,null)),',
  'F=se("focusBorder",{dark:"#007FD4",light:"#0090F1"},d(0,null)),',
  'R=se("modernTab.hoverBackground",zP(Q,"(,)"),d(1,null)),',
  'S=se("tab.old",null,d(2,null),!1,d(3,null)),',
  'T=se("tab.opaque",Q,"Inline description, with a comma",!0);',
  'foo("not.a.color",{dark:"#000"},d(0,null));',
  'se("dynamic."+x,null,d(0,null));'
].join('')

test('finds every color registered through the registerColor alias', () => {
  const ids = extractColors(bundle, messages).map((c) => c.id)
  assert.deepEqual(ids, ['editor.background', 'focusBorder', 'modernTab.hoverBackground', 'tab.old', 'tab.opaque'])
})

test('resolves localized descriptions and keeps inline ones', () => {
  const byId = Object.fromEntries(extractColors(bundle, messages).map((c) => [c.id, c]))
  assert.equal(byId['editor.background'].description, 'Editor background.')
  assert.equal(byId['modernTab.hoverBackground'].description, 'Tab surface, when hovering.')
  assert.equal(byId['tab.opaque'].description, 'Inline description, with a comma')
})

test('flags deprecated colors with their deprecation message', () => {
  const byId = Object.fromEntries(extractColors(bundle, messages).map((c) => [c.id, c]))
  assert.equal(byId['tab.old'].deprecated, 'Use tab.new instead.')
  assert.equal(byId['editor.background'].deprecated, undefined)
})

test('fails loudly when the registerColor alias cannot be found', () => {
  assert.throws(() => extractColors('var a=1;', messages), /registerColor/)
})
