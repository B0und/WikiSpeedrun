# Wikipedia Vector 2022 Styling Implementation Plan

## Audience and objective

This document is the execution plan for the model implementing the Wikipedia article styling migration.

The result must render parsed Wikipedia article content with the same compiled style inputs used by the selected language edition's live Vector 2022 page, while preserving WikiSpeedrun navigation, timing, dark mode, responsive behavior, and user settings.

Read `WIKIPEDIA_STYLE_RESEARCH.md`, especially §16, before editing. That report contains the upstream evidence and request captures behind the decisions below.

## Fixed decisions

1. **Use runtime ResourceLoader CSS from the selected Wikipedia edition.** Do not copy raw Vector LESS and do not keep the current English CSS dump as the production source of truth.
2. **Render the article in an open `ShadowRoot`.** Full upstream CSS is allowed inside that boundary; it must not style the header, sidebar, dialogs, or settings UI.
3. **Keep application chrome application-owned.** Do not mount Vector's header, sidebar, sticky header, appearance menu, JavaScript modules, or `client-js` feature classes.
4. **Use three app-controlled presentation settings only:**
   - width: `standard | wide` (`standard` is labeled **Compact** in the UI),
   - font size: `small | standard | large`,
   - existing app theme: light or dark.
5. **No vendored upstream fallback.** Article HTML already depends on a live Wikipedia API request; an English snapshot would not provide exact fallback behavior for hundreds of language editions. A small app-authored adaptation stylesheet must keep failed stylesheet loads readable, but it must not imitate or fork Vector.
6. **Do not add a second data-loading convention.** Keep TanStack Query in `useWikiQuery`; the route remains client-rendered and needs no new loader.
7. **Clean cutover.** When the ShadowRoot path passes the focused tests and smoke checks, delete the legacy global CSS files and fake root feature classes. Do not leave a hidden legacy renderer or compatibility alias.

## Non-goals

- Reimplementing MediaWiki client JavaScript, preferences, collapsible behavior, or chrome.
- Loading ResourceLoader script modules or evaluating `jsconfigvars`.
- Matching the full Vector page shell; only the article title/content surface is in scope.
- Persisting Wikipedia CSS in local storage or IndexedDB.
- Replacing the existing dark-theme filter with a native Vector night-mode implementation.
- Changing TanStack Router paths or route search-state contracts.

## Target module shape

Keep the implementation to these seams:

### `getArticleData(language, title)`

Location: `src/components/Wiki/WikiDisplay.utils.tsx`.

Responsibilities:

- call the parse API with the selected language and Vector 2022 skin,
- validate the HTTP and parse response,
- return sanitized-independent article data plus stylesheet URLs,
- remain the only query function consumed by `useWikiQuery`.

Return contract:

```ts
interface WikiArticleData {
  html: string;
  title: string;
  pageid: number;
  revid: number;
  language: WikiLanguage;
  styleUrls: readonly string[];
}
```

Do not return raw API response objects to React components.

### `buildWikipediaStyleUrls(language, moduleStyles)`

Location: `src/components/Wiki/WikiDisplay.utils.tsx`, exported because its URL contract deserves a focused test.

Responsibilities:

- validate that `language` is one of the app-supported Wikipedia subdomains,
- validate ResourceLoader module names before putting them in a URL,
- deduplicate and sort module names for stable cache keys,
- split stable baseline, page-conditional, and site styles into separate URLs,
- use `skin=vector-2022` on ResourceLoader requests.

It must return URLs in cascade order:

1. stable baseline modules,
2. page-conditional modules, if any remain,
3. `site.styles` for the selected edition.

Stable baseline modules:

```text
skins.vector.styles
mediawiki.skinning.content.parsoid
ext.cite.parsoid.styles
```

Page-conditional modules come from `parse.modulestyles`. Filter out:

```text
site.styles
user.styles
noscript
skins.vector.icons
skins.vector.search.codex.styles
```

