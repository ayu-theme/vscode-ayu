# ayu for VS Code

The VS Code port of ayu: three color themes (Light, Mirage and Dark) and the ayu file icon theme. The palette itself is not defined here. It comes from the `ayu` npm package, developed in the sibling repo [ayu-colors](https://github.com/ayu-theme/ayu-colors). This repo decides which palette color each VS Code UI and syntax element uses.

## Setup

`ayu` is a `file:../ayu-colors` dependency, so both repos have to be checked out side by side, and ayu-colors has to be built (`npm run build` there) before anything here runs. A palette change in ayu-colors reaches this repo after it is rebuilt there, with no publish needed.

## Generated files

Every `ayu-*.json` at the root and everything in `icons/` is build output, committed so that the extension ships without a build step. Never edit them by hand. The build overwrites them, and anything added directly to them is silently lost on the next build.

- **Color themes** are generated from `src/`. Each variant is written twice, as `ayu-<variant>.json` (bordered) and `ayu-<variant>-unbordered.json`. The unbordered themes keep the plain `Ayu <Variant>` IDs, because existing users' settings select them by those IDs.
- **Icons**, both the image files and which file names and extensions map to which icon, belong to ayu-colors. A new file icon goes into ayu-colors. This repo only adds the mapping from VS Code language IDs to those icons.

After changing the template, run the build and commit the regenerated JSON alongside the source change.

## Commands

- `npm start`: rebuild the themes on every source change.
- `npm test`: unit tests.
- `npx tsc --noEmit -p .`: type check (`tsx` runs the build scripts without one).
- `npm run colors`: compare the theme against the colors registered by the locally installed VS Code (set `VSCODE_APP` to point at another install). It lists which colors ayu leaves at VS Code defaults (modern UI ones first), deprecated keys ayu still sets, and keys VS Code no longer knows. `terminal.ansi*` always shows up as unknown: VS Code registers them dynamically, where the script cannot see them.
- `npm run build`: regenerate everything and package a `.vsix`.

## Previewing

The **Preview theme** launch configuration (F5) opens an Extension Development Host on `test/`, which holds syntax samples for many languages. Its workspace settings select Ayu Mirage, the ayu icons and VS Code's modern UI. With `npm start` running, saved template changes show up in that window live. A development host starts on the extension's first theme of the current type whatever the settings say, so pick an unbordered theme from the theme picker once the window is open.

## Theme conventions

- Colors come from the scheme's semantic groups (`ui`, `editor`, `syntax`, `vcs`, `common`), with variations derived through alpha or lightness. Apart from a few terminal greys and the translucent black of `statusBarItem.prominentHoverBackground` there are no hex literals. When the theme needs a color the scheme lacks, add it in ayu-colors.
- `darken(x)` and `brighten(x)` shift OKLCH lightness by `x / 10`. `alpha(x)` sets opacity.
- VS Code's modern UI, the floating "islands" layout, uses its own tokens (`modern*`, `surface.*`, `editor.border`). Any the theme leaves unset fall back to derivations of classic tokens, so they change whenever those do. Check them in the preview.
- Check every change in all three variants, bordered and unbordered, in both the classic and the modern UI. Unbordered themes use the side bar background for the editor, title bar, status bar and modern UI shell, and hide every divider and card outline by painting it in that same color. Light diverges from Mirage and Dark in places (badge foreground, terminal greys).

## Tooling constraints

- TypeScript stays on 6.x. TypeScript 7 ships only the native compiler, which the editor language servers and ayu-colors' Next.js designer cannot load.
- `src/` and `test/` are excluded from the published package (see `.vscodeignore`).
- Formatting follows `.prettierrc.js`: no semicolons, single quotes, 100 columns.

## Releasing

Bump `version` in `package.json` and add a `CHANGELOG.md` entry at the top: a `## <version>` heading, the release date in backticks, then user-facing bullets describing what changed in the theme, not in the code. Commits use a short imperative one-line subject.

`npm run build` produces `ayu-<version>.vsix`. The maintainer uploads it to the Marketplace by hand; nothing in this repo publishes.
