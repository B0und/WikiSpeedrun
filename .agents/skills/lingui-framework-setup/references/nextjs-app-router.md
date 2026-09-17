# Lingui + Next.js App Router

React Server Components cannot read React context, so the client-side `I18nProvider` alone cannot serve an App Router app. Lingui ships a server-side store (`setI18n` / RSC-aware `useLingui` in `@lingui/react/server`) that works through React's request `cache` — the setup below wires both halves.

Paths assume `src/`; if the project has no `src/` directory, drop that segment everywhere.

## Packages

```bash
npm install '@lingui/core@^6' '@lingui/react@^6'
npm install -D '@lingui/cli@^6' '@lingui/swc-plugin@<exact version>'
```

`@lingui/swc-plugin` must be **pinned to an exact version** chosen for the Next.js version the lockfile resolved — the **swc-plugin-compatibility** skill has the selection steps (host version → `swc_core` range → newest plugin in range whose peer admits the installed `@lingui/core`). A caret range resolves to the newest plugin, which is regularly built against a newer `swc_core` than Next's bundled SWC accepts, so `^` is a build break waiting for the next `npm update`. If no plugin that installs beside `@lingui/core@6` fits this Next.js version, upgrade Next.js or take the Babel path below; older plugin majors peer on older `@lingui/core` majors and will not install.

If the project has a `.babelrc`, Next.js silently disables its SWC compiler entirely — use `@lingui/babel-plugin-lingui-macro` in that Babel config instead of the SWC plugin (plus `babel-plugin-macros` and an explicit `@babel/types`), and know that the project has already paid the slower-build cost.

Do **not** install `@lingui/loader` — it is a webpack loader, and Turbopack is the default bundler in Next 15/16, so a loader-based catalog pipeline silently never runs. Compiled catalogs (below) work under both bundlers.

## Build tool integration

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
}
export default nextConfig
```

The entry must be a `[name, options]` **tuple** even with empty options — a bare string is silently ignored and macros never transform (build still green).

## lingui.config.ts and catalog scripts

```ts
import { defineConfig } from '@lingui/cli'

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en', 'fr', 'ar'],
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  compileNamespace: 'ts',
})
```

There is no Vite plugin here to compile `.po` on the fly, so the app imports **compiled** catalogs and `lingui compile` must run before anything builds or type-checks:

```json
{
  "scripts": {
    "lingui:extract": "lingui extract --clean",
    "lingui:compile": "lingui compile",
    "dev": "lingui compile && next dev",
    "build": "lingui compile && next build"
  }
}
```

Prepend to the existing scripts, never replace them, and don't use a `prebuild` hook (pnpm ≥ 7 and Yarn Berry skip pre/post hooks). Gitignore rules for the compiled `messages.ts` files: extension-scoped, never the directory — see the lingui-best-practices skill.

## Locale module

Create the shared `src/i18n/locales.ts` (`locales`, `sourceLocale`, `resolveLocale`, `getDirection`, `localeDisplayName`) exactly as the lingui-best-practices skill defines it. It is pure — safe to import from middleware (Edge runtime), layouts, and client components alike. Never inline `dir={locale === 'ar' ? 'rtl' : 'ltr'}` in a layout; that conditional multiplies across files and misses the other RTL languages.

## I18n instances for server components

One instance per locale, created once at module scope. The global `i18n` singleton from `@lingui/core` is a trap on the server: two concurrent requests for different locales race over `activate()` and users see each other's language.

```ts
// src/appRouterI18n.ts
import 'server-only'
import { setupI18n, type I18n, type Messages } from '@lingui/core'
import { locales, sourceLocale, type Locale } from './i18n/locales'

export const allMessages: Record<string, Messages> = {}
for (const locale of locales) {
  const { messages } = await import(`./locales/${locale}/messages`)
  allMessages[locale] = messages
}

const instances = new Map<Locale, I18n>()
for (const locale of locales) {
  instances.set(locale, setupI18n({ locale, messages: { [locale]: allMessages[locale] } }))
}

export function getI18nInstance(locale: Locale): I18n {
  return instances.get(locale) ?? instances.get(sourceLocale)!
}
```

```ts
// src/initLingui.ts
import { setI18n } from '@lingui/react/server'
import type { I18n } from '@lingui/core'
import { getI18nInstance } from './appRouterI18n'
import { resolveLocale } from './i18n/locales'