Also remove any baseline duplicate. Preserve unknown valid conditional style modules: they are the mechanism for Math, TimedMediaHandler, Cite, and template-specific extensions.

Each generated `load.php` URL must use:

```text
https://{language}.wikipedia.org/w/load.php
modules={pipe-separated module names}
only=styles
skin=vector-2022
lang={language}
debug=false
```

Use `URL` and `URLSearchParams`; do not concatenate query values manually.

### `WikiArticleSurface`

New file: `src/components/Wiki/WikiArticleSurface.tsx`.

Responsibilities:

- attach or reuse an open ShadowRoot on one stable host element,
- portal the article DOM, stylesheet links, and app adaptation stylesheet into that root,
- sanitize parse HTML immediately before injection,
- expose readiness only after all stylesheet links have loaded or failed,
- keep click and keyboard event handlers attached inside the ShadowRoot,
- apply font custom properties on the shadow host,
- report the actual content container to `WikiDisplay` when layout is ready.

Keep the props narrow:

```ts
interface WikiArticleSurfaceProps {
  article: WikiArticleData;
  fontSize: WikiArticleFontSize;
  isDark: boolean;
  onReady: (contentRoot: HTMLElement, styleState: "ready" | "degraded") => void;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
}
```

`WikiDisplay` owns game state and the outer width/title layout. `WikiArticleSurface` owns all ShadowRoot implementation details.

### `WikiPresentationMenu`

New file: `src/components/Wiki/WikiPresentationMenu.tsx`.

Responsibilities:

- render one icon button in `Header`, next to the existing theme control,
- render a desktop Radix Popover and a mobile Radix Drawer using one shared controls body,
- read/write persisted presentation settings,
- use semantic fieldsets and native radio inputs,
- occupy no permanent content width.

Do not put presentation controls inside Wikipedia HTML or the ShadowRoot.

## Required upstream requests

Update the parse request in `getArticleData` to include:

```text
action=parse
page={title}
prop=text|displaytitle|revid|modules|jsconfigvars
useskin=vector-2022
usearticle=1
origin=*
format=json
disableeditsection=true
redirects=true
```

Important distinctions:

- `parse.modulestyles` is returned by `prop=modules`; `modulestyles` is not a valid parse `prop` value.
- The parse API parameter is `useskin=vector-2022`.
- The ResourceLoader parameter is `skin=vector-2022`.
- Keep the existing response format rather than adding an unrelated `formatversion=2` migration.
- Read CSS modules only from `parse.modulestyles`; never request names from `parse.modules` as styles.

Extend `src/components/Wiki/Wiki.types.ts` so the raw parse type covers at least:

```ts
revid: number;
modules?: string[];
modulescripts?: string[];
modulestyles?: string[];
jsconfigvars?: Record<string, unknown>;
```

Fail the query on a non-2xx response, an API error object, or missing parse text. Do not silently render an empty article.

## ShadowRoot DOM and cascade

Render this semantic chain inside the ShadowRoot:

```html
<div class="wiki-insert skin-vector skin-vector-2022 [wiki-dark-theme]">
  <main class="mw-body">
    <div id="bodyContent" class="vector-body">
      <div id="mw-content-text" class="mw-body-content">
        <!-- sanitized parse.text root; normally .mw-parser-output -->
      </div>
    </div>
  </main>
</div>
```

Before the content, insert stylesheet nodes in this order:

1. ResourceLoader baseline link,
2. optional ResourceLoader page-module link,
3. selected edition `site.styles` link,
4. bundled app adaptation link.

The app adaptation stylesheet is new: `src/components/Wiki/styles/article-adaptations.css`. Import it with Vite's `?url` form and mount its `<link>` inside the ShadowRoot. A normal side-effect CSS import will not cross the shadow boundary.

The adaptation file must contain only application policy and shadow-boundary compensation:

- `:host { display: block; min-width: 0; }`,
- readable base foreground/background/font fallback,
- `.mw-body { display: block; }` to neutralize Vector's page-shell grid; outer app width owns standard versus wide mode,
- responsive media/image/table overflow safety,
- the current product rules that suppress citation backlinks, coordinates, and non-game chrome,
- the current dark filter and counter-filter for images/media,
- a minimal readable failure state when an upstream link errors.

Do not copy Vector rules into this file. Do not include selectors for unrelated app pages such as `.about-section`.

Do not add `html`, `body`, `.client-js`, or Vector feature-preference emulation inside the ShadowRoot. Root selectors and preference selectors intentionally do not match there. Keep the stable `skin-vector` and `skin-vector-2022` identity classes on the inner wrapper because selected-edition `site.styles` may legitimately scope content rules to the active skin.

### Font values

Set these inherited custom properties on the shadow host:

| Setting | `--font-size-medium` | `--line-height-content` |
|---|---:|---:|
| `small` | `0.875rem` | `1.5714285` |
| `standard` | `1rem` | `1.625` |
| `large` | `1.25rem` | `1.55` |

Use a typed `React.CSSProperties` extension for the custom properties. Do not vary browser zoom or scale the whole article with `transform`.

### Width values

Wrap the app-rendered title and the shadow host in one light-DOM article column in `WikiDisplay.tsx`:

- `standard`: `width: 100%`, `max-width: 59.25rem`, centered,
- `wide`: `width: 100%`, no maximum width.

This width belongs outside the ShadowRoot so the app title and article body align. The adaptation rule that resets `.mw-body` to block is required; otherwise upstream Vector grid CSS can reapply the 59.25rem cap in wide mode.

### Direction and language

Preserve the `lang` and `dir` attributes already present on the API's `.mw-parser-output` root. The CSS host must use the selected language's ResourceLoader endpoint so server-side CSSJanus output matches RTL editions. Do not maintain a hand-written RTL language list.

## Stylesheet readiness and game lifecycle

A page-dependent stylesheet can change whether a target link is visible. Winning-link counting and stopwatch resume must therefore happen after stylesheet settlement, not immediately after parse HTML arrives.

Implement the following state machine in `WikiArticleSurface`:

```text
article key changed -> loading
all stylesheet links loaded -> ready
one or more stylesheet links errored and all links settled -> degraded
```

Rules:

- The parent keys one surface instance per article; one mounted surface settles exactly one article's stylesheets.
- Treat `load` and `error` as settled so a failed stylesheet cannot deadlock the game.
- Report `onReady` directly from the last settling link event; Chromium applies `load`ed style sheets before the event dispatches, so layout-dependent `offsetWidth` checks see the final cascade without an extra animation frame. The cascade-at-readiness contract is locked by `WikiArticleSurface.test.tsx` ("reports readiness only after the final cascade hides winning links").
- Expose `aria-busy=true` while loading.
- Keep the existing loader visible until the article presentation settles.
- In degraded mode, show the article using the adaptation stylesheet; do not keep it hidden forever.

Refactor `useWikiQuery` so fetching and game lifecycle do not race:

1. `useWikiQuery` fetches and selects `WikiArticleData` only.
2. A small `useWikiArticleLifecycle(article, presentationReady)` hook owns the existing win detection, stopwatch start, and loading pause/resume behavior.
3. Process each article key once to remain safe under React StrictMode.
4. Run winning-link highlighting/counting from `WikiArticleSurface.onReady`, using the provided content root.

Do not let `useWikiQuery` start the stopwatch merely because HTML arrived; that would resume timing while the rendered article is still settling.

## Root-scoped article interactions

Prepare article DOM helpers before introducing Shadow DOM so each change is independently verifiable.

Change:

```ts
findVisibleWinningLinks(articleTitle)
```

to:

