# Lingui + React Router 7 (framework mode) / Remix v2

React Router 7 framework mode is the continuation of Remix; both render HTML per request through a root `loader` chain, so the locale must be resolved **server-side per request** — anything browser-detected paints the wrong language first and desyncs hydration. One recipe covers both; the package-name mapping is at the end.

Detection: RR7 = `react-router@^7` + `@react-router/dev` + `react-router.config.*`. Remix = `@remix-run/*` ≥ 2.7 + `vite` (the classic pre-Vite Remix compiler is not covered). `react-router` **without** `@react-router/dev` is a declarative SPA — use [vite-spa.md](vite-spa.md).

## Packages

```bash
npm install '@lingui/core@^6' '@lingui/react@^6'
npm install -D '@lingui/cli@^6' '@lingui/vite-plugin@^6' '@lingui/format-po@^6' \
  '@lingui/babel-plugin-lingui-macro@^6' '@vitejs/plugin-react@^5'
```

`@vitejs/plugin-react` is not in the RR7 scaffold — the `reactRouter()` plugin handles React itself but exposes no Babel hook, so the macro transform needs its own Babel-capable React plugin. The `^5` pin is deliberate: v6 removed the `babel` option this setup depends on. (Alternative: `vite-plugin-babel-macros` works too; prefer the plugin-react path because it matches Lingui's installation guide.) If the project already uses `@vitejs/plugin-react-swc`, use `@lingui/swc-plugin` (exact pin — see swc-plugin-compatibility) inside it instead.

Add `@babel/types` too: it is an unmet peer of `@lingui/babel-plugin-lingui-macro` whenever that plugin is a direct dependency, and `lingui extract` crashes with `ERR_MODULE_NOT_FOUND` without it. On a Vite 8 project the `^5` pin is avoidable — keep `@vitejs/plugin-react` at v6 and run the macro as the standalone Babel pass described in [vite-spa.md](vite-spa.md), in the same plugin position as `react()` below.

No `@lingui/detect-locale` — it is browser-only and throws or lies under SSR; the request itself carries the locale.

## Build tool integration

Plugin order is a contract, not a style choice:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite' // Remix: import { vitePlugin as remix } from '@remix-run/dev'
import react from '@vitejs/plugin-react'
import { lingui } from '@lingui/vite-plugin'

export default defineConfig({
  plugins: [
    reactRouter(),  // 1st: rewrites route modules; later plugins must see the rewritten output
    react({ babel: { plugins: ['@lingui/babel-plugin-lingui-macro'] } }), // 2nd: expands macros
    lingui(),       // 3rd: serves compiled .po imports; must run after macros are expanded
  ],
})
```

Keep every pre-existing plugin (`tsconfigPaths()`, `tailwindcss()`, …) in its original position; if `react()` already has Babel plugins, append to that array. `react-router.config.ts` is unrelated to this — it has no transform options; don't edit it for Lingui.

## lingui.config.ts

```ts
import { defineConfig } from '@lingui/cli'
import { formatter } from '@lingui/format-po'
import { locales, sourceLocale } from './app/i18n/locales'

export default defineConfig({
  sourceLocale,
  locales: [...locales],
  catalogs: [
    {
      path: '<rootDir>/app/locales/{locale}/messages',
      include: ['app'],
      exclude: ['**/node_modules/**', '**/+types/**'],
    },
  ],
  format: formatter({ lineNumbers: false }),
})
```

The `**/+types/**` exclusion keeps the extractor out of RR7's generated type files. `lineNumbers: false` keeps catalog diffs reviewable. The `.po` files are imported directly (compiled on the fly by `lingui()`), so there is no compile step and nothing to gitignore. Add the `*.po` module declaration from [vite-spa.md](vite-spa.md) so TypeScript accepts the imports.

Create `app/i18n/locales.ts` per the lingui-best-practices locale module first — the config above imports from it.

## Locale resolution (server side)

```ts
// app/i18n/locale.server.ts
import { createCookie } from 'react-router' // Remix: from '@remix-run/node'
import { resolveLocale, type Locale } from './locales'

export const localeCookie = createCookie('locale', {
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
})

export async function readLocaleFromRequest(request: Request): Promise<Locale> {
  const cookieValue = await localeCookie.parse(request.headers.get('Cookie'))
  if (typeof cookieValue === 'string') return resolveLocale(cookieValue)
  const header = request.headers.get('Accept-Language')
  return resolveLocale(header?.split(',')[0]?.split(';')[0]?.trim())
}
```

The `.server.ts` suffix makes Vite exclude the file from the client bundle — cookie parsing is server-only. That is exactly why `getDirection` must **not** live here: client components need it for `dir`-sensitive rendering, and a `.server` import from client code is a build error. It stays in the pure `locales.ts`.

## Root module

```tsx
// app/root.tsx
import type { Route } from './+types/root' // Remix: use LoaderFunctionArgs from @remix-run/node
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from 'react-router'
import { setupI18n, type I18n, type Messages } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { localeCookie, readLocaleFromRequest } from './i18n/locale.server'
import { getDirection, sourceLocale, type Locale } from './i18n/locales'

export async function loader({ request }: Route.LoaderArgs) {
  const locale = await readLocaleFromRequest(request)
  // Keyed dynamic import → Vite emits one chunk per locale, picked at request
  // time. Statically importing every catalog ships all locales to every client.
  const { messages } = (await import(`./locales/${locale}/messages.po`)) as { messages: Messages }
  return Response.json(
    { locale, dir: getDirection(locale), messages },
    // Persist even header-derived locales: the Accept-Language parse then
    // happens once per browser, not once per request.
    { headers: { 'Set-Cookie': await localeCookie.serialize(locale) } },
  )
}

// Per-locale instances: concurrent SSR requests for different locales would
// race over a shared global's activate(). On the client the map holds one entry.
const instances = new Map<Locale, I18n>()
function getI18n(locale: Locale, messages: Messages): I18n {
  let i18n = instances.get(locale)
  if (!i18n) {
    i18n = setupI18n()
    instances.set(locale, i18n)
  }
  i18n.loadAndActivate({ locale, messages })
  return i18n
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData('root') as { locale: Locale; dir: 'ltr' | 'rtl' } | undefined
  return (
    <html lang={data?.locale ?? sourceLocale} dir={data?.dir ?? 'ltr'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App({ loaderData }: Route.ComponentProps) {
  const i18n = getI18n(loaderData.locale, loaderData.messages)
  return (
    <I18nProvider i18n={i18n}>
      <Outlet />
    </I18nProvider>
  )
}
```

Two rules the shape depends on:

- **`Layout` reads `useRouteLoaderData('root')`, never `useLoaderData()`.** `Layout` also renders around the `ErrorBoundary`, where `useLoaderData` throws; and in any nested component `useLoaderData` returns the *closest* route's data, which silently lacks `locale`. The `?? sourceLocale` fallback covers the loader-errored render.
- The catalog is activated synchronously from `loaderData` before the tree renders, so the first server-rendered byte is already translated — no client-side activation effects, no FOUC, no `document.documentElement` mutation (which would fight the server-rendered attributes).

Page routes then just use macros — no per-route i18n code:

```tsx
import { Trans } from '@lingui/react/macro'
export default function About() {
  return <h1><Trans>About us</Trans></h1>
}
```

For raw locale access (e.g. `Intl` formatting), read `useRouteLoaderData('root')`.

## Routing strategies

The recipe above is **cookie-only** (no URL changes) — the right default for auth-gated apps and internal tools. If the user wants locale-prefixed URLs, ask them to choose, then adjust the loader:

- **All locales prefixed**: mount routes under `:lang` (config-based: `...prefix(':lang', [...])` in `app/routes.ts`; fs-routes: `$lang.` filename prefix). Root loader: if the first path segment isn't a known locale, `throw redirect('/' + resolvedLocale + pathname)`; otherwise the URL segment **is** the locale — the URL outranks the cookie so links land where they say.
- **Unprefixed source locale**: source routes keep bare paths, targets nest under `:lang` (config-based needs explicit `id` overrides — the same file can't register twice under one id; fs-routes: optional `($lang).` segment). Loader prefers a valid URL param, else the cookie. Redirect `/${sourceLocale}/...` to the bare path for SEO canonicalization.

Internal links then need the locale prefix — centralize a `localePath(path, locale)` helper next to `locales.ts` rather than scattering template literals.

## Language switcher

The switcher posts to an action that writes the cookie and redirects — the full request cycle is the point: the next render comes from the server with the new locale, so no mixed-language frames during streaming.

```ts
// app/routes/set-locale.ts
import type { Route } from './+types/set-locale'
import { redirect } from 'react-router'
import { localeCookie } from '../i18n/locale.server'
import { resolveLocale } from '../i18n/locales'

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const locale = resolveLocale(String(form.get('locale') ?? ''))
  const raw = String(form.get('returnTo') ?? '/')
  // Only same-origin paths: an unvalidated returnTo is an open redirect.
  const returnTo = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/'
  return redirect(returnTo, {
    headers: { 'Set-Cookie': await localeCookie.serialize(locale) },
  })
}
```

Register it (`route('set-locale', 'routes/set-locale.ts')` in `app/routes.ts`; fs-routes pick it up by filename). The component is a plain `<Form method="post">` per locale with hidden `locale` and `returnTo={location.pathname + location.search}` inputs, labeled via `localeDisplayName` — and it works before hydration, which a JS-only switcher does not.

## Remix v2 mapping

| RR7 | Remix v2 |
|---|---|
| `@react-router/dev` / `reactRouter()` | `@remix-run/dev` / `vitePlugin as remix` |
| imports from `react-router` | `@remix-run/react` (components/hooks), `@remix-run/node` (`createCookie`, `redirect`) |
| `./+types/<route>` generated types | `LoaderFunctionArgs` / `ActionFunctionArgs` from `@remix-run/node` |
| `react-router dev` / `build` / `typegen` | `remix vite:dev` / `remix vite:build` (no typegen) |
| `app/routes.ts` config or fs-routes | fs-routes flat convention |

Everything else — loader shape, cookie helper, instance map, switcher action — is identical.

## Gotchas

- `Trans is not defined` at build/runtime → the macro transform didn't run: `@vitejs/plugin-react` missing, on v6 (no `babel` option), or ordered before `reactRouter()`.
- `Cannot find name 'Route'` → generated types missing; run `npx react-router typegen` (the dev server normally does this, but not on a fresh clone).
- Language switch appears to work then reverts on the next page → the action wrote the cookie but the switcher navigated client-side without revalidation; the `redirect()` from the action is what forces the round trip.

## Verification

```bash
npx react-router typegen     # RR7 only — Route.* types must exist before tsc
npx lingui extract --clean
npx tsc --noEmit
npm run build
```

Then prove first-byte correctness without JS:

```bash
curl -s -H 'Accept-Language: de' http://localhost:5173/ | grep 'lang="de"'
curl -s -c /tmp/jar -d 'locale=de' -d 'returnTo=/' http://localhost:5173/set-locale -o /dev/null
curl -s -b /tmp/jar http://localhost:5173/ | grep '<a German string>'
```