export function initLingui(locale: string): I18n {
  const i18n = getI18nInstance(resolveLocale(locale))
  setI18n(i18n)
  return i18n
}
```

**Call `initLingui(locale)` at the top of every layout AND every page that renders translations.** Next renders segments independently, and on client-side navigation only the page re-renders — a page that relies on its layout having called `setI18n` breaks on soft navigation.

## Client provider

```tsx
// src/components/LinguiClientProvider.tsx
'use client'
import { I18nProvider } from '@lingui/react'
import { setupI18n, type Messages } from '@lingui/core'
import { useState } from 'react'

export function LinguiClientProvider({
  children,
  initialLocale,
  initialMessages,
}: {
  children: React.ReactNode
  initialLocale: string
  initialMessages: Messages
}) {
  // useState, not useMemo: the instance must never be re-created on re-render,
  // only on a locale change remount.
  const [i18n] = useState(() =>
    setupI18n({ locale: initialLocale, messages: { [initialLocale]: initialMessages } }),
  )
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
```

## Layouts — the two-layout pattern

Pages move under `src/app/[locale]/`. Two layouts, not one:

- the **root layout** (`src/app/layout.tsx`) owns `<html>` and wraps everything in the provider with a `sourceLocale` fallback — root-level routes like `not-found.tsx` and `error.tsx` live outside `[locale]`, and without this outer provider they crash instead of rendering in the source language;
- the **locale layout** (`src/app/[locale]/layout.tsx`) validates the param, declares `generateStaticParams`, and calls `initLingui` — its inner provider takes precedence via normal context nesting and supplies the real locale.

```tsx
// src/app/layout.tsx
import { LinguiClientProvider } from '../components/LinguiClientProvider'
import { allMessages } from '../appRouterI18n'
import { getDirection, sourceLocale } from '../i18n/locales'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={sourceLocale} dir={getDirection(sourceLocale)}>
      <body>
        <LinguiClientProvider initialLocale={sourceLocale} initialMessages={allMessages[sourceLocale]}>
          {children}
        </LinguiClientProvider>
      </body>
    </html>
  )
}
```

```tsx
// src/app/[locale]/layout.tsx
import { notFound } from 'next/navigation'
import { LinguiClientProvider } from '../../components/LinguiClientProvider'
import { allMessages } from '../../appRouterI18n'
import { initLingui } from '../../initLingui'
import { locales } from '../../i18n/locales'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}) {
  const { locale } = await params // params is a Promise in Next 15+; plain object in 13/14
  if (!(locales as readonly string[]).includes(locale)) notFound()
  initLingui(locale)

  return (
    <LinguiClientProvider initialLocale={locale} initialMessages={allMessages[locale]}>
      {children}
    </LinguiClientProvider>
  )
}
```

One catch the two-layout pattern does not fix: the root layout renders `<html lang>` with the source locale, and the locale layout cannot re-render `<html>`. If correct `lang`/`dir` on the first byte matters more than translated root-level error pages, collapse to a single `[locale]` layout owning `<html lang={locale}>` plus a `[locale]/[...rest]` catch-all that calls `notFound()` — both shapes are legitimate; pick one deliberately.

## Using translations

Server and client components share the same macro imports:

```tsx
import { Trans, useLingui } from '@lingui/react/macro'

export function Greeting() {
  const { t } = useLingui() // in RSC this reads the setI18n store, not context
  return <h1 title={t`Welcome`}><Trans>Welcome</Trans></h1>
}
```

`generateMetadata` runs outside component rendering, so hooks and the request cache don't apply — take the instance explicitly:

```tsx
import { t } from '@lingui/core/macro'
import { getI18nInstance } from '../../appRouterI18n'
import { resolveLocale } from '../../i18n/locales'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const i18n = getI18nInstance(resolveLocale(locale)) // params are strings; resolveLocale narrows to Locale
  return { title: t(i18n)`My App` }
}
```

## Middleware and routing strategy

Ask the user which URL strategy they want before restructuring:

1. **Unprefixed source locale** — `/about` serves the source language, `/fr/about` the rest. Middleware **rewrites** bare paths internally (URL unchanged). Best when existing URLs must not move.
2. **All locales prefixed** — `/en/about`, `/fr/about`; bare paths **301-redirect** to the source prefix. The 301 is safe only because the target is deterministic (always source locale), never detection-based — a detection-based permanent redirect gets cached wrong.

```ts
// src/middleware.ts (Next 14/15) — see the Next 16 note below
import { NextRequest, NextResponse } from 'next/server'
import { locales, sourceLocale } from './i18n/locales'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  )
  if (hasLocale) return

  request.nextUrl.pathname = `/${sourceLocale}${pathname}`
  return NextResponse.rewrite(request.nextUrl)        // strategy 1
  // return NextResponse.redirect(request.nextUrl, 301) // strategy 2
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