```ts
findVisibleWinningLinks(root: ParentNode, articleTitle)
```

Query only `root`. `WikiDisplay` passes the ready content container.

In `WikiLogic.tsx`:

- resolve hash targets from `event.currentTarget.getRootNode()` rather than `document.getElementById`,
- keep navigation through typed TanStack Router `useNavigate`,
- keep the existing same-host and `/wiki/` checks,
- keep navbox show/hide class toggling,
- attach click and keydown handlers to the wrapper rendered inside the ShadowRoot.

The wrapper no longer needs `role="button"` or `tabIndex={0}`. Its real anchors are already keyboard focusable and their events bubble to the delegated handler. Preserve the keydown delegation needed for Enter; do not make the entire article one giant button.

No route definitions, generated route tree files, or search-state codecs should change.

## Persisted presentation state

Update `src/stores/SettingsStore.ts` with:

```ts
type WikiArticleWidth = "standard" | "wide";
type WikiArticleFontSize = "small" | "standard" | "large";
```

Add flat state fields consistent with the existing store:

```ts
wikiArticleWidth: WikiArticleWidth;
wikiArticleFontSize: WikiArticleFontSize;
```

Defaults:

```text
wikiArticleWidth = standard
wikiArticleFontSize = standard
```

Add action methods and narrow selector hooks for both fields. Do not make `WikiDisplay` subscribe to the whole settings store.

Bump the persisted store version from 1 to 2 and add a migration that merges missing fields with the new defaults while preserving all version-1 values. The migration must also tolerate partially written version-2 data. Do not rename existing local-storage keys.

## Presentation menu behavior

Add `WikiPresentationMenu` to the existing icon row in `src/components/Header.tsx`. Keep it visible globally: the settings are persistent and users may configure an article before starting a run.

Desktop (`> 767px`, remembering this repository uses max-width Tailwind breakpoints):

- Radix Popover,
- trigger is a `react-feather` appearance/text icon,
- content uses the established `ArticlePreview` surface colors, radius, shadow, and focus treatment,
- no layout reservation while closed.

Mobile (`<= 767px`):

- reuse `Drawer` with a right-side sheet,
- render the same controls component rather than duplicating labels/state logic.

Controls:

- fieldset **Text size**: Small, Standard, Large,
- fieldset **Content width**: Compact, Wide,
- visible selected state and native keyboard behavior,
- localized trigger label **Article appearance**.

Add these keys to `src/i18n/en/index.ts` and every `Translation` locale file:

```text
Article appearance
Text size
Small
Standard
Large
Content width
Compact
Wide
```

Run `pnpm typesafe-i18n` after editing the locale sources. Do not hand-edit generated i18n utility/type files except through that generator.

## Incremental implementation commits

Each commit must compile and preserve the existing test before moving on. Do not defer a broken interaction to a later commit.

### Commit 1 — Extend the parse and ResourceLoader contract

Files:

- `src/components/Wiki/Wiki.types.ts`
- `src/components/Wiki/WikiDisplay.utils.tsx`
- `src/test_mocks/handlers.ts`
- `src/test_mocks/wiki_pages/ChahkandukBirjand.json`
- focused utility test beside `WikiDisplay.utils.tsx`

Changes:

- add explicit parse props and `useskin`,
- select `revid`, `language`, and `styleUrls`,
- add stable URL construction/filtering,
- make the MSW parse handler assert relevant `searchParams` rather than one order-sensitive query string,
- add `modulestyles` metadata to the committed fixture,
- mock `https://en.wikipedia.org/w/load.php` with deterministic CSS for browser tests.

Checkpoint:

- one request-contract test proves the parse query,
- one URL-builder test proves language host, baseline modules, page-module filtering, stable order, and separate `site.styles`,
- existing WikiDisplay test still passes.

### Commit 2 — Scope DOM behavior to an article root

Files:

- `src/components/Wiki/WikiDisplay.utils.tsx`
- `src/components/Wiki/WikiDisplay.tsx`
- `src/components/Wiki/WikiLogic.tsx`
- `src/components/Wiki/WikiDisplay.test.tsx`

Changes:

- pass a content root into winning-link discovery,
- resolve hash targets from the event root,
- remove direct article queries from `document`,
- retain current light-DOM rendering for this commit.

Checkpoint:

- navbox show/hide test passes,
- add or extend a browser test proving a same-page hash link finds its target inside the supplied article root,
- no global article query remains in these modules.

### Commit 3 — Introduce the ShadowRoot article surface

Files:

- new `src/components/Wiki/WikiArticleSurface.tsx`
- new `src/components/Wiki/styles/article-adaptations.css`
- `src/components/Wiki/WikiDisplay.tsx`
- `src/components/Wiki/WikiDisplay.utils.tsx`
- `src/components/Wiki/WikiDisplay.test.tsx`

Changes:

- create the open ShadowRoot and React portal,
- mount ResourceLoader and app adaptation links inside it,
- move sanitization and the minimal Vector article wrapper into the surface,
- implement stylesheet settlement and article-key reset,
- move lifecycle effects so counting and stopwatch resume occur after settlement,
- keep title rendering and game orchestration in `WikiDisplay`.

Checkpoint:

- mocked ResourceLoader CSS such as `.mw-parser-output a { color: ... }` visibly affects an article link,
- an invasive mock root rule such as `body { color: ... }` affects neither the shadow article nor the app header,
- navbox click, internal link navigation, and winning-link discovery still work through the open shadow tree,
- a simulated style error reaches `degraded` and does not leave the loader or stopwatch permanently blocked.

### Commit 4 — Add persisted width and font settings

Files:

- `src/stores/SettingsStore.ts`
- `src/components/Wiki/WikiDisplay.tsx`
- `src/components/Wiki/WikiArticleSurface.tsx`
- focused store/display tests

Changes:

- add state types, fields, actions, selectors, defaults, and version-2 migration,
- add the common title/body width wrapper,
- set Vector font custom properties on the shadow host.

Checkpoint:

- standard mode computes to a 59.25rem maximum and wide mode removes that cap,
- body font computes to 14px, 16px, and 20px at a 16px browser root for small, standard, and large,
- a synthetic version-1 persisted store hydrates with standard defaults while preserving prior language/sidebar/search settings.

### Commit 5 — Add the responsive presentation menu

Files:

- new `src/components/Wiki/WikiPresentationMenu.tsx`
- `src/components/Header.tsx`
- `src/i18n/en/index.ts`
- every translated locale file under `src/i18n/*/index.ts`
- generated i18n files from `pnpm typesafe-i18n`
- focused menu/display test

Changes:

- add desktop Popover and mobile Drawer shells around one controls body,
- wire controls to narrow store actions/selectors,
- add localized labels and accessible radio groups.

Checkpoint:

- keyboard and pointer selection update the live article without navigation or reload,
- closing and reopening the menu shows the stored selection,
- desktop panel overlays content and mobile drawer overlays content without resizing the article column.

### Commit 6 — Delete the legacy global styling path

Delete:

- `src/components/Wiki/styles/unreset.css`
- `src/components/Wiki/styles/vec2022base.css`
- `src/components/Wiki/styles/vector2022.css`
- `src/components/Wiki/styles/overrides.css` after its still-valid app rules have been moved and tightened in `article-adaptations.css`

Update:

- `src/components/Wiki/WikiDisplay.tsx` to remove all four imports,
- tests and fixtures that still expect fake `#wikiHtml`, `#wikiBody`, `.client-js`, or Vector feature classes.

Checkpoint:

- production source has one article renderer and one style-loading path,
- no global upstream selector is emitted into the application bundle,
- no old CSS filename is referenced anywhere under `src`.

## Permanent tests worth keeping

