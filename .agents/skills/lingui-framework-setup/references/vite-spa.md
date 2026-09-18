# Lingui + Vite SPA

Covers client-rendered Vite React apps: no router, declarative React Router (`<Routes>` in JSX), and TanStack Router. A project with `@react-router/dev` is React Router **framework mode** — use [react-router-remix.md](react-router-remix.md) instead; nothing here applies to it.

## Packages

```bash
npm install '@lingui/core@^6' '@lingui/react@^6' '@lingui/detect-locale@^6'
npm install -D '@lingui/cli@^6' '@lingui/vite-plugin@^6'
```

plus the macro transform matching the compiler — that choice is the single most common way this setup silently fails, so resolve it first.

Whenever `@lingui/babel-plugin-lingui-macro` goes in as a **direct** dependency, install `@babel/types` beside it. It is an unmet peer of that package, and npm keeps its own copy nested under `@lingui/cli` where the hoisted plugin can't see it — `lingui extract` then dies with `ERR_MODULE_NOT_FOUND: Cannot find package '@babel/types'` before extracting anything.

## Build tool integration — pick by compiler

**`@vitejs/plugin-react-swc`** (SWC):

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { lingui } from '@lingui/vite-plugin'
import { linguiMacroSwcPlugin } from '@lingui/swc-plugin/options'

export default defineConfig({
  plugins: [
    react({ plugins: [linguiMacroSwcPlugin()] }),
    lingui(),
  ],
})
```

Install `@lingui/swc-plugin` **pinned to an exact version** compatible with the `@swc/core` the lockfile resolved for `@vitejs/plugin-react-swc` (`npm ls @swc/core`, not the caret range the plugin declares) — the plugin ABI doesn't follow semver, and the swc-plugin-compatibility skill has the selection steps. A Vite host and a Next.js host in the same repo can need different plugin versions. `linguiMacroSwcPlugin()` is the current helper; the raw tuple form `plugins: [['@lingui/swc-plugin', {}]]` is equivalent. Either way it must be a tuple/helper call, never a bare string — a bare string is silently ignored. Details: the swc-plugin-compatibility skill.

**`@vitejs/plugin-react` v5 or lower** (Babel):

```ts
import react from '@vitejs/plugin-react'

react({
  babel: { plugins: ['@lingui/babel-plugin-lingui-macro'] },
}),
lingui(),
```

**`@vitejs/plugin-react` v6+** (what `create-vite` scaffolds today): the `babel` option was **removed**. A TS config fails with `TS2353: 'babel' does not exist in type 'Options'`; a JS config is accepted in silence and macros never transform — the build stays green and the app ships untranslated. Three ways out, in order of preference:

*On Vite 8 (Rolldown)* — run the macro as its own Babel pass and keep the stock React plugin. No compiler switch, no version pins:

```ts
import react from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { lingui, linguiTransformerBabelPreset } from '@lingui/vite-plugin'

export default defineConfig({
  plugins: [react(), lingui(), babel({ presets: [linguiTransformerBabelPreset()] })],
})
```

`linguiTransformerBabelPreset` ships from `@lingui/vite-plugin` (6.6+) pre-filtered for Lingui files; add `@rolldown/plugin-babel`, `@babel/core`, and `@lingui/babel-plugin-lingui-macro` as dev deps. On Vite ≤ 7 there is no Rolldown, so use `vite-plugin-babel` for the same pass.

*Or switch to SWC*: `@vitejs/plugin-react-swc` + the SWC config above. Costs an exact pin, buys a faster transform.

*Or pin `@vitejs/plugin-react@^5`*, which keeps the `babel` option. A project already on `^5` works as-is; crossing to v6 later means adopting one of the two options above in the same change.

`lingui()` makes `.po` files importable as compiled message modules — there is no `lingui compile` step and no compiled artifacts to gitignore on this stack. Add the type declaration once:

```ts
// src/vite-env.d.ts — append, or create it (current create-vite scaffolds omit this file)
declare module '*.po' {
  import type { Messages } from '@lingui/core'
  export const messages: Messages
}
```

## lingui.config.ts

```ts
import { defineConfig } from '@lingui/cli'

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en', 'es', 'fr'],
  catalogs: [
    { path: '<rootDir>/src/locales/{locale}/messages', include: ['src'] },
  ],
})
```

Create the shared `src/i18n/locales.ts` module (`resolveLocale`, `getDirection`, `localeDisplayName`) per the lingui-best-practices skill before writing anything below — every snippet imports from it.

## The i18n module (no URL locale — the default SPA shape)

```ts
// src/i18n/index.ts
import { i18n } from '@lingui/core'
import { detect, fromUrl, fromStorage, fromNavigator } from '@lingui/detect-locale'
import { getDirection, resolveLocale, sourceLocale, type Locale } from './locales'

export * from './locales'

export function detectLocale(): Locale {
  try {
    return resolveLocale(detect(fromUrl('lang'), fromStorage('lang'), fromNavigator()))
  } catch {
    // Sandboxed iframes (CodeSandbox, some embeds) throw SecurityError on
    // localStorage access before the app renders anything at all.
    return resolveLocale(detect(fromUrl('lang'), fromNavigator()))
  }
}

