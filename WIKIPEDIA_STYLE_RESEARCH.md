# Wikipedia Style Integration Research Report

**Repo:** WikiSpeedrun-styles-research · **Date:** 2026-09-13 · **Owner:** ReportOwner
**Scope:** current app ↔ upstream Vector 2022 presentation, plus a proposed app-owned presentation/settings design. No application code was changed.

**Convention used throughout:**
- **[OBSERVED]** = verified against a primary source (live Wikipedia HTML/ResourceLoader output, Vector/MediaWiki source, or this repository's files with path+line).
- **[RECOMMENDATION]** = opinion/plan of this report; not verified truth.
- **[CORRECTION]** = an initial claim that was later falsified and fixed in place; kept visible for transparency.

---

## 1. Executive summary
[OBSERVED] The app renders an `action=parse` article dump inside two fake-shim wrapper divs (`#wikiHtml`, `#wikiBody`) that hard-code stale `vector-feature-*` class names, then loads four overlapping stylesheets: a Tailwind counter-reset, two copied MediaWiki/Vector bundles, and app overrides. Upstream Vector 2022 has since moved its width and font-size presentation onto (a) `clientpref` feature classes on `<html>` rewritten from a cookie, and (b) CSS custom properties (`--font-size-medium`, `--line-height-content`) — a contract the app neither follows nor needs to follow verbatim.

[RECOMMENDATION] The research conclusion: the stable, valuable piece of upstream is not its compiled CSS but its *mechanism* — feature classes + custom properties + a dropdown panel that consumes no permanent horizontal space. The app should re-implement that mechanism as one app-owned deep module (`WikiPresentationSurface` + a `presentation` slice in `SettingsStore`), scoped to a single article-surface container (width cap + font-size var — see §4.2 correction for why upstream classes cannot do this in the embed), and stop chasing upstream class names.

---

## 2. Method and primary sources

Upstream claims below cite:

1. Live en.wikipedia article HTML: https://en.wikipedia.org/wiki/Boxing (fetched 2026-09-12, static curl; content treated as untrusted data, no consequential actions performed).
2. Live ResourceLoader output of the Vector 2022 stylesheet: https://en.wikipedia.org/w/load.php?lang=en&modules=skins.vector.styles&only=styles&skin=vector-2022 (89,892 bytes, fetched 2026-09-12).
3. Vector skin source, `wikimedia/mediawiki-skins-Vector` master: https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/master/resources/skins.vector.js/clientPreferences.json (HTTP 200, fetched 2026-09-12) and the repository tree at https://github.com/wikimedia/mediawiki-skins-Vector (commit 3e134deb per VectorSourceAudit).
4. Official Wikimedia desktop-improvements documentation: https://www.mediawiki.org/wiki/Reading/Web/Desktop_Improvements and skin page https://www.mediawiki.org/wiki/Skin:Vector_2022.

Local claims cite repository paths and line ranges as observed in this session.

---

## 3. Current architecture [OBSERVED]

### 3.1 Render pipeline

| Stage | Location | Notes |
|---|---|---|
| Fetch | `src/components/Wiki/WikiDisplay.utils.tsx:25-34` | raw `action=parse` call to `https://{lang}.wikipedia.org/w/api.php` with `disableeditsection=true`; no width/font/appearance parameters; select at 79-87 extracts `parse.text["*"]`, title, pageid; cache key `["article", title, lang]` (line 73) |
| Sanitize | `src/components/Wiki/WikiDisplay.tsx:77` | DOMPurify default config; template `<style>` (TemplateStyles) survives (see `src/test_mocks/wiki_pages/ChahkandukBirjand.json`), no class allowlist |
| Shim shell | `src/components/Wiki/WikiDisplay.tsx:55-78` | `.unreset.wiki-insert` wrapper (+`wiki-dark-theme` when dark, line 55) → `#wikiHtml` (line 58) carrying hard-coded `vector-feature-*` classes (line 59) → `#wikiBody` (line 63) with fake body classes `skin-vector-2022 vector-body … vector-below-page-title` (line 64) → sanitized HTML in a `role="button"` div (lines 66-78; the whole article is one click target) |
| CSS import order | `src/components/Wiki/WikiDisplay.tsx:4-7` | `unreset.css` → `vec2022base.css` → `vector2022.css` → `overrides.css` (last wins); bundle loads after `src/index.css`/Tailwind via `src/main.tsx:4` and `src/components/Wiki/WikiDisplay.tsx` lazy mount through `src/routes/wiki/$.tsx:3-7` |
| Interaction | `src/components/Wiki/WikiLogic.tsx:11-19` | click-to-navigate; navbox collapse toggled via `th.navbox-title`; winning-link detection `findVisibleWinningLinks` matches `[href="/wiki/Title_With_Underscores"]` + `offsetWidth > 0` (`src/components/Wiki/WikiDisplay.utils.tsx:39-41`), coupled to the sanitized DOM |

### 3.2 Stylesheet inventory (4,499 lines total)

| File | Lines | Provenance |
|---|---|---|
| `src/components/Wiki/styles/unreset.css` | 299 | Tailwind-conflict reset for the wiki subtree; re-establishes UA defaults (headings `1`:38-42, box-sizing `content-box` at 1-5); nested-SCSS-style syntax |
| `src/components/Wiki/styles/vec2022base.css` | 345 | MediaWiki core content styles + enwiki Common.css/infobox snippets (infobox rules 193-277; asset URL rewritten to `/wiki-assets/bullet-icon.svg` at `vector2022.css:939`; dead `/w/...` URLs at 1210/1398/2988) |
| `src/components/Wiki/styles/vector2022.css` | 3816 | Full dump of the Vector 2022 skin ResourceLoader CSS (grid layout 2504-2537; `.mw-page-container` max-width 99.75em at 1344; `.vector-body` `font-size: calc(1em * 0.875)` at 998-1001; toc/pinned/sticky-header 2485-2895); upstream `vector-feature-limited-width-*` switch rules already present at 1353-1374 |
| `src/components/Wiki/styles/overrides.css` | 39 | App-specific suppression rules (lines 1-14: image-info link, fact templates, `#coordinates`, `cite_note` anchors) and dark-theme `filter: invert(1) hue-rotate(180deg)` (lines 20-31) |

### 3.3 Settings today [OBSERVED]

`src/stores/SettingsStore.ts:10-72`: zustand + `persist` (localStorage key `"settings"`, `partialize` strips actions, `version: 1`). Values: `interfaceLanguage`, `wikiLanguage`, `sidebarWidth` (default 400), `is_CTRL_F_enabled`. Selectors exported at 68-72. This is the seam a presentation slice would extend **[RECOMMENDATION]**.

Settings UI today lives on the `/settings` route page (`src/pages/Settings.tsx:68-131`: language selects, start/end article form, `LabelSwitch` for Ctrl+F) — a full page, not an in-game overlay. Header icon-button row precedent: `src/components/Header.tsx:29,32` (Sun/Moon `switchTheme`); Drawer shell: `src/components/Drawer.tsx` (Radix Dialog slide-over, portal-based → zero permanent horizontal space); `src/components/MobileMenu.tsx` shows Drawer usage. Layout sidebar is resizable via `useSidebarWidth` (`src/stores/SettingsStore.ts:71`; `src/components/Layout.tsx`).

---

## 4. Upstream Vector 2022 behavior [OBSERVED — primary sources]

### 4.1 The clientpref class contract

Live `<html>` class list on the Boxing article:

```
client-js vector-feature-language-in-header-enabled …
vector-feature-toc-pinned-clientpref-1 …
vector-feature-limited-width-clientpref-1
vector-feature-limited-width-content-enabled
vector-feature-custom-font-size-clientpref-1
vector-feature-appearance-pinned-clientpref-1
skin-theme-clientpref-day vector-sticky-header-enabled
vector-toc-available skin-thumbsize-clientpref-standard
```
(source: https://en.wikipedia.org/wiki/Boxing)

An inline script (same page) rewrites `<html>` classes at boot: for each entry in the cookie `enwikimwclientpreferences` (comma-separated `feature-clientpref-value` pairs), it replaces the matching `(^| )<feature>-clientpref-\w+( |$)` class with the cookie value, then assigns `document.documentElement.className`. So the *contract* is: **one class per feature, `<feature>-clientpref-<value>`, owned by `<html>`, swapped by JS/cookie**.

### 4.2 Compact vs wide (limited width)

From the live `skins.vector.styles` ResourceLoader bundle:
**[OBSERVED]** Upstream width has **exactly two states** — Standard (`vector-feature-limited-width-clientpref-1`, default) and Wide (`-clientpref-0`); there is **no** narrower "compact" option upstream. Labels in Vector i18n (`i18n/en.json` @ `wmf/1.47.0-wmf.19`): `…limited-width-1-label` = "Standard", `-0-label` = "Wide". A narrower-than-Standard "compact" would therefore be **app-owned** CSS, not a Vector class. (MediaWiki `1.47.0-wmf.19`, anonymous request — per LiveVectorAudit.)

- Default (Standard): `.mw-page-container { max-width: 99.75rem }` (= 1596px, the 99.75em value the repo's dumped CSS also carries at `vector2022.css:1344`).
- Wide: `.vector-feature-limited-width-clientpref-0 .mw-page-container, .vector-feature-limited-width-clientpref-0 .vector-sticky-header, .vector-feature-limited-width-clientpref-0 .mw-header { max-width: none }`.
- Content column: `.mw-body` grid at `min-width:1120px` is `grid-template: … / minmax(0,59.25rem) min-content` (59.25rem = 948px); the wide variant is `.vector-feature-limited-width-clientpref-0 .mw-body, .vector-feature-limited-width-content-disabled .mw-body { grid-template-columns: minmax(0,1fr) min-content }`.
- Side columns: `12.25rem` (196px) at ≥1120px, `15.5rem` (248px) at ≥1680px (grid template columns in the same bundle).
- Source-level naming (Vector master): `@max-width-page-container: 1596px`, `@max-width-content-container: 948px` in `resources/skins.vector.styles/variables.less`; switches in `layouts/screen.less` and `layouts/grid.less`; page exclusions produce `vector-feature-limited-width-content-disabled` server-side (`VectorMaxWidthOptions` / `LimitedWidthContentRequirement`).
  (per VectorSourceAudit; corroborated by the live bundle output above)

**[CORRECTION, verified in-repo]** The repo's dumped `vector2022.css:1353-1374` does contain limited-width switch rules, but they target `.mw-page-container`, `.mw-content-container`, `.mw-table-of-contents-container`, and `.mw-body` (and use the old `-disabled` class names, e.g. `vector2022.css:1353` `.vector-feature-limited-width-disabled .mw-page-container`). `action=parse` HTML injects only `.mw-content-ltr.mw-parser-output` under the fake wrappers (`WikiDisplay.tsx:66-78`); none of those container classes exist in the embedded DOM (the fake body div carries `vector-body`, not `mw-body` — `WikiDisplay.tsx:64`). **Toggling the current `vector-feature-*` classes therefore cannot cap the embedded article. Width must be an app-owned `max-inline-size` on a real article container** that wraps both the app-rendered title and the injected `.mw-parser-output` (suggested app token: standard = `59.25rem`/948px, wide = none, both constrained by `100%`) — this also fixes the current misalignment where the external `<h2>` title sits outside the reading column.

### 4.3 Font size
From the live bundle (same URL as §2 item 2):

```css
html.vector-feature-custom-font-size-clientpref--excluded,
html.vector-feature-custom-font-size-clientpref-0, …
  { --font-size-medium: var(--font-size-small, .875rem);
    --line-height-medium: 1.5714285; --line-height-content: 1.5714285 }
html.vector-feature-custom-font-size-clientpref-1, .vector-icon
  { --font-size-medium: var(--font-size-medium, 1rem);
    --line-height-medium: 1.6; --line-height-content: 1.625 }
html.vector-feature-custom-font-size-clientpref-2
  { --font-size-medium: var(--font-size-x-large, 1.25rem);
    --line-height-medium: 1.5; --line-height-content: 1.55 }

.vector-body { font-size: var(--font-size-medium); line-height: var(--line-height-content) }
```

- Preference name `vector-font-size`, options `0|1|2`; upstream i18n labels are "Small" / "Standard" / "Large"; the live page shipped `clientpref-1`. Configuration JSON (primary source: `clientPreferences.json`, URL in §2 item 3): `"vector-feature-custom-font-size": {"options": ["0","1","2"], "preferenceKey": "vector-font-size"}`.

### 4.4 Appearance panel placement (pinned vs zero-space unpinned)

[OBSERVED] Server-rendered markup is an empty pinnable container; content is built 100% client-side by `skins.vector.clientPreferences` from `clientPreferences.json` (font-size 0/1/2, limited-width 1/0, theme os/day/night). Placement states, observed live:

- **Pinned (default for anons, `vector-feature-appearance-pinned-clientpref-1`)**: rendered inside `<div class="vector-column-end no-font-mode-scale"><nav class="vector-appearance-landmark"><div id="vector-appearance-pinned-container"><div id="vector-appearance" class="vector-appearance vector-pinnable-element">…`; column width `12.25rem` (`15.5rem` ≥1680px), `column-gap: 24px` on `.mw-body`.
- **Unpinned (`-clientpref-0`)**: element teleported into the header dropdown `#vector-appearance-dropdown > .vector-dropdown-content > #vector-appearance-unpinned-container`; one of the two landmarks is hidden by CSS per state (`.vector-feature-appearance-pinned-clientpref-1 .vector-user-links .vector-appearance-landmark { display:none }` and the inverse for `.vector-column-end`).
- **Overlay geometry [OBSERVED]**: the unpinned dropdown content is `position: absolute; top: 100%; width: max-content; max-width: 200px; max-height: 75vh; padding: 16px`, right-aligned (`#vector-appearance-dropdown .vector-dropdown-content { left: auto; right: 0 }`) — i.e. **zero permanent horizontal space when unpinned**; the pinned state consumes a `12.25rem` (196px; `15.5rem` ≥1680px) right column. Panel form: JS-rendered form of `.cdx-radio` rows, `font-size: 0.875rem`.
- **Upstream's own no-JS behavior [OBSERVED]**: `.client-nojs .vector-appearance-landmark { display: none }` — the panel is 100% JS-rendered into `#vector-appearance` (server markup is an empty container). This confirms that the app can omit the panel completely by continuing not to render Vector chrome or load `skins.vector.clientPreferences`; no suppressive CSS is needed.
- **Separate thumbnail-size preference [OBSERVED]**: `skin-thumbsize-clientpref-standard|small|large` (Codex `--image-size-*: 180px/250px/400px`) exists in live DOM/CSS but is **absent** from `clientPreferences.json` — do not assume the Appearance menu controls it.

### 4.5 What upstream does NOT have [OBSERVED]

- **No `--vector-site-width` custom property** — width is a compiled `max-width` (99.75rem/none). Any such variable would be app-invented.
- **No server-side notion of an embedded third-party page.** All upstream styling assumes it owns the whole `body`. The app is a host page embedding the article; upstream will never solve the cascade-out problem for us.

---

## 5. Visual findings

All visual evidence is reported in §14 with per-claim labels. Summary [OBSERVED]:

| # | Observation | Source |
|---|---|---|
| V1 | Upstream unpinned Appearance menu = header icon → overlay popover (Text Small/Standard/Large; Width Standard/Wide); zero permanent horizontal space | official WMF screenshot, §14.4 |
| V2 | Upstream applies small text to chrome regions (edit links, TOC, tools) separately from article text → font sizing must stay inside the article scope, never app chrome/panel | official WMF typography screenshot, §14.4 |
| V3 | Upstream pinned Appearance panel consumes a ~180-200px right column while article text stays ~660-700px | live capture @1440×1000, §14.4 |
| V4 | App today: History sidebar ~435px, article fills the rest with **no reading-width cap**; upstream chrome cleanly absent; article keeps hatnote/infobox/references/navbox/stub; title serif, body sans ~15-16px, infobox ~12-13px | app capture @1440×1000, §14.5 |
| V5 | App header already hosts a flag/theme/GitHub icon cluster → an article-display icon popover is consistent with existing affordances; Drawer exists as narrow-screen fallback | app settings capture, §14.5 |

**[RECOMMENDATION]** Derived: adopt V1's overlay pattern with app-owned controls; apply V2's scoping rule; never adopt V3's pinned layout; fix V4's missing width cap via the presentation module (§7); follow V5's placement.

---

## 6. Proposed deep module / interface [RECOMMENDATION]

### 6.1 Deepness analysis

The current surface is *shallow and scattered*: four CSS files, two fake-shim divs, hard-coded class strings in TSX, suppression rules in `overrides.css`, game coupling in `WikiLogic`. A deep module hides all of that behind one component + one store slice:

```
WikiPresentationSurface            (component, owns the article DOM shell)
  props: none (fetches internally)
  owns:  a real article container wrapping the app title + injected .mw-parser-output,
         width/font-size modifier application, dark filter, winning-link highlight
  exposes (via store): useWikiPresentation()  -> { width, fontSize }
                       useWikiPresentationActions() -> setters (persisted)
PresentationMenu                    (Header icon button + Radix Popover/Drawer panel)
  consumes the same store slice; zero permanent horizontal space
```

Interface sketch (state model formalized in §7):

```ts
// stores/presentationSlice (new zustand slice, persisted as settings v2)
type WikiWidth = "standard" | "wide";                 // UI may label "standard" as Compact
type WikiFontSize = "small" | "standard" | "large";   // maps 0 | 1 | 2 upstream-equivalent
interface WikiPresentation {
  width: WikiWidth;            // default "standard"
  fontSize: WikiFontSize;      // default "standard"
}
```

The module is deep because: (1) a single state object drives all presentation; (2) the mapping state→DOM is internal (class names are an implementation detail); (3) CSS scope is internal (article container only); (4) the menu is a pure consumer of the same state. **Scope note:** no density knob and no night-mode state — the user asked for width + font-size only; dark theme stays the existing app-wide `colorMode` mechanism, and replacing the dark `filter` hack is a separately scoped follow-up risk (§10, §11), not part of this state.

### 6.2 Contract rules for new CSS

- **Layered, scoped files [RECOMMENDATION]:**
  1. *content snapshot* — the existing MediaWiki content CSS (`vec2022base.css`, `vector2022.css`) stays a pinned, scoped MediaWiki content snapshot (upstream fidelity, not app policy);
  2. `presentation.css` (new, app-owned) — width/font-size custom properties and the modifier classes, scoped to the article container;
  3. `adaptations.css` (or the re-scoped `overrides.css`) — intentional hides (citations, coordinates, stub notices), scoped under the article container. This separates upstream content fidelity from product policy.
- Never target `#wikiHtml`/`#wikiBody` from new code; treat them as legacy shims to be deleted once equivalent content styles are owned (§10).
- Never emit unscoped selectors (today's `#coordinates`, `a[href*="#cite_note"]` in `overrides.css:8-14` leak globally **[OBSERVED]**).
- Width/font-size toggles are applied as modifier classes on the article container (`wiki-width-wide`, `wiki-font-large`, …), mirroring upstream's feature-class idea but app-owned.

---

## 7. Presentation-state model [RECOMMENDATION]

| State | Values | Default | Applied as | Upstream analogue |
|---|---|---|---|---|
| `width` | `standard` / `wide` (UI may label `standard` as "Compact") | `standard` | app-owned `max-inline-size` on a **common article surface** that contains the app-rendered title and the injected `.mw-parser-output`: standard = `59.25rem` (948px), wide = none; both constrained by `100%` | upstream has only Standard/Wide (`vector-feature-limited-width-clientpref-1/0`); the value 59.25rem is the upstream content-column token, re-declared app-owned |
| `fontSize` | `small` / `standard` / `large` | `standard` | CSS var on the article surface: `--wiki-font-size: .875rem / 1rem / 1.25rem`, consumed by a scoped `.mw-parser-output { font-size: var(--wiki-font-size) }` rule in `presentation.css`; **replaces** the dumped `.vector-body { font-size: calc(1em * 0.875) }` (`vector2022.css:998-1001`) | `vector-feature-custom-font-size-clientpref-0/1/2` → `--font-size-medium` (0.875rem/1rem/1.25rem) |

Excluded from state (per scope correction): no `density` knob, no `night`/theme state. Dark theme remains the app-wide `colorMode` filter; its replacement is a separately scoped follow-up risk, not part of width/font state (§10 Phase 5, §11).

The width cap applies to the common article surface so the external `<h2>` title and `.mw-parser-output` share one column — the current misalignment (title outside the reading width) disappears.

Persistence: extend `SettingsStore` (`src/stores/SettingsStore.ts:34-66`) with the slice and **bump `version` to 2** with a `migrate` that defaults missing presentation fields (localStorage `"settings"` key must not break existing users). Zustand persist migration is a documented middleware capability — pattern already used in-repo (`version: 1` at line 59).

Everything under the article surface is em-based (upstream headings em-scale; the dumped `#wikiHtml { font-size: 100% }` at `vector2022.css:935-937` confirms the existing one-choke-point design), so a single font-size definition on the surface scales the whole article **[OBSERVED]**.

---

## 8. Settings UI placement [RECOMMENDATION]

Requirements (user-specified): compact vs wide, font-size controls, app-owned menu consuming **no permanent horizontal space**, removal/suppression of upstream settings UI.

- **Placement:** icon button in the existing Header icon row (`src/components/Header.tsx:32-57` area, next to the flag/theme/GitHub icons observed in `/tmp/wikispeedrun-settings.png`) → Radix Popover on desktop; the existing `Drawer.tsx` (Radix Dialog slide-over) as the narrow-screen fallback. Portal-based = 0px permanent cost. **[OBSERVED: shells exist; OFFICIAL PRECEDENT: unpinned-menu screenshot in §14.4]**
- **Sidebar placement is ruled out** [RECOMMENDATION, evidence-backed]: the pinned Appearance panel costs a 12.25rem/15.5rem column upstream (§4.4), and the app's gameplay sidebar already consumes ~435px / ~35-40% of the viewport (§14.5) — adding a pinned panel would duplicate both problems. Match upstream's unpinned overlay pattern only.
- **Panel content** mirrors upstream's Appearance panel but app-owned: font-size control (3 steps: small/standard/large) and compact(standard)/wide switch. i18n via existing `typesafe-i18n` (`LL.*` keys; `src/i18n/`). Panel text must be app-chrome-sized (not article-scaled), per the typography-audit finding in §14.4.
- **Suppression of upstream settings UI [CORRECTION]:** do **not** claim that existing CSS "suppresses" the upstream Appearance panel — `action=parse` HTML never includes Vector chrome or `skins.vector.clientPreferences` output, so there is nothing to hide. Upstream settings UI is disabled by **not loading/rendering** upstream chrome or its clientPreferences module, and by not emulating its menu CSS. The existing `overrides.css:1-14` rules are a separate concern: article-level product-policy hides (citations, coordinates, image-info) that must be inventoried and re-scoped (§6.2 layer 3).

---

## 9. Cascade strategy [RECOMMENDATION]

1. **Layer separation (per correction):** three distinct layers — (a) *pinned, scoped MediaWiki content snapshot* (`vec2022base.css` + `vector2022.css` content rules: upstream fidelity, not app policy); (b) *app-owned `presentation.css`* for width/font-size custom properties and modifier classes; (c) *scoped `adaptations.css`* for intentional hides (article-level product policy). Each layer owns its reason for existing; app policy never edits the snapshot.
2. **Scope discipline:** the article surface container is the only style hook for app layers; all new rules scoped under it. This fixes the leak risk of today's unscoped `overrides.css:1-14` selectors.
3. **Elevate knobs to variables:** `--wiki-font-size` and the width token (`--wiki-article-max-inline-size`: `59.25rem` / `none`) are declared app-owned in `presentation.css`, consumed by scoped rules on the common article surface. Do not read upstream-compiled px values from the dump for new code (`vector2022.css:998-1001`, `1344`).
4. **Order of battles for conflicts:** `unreset.css` (scope-local reset) → content snapshot dumps → `presentation.css` → `adaptations.css` last. Import order is explicit in `WikiDisplay.tsx:4-7`; keep it monotonic. Do not fight specificity with `!important` except the existing dark-filter block.
5. **Dark theme stays a filter** and stays **out of scope**: replacing it with real variables is a separately scoped follow-up risk. The current filter hard-pins link colors (`overrides.css:16-18, 33-35`), so verify color and media legibility in every width/font combination.

---

## 10. Migration phases [RECOMMENDATION]

1. **Phase 0 — scope fixes (no behavior change):** scope `overrides.css:1-14` selectors under the article surface, or move them unchanged into `adaptations.css` per §6.2.
2. **Phase 1 — common article surface + width:** introduce the article-surface container wrapping the app title and `.mw-parser-output`; add `presentation.css` with `--wiki-article-max-inline-size` (standard `59.25rem` / wide `none`, both `max-width: 100%`); apply `.wiki-width-standard|wide` from the store slice. This is the first width cap that can actually reach the injected content (§4.2 correction).
3. **Phase 2 — font size:** add `--wiki-font-size` (small/standard/large = .875rem/1rem/1.25rem) consumed by a scoped `.mw-parser-output` rule; **replace** the dumped `.vector-body` typography rule (`vector2022.css:998-1001`) with the app presentation layer; add `presentation` slice to `SettingsStore` (version 2 + migrate) if not already in Phase 1.
4. **Phase 3 — clean cutover of fake shim classes:** once equivalent content styles are app-owned, **remove all** fake `#wikiHtml`/`#wikiBody` `vector-feature-*`/skin/body classes (`WikiDisplay.tsx:59,64`) — verify selector-by-selector that no remaining dump rule needs them; target: zero (they are not the live contract, §4.1, and none of the emulated width rules even apply, §4.2).
5. **Phase 4 — menu:** `PresentationMenu` in Header via Radix Popover; icon-only button; i18n keys; settings page keeps game config (languages, Ctrl+F) untouched.
6. **Phase 5 — cleanup:** delete obsolete dumped upstream menu/pinned/sticky-header blocks (`vector2022.css:2485-2895`) and dead `/w/…` asset rules only after confirming the embedded DOM never reaches them. Dark-filter replacement is **out of scope**: recorded as a follow-up risk in §11, not part of width/font work.
7. **Phase 6 — verification:** §12 scenarios; no permanent test debt beyond what earns its place.

---

## 11. Risks [OBSERVED unless noted]

| Risk | Evidence | Mitigation |
|---|---|---|
| Stale upstream class contract | `WikiDisplay.tsx:59` ships a class set that no longer matches live `<html>` (§4.1); comments "todo delete unused classnames" at 57,61 | stop depending on upstream class names; app-owned modifiers [RECOMMENDATION] |
| Template CSS survives sanitize | `ChahkandukBirjand.json` inline TemplateStyles | keep `overrides.css` last and specific; no class allowlist change in this scope |
| Unscoped suppression selectors | `overrides.css:8-14` | scope under the article surface container |
| Dark filter side effects | `overrides.css:20-32` inverts everything, re-inverts img/video/math; pins link colors | verify with font-size/wide changes; document |
| Layout coupling | `src/components/Wiki/Wiki.tsx:17-19` sticky banners; `src/components/Layout.tsx` resizable sidebar assume app-owned scroll context | wide mode must expand *inside* the app column, not fight the sidebar [RECOMMENDATION] |
| Upstream CSS churn | px values (948/1596), generated ids, Codex classes are churn-prone (VectorSourceAudit: task-history of change; `@unstable` internals) | copy mechanism, not values; document variable names as app-owned |
| Persistence migration | `version: 1` store in production users' localStorage | migrate + defaults |
| Ultrawide line length | article has no reading-width cap today; History sidebar ~435px already occupies ~35-40% (`/tmp/wikispeedrun-current.png`, §14.5); no-infobox pages stretch widest | standard default + explicit wide opt-in via `.wiki-width-wide` [RECOMMENDATION] |
| Infobox squeeze at narrow viewports | right-floated infobox at ~12-13px text observed (§14.5) | verify standard/wide × small/large font matrix at 1024/1280 widths (§12.2) |

---

## 12. Verification scenarios [RECOMMENDATION]

1. **Standard↔wide toggle:** switch to wide, article expands to the app column without horizontal scrollbar at 1280/1440/1920 widths; standard restores the 948px reading column. **Title alignment:** the app-rendered `<h2>` title and `.mw-parser-output` share the same capped column in both states.
2. **Font-size scaling:** each of small/standard/large visibly scales body text, headings, and references proportionally; no clipped TOC/infobox at each step; panel/chrome text stays chrome-sized.
3. **Persistence:** reload after toggling width+font-size → both retained (localStorage `settings` v2).
4. **Leak check:** with a `/settings` page open, none of the wiki suppression selectors affect app UI (scope fix from Phase 0).
5. **Dark mode interplay:** dark + large font + wide simultaneously; image re-inversion and winning-link highlight (`#aa6600`, `WikiDisplay.tsx:39-42`) still legible.
6. **Game logic intact:** winning-link detection still finds targets after class changes (`findVisibleWinningLinks` depends on hrefs, not classes).
7. **Mobile:** menu opens as sheet on narrow viewport; no permanent horizontal space consumed at 360px.

---

## 13. Prioritized implementation plan [RECOMMENDATION]

1. **P0:** scope `overrides.css` suppression rules under the article surface / split into `adaptations.css` (risk-free, unblocks everything).
2. **P0:** add `presentation` slice (`width`: standard|wide, `fontSize`: small|standard|large) + migrate settings v2.
3. **P0:** introduce the common article surface (title + `.mw-parser-output`); implement `--wiki-article-max-inline-size` and `--wiki-font-size` choke point in new `presentation.css`; wire standard/wide + font-size.
4. **P1:** Header `PresentationMenu` (Radix Popover) with font-size + width controls; i18n labels; Drawer fallback on narrow screens.
5. **P1:** **remove all** stale hard-coded `vector-feature-*`/skin/body classes from `WikiDisplay.tsx:59,64` (clean cutover — none of the emulated width rules apply, §4.2).
6. **P2:** delete dead `vector2022.css` blocks and the `.vector-body` typography rule the presentation layer replaces. Dark-filter coupling: separately scoped follow-up risk, not in this plan.

---

## 14. Peer audit integration

*(Integration status: VectorSourceAudit, RepoStyleAudit, and LiveVectorAudit reported; VisualStyleAudit was parked without a readable result — Main's official-screenshot and live-capture vision findings (§14.4, §14.5) stand as the visual audit. ReportOwner owns and writes this file; no other task edits it.)*

### 14.1 VectorSourceAudit (source-level audit, mediawiki-skins-Vector master 3e134deb)

Corroborates and extends §4: width classes `vector-feature-limited-width-clientpref-1|0` (pref `vector-limited-width`, default 1) plus server-side `vector-feature-limited-width-content-disabled` page exclusion (from `VectorMaxWidthOptions` + `LimitedWidthContentRequirement`); source constants `@max-width-page-container: 1596px` (99.75rem) and `@max-width-content-container: 948px` in `variables.less`, consumed by `layouts/grid.less` (`.mw-body` grid `minmax(0,@max-width-content-container) min-content`; wide = `minmax(0,1fr) min-content`); core breakpoints from `mediawiki.skin.defaults.less`: 320/640/1120/1680px (desktop=1120, wide=1680), side columns 196px→248px. Font size: pref `vector-font-size` (default 0), classes 0/1/2 + `--excluded`, `CSSCustomProperties.less` sets `--font-size-medium` (0.875rem/1rem/1.25rem) + line-heights, `typography.less` applies `.vector-body { font-size: var(--font-size-medium) }`. Panel: `UserLinks.mustache` (`nav.vector-appearance-landmark` → `#vector-appearance-dropdown` → `#vector-appearance-unpinned-container`) for unpinned; `ColumnEnd.mustache` for pinned; `Appearance.less` hides the inactive landmark and flips `right: 0`. JS: `skin.js` lazily loads `skins.vector.clientPreferences`, renders into `#vector-appearance` from `clientPreferences.json`; generated ids `skin-client-prefs-<feature>` / `skin-client-pref-<feature>-value-<value>`. Persistence: logged-in → debounced `mw.Api().saveOptions({preferenceKey: value}, {global:'update'})` (100ms), prefs are API-only/hidden (Hooks::onGetPreferences); anons → `mw.user.clientPrefs.set()` (core `resources/src/mediawiki.user.js`): swaps html class, persists cookie `mwclientpreferences` (comma-joined `<feature>-clientpref-<value>`), fires `mw.hook('skin-client-preference.change')` + resize. Defaults in `skin.json` `DefaultUserOptions`: limited-width 1, appearance-pinned 1, font-size 0, theme 'day'.

**Stable vs churn (their assessment, adopted here):** stable = the clientpref class-naming contract, cookie name, `vector-feature-*` class strings, `--font-size-medium`/`--line-height-*` custom props, structural selectors (`.mw-page-container`, `.vector-body`, `#vector-appearance-dropdown`), breakpoints. Churn-prone = exact px values (948/1596 have change history), generated portlet ids, Codex `cdx-*` classes, FeatureManager internals (`@unstable`), night-mode beta plumbing, `.no-font-mode-scale`/`.skin-invert` (marked temporary in source). **Implication: the upstream mechanism is small enough to re-implement app-owned (custom props + one toggle class + dropdown panel) rather than vendor the compiled CSS.**

### 14.2 RepoStyleAudit (repository audit)

Confirms §3 in depth: pipeline map (fetch → DOMPurify → shim shell → CSS import order) as tabled in §3.1/§3.2; provenance of the three bundled stylesheets; brittle seams — 13 fake body/feature classes at `src/components/Wiki/WikiDisplay.tsx:59,64` with "todo delete unused classnames" comments at 57/61; dark theme as `filter: invert(1) hue-rotate(180deg)` + re-invert img/video/math (`overrides.css:20-32`); `findVisibleWinningLinks` href matching (`WikiDisplay.utils.tsx:39-41`); `unreset.css` `box-sizing: content-box` (1-5) fighting Tailwind preflight; unscoped suppression selectors in `overrides.css:1-14`; dead `/w/skins` asset URLs and ULS selectors for DOM never rendered; layout coupling with `Wiki.tsx:17-19` sticky banners and `Layout.tsx` resizable sidebar. Their recommended minimal seam matches §6: single `.wiki-insert` scope, app presentation toggles as modifier classes on it from a persisted zustand slice, controls in a Radix Drawer/Popover anchored to a Header icon button, new rules only in `overrides.css` scoped under `.wiki-insert`, dead-block deletion in `vector2022.css` separate.

### 14.3 LiveVectorAudit (live enwiki audit, 1.47.0-wmf.19, 2026-09-12)

Direct live-HTML/ResourceLoader evidence behind §4: exactly **two** width states (Standard/Wide — no narrow/compact upstream; app-owned gap), exactly **three** font-size states with the exact decisive CSS blocks quoted in §4.3; Codex tokens `--font-size-small: 0.875rem / --font-size-medium: 1rem / --font-size-x-large: 1.25rem` from `theme-wikimedia-ui-root.css` @ `wmf/1.47.0-wmf.19`; `.no-font-mode-scale` opt-out regions (header, page titlebar, column-end observed live); Appearance panel placement/pinned/unpinned markup and the `position: absolute; max-width: 200px` overlay quoted in §4.4; `skin-thumbsize-clientpref-*` exists in DOM/CSS but is absent from `clientPreferences.json`; anon persistence = cookie `enwikimwclientpreferences` applied pre-render by an inline script (FOUC avoidance); named users via `userPreferences.saveOptions`; per-page exclusion classes `vector-feature-custom-font-size-clientpref--excluded` / `vector-feature-limited-width-content-disabled` observed on `Special:BlankPage`; upstream's own suppression lever `.client-nojs .vector-appearance-landmark { display: none }`. Primary URLs: article https://en.wikipedia.org/wiki/Cat, chrome https://en.wikipedia.org/wiki/Special:BlankPage, styles https://en.wikipedia.org/w/load.php?lang=en&modules=skins.vector.styles&only=styles&skin=vector-2022&debug=1, JS bundle https://en.wikipedia.org/w/load.php?lang=en&modules=skins.vector.js&only=scripts&skin=vector-2022&debug=1, panel builder https://en.wikipedia.org/w/load.php?lang=en&modules=skins.vector.clientPreferences&only=scripts&skin=vector-2022&debug=1, core clientPrefs https://en.wikipedia.org/w/load.php?lang=en&modules=mediawiki.user&only=scripts&skin=vector-2022&debug=1, i18n https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/wmf/1.47.0-wmf.19/i18n/en.json, Codex tokens https://raw.githubusercontent.com/wikimedia/mediawiki/wmf/1.47.0-wmf.19/resources/lib/codex-design-tokens/theme-wikimedia-ui-root.css.

### 14.4 Main (vision-model evidence, official WMF screenshots + live capture)

- **[OBSERVED, official screenshot]** https://upload.wikimedia.org/wikipedia/commons/e/e7/Accessibility_for_reading_first_iteration_prod_unpinned.png shows the header icon opening an overlay popover containing Text (Small/Standard/Large) and Width (Standard/Wide) radio groups; it overlays article content only while open and consumes no permanent horizontal space. The old "move to sidebar" action should **not** be copied.
- **[OBSERVED, official screenshot]** https://upload.wikimedia.org/wikipedia/commons/9/91/Screenshot_of_Wikipedia_Vector_2022_skin_highlighting_different_font-sizes.png shows chrome, edit links, TOC, and tools as separate small-text regions — implication adopted in §8/§9: apply article font sizing only to the injected article scope, not app chrome or the settings panel.
- **[OBSERVED, live capture]** current live Wikipedia at 1440×1000 shows the pinned Appearance panel taking ~180-200px on the right while article text stays a ~660-700px column — direct evidence against adopting the pinned layout for this app.
- **Recommendation (adopted §8):** app-owned header popover on desktop, drawer/modal on narrow screens.

### 14.5 Main (current-app visual capture, 2026-09-12)

**[OBSERVED, screenshots `/tmp/wikispeedrun-current.png` and `/tmp/wikispeedrun-settings.png`, 1440×1000]:** the app's History sidebar is ~435px; the article then spans the remaining width **without a reading-width cap**. Wikipedia global header/search/nav/footer/edit tabs are gone cleanly. The parsed article retains hatnote, right-floated infobox, references, navbox `[show]`/V·T·E, and stub notice. Article title is serif; body sans ~15-16px; infobox text ~12-13px. The settings page confirms the header already has a flag/theme/GitHub icon cluster — a single article-display icon popover there is consistent and zero-space; the existing Drawer is the narrow-screen fallback.

**[RISKS per Main, adopted in §11]:** ultrawide line lengths when no infobox; the sidebar already consumes ~35-40% of width; infobox squeezing at narrower widths; navbox/stub are vertically costly. **Sidebar placement for the settings menu is ruled out** by the width already consumed by the gameplay sidebar.

---

## 15. Citation index

- Live article HTML (this report): https://en.wikipedia.org/wiki/Boxing (fetched 2026-09-12)
- Live article HTML (live audit): https://en.wikipedia.org/wiki/Cat and https://en.wikipedia.org/wiki/Special:BlankPage (per LiveVectorAudit)
- Live Vector 2022 stylesheet: https://en.wikipedia.org/w/load.php?lang=en&modules=skins.vector.styles&only=styles&skin=vector-2022 (and `&debug=1` variant)
- Live Vector JS / panel builder / core clientPrefs: `skins.vector.js`, `skins.vector.clientPreferences`, `mediawiki.user` load.php URLs (§14.3)
- Vector clientPreferences config: https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/master/resources/skins.vector.js/clientPreferences.json
- Vector i18n labels @ wmf/1.47.0-wmf.19: https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/wmf/1.47.0-wmf.19/i18n/en.json
- Codex font tokens @ wmf/1.47.0-wmf.19: https://raw.githubusercontent.com/wikimedia/mediawiki/wmf/1.47.0-wmf.19/resources/lib/codex-design-tokens/theme-wikimedia-ui-root.css
- Official WMF screenshots (per Main): unpinned menu https://upload.wikimedia.org/wikipedia/commons/e/e7/Accessibility_for_reading_first_iteration_prod_unpinned.png ; typography audit https://upload.wikimedia.org/wikipedia/commons/9/91/Screenshot_of_Wikipedia_Vector_2022_skin_highlighting_different_font-sizes.png
- Vector skin repository: https://github.com/wikimedia/mediawiki-skins-Vector (master, 3e134deb at audit time)
- Wikimedia desktop improvements docs: https://www.mediawiki.org/wiki/Reading/Web/Desktop_Improvements
- Skin page: https://www.mediawiki.org/wiki/Skin:Vector_2022
- All repository claims: paths and line ranges as listed per section.
- §16 additions — deployment pin: https://api.github.com/repos/wikimedia/mediawiki/branches/wmf%2F1.47.0-wmf.19 and https://api.github.com/repos/wikimedia/mediawiki-skins-Vector/branches/wmf%2F1.47.0-wmf.19
- §16 additions — module map: https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/wmf/1.47.0-wmf.19/skin.json ; https://raw.githubusercontent.com/wikimedia/mediawiki/wmf/1.47.0-wmf.19/resources/Resources.php ; https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/wmf/1.47.0-wmf.19/resources/skins.vector.styles/skin.less
- §16 additions — compiled captures (2026-09-13): load.php URLs for `skins.vector.styles`, `mediawiki.skinning.content.parsoid`, `site.styles`, `ext.cite.styles`, `ext.cite.parsoid.styles`, `jquery.makeCollapsible.styles`, `ext.wikimediamessages.styles` (all `only=styles&skin=vector-2022`); `useskin` discovery: https://en.wikipedia.org/w/api.php?action=parse&page=Cat&format=json&formatversion=2&prop=modules%7Cjsconfigvars&useskin=vector-2022 ; RTL check: https://he.wikipedia.org/w/load.php?lang=he&modules=mediawiki.skinning.content.parsoid&only=styles&skin=vector-2022

---

## 16. Implementation-specific update recipe

*(Authored by ExactStyleReport 2026-09-13 by direct primary-source verification plus peer-input integration. Every upstream claim below was re-fetched and checked in this session; claims that could not be verified are labeled [INFERENCE] or flagged as unresolved. Deployment observed: enwiki **MediaWiki `wmf/1.47.0-wmf.19`**, core git hash `444c0035d220c1b9ff9ab4ad930828d0e0db434d` (branch tip 2026-09-11T16:40:12Z — verified identical via https://api.github.com/repos/wikimedia/mediawiki/branches/wmf%2F1.47.0-wmf.19), Vector skin branch tip `fa1bc23ab8329ac61ec11fe6e5403361ad79033b` (2026-09-07T08:58:19Z). Source of truth for the branch: `action=query&meta=siteinfo` → `git-branch` / `git-hash`.)*

### 16.1 CSS/module inventory — Required / Conditional / Do-not-copy matrix

**Category A — universal article CSS (compiled, capturable from `load.php`):**

| Module | Class | Required? | Observed size (enwiki, 2026-09-13) | What it owns | Primary URL |
|---|---|---|---|---|---|
| `skins.vector.styles` | `SkinModule` with `features: {normalize, elements, content-media, content-media-dark, content-tables, interface-category, interface-edit-section-links, interface-user-message, i18n-ordered-lists, i18n-headings}` ([skin.json](https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/wmf/1.47.0-wmf.19/skin.json)) | **Required** — single most important bundle | 89,892 B minified / 144,192 B with `debug=2` | All content typography (`.vector-body { font-size: var(--font-size-medium) }`), table styles (18 `wikitable` rules), media defaults (27 `.mw-parser-output` rules), links, plus Vector chrome | https://en.wikipedia.org/w/load.php?lang=en&modules=skins.vector.styles&only=styles&skin=vector-2022 |
| `mediawiki.skinning.content.parsoid` | core `FileModule` (`resources/Resources.php:89-97` @ [wmf branch](https://raw.githubusercontent.com/wikimedia/mediawiki/wmf/1.47.0-wmf.19/resources/Resources.php)) | **Required** | 7,049 B | Parsoid autonumbered-ext-link counters + `figure[typeof~='mw:File'].mw-halign-*` float alignment (image alignment breaks without it) | https://en.wikipedia.org/w/load.php?lang=en&modules=mediawiki.skinning.content.parsoid&only=styles&skin=vector-2022 |
| `site.styles` | `SiteStylesModule` ([Resources.php:51](https://raw.githubusercontent.com/wikimedia/mediawiki/wmf/1.47.0-wmf.19/resources/Resources.php)) — dynamic per wiki; **no source file exists** | **Required for enwiki content fidelity** (base `.infobox` float/size, `.references`, navbox helpers); **not copyable from source** | 6,839 B (varies with wiki edits; `cache-control: max-age=300`) | enwiki `MediaWiki:Common.css` compiled output | https://en.wikipedia.org/w/load.php?lang=en&modules=site.styles&only=styles&skin=vector-2022 |
| `ext.cite.styles` | extension [Cite](https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-Cite/wmf/1.47.0-wmf.19/extension.json) | **Conditional** — only on pages with `<ref>` (verified: present in `parse` `modulestyles` for Cat/Boxing/Doom, absent for a plain page) | 2,139 B | backlink/reflist columns/counter styles | https://en.wikipedia.org/w/load.php?lang=en&modules=ext.cite.styles&only=styles&skin=vector-2022 |
| `ext.cite.parsoid.styles` | extension Cite | **Conditional** (Parsoid-reference markup variant) | 1,004 B | sup/abbr ref styling for Parsoid output | https://en.wikipedia.org/w/load.php?lang=en&modules=ext.cite.parsoid.styles&only=styles&skin=vector-2022 |
| `ext.phonos.styles` + `ext.phonos.icons` | extension [Phonos](https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-Phonos/wmf/1.47.0-wmf.19/extension.json) | **Conditional** — pronunciation/audio buttons (present for Albert Einstein) | — | `Phonos.less` plus OOUI icon-pack output | (same load.php pattern) |
| `ext.tmh.player.styles` | extension [TimedMediaHandler](https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-TimedMediaHandler/wmf/1.47.0-wmf.19/extension.json) | **Conditional** — audio/video players (present for Albert Einstein and Cat) | — | `ext.tmh.player.styles.less` | (same load.php pattern) |
| `ext.math.styles` | extension [Math](https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-Math/wmf/1.47.0-wmf.19/extension.json) | **Conditional** — pages emitting MathML/fallback images | — | `ext.math.css` + `ext.math.less` | (same load.php pattern) |
| `jquery.makeCollapsible.styles` | core (`Resources.php:78-85`) | **Conditional — normally omit** (see `.client-js` gating, §16.4) | 3,927 B | `[show]`/`[hide]` toggle label styles | https://en.wikipedia.org/w/load.php?lang=en&modules=jquery.makeCollapsible.styles&only=styles&skin=vector-2022 |
| `ext.wikimediamessages.styles` | [WikimediaMessages extension](https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-WikimediaMessages/wmf/1.47.0-wmf.19/extension.json), generated by `SiteAdminHelperModule` | **Conditional — rarely needed for the embed** | 14,358 B | CSS derived from wiki messages | https://en.wikipedia.org/w/load.php?lang=en&modules=ext.wikimediamessages.styles&only=styles&skin=vector-2022 |
| `mediawiki.action.view.redirectPage` | core | **Conditional — redirect pages only** (verified via Doom vs plain page parse) | — | redirect landing page | https://en.wikipedia.org/w/load.php?lang=en&modules=mediawiki.action.view.redirectPage&only=styles&skin=vector-2022 |
| `mediawiki.page.gallery.styles` | core | **Conditional — gallery pages only** (verified present on Boxing, absent on Cat) | — | gallery rows | (same load.php pattern) |
| inline TemplateStyles | — | **Required per page**, delivered inside the `action=parse` HTML, never via ResourceLoader (§16.9) | 16 distinct `TemplateStyles:r*` revisions observed on Boxing | per-template CSS (`.mw-parser-output`-scoped) | embedded in parse text as `<style data-mw-deduplicate="TemplateStyles:rNNN">` |

**Category B — Vector chrome (Do-not-copy):** every rule targeting `#mw-navigation`, `.vector-header*`, `#vector-main-menu*`, `.vector-sticky-header*`, `.vector-toc*`/`#vector-toc`, `.vector-page-titlebar`, `.vector-page-toolbar`, `#vector-appearance*`, `.vector-column-end`, `.vector-user-links`, `.vector-dropdown`, `#footer`, `.mw-portlet`, `.vector-watchstar`, `.vector-search*, logo/`Logo.less`. Corresponding source files (from [skin.less](https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/wmf/1.47.0-wmf.19/resources/skins.vector.styles/skin.less) import list): `components/{Dropdown,MainMenu,PinnableElement,PinnableHeader,PageTools,TableOfContents,Button,Appearance,LanguageDropdown,UserLinks,Header,Icon,Indicators,Footer,Menu,MenuTabs,PageTitlebar,PageToolbar,SearchBox,SiteNotice,Watchstar,BottomDock,Logo}.less`, `layouts/toc/{pinned,unpinned}.less`, `print.less`, `layouts/print.less`. In the existing dump these live at `vector2022.css:2485-2895` (toc/pinned/sticky-header) and scattered header/footer blocks — prune on every refresh (§16.8).

**Category C — app-owned presentation (never copy from upstream):** width cap (`@max-width-content-container` value `948px` may be *read* as an upstream token but the class must be app-owned — §4.2), font-size var (`.vector-body` rule replacement), dark-mode handling, adaptations/suppression rules, Codex token values if needed for dark mode (fallbacks already inline upstream so light mode works token-free).

**Category D — legacy/irrelevant (Do-not-copy):** `skins.vector.styles.legacy`, `mediawiki.skins.legacy` (`content-media-legacy`), `skins.vector.js`, `skins.vector.clientPreferences`, `skins.vector.search`, `skins.vector.search.codex.styles` (needed only if the app's own panel adopts `cdx-*` classes — the Radix-based panel does not), `skins.vector.icons`/`icons.js` (OOUI icon CSS for chrome). `ext.gadget.ReferenceTooltips` and other gadget modules are per-config; treat as page-conditional via the same parse discovery.

**Copy form: compiled capture, not source LESS.** The source files (`resources/skins.vector.styles/*.less` under `@import 'mediawiki.skin.variables.less'` Codex tokens, `unit()` math, `@noflip`, `lessMessages: [parentheses-start, parentheses-end, brackets-start, brackets-end]` pulling wiki i18n, plus SkinModule feature CSS emitted by PHP classes, not files) cannot be compiled without a full MediaWiki build. Per [UpstreamFileMap's finding, verified](https://raw.githubusercontent.com/wikimedia/mediawiki/wmf/1.47.0-wmf.19/resources/Resources.php): only modules that compile to plain CSS without these features could be vendored from source; for this stack that is none of the required ones except trivially small extension styles.

### 16.2 Current official class/state table (live `<html>` on https://en.wikipedia.org/wiki/Boxing, 2026-09-13)

| Class (on `<html>` unless noted) | State | Owner/consumer |
|---|---|---|
| `vector-feature-limited-width-clientpref-1` / `-0` | Standard / Wide; pref key `vector-limited-width`, options `1\|0` | `.mw-page-container`/`.mw-body` grid max-width rules in `skins.vector.styles` |
| `vector-feature-limited-width-content-disabled` | server-side page exclusion (`VectorMaxWidthOptions`) | same rules; class is on `html` from the *page*, not a pref |
| `vector-feature-custom-font-size-clientpref-0` / `-1` / `-2` / `--excluded` | Small/Standard/Large; pref `vector-font-size` | sets `--font-size-medium`/`--line-height-*` vars ([CSSCustomProperties.less](https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/wmf/1.47.0-wmf.19/resources/skins.vector.styles/CSSCustomProperties.less)) |
| `vector-feature-toc-pinned-clientpref-1` / `-0` | TOC pinned/unpinned | chrome only |
| `vector-feature-appearance-pinned-clientpref-1` / `-0` | Appearance panel pinned/unpinned | chrome only |
| `skin-theme-clientpref-day` / `-night` / `-os` | theme | `html.skin-theme-*` rules in `skins.vector.styles` **and `site.styles`** (e.g. `.infobox a` night colors) |
| `skin-thumbsize-clientpref-standard` / `-small` / `-large` | thumb size (`<html>` class) | image sizing; NOT in `clientPreferences.json` |
| `skin-vector-2022` (on `body`), `vector-toc-available`, `vector-sticky-header-enabled`, `client-js` / `client-nojs` | skin/context | chrome; `client-js` also gates `.collapsible` hiding inside `site.styles` |
| DOM chain (live): `main#content.mw-body` → `div#bodyContent.vector-body` → `div#mw-content-text.mw-body-content` → `div.mw-parser-output` (verified in live Boxing HTML) | — | `.vector-body` carries the font-size rule; `.mw-body-content` carries sub/sup-80% and blockquote resets (site.styles + core); `.mw-parser-output` is the parse root |

**State-space summary [verified against live bundle]:** exactly two width states, three font-size states (plus `--excluded`), three theme states, two TOC states, two appearance states. The embed only ever needs the font-size and width *values*, applied app-owned (§4.2); everything else is chrome state the embed must not emulate.

### 16.3 Deterministic update command/URL recipe

Pinned to: **core branch `wmf/1.47.0-wmf.19` @ `444c0035d220c1b9ff9ab4ad930828d0e0db434d`, Vector branch tip `fa1bc23ab8329ac61ec11fe6e5403361ad79033b`.** Live `load.php` output always reflects *whatever is currently deployed*, so determinism comes from (a) recording `siteinfo` branch+hash, (b) recording the byte content hash, (c) date — not from URL parameters.

```bash
# 0) Pin the deployment (record these three lines in the provenance header):
curl -s 'https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo&format=json' \
  | jq -r '.query.general | "core=\(.[git-hash]) branch=\(.[git-branch])"'
curl -s 'https://api.github.com/repos/wikimedia/mediawiki-skins-Vector/branches/wmf%2F1.47.0-wmf.19' \
  | jq -r '.commit.sha, .commit.commit.committer.date'

# 1) Capture the compiled universal bundle (minified, no debug):
curl -s 'https://en.wikipedia.org/w/load.php?lang=en&modules=skins.vector.styles&only=styles&skin=vector-2022' \
  -o vendored/mw-vector2022-styles.css

# 2) Capture the core Parsoid content styles:
curl -s 'https://en.wikipedia.org/w/load.php?lang=en&modules=mediawiki.skinning.content.parsoid&only=styles&skin=vector-2022' \
  -o vendored/mw-skinning-content-parsoid.css

# 3) Capture per-wiki site styles (dynamic, no source file):
curl -s 'https://en.wikipedia.org/w/load.php?lang=en&modules=site.styles&only=styles&skin=vector-2022' \
  -o vendored/site-styles-enwiki.css

# 4) Capture conditional extension styles (re-verify per refresh whether still needed):
curl -s 'https://en.wikipedia.org/w/load.php?lang=en&modules=ext.cite.styles%7Cext.cite.parsoid.styles&only=styles&skin=vector-2022' \
  -o vendored/ext-cite-styles.css
```

Source paths for review/diff only (GitHub raw, branch ref):
- https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/wmf/1.47.0-wmf.19/skin.json (module map + `features`)
- https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/wmf/1.47.0-wmf.19/resources/skins.vector.styles/skin.less (import tree: `variables.less`, `CSSCustomProperties.less`, `typography.less`, `links.less`, `normalize.less`, `layouts/{screen,grid}.less`, 22 `components/*.less`)
- https://raw.githubusercontent.com/wikimedia/mediawiki/wmf/1.47.0-wmf.19/resources/Resources.php (`mediawiki.skinning.content.parsoid`, `site.styles`, `jquery.makeCollapsible.styles`)
- https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-WikimediaMessages/wmf/1.47.0-wmf.19/extension.json (`ext.wikimediamessages.styles`)
- Conditional extension manifests: https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-Cite/wmf/1.47.0-wmf.19/extension.json ; https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-Phonos/wmf/1.47.0-wmf.19/extension.json ; https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-TimedMediaHandler/wmf/1.47.0-wmf.19/extension.json ; https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-Math/wmf/1.47.0-wmf.19/extension.json
- `master` equivalents: same paths under `https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/...` and `https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/master/resources/...` — use only for looking forward; always diff against the deployed branch ref.

**Per-page discovery (works today, verified):**
```bash
# `prop=modules` returns `modules`, `modulescripts`, and `modulestyles`.
# `jsconfigvars` is required whenever `modules` is requested.
curl -s 'https://en.wikipedia.org/w/api.php?action=parse&page=Cat&format=json&formatversion=2&prop=modules%7Cjsconfigvars&useskin=vector-2022&disableeditsection=1'
# → parse.modulestyles: ["skins.vector.search.codex.styles","skins.vector.styles","skins.vector.icons","ext.cite.styles","ext.tmh.player.styles"]
```
`site.styles` is served via its own head `<link>`, not the returned `parse.modulestyles`, so always fetch it separately. `useskin` is the documented `action=parse` parameter and returned the skin-augmented list without warnings. A bare `skin=vector-2022` parameter is rejected with `Unrecognized parameter: skin`; never use it on `action=parse` (it remains correct on `load.php`).

Note on ResourceLoader comma packing (main-agent correction, verified against the [Doom head batch](https://en.wikipedia.org/wiki/Doom_(1993_video_game))): `modules=skins.vector.icons%2Cstyles` expands to **both** `skins.vector.icons` and `skins.vector.styles`. The full-page head style batch therefore *does* include the Vector styles bundle; it is not chrome-only. Any recipe that parses RL batches MUST expand comma-packed groups.

### 16.4 Required URL / scoping / cascade transformations

1. **Resource URL handling.** For runtime CSS inside a ShadowRoot, prefer `<link rel="stylesheet" href="https://${wikiLanguage}.wikipedia.org/w/load.php?...">`; the browser then resolves `/w/...` assets against the stylesheet's Wikipedia origin and uses its HTTP cache. If CSS is fetched as text and inserted into `<style>`, first absolutize root-relative `/w/...` URLs to that wiki's origin and protocol-relative `//...` URLs to `https://...`, because otherwise they resolve against the app origin. Only the vendored en/LTR fallback should rewrite assets to `/wiki-assets/<hash>-<name>` and copy binaries into `public/wiki-assets/` (precedent: `vector2022.css:939`).
2. **Do not carry `.client-js`.** `site.styles` contains `.client-js .collapsible... { display:none }` (verified). The embed has no MediaWiki makeCollapsible JS, so a wrapper carrying `client-js` would permanently hide collapsed navbox rows. Consequence: omit `jquery.makeCollapsible.styles` too (its `[show]`/`[hide]` label styles only matter when collapse is active); navbox collapsing stays the app's own `th.navbox-title` logic.
3. **`html.`/`body.`-prefixed selectors are dead in the embed.** `html.skin-theme-clientpref-night .infobox a { color: var(--color-progressive) !important }` (verified in `site.styles`) and `html.vector-feature-custom-font-size-*` var blocks can never match under a wrapper div. Accept the loss for site-prefixed rules (dark mode is app-owned, existing `filter`); re-map the font-size var contract to app-owned `--wiki-font-size` (§7).
4. **Feature classes must not be emulated on the shim divs.** No width rule in the bundle can reach the embedded content (`#wikiHtml`/`#wikiBody` lack `.mw-page-container`/`.mw-body`/`.mw-content-container` ancestors — §4.2). Width = app-owned `max-inline-size` on the article surface.
5. **Missing middle wrappers must be added** (biggest fidelity gap, [EmbeddedSelectorMap, verified against live HTML]): without `.mw-body-content` between `.vector-body` and `.mw-parser-output`, these verified rules die: `site.styles`' `.mw-body-content sub, .mw-body-content sup { font-size: 80% }`, Vector's content typography hooks, `content.parsoid`'s `.mw-body-content figure > a { border: 0 }`. Wrapper example in §16.7.
6. **Chrome pruning on capture.** Delete Category-B blocks immediately after capture, or keep them inert under a clearly named `@media` guard; never leave them fighting the app's header. Keep the `@media screen`/`@media print` structure of the bundle when pruning (print styles are harmless but large — pruning them is safe because the app never prints).
7. **Codex custom properties.** The bundle consumes `var(--color-progressive)`, `var(--background-color-neutral-subtle)`, `--font-size-small/medium/x-large`, etc., always with inline fallbacks → light mode works token-free; dark theme via the existing `filter` hack keeps working but night-*specific* rules (e.g. `html.skin-theme-clientpref-night ... img` backgrounds) cannot be reached. If real dark theming is later adopted, vendor the token root: https://raw.githubusercontent.com/wikimedia/mediawiki/wmf/1.47.0-wmf.19/resources/lib/codex-design-tokens/theme-wikimedia-ui-root.css.
8. **Direction is runtime state, not an enwiki constant.** Use the article wiki's `lang` in every `load.php` URL and preserve the `lang`/`dir` attributes already emitted on `.mw-parser-output`. ResourceLoader applies CSSJanus and `@noflip`; never reuse an en/LTR compiled capture for an RTL edition except as an explicitly degraded offline fallback (§16.11).

### 16.5 Source manifest / provenance requirements

Every vendored CSS file MUST carry a header block before line 1:

```css
/*! Vendored from enwiki ResourceLoader output. DO NOT EDIT MANUALLY.
 * module: skins.vector.styles
 * deployment: MediaWiki wmf/1.47.0-wmf.19 core=444c0035d220c1b9ff9ab4ad930828d0e0db434d vector-skin=fa1bc23ab8329ac61ec11fe6e5403361ad79033b
 * source: https://en.wikipedia.org/w/load.php?lang=en&modules=skins.vector.styles&only=styles&skin=vector-2022
 * captured: 2026-09-13  bytes: 89892  sha256: <hash>
 * transforms: chrome-pruned (see WIKIPEDIA_STYLE_RESEARCH.md §16.1-B); asset URLs rewritten to /wiki-assets/
 * license: GPL-2.0-or-later (see source repo headers)
 */
```

Plus a machine-readable `src/components/Wiki/styles/vendored/manifest.json` with the same fields (module list, branch, hash, capture date, sha256, size, transform list) so a diff-review script can fail loudly when manifest and file disagree. License note: `skins.vector.styles` and core modules are `GPL-2.0-or-later` (per `skin.json` `license-name` and Resources.php header).

### 16.6 Proposed repository file layout

```
src/components/Wiki/styles/
  unreset.css                  (keep; UA-default re-establishment for the wiki subtree)
  presentation.css             (new; app-owned --wiki-font-size, width modifiers, article-surface scoping)
  adaptations.css              (new; product-policy hides re-scoped from today's overrides.css:1-14)
  overrides.css                (deleted after re-split)
  vendored/
    manifest.json              (provenance, §16.5)
    mw-vector2022-content.css  (skins.vector.styles capture, chrome-pruned, assets rewritten)
    mw-skinning-content-parsoid.css
    site-styles-enwiki.css
    ext-cite-styles.css        (conditional snapshot; refresh with the baseline)
  assets/ -> public/wiki-assets/ (svg/png/woff referenced by the bundles)
```

Import order stays monotonic in `WikiDisplay.tsx`: `unreset.css` → `vendored/*.css` → `presentation.css` → `adaptations.css`.

### 16.7 Wrapper DOM example (maps live chain onto the embed)

```html
<div class="unreset wiki-insert wiki-width-standard wiki-font-standard">
  <!-- note: deliberately NO .client-js, NO vector-feature-*, NO skin/body classes -->
  <main id="wikiHtml" class="wiki-surface mw-body">
    <div id="bodyContent" class="vector-body">         <!-- carries the font-size/line-height rule -->
      <div id="mw-content-text" class="mw-body-content"> <!-- carries sub/sup, blockquote, content-body hooks -->
        <div class="mw-content-ltr mw-parser-output">  <!-- already the root of sanitized parse text -->
          …sanitized action=parse output…
        </div>
      </div>
    </div>
  </main>
</div>
```

Width/font modifiers (`wiki-width-*`, `wiki-font-*`) sit on the outermost `wiki-insert` surface so the app-rendered title and the injected article share one capped column (§7). The `.vector-body` / `.mw-body-content` / `.mw-parser-output` classes replace the stale fake-body class set at `WikiDisplay.tsx:59,64`; add `role="presentation"` divs as needed but do not add a *second* `.mw-parser-output` (the sanitized HTML already has one at its root).

### 16.8 Update diff-review checklist

1. **Provenance first:** new `git-hash` recorded; sha256 of every capture recomputed and matches the manifest; capture date ≤ cache staleness (site.styles `max-age=300`, so re-capture fresh, not from CDN cache: add `?debug=1`-free unique query is not needed — rely on `s-maxage=300` expiry or bypass with `Cache-Control: no-cache` header).
2. **Diff shape:** `diff -u old.css new.css` — count added/removed rule blocks; no diff on `presentation.css`/`adaptations.css` (they are app-owned; if the diff touches them, the capture pipeline is wrong).
3. **Chrome leak grep:** every added selector must not match the Category-B selector list (§16.1). Grep new rules for `vector-header|sticky|toc|main-menu|titlebar|toolbar|dropdown|footer|portlet|watchstar|search`.
4. **Dead-prefix grep:** added rules starting `html.` or `body.` must be dropped or re-scoped (they cannot match in the embed).
5. **Asset sweep:** every `url()` in the diff must resolve to `/wiki-assets/` or a `data:` URI; copy new binaries and verify they 200 over the dev server.
6. **New var() without fallback:** any added `var(--x)` lacking a `, fallback` needs either an app-owned definition or acceptance in writing (light-mode-only).
7. **Value-drift note:** record changed upstream px/rem values (e.g. `@max-width-content-container` 948px) in the manifest changelog — read them, but do not port them into app-owned code except deliberately (§7 tokens).
8. **Validation pages (render each locally after refresh):** Boxing (infobox + gallery + refs + navbox), Cat (refs, tmh video), a redirect page (`redirectPage`), Tower of London (WikiMiniAtlas gadget variance), a page with collapsed navbox rows. Check: article font-size knob scales body+headings+references; infobox floats right at standard width; no horizontal scrollbar; winning-link detection still matches `/wiki/Title_With_Underscores` hrefs (href-based, class-independent).
9. **i18n spot-check:** the bundles embed wiki-message text (`lessMessages`); enwiki messages drift — grep the diff for changed literal strings like `[show]`/`[hide]`/parenthesis glyphs and confirm the app's own copy of such strings is not affected (the app renders its own UI strings via typesafe-i18n).

### 16.9 Fallback strategy for per-page `modulestyles` / inline TemplateStyles

**Static baseline (checked in):** the union of `modulestyles` across the validation pages of §16.8 — currently `skins.vector.styles` (+ `mediawiki.skinning.content.parsoid`, `site.styles` fetched separately), `ext.cite.styles`, `ext.cite.parsoid.styles`. Anything in that union is vendored and imported statically.

**Per-page runtime fallback:** make the existing `action=parse` request include `prop=text|displaytitle|revid|modules|jsconfigvars&useskin=vector-2022`; `parse.modulestyles` is returned as part of `prop=modules` (there is no separate `modulestyles` prop). For any style module not in the baseline union, construct one `load.php?...&only=styles&skin=vector-2022` URL for the article's wiki. Load it as a `<link>` inside the article ShadowRoot, keyed by module set + wiki language; if light DOM is retained, fetch the CSS text and run the complete selector/URL scoping transform in §16.11 before inserting it. Merely placing an unscoped `<style>` inside a light-DOM container does **not** scope it. Skip known-gadget modules (`ext.gadget.*`) unless observed to carry content-critical CSS; log them for baseline review instead.

**Inline TemplateStyles:** always shipped inside the parse HTML itself as `<style data-mw-deduplicate="TemplateStyles:rNNN">` (verified: 16 revisions on Boxing; content `.mw-parser-output`-scoped, so the app-owned wrapper layers never override it). Duplicate rules on the same page become `<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:rNNN">`. DOMPurify's default config keeps `<style>` (verified in-repo: `ChahkandukBirjand.json` template styles survive, §3.1); whether it keeps the dedup `<link>` was not directly tested [INFERENCE: loss is benign because the identical rules were already emitted by the first occurrence, which always precedes the dedup link in document order]. Optional hardening: expand `mw-data:` dedup links to their original `<style>` content before sanitization by scanning the parse text for `data-mw-deduplicate` blocks — a ~20-line transform in `WikiDisplay.utils.tsx`.

**r-number drift:** TemplateStyles revision ids (`r1368532237` etc.) and site.styles content change with template edits without any MediaWiki release. That is why the recipe's per-page discovery step is mandatory at refresh time even when the vendored baseline appears unchanged: the baseline protects load-shape, the per-page fetch protects fidelity.

### 16.10 Conflict resolution notes (peer claims vs primary sources)

| Claim | Origin | Resolution |
|---|---|---|
| "Head batch does not include `skins.vector.styles` (chrome only)" | LiveCssModules | **Wrong; corrected by Main and verified.** `skins.vector.icons%2Cstyles` is comma-packed and expands to both modules; the compiled bundle carries `.mw-parser-output` content rules (27 occurrences verified) — it is the core content source, not just chrome. |
| "`site.styles` ≈ 4.5 KB" | LiveCssModules | Superseded by direct capture: **6,839 B** observed 2026-09-13. Treat all module sizes as capture-time observations, not constants. |
| "`mediawiki.skinning.content.parsoid` alone is enough core content CSS" | (implied by LiveCssModules minimal set) | **No — Main's constraint verified:** it is only Parsoid numbering + figure/media compatibility (7,049 B). Typography/tables/body rules live in `skins.vector.styles`. Minimal set = vector.styles + content.parsoid + site.styles (+ conditional ext styles). |
| "`skin` param is rejected with a warning by action=parse" | LiveCssModules | **Verified.** `action=parse&skin=vector-2022` returns `Unrecognized parameter: skin`; `useskin=vector-2022` is the documented parameter and returns the skin-augmented `modulestyles`. Use `useskin` on the API and `skin` on `load.php`. |
| "`.client-js` on `#wikiHtml` triggers dead [show]/[hide] labels" | EmbeddedSelectorMap | Verified true in the other direction: `site.styles` gates `.collapsible` hiding on `.client-js`; carrying it hides rows permanently. Recipe: never carry `.client-js`; drop `jquery.makeCollapsible.styles`. |
| "Infobox/navbox styling is TemplateStyles-inline (per EmbeddedSelectorMap)" | EmbeddedSelectorMap | **Partially true:** base `.infobox` rules are in `site.styles` (verified), while component refinements (16 revisions on Boxing) arrive inline as TemplateStyles. Both sources are needed. |
| "`.mw-body-content` missing in embed is the single biggest typography gap" | EmbeddedSelectorMap | Verified against live HTML + bundle: sub/sup-80%, figure border reset, and typography hooks all hang off `.mw-body-content`; wrapper recipe §16.7 adds it. |

### 16.11 Multi-language editions, RTL, and CSS isolation (correction of §16.1/§16.3/§16.7 scope)

**Constraint [verified]:** `WikiLanguageSelect.tsx` supports hundreds of Wikipedia editions, including RTL ones. A single enwiki snapshot cannot be the "official" source for the whole app. `load.php` output is **language/direction-sensitive**: the compiled bundle served by `https://he.wikipedia.org/w/load.php?lang=he&...` is CSSJanus-flipped relative to enwiki (observed: `float:left`/`float:right` and `margin-*` values mirrored in `mediawiki.skinning.content.parsoid`, 7,045 B vs 7,049 B LTR). `site.styles` is wiki-editable per host and diverges for every edition. Runtime fetch + cache from `https://${wikiLanguage}.wikipedia.org/w/load.php?lang=${wikiLanguage}&modules=...&only=styles&skin=vector-2022` is therefore the only exact-fidelity path; a per-language generated matrix is infeasible to maintain.

**Transport facts [verified 2026-09-13]:** `load.php` responses carry `access-control-allow-origin: *`, `cache-control: public, max-age=300, s-maxage=300`, `content-type: text/css; charset=utf-8` → cross-origin fetch from the app is allowed. Let the browser honor `Cache-Control`/`ETag`; an app cache must key by module set + language + direction and must not keep `site.styles` indefinitely because wiki CSS can change independently of a MediaWiki deployment.

**Isolation architecture (preferred, exact-fidelity):** render the article inside an `attachShadow({ mode: 'open' })` root on `.wiki-article-host`. Selectors do not bleed across shadow scopes, so the full unpruned compiled bundles (chrome included) can be loaded without touching app CSS, and **inline TemplateStyles becomes sandboxed content CSS instead of untrusted global CSS** — the DOMPurify `<style>`-survival risk disappears. Prefer `<link rel="stylesheet">` nodes in the shadow root for ResourceLoader URLs; use a `<style>` node or an adopted `CSSStyleSheet` only after applying the URL handling in §16.4. Load the sanitized parse HTML inside the minimal live structural chain (backed by official Vector [includes/templates/skin.mustache](https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/wmf/1.47.0-wmf.19/includes/templates/skin.mustache) and the local selector audit):

```html
<div class="wiki-article-host">
  #shadow-root
    <style>/* runtime-fetched, lang-specific compiled RL CSS */</style>
    <div class="wiki-insert unreset-lite">        <!-- app presentation modifiers + host-scoped vars -->
      <main class="mw-body">
        <div class="vector-body">
          <div id="mw-content-text" class="mw-body-content">
            {parse.text.* → <div class="mw-content-ltr mw-parser-output">…</div>}
          </div>
        </div>
      </main>
    </div>
</div>
```

Consequences that MUST be implemented together:
1. **All app queries target `shadowRoot`, not `document`**: click-to-navigate (`WikiLogic.tsx:11-19`), winning-link detection `findVisibleWinningLinks` (`WikiDisplay.utils.tsx:39-41` — `[href]` + `offsetWidth`), and navbox collapse (`th.navbox-title`) must run against `host.shadowRoot.querySelectorAll(...)`.
2. **Root-specific selectors cannot match inside shadow** (`:root`, `html`, `body`, `html.vector-feature-*`, `body.skin-vector-2022`): do not regex-translate them. Define the handful of consumed custom properties app-side on the host/`:host`: `--font-size-medium`, `--line-height-content`, `--font-size-small`/`--font-size-x-large`, and width tokens; per §16.4 the width cap is app-owned `max-inline-size` on `.wiki-insert` regardless.
3. **Per-language caching:** cache key = `moduleSet | wikiLanguage | direction`; respect the response's `Cache-Control`/`ETag` because `site.styles` and extension/wiki configuration can change without a core deployment. Record `core git-hash | module response sha256 | captured-at` for the vendored fallback and refresh it deliberately; do not use core git hash alone to invalidate runtime `site.styles`.
4. **Fallback baseline:** vendor an en/LTR compiled snapshot (§16.6) only as the offline/default fallback, explicitly labeled `enwiki @ wmf/…` in the manifest, with non-en divergence documented as runtime-resolved. `site.styles` is **never** vendored cross-wiki — it must always come from the article's own host at runtime.

**Light-DOM alternative (if ShadowRoot is rejected):** a plain regex refresh/transform is unsafe for cross-origin CSS; the scoping transform must be a PostCSS selector-AST pass that (a) splits selector lists, (b) prefixes compound selectors under `.wiki-article-surface`, (c) rewrites `html`/`body`/`:root` and `html.vector-feature-*` state selectors into the app-owned modifier equivalents, (d) retains `@media`/`@supports` at-rules and namespaces any inserted ones, and (e) absolutizes `/w/...` and protocol-relative `//...` URLs to `/wiki-assets/...`. Inline TemplateStyles in light DOM remains the untrusted-CSS escape hatch it is today — accepted only with the DOMPurify status quo, never with light-DOM `<link>` loading of the full bundles (global selector leak).

