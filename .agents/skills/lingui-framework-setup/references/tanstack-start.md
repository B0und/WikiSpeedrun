# Lingui + TanStack Start

TanStack Start renders HTML per request, so the locale is resolved by server middleware and the i18n instance is created **per request** — the shape Lingui's official `tanstack-start` example uses. A module-level singleton works in dev with one user and bleeds locales between concurrent requests in production.

Detection: `@tanstack/react-start` in dependencies. (Plain `@tanstack/react-router` without `react-start` is a client SPA — use [vite-spa.md](vite-spa.md).)

## Packages

```bash
npm install '@lingui/core@^6' '@lingui/react@^6'
npm install -D '@lingui/cli@^6' '@lingui/vite-plugin@^6'
```

plus a macro transform picked by what's installed:

- `@vitejs/plugin-react@^5` → `@lingui/babel-plugin-lingui-macro` via the plugin's `babel` option.
- `@vitejs/plugin-react@^6` (no `babel` option) → run the macro as a standalone Babel pass: `babel({ presets: [linguiTransformerBabelPreset()] })` with `@rolldown/plugin-babel` on Vite 8, or `vite-plugin-babel` with `plugins: ['@lingui/babel-plugin-lingui-macro']` on Vite ≤ 7. `linguiTransformerBabelPreset` comes from `@lingui/vite-plugin` (6.6+).
- `@vitejs/plugin-react-swc` → `@lingui/swc-plugin`, exact-pinned to the `@swc/core` the lockfile resolved (see swc-plugin-compatibility).

On either Babel path, install `@babel/types` alongside `@lingui/babel-plugin-lingui-macro` — unmet peer, and `lingui extract` crashes with `ERR_MODULE_NOT_FOUND` without it.

`@lingui/detect-locale` has no place here: its detectors read `navigator`/`localStorage` and throw during SSR. The middleware below resolves the locale from the request instead.

## Build tool integration

**`@vitejs/plugin-react` `^5`** — the macro rides inside the React plugin:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { lingui } from '@lingui/vite-plugin'

export default defineConfig({
  plugins: [
    lingui(),           // compiles .po imports on the fly — no `lingui compile` step
    tanstackStart(),
    viteReact({
      babel: { plugins: ['@lingui/babel-plugin-lingui-macro'] },
    }),
  ],
})
```

**`@vitejs/plugin-react` `^6`+ on Vite 8** — the `babel` option is gone, so the macro runs as its own pass **after** `viteReact()`:

```ts
import babel from '@rolldown/plugin-babel'
import { lingui, linguiTransformerBabelPreset } from '@lingui/vite-plugin'

export default defineConfig({
  plugins: [
    lingui(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [linguiTransformerBabelPreset()] }),
  ],
})
```

Ordering rules, both of which produce silent failures rather than errors:

- **`viteReact()` must come after `tanstackStart()`** (from the Start docs) — reversed, Start's code splitting and server/client boundary handling break.
- **The standalone macro pass goes last, after `viteReact()`.** It transforms the macro calls; running it ahead of the React plugin leaves nothing reliable for it to match on.

Add the `*.po` module declaration from [vite-spa.md](vite-spa.md).

`lingui.config.ts` is the standard single-catalog shape (`src/locales/{locale}/messages`, `include: ['src']`) — see [vite-spa.md](vite-spa.md); build the shared `src/i18n/locales.ts` module first (lingui-best-practices).

## Locale resolution + per-request instance

```ts
// src/i18n/index.ts — client-safe; must NOT import the route tree (that's a cycle:
// routes import i18n, so i18n importing routeTree deadlocks module resolution)
import type { I18n } from '@lingui/core'
import { type Locale } from './locales'

export async function dynamicActivate(i18n: I18n, locale: Locale) {
  const { messages } = await import(`../locales/${locale}/messages.po`)
  i18n.loadAndActivate({ locale, messages })
}
```

```ts
// src/i18n/locale.server.ts — request parsing stays server-only
import { parse, serialize } from 'cookie-es'
import { resolveLocale, sourceLocale } from './locales'