Keep tests for observable failure modes, not component wiring:

1. **ResourceLoader contract:** selected language host, stable baseline, conditional module inclusion, invalid/excluded module rejection, separate site styles.
2. **Style isolation:** a content selector in mocked Wikipedia CSS alters an article link, while a hostile root/body selector cannot alter either app chrome or the ShadowRoot's synthetic article shell.
3. **Article behavior through Shadow DOM:** navbox show/hide and internal article navigation still work.
4. **Presentation behavior:** the three font sizes and two widths change computed presentation values.
5. **Persistence migration:** a version-1 store keeps old settings and gains the two new defaults.
6. **Failure settlement:** a failed upstream stylesheet produces readable degraded content and does not deadlock game loading.

Do not add snapshots of the whole Wikipedia fixture, source-text assertions, or tests that only assert a link element exists.

## Verification matrix

Run focused checks after the commit that owns them, then one complete verification pass after cleanup.

### Automated

```bash
pnpm typesafe-i18n
pnpm test:browser src/components/Wiki/WikiDisplay.test.tsx --run
pnpm typecheck
pnpm build
```

If a new utility or store test is in a separate file, include it in the focused Vitest invocation before the final build.

### Actual UI smoke test

Launch the real application, not only MSW fixtures, and verify with browser tooling at desktop and mobile widths.

Articles/languages:

- English article with infobox, citations, and navbox,
- Arabic article for RTL layout and CSSJanus output,
- Japanese or Chinese article for CJK typography,
- an article containing Math or media for conditional module styles.

For each relevant case, inspect the ShadowRoot and computed layout rather than relying only on screenshots:

- `skins.vector.styles`, Parsoid content styles, conditional modules, and the selected edition's `site.styles` loaded from the correct host,
- body font size/line height match the selected control,
- standard width is capped and wide width expands beyond it on a wide viewport,
- title and article body share the same width boundary,
- infoboxes/tables/figures remain usable on a 360px viewport,
- Arabic content is RTL without an app-maintained RTL list,
- dark mode preserves readable text and counter-inverts images/media,
- article links navigate inside WikiSpeedrun,
- hash links scroll inside the shadow tree,
- the appearance panel consumes no permanent horizontal article space,
- app header/sidebar computed styles do not change when article CSS loads.

### Cache/network check

Navigate between two articles in the same language and inspect the network panel:

- the stable baseline URL is identical and served from browser cache on the second article,
- only the conditional module URL changes when page requirements differ,
- switching language changes both the Wikipedia hostname and `lang` parameter,
- `site.styles` is never reused across language editions.

## Rollback and failure rules

- Keep commits independently revertible, but never ship both renderers behind a hidden branch.
- A ShadowRoot interaction failure is fixed at the root-scoping seam; do not restore document-wide queries.
- A stylesheet load failure settles to `degraded`; it must not block gameplay indefinitely.
- If deployed CSP blocks `https://*.wikipedia.org/w/load.php`, update the deployment `style-src` policy to allow the already-required Wikipedia editions. Do not silently fall back to one English snapshot.
- If ResourceLoader rejects a returned module, record the rejected URL/module, tighten the explicit filter, and retain the rest of the module set. Do not drop all page-conditional CSS.
- Never evaluate ResourceLoader JavaScript as a styling fix.

## Definition of done

- Parsed articles use the selected edition's compiled Vector 2022, Parsoid, page-conditional, and site CSS.
- Upstream selectors cannot style app chrome.
- Font size and compact/wide settings are accessible, responsive, live, and persisted.
- Winning-link counting, navbox behavior, hash links, route navigation, win detection, loading pause, and stopwatch resume work inside the ShadowRoot.
- RTL and conditional extension styling are verified against real Wikipedia pages.
- Legacy global Wikipedia CSS files and fake Vector root state are deleted.
- Focused browser tests, type checking, i18n generation, and the production build pass.