Rules that prevent real breakage:

- **Merge, don't replace.** If `middleware.ts`/`proxy.ts` already exists (auth, headers), merge the locale logic into it and show the user the merged file. Two middleware files is not a thing; the second is ignored.
- **Next 16 renamed the convention**: file `middleware.ts` → `proxy.ts` **and** the exported function `middleware` → `proxy` (default export also works). On Next 16 create `proxy.ts` with `export function proxy(...)`; on an existing project use the codemod `npx @next/codemod middleware-to-proxy .` rather than hand-editing. Never leave both files in one project.
- Middleware runs on the Edge/proxy boundary — import only the pure `locales.ts` constants, never the i18n instances.
- Optional first-visit negotiation: read a `locale` cookie, fall back to `Accept-Language`, and only then to `sourceLocale`; persist the result with `response.cookies.set(...)` so the header parse happens once per browser, not per request.

### hreflang

Per-locale alternates belong in `generateMetadata` on the `[locale]` layout (absolute URLs required, so a `NEXT_PUBLIC_SITE_URL` env var): map `locales` to `alternates.languages` plus an `x-default` pointing at the source locale. This dedupes the same page across locales for search engines.

## Language switcher

```tsx
// src/app/[locale]/LanguageSwitcher.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, localeDisplayName, resolveLocale } from '../../i18n/locales'

export function LanguageSwitcher() {
  const pathname = usePathname() // includes the locale prefix
  const segments = pathname.split('/')
  const current = resolveLocale(segments[1])
  const rest = (locales as readonly string[]).includes(segments[1])
    ? '/' + segments.slice(2).join('/')
    : pathname

  return (
    <nav>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${rest === '/' ? '' : rest}`}
          hrefLang={locale}
          aria-current={locale === current ? 'true' : undefined}
        >
          {localeDisplayName(locale)}
        </Link>
      ))}
    </nav>
  )
}
```

Under strategy 1, strip the prefix for the source locale instead of adding `/{sourceLocale}`. Label with `localeDisplayName` (each language in its own tongue) — never a hand-maintained name map.

## Next.js Pages Router (brief)

Lingui fully supports the Pages Router — the official `nextjs-swc` example ships both routers side by side. Tell users so, and wire the simpler shape: Next's built-in i18n routing (`i18n: { locales, defaultLocale }` in `next.config`, a Pages-Router-only feature), catalogs loaded in `getStaticProps`/`getServerSideProps`, and a plain `I18nProvider` in `_app.tsx`. No `setI18n`, no instance map — there are no server components. The packages, `lingui.config`, scripts, and locale module above all carry over unchanged.

## Advanced: per-page catalogs

`lingui extract-experimental` can co-locate one catalog per page (smaller per-route payloads at the cost of per-page load boilerplate and duplicated shared strings). Its extractor resolves the pages' dynamic catalog imports at extract time, so on the **first** run every import target must already exist — seed one `export const messages = {}` stub per page per locale, or the extract exits with `Could not resolve import(...)`. Prefer the single-catalog setup above until bundle analysis says otherwise.

## Gotchas

- Build crashes with `Failed to execute SWC plugin` / `failed to run Wasm plugin transform` / `Failed to deserialize program received from host` → SWC plugin/host version mismatch, usually a caret range that resolved to a plugin newer than Next's bundled SWC; fix per the swc-plugin-compatibility skill, don't touch app code.
- `<Trans>` renders raw source text with a green build → transform not running: bare-string plugin entry, or a `.babelrc` turned SWC off while the SWC plugin is configured.
- `global-error.tsx` replaces the root layout entirely — no provider exists there; keep it hardcoded in the source language.
- Statically rendered pages evaluate module scope once at build time — a module-level `t\`...\`` bakes one locale into every page; use `msg` descriptors resolved at render (see lingui-best-practices).

## Verification

```bash
npx lingui extract --clean   # per-locale .po files update
npx lingui compile           # emits src/locales/*/messages.ts
npx tsc --noEmit
npm run build                # both bundlers: macro errors surface here
```

Then load a prefixed URL for a non-source locale and confirm translated HTML arrives in the raw response (`curl -s http://localhost:3000/fr | grep <a French string>`), not after hydration.