const COOKIE = { maxAge: 60 * 60 * 24 * 365, path: '/' }

export function getLocaleFromRequest(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('locale')
  if (query) {
    const locale = resolveLocale(query)
    // ?locale= wins and is persisted — it makes locale links shareable
    return { locale, setCookie: serialize('locale', locale, COOKIE) }
  }
  const cookie = parse(request.headers.get('cookie') ?? '').locale
  if (cookie) return { locale: resolveLocale(cookie) }
  const header = request.headers.get('accept-language')?.split(',')[0]?.split(';')[0]
  const locale = header ? resolveLocale(header) : sourceLocale
  return { locale, setCookie: serialize('locale', locale, COOKIE) }
}
```

```ts
// src/start.ts — global request middleware: one fresh i18n per request
import { createStart, createMiddleware } from '@tanstack/react-start'
import { setupI18n } from '@lingui/core'
import { getLocaleFromRequest } from './i18n/locale.server'
import { dynamicActivate } from './i18n'

const linguiMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ request, next }) => {
    const { locale, setCookie } = getLocaleFromRequest(request)
    const i18n = setupI18n()
    await dynamicActivate(i18n, locale)
    const result = await next({ context: { locale, i18n } })
    if (setCookie) result.response.headers.append('Set-Cookie', setCookie)
    return result
  },
)