export async function loadCatalog(locale: Locale) {
  try {
    const { messages } = await import(`../locales/${locale}/messages.po`)
    i18n.loadAndActivate({ locale, messages })
  } catch (e) {
    console.error(`Catalog for "${locale}" failed to load, using "${sourceLocale}"`, e)
    const { messages } = await import(`../locales/${sourceLocale}/messages.po`)
    i18n.loadAndActivate({ locale: sourceLocale, messages })
  }
  document.documentElement.lang = i18n.locale
  document.documentElement.dir = getDirection(i18n.locale)
}

export function saveLocale(locale: Locale) {
  try {
    localStorage.setItem('lang', locale)
  } catch {
    /* sandboxed iframe — the URL param below still persists the choice */
  }
  const url = new URL(window.location.href)
  url.searchParams.set('lang', locale)
  history.replaceState(history.state, '', url)
}

export { i18n }
```

Two rules here are load-bearing:

- **`saveLocale` writes the URL param as well as storage.** `detectLocale` reads `?lang=` *first*, so a visitor arriving from a shared `/?lang=es` link who switches language and reloads would be thrown back to Spanish if only storage were written. Keeping both sources agreed also keeps the address bar shareable. `replaceState`, not `pushState` — a language switch should not create a back-button entry.
- The keyed dynamic import (`` import(`../locales/${locale}/messages.po`) ``) keeps the template analyzable, so Vite emits **one lazy chunk per locale** and only the active one downloads.

## Provider wiring

```tsx
// src/main.tsx
import ReactDOM from 'react-dom/client'
import { I18nProvider } from '@lingui/react'
import { i18n, detectLocale, loadCatalog } from './i18n'
import App from './App'

await loadCatalog(detectLocale()) // before first render: no flash of raw msgids

ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nProvider i18n={i18n}>
    <App />
  </I18nProvider>,
)
```

Set `index.html`'s `<html lang>` to the source locale and **remove any hardcoded `dir`** — `loadCatalog` sets both at runtime, and a hardcoded `dir="ltr"` flashes the wrong direction for RTL users before JS runs.

## Language switcher (no URL locale)

```tsx
// src/components/LanguageSwitcher.tsx
import { useLingui } from '@lingui/react'
import { locales, localeDisplayName, loadCatalog, saveLocale, type Locale } from '../i18n'

export function LanguageSwitcher() {
  const { i18n } = useLingui() // subscribes the component to locale changes

  return (
    <select
      value={i18n.locale}
      aria-label="Language"
      onChange={async (e) => {
        const locale = e.target.value as Locale
        saveLocale(locale)
        await loadCatalog(locale)
      }}
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>{localeDisplayName(locale)}</option>
      ))}
    </select>
  )
}
```

A `<select>` is right here because there is no URL to link to. Labels come from `localeDisplayName` (each language naming itself) — never a hand-written map.

## Locale-prefixed URLs (optional)

If the user wants `/es/about`-style URLs, ask them to choose: unprefixed source locale, all locales prefixed, or stay URL-free. Then:

- **The path becomes the only locale source.** Drop `detectLocale`/`saveLocale`/`@lingui/detect-locale` for routing purposes — a stored value competing with the path is a desync generator.
- **Declarative React Router**: mount pages under a `:locale` layout route that validates the param, loads the catalog in an effect (with a cancelled flag — two fast switches resolve out of order otherwise), and renders `I18nProvider` around its `<Outlet>`. The validation is mandatory because `:locale` matches *any* first segment (`/xyz/about` arrives with `locale === 'xyz'`); only static-beats-dynamic ranking keeps real routes out.
- **TanStack Router** (file-based): routes under `$locale/`, catalog load in `beforeLoad`. Don't wrap its `<Link>` in a helper — `to`/`params` are typed against the route tree and a wrapper erases the inference; pass `params={{ locale }}` natively.
- **Switcher becomes a plain `<a>`** doing a full document navigation to the same path under the target locale, re-appending `search` and `hash` (dropping them loses the user's query/fragment on switch). Full navigation re-runs catalog loading uniformly across router flavors.
- **Production hosting must rewrite unknown paths to `index.html`.** Dev and `vite preview` do this automatically, so the failure only appears deployed: a hard refresh of `/es/about` 404s. Netlify / Cloudflare Pages: `public/_redirects` → `/* /index.html 200`; Vercel: `rewrites` to `/index.html`; nginx: `try_files $uri $uri/ /index.html;`; Apache: `FallbackResource /index.html`; GitHub Pages: copy `index.html` to `404.html` at build time or stay URL-free.

## Gotchas

- Build green, UI in English, no errors → macro transform not wired: `@vitejs/plugin-react@6` `babel` option, or a bare-string SWC entry. See swc-plugin-compatibility.
- `SecurityError` before first paint in an iframe → unguarded `localStorage`; the try/catch above is the fix.
- Switching locale does nothing → the component isn't subscribed; read `i18n` via `useLingui()` instead of importing the singleton directly in the component.

## Verification

```bash
npx lingui extract --clean   # .po files update
npx tsc --noEmit             # *.po declaration + config type-check
npm run build                # macro wiring errors surface here
npm run preview
```

Then prove the transform ran: fill in one `msgstr` in a non-source `.po`, load `?lang=<that locale>` in `preview`, and confirm the translated string renders. English text there means the macro transform is a no-op, whatever the build said. Hard-load a deep link too (a route path typed straight into the address bar) — that is the only check that catches a missing SPA fallback.