export const startInstance = createStart(() => ({
  requestMiddleware: [linguiMiddleware],
}))
```

If `src/start.ts` already registers middleware, merge into the existing array.

**Current versions auto-discover this file.** Start resolves `<srcDirectory>/start.ts` as a first-class entry and falls back to a stub that exports `startInstance = undefined`, so exporting `startInstance` is enough — no import from the server entry is needed. Confirm it for the installed version before adding one:

```bash
# Should list `start` alongside the client/server/router entries
grep -r 'defaultEntry: "start"' node_modules/@tanstack/start-plugin-core/dist
```

On versions without that resolution, an unreferenced `startInstance` is tree-shaken and the middleware silently never runs — there, import `./start` from the server entry (a side-effect import is enough).

## Router wiring: provider + dehydrate/hydrate

The router carries the instance: on the server it takes the per-request one from Start's global context; on the client it creates a fresh one and fills it from the dehydrated payload — **before React hydrates**, so the first client render matches the server HTML exactly.

```tsx
// src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { getGlobalStartContext } from '@tanstack/react-start'
import { setupI18n, type I18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { routeTree } from './routeTree.gen'

export interface AppContext {
  i18n: I18n
}

export function getRouter() {
  // server: per-request; client: fresh.
  // The cast is load-bearing on current versions — see the note below.
  const globalContext = getGlobalStartContext() as
    | Partial<{ locale: string; i18n: I18n }>
    | undefined
  const i18n = globalContext?.i18n ?? setupI18n()

  const router = createTanStackRouter({
    routeTree,
    context: { i18n },
    Wrap: ({ children }) => <I18nProvider i18n={i18n}>{children}</I18nProvider>,
  })

  if (router.isServer) {
    router.options.dehydrate = async () => ({
      i18n: { locale: i18n.locale, messages: i18n.messages },
    })
  } else {
    router.options.hydrate = async (dehydrated) => {
      i18n.loadAndActivate(dehydrated.i18n) // runs before hydration → no mismatch, no msgid flash
    }
  }

  return router
}
```

**Why `getGlobalStartContext()` needs a cast.** Its signature resolves the request-middleware context with the middleware list pinned to `[]`, so the return type collapses to `never` — `getGlobalStartContext()?.i18n` is then a type error (`Property 'i18n' does not exist on type 'never'`) no matter what `Register` declares. Registering the start instance is still worth doing — it types middleware context for server functions — but it does not fix this call site, and `tsr generate` already writes that registration into `routeTree.gen.ts` once `src/start.ts` exists. Read that file rather than hand-writing a `Register` augmentation. Keep the cast narrow and commented: if a future version widens the signature, it is the one line to delete.

The root route reads the instance for the document shell:

```tsx
// src/routes/__root.tsx
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { useLingui } from '@lingui/react'
import { getDirection } from '../i18n/locales'
import type { AppContext } from '../router'

export const Route = createRootRouteWithContext<AppContext>()({
  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { i18n } = useLingui()
  return (
    <html lang={i18n.locale} dir={getDirection(i18n.locale)}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

Do **not** mutate `document.documentElement.lang` anywhere in client code — the server renders the attributes correctly on the first byte, and a client write fights that output.

## Language switcher

The commit is a server-set cookie followed by a **full document navigation**, so the very next SSR pass sees the new locale. A pure client-side catalog swap leaves the cookie stale — the next server render (navigation, refresh, shared link) flips the language back.

```ts
// src/functions/locale.ts
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { serialize } from 'cookie-es'
import { resolveLocale } from '../i18n/locales'

export const updateLocale = createServerFn({ method: 'POST' })
  .inputValidator((locale: string) => locale)
  .handler(async ({ data }) => {
    setResponseHeader(
      'Set-Cookie',
      serialize('locale', resolveLocale(data), { maxAge: 60 * 60 * 24 * 365, path: '/' }),
    )
  })
```

```tsx
// src/components/LanguageSwitcher.tsx
import { useLingui } from '@lingui/react'
import { locales, localeDisplayName } from '../i18n/locales'
import { updateLocale } from '../functions/locale'

export function LanguageSwitcher() {
  const { i18n } = useLingui()
  return (
    <select
      value={i18n.locale}
      aria-label="Language"
      onChange={async (e) => {
        await updateLocale({ data: e.target.value })
        window.location.reload() // full navigation: next SSR reads the new cookie
      }}
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>{localeDisplayName(locale)}</option>
      ))}
    </select>
  )
}
```

`?locale=fr` on any URL also switches (the middleware reads it first and persists it) — handy for links and testing.

## Locale-prefixed URLs (optional)

The recipe above is cookie-only. For `/$locale/`-prefixed routes: mount routes under `src/routes/$locale/`, derive the locale in the root route's `beforeLoad` from `location.pathname` (the URL outranks the cookie — links must land where they say), redirect bare paths with `throw redirect({ href: \`/${locale}${pathname}\` })` — `href`, not `to`, because `to` is typed against the route tree and rejects concatenated strings. Keep TanStack's `<Link>` unwrapped and pass `params={{ locale }}` natively; a wrapper erases its route-tree typing. If catalogs are co-located per route (`lingui extract-experimental`), add `routeFileIgnorePattern: 'locales/'` to the router plugin config so catalog files aren't scanned as routes.

## Gotchas

- **Middleware never runs** (always source locale): check the filename and location first — Start auto-discovers `<srcDirectory>/start.ts` by exact name, so `src/start.tsx`, `src/app/start.ts`, or a differently-named file is simply never loaded. On older versions without that resolution, an unreferenced `startInstance` is tree-shaken instead; there, import `./start` from the server entry.
- **Build green, UI in the source language, no errors**: the macro transform isn't wired. On `@vitejs/plugin-react@6` this is usually a `babel` option that was silently ignored, or a standalone macro pass placed before `viteReact()` instead of after it.
- **`localStorage is not defined` / `navigator is not defined` during SSR**: `@lingui/detect-locale` got installed (often copied from a SPA guide) — uninstall it; the middleware replaces it.
- **Hydration mismatch on `<html>`**: client code mutates `document.documentElement` — remove the mutation, the server owns those attributes.
- **Language reverts after navigating**: the switcher swapped catalogs client-side without committing the cookie — commit via the server function + full navigation.
- **Import cycle / undefined routeTree**: an i18n module imports from `routes/` or `routeTree.gen` — keep i18n modules leaf-level.

## Verification

```bash
npx lingui extract --clean
npx tsc --noEmit
npm run build
```

Then first-byte checks without JS:

```bash
curl -s -H 'Accept-Language: fr' http://localhost:3000/ | grep 'lang="fr"'
curl -s 'http://localhost:3000/?locale=fr' | grep '<a French string>'
```
