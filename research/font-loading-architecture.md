# Localized font-loading architecture

## Decision

Keep CJK font CSS lazy, but stop treating font loading as part of Lingui catalog activation. Select CJK families by the rendered content's `lang`, not by a permanent global fallback order, move from two static weights to Fontsource variable packages, and render inactive language-picker options with system fonts so previewing them does not fetch their webfont subsets.

For this project, the best target architecture is:

1. Statically load `@fontsource-variable/noto-sans/wght.css` as the base UI font.
2. Lazily register `@fontsource-variable/noto-sans-jp/wght.css` and `@fontsource-variable/noto-sans-sc/wght.css` when Japanese or Simplified Chinese content becomes active.
3. Use `:lang(ja)` and `:lang(zh-Hans)`/`:lang(zh)` to choose the correct regional CJK family through CSS custom properties.
4. Give embedded Wikipedia content its own `lang` attribute and load a font for both `interfaceLanguage` and `wikiLanguage`.
5. Remove the dedicated Noto Sans Devanagari package: the base Noto Sans package already contains a Devanagari `unicode-range` face.
6. Keep `font-display: swap`; do not block locale activation on `document.fonts`.
7. Render language-picker option labels with `system-ui, sans-serif`; selected page and article content still use the webfont stack.

TanStack Router does not provide a font optimizer. Its head API can add links, but route lifetime is the wrong lifecycle for this app's independent interface and article languages.

## Current implementation

- `src/main.tsx` statically imports Noto Sans weights 400 and 700.
- `src/locales/config.ts` maps `hi`, `ja`, and `zh` to dynamic imports for two script-font weights.
- `src/locales/runtime.ts` waits for both the Lingui catalog and font CSS before activating the locale.
- `tailwind.config.cjs` always orders fallback families as Noto Sans, Noto Sans Devanagari, Noto Sans JP, then Noto Sans SC.
- `src/index.css` uses an `App Serif` local face whose `unicode-range` excludes Devanagari and CJK, causing those glyphs to fall through to the Noto families.

Fontsource's default CSS is already split with `unicode-range`. A declared face does not download its font file merely because the stylesheet is loaded; the browser requests a face when rendered text needs code points in its range. Fontsource recommends relying on this default range splitting rather than manually importing one broad subset ([Fontsource subset guidance](https://fontsource.org/docs/getting-started/subsets); [MDN `unicode-range`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range); [CSS Fonts 4](https://www.w3.org/TR/css-fonts-4/#unicode-range-desc)).

## Problems found
### Language-selector options activate inactive ranges

The original recommendation missed a distinct render surface: opening `InterfaceLanguageSelect` mounts native-script labels such as `Ελληνικά`, `हिंदी`, `Русский`, and `Tiếng Việt` in a Radix portal. Those labels inherit the global `Noto Sans Variable` family. Because the static `wght.css` has already registered Greek, Devanagari, Cyrillic, and Vietnamese faces, the browser downloads all four WOFF2 files as soon as the menu lays out.

This is correct `unicode-range` behavior, not eager downloading by Lingui, React, Radix, or Vite. A face is registered when its CSS loads, but its binary is requested when rendered text intersects the declared range. Native-script names are previews of inactive languages, so they should use `system-ui, sans-serif`. The selected interface or article remains in the language-aware webfont stack and triggers its subset normally.


### 1. CJK family selection is wrong after an in-app locale switch

Dynamic CSS imports register `@font-face` rules in the document and do not remove the previously registered family. After Japanese and Chinese have both been visited, the global Tailwind stack still puts `Noto Sans JP` before `Noto Sans SC`. Japanese and Simplified Chinese fonts overlap heavily in code-point coverage but intentionally contain regional glyph forms ([Noto CJK deployment guidance](https://github.com/notofonts/noto-cjk/blob/main/Sans/README.md)). A fixed family order therefore cannot represent both languages correctly.

This was reproduced in Chromium against the current app:

- A fresh `zh` load rendered both glyphs of the Settings heading `设置` with `Noto Sans SC`.
- In the same document, switching `ja` → `zh` left both CJK families registered. Chrome's `CSS.getPlatformFontsForNode` reported one heading glyph from `Noto Sans SC` and one from `Noto Sans JP`.

That is a correctness bug, not just a performance trade-off. Static imports alone would make it happen on every Chinese load unless family selection also becomes language-aware.

### 2. Font loading follows the wrong state

`interfaceLanguage` controls Lingui messages. `wikiLanguage` independently controls Wikipedia article content. The current font imports follow only `interfaceLanguage`, so an English-interface user viewing Japanese Wikipedia does not register the Japanese font. The reverse case registers Chinese/Japanese font CSS even when the article content does not use it.

Fonts should follow the language of the content subtree. HTML defines `lang` as the element content's primary language and requires a valid BCP 47 tag ([HTML Standard](https://html.spec.whatwg.org/multipage/dom.html#the-lang-and-xml:lang-attributes)). CSS `:lang()` matches that language and inherits through a subtree ([MDN `:lang()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:lang)). This is the correct seam for selecting Japanese versus Chinese forms.

### 3. Waiting for the CSS import does not wait for the font

Vite guarantees that CSS associated with an async chunk is loaded before that chunk is evaluated, preventing an unstyled component flash ([Vite CSS code splitting](https://vite.dev/guide/features#css-code-splitting)). That guarantee stops at the stylesheet. Font binaries are normally requested only once matching styled text is rendered ([CSS Font Loading](https://www.w3.org/TR/css-font-loading/#introduction); [web.dev font loading guidance](https://web.dev/articles/font-best-practices)).

Therefore `Promise.all([loadMessages(locale), loadFontCss(locale)])` delays translation activation until font CSS arrives but still cannot guarantee that the glyphs are ready. Fontsource uses `font-display: swap`, so fallback text may render and later swap ([MDN `font-display`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)). Catalog loading and font registration should have independent lifecycles.

### 4. The Hindi font import is mostly duplicate coverage

The statically imported `@fontsource/noto-sans/400.css` and `700.css` already declare Devanagari faces under the `Noto Sans` family. In the sans stack, those glyphs match the first family, so the later `Noto Sans Devanagari` family is never reached. The dedicated family is only reached by the serif stack because `App Serif` excludes Devanagari and the serif stack does not contain base Noto Sans.

Use base Noto Sans as the Devanagari fallback for both stacks, or deliberately add Noto Serif Devanagari if Hindi headings must remain serif. Loading another sans family under a different name adds no useful coverage.

### 5. The current static-weight packages add avoidable build output

The current production build contains:

| Family | WOFF files | WOFF2 files | Emitted payload |
| --- | ---: | ---: | ---: |
| Noto Sans | 14 | 14 | 0.53 MiB |
| Noto Sans Devanagari | 8 | 8 | 0.51 MiB |
| Noto Sans JP | 248 | 248 | 12.38 MiB |
| Noto Sans SC | 196 | 196 | 10.49 MiB |

The whole build is 33 MiB and contains 932 font assets. Browsers select WOFF2 first, so the WOFF copies are deployment/build weight rather than normal client transfer.

Fontsource's variable `wght.css` files use one WOFF2 variable face per Unicode range, support weights 100–900, and preserve the same range splitting. This was verified directly in the published 5.3.0 CSS for [Noto Sans](https://unpkg.com/@fontsource-variable/noto-sans@5.3.0/wght.css), [Noto Sans JP](https://unpkg.com/@fontsource-variable/noto-sans-jp@5.3.0/wght.css), and [Noto Sans SC](https://unpkg.com/@fontsource-variable/noto-sans-sc@5.3.0/wght.css). It also prevents synthesis for the app's existing 500 and 600 weight declarations. Fontsource documents variable fonts as one file spanning a weight range ([Fontsource variable-font guidance](https://fontsource.org/docs/getting-started/variable)).

## Options compared

| Approach | Result in this project |
| --- | --- |
| System fonts only | Lowest transfer and no webfont swap, but loses deterministic typography and can vary materially across Linux/Windows/macOS. Safe fallback, not the chosen design. |
| Static imports for every current package | Browser still conditionally downloads binary subsets through `unicode-range`, but Latin-only users would receive about 159 KiB more gzipped JP/SC CSS based on the current build. It also does not solve JP/SC regional selection without `:lang()`. Simple but needlessly expensive here. |
| Current locale-triggered static-weight CSS | Saves initial CSS bytes, but uses the wrong state, delays message activation without waiting for fonts, duplicates Devanagari, and permits JP/SC mixing after switches. |
| Lazy variable CJK CSS plus `:lang()` | Preserves lazy CJK stylesheet delivery, halves weight declarations, emits WOFF2-only variable assets, supports every used weight, and selects regional forms correctly. Best balance. |
| Browser Font Loading API | Useful for tests and explicit readiness checks. Blocking UI on `document.fonts.load()` or `document.fonts.ready` would trade FOUT for delayed text and complicate code-point/subset discovery. Not needed in production. |
| TanStack route `head().links` | TanStack can add and unload head links ([Document Head Management](https://tanstack.com/router/latest/docs/guide/document-head-management)), but fonts vary by content language rather than route. It also does not provide `next/font`-style processing. TanStack's own migration guide says to use self-hosted files or Fontsource, preserve weights/subsets and `font-display`, and verify layout/network behavior ([TanStack Start migration guide](https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js#replace-image-and-font-services-deliberately)). |
| Preload all script fonts | Explicitly discouraged. Preload bypasses `unicode-range` selection and competes with critical resources; only a known critical face should be preloaded ([web.dev](https://web.dev/articles/font-best-practices#be_cautious_when_using_preload_to_load_fonts); [Fontsource preload guidance](https://fontsource.org/docs/getting-started/preload)). |
| System-font picker options | Keeps native-script preview labels out of the registered webfont family, so opening either selector causes no language-specific WOFF2 request. The transient menu follows OS typography; selected content remains unchanged. |
| External Google Fonts | Can dynamically subset and serve variable fonts, but adds a third-party connection and privacy/deployment dependency. The repo already self-hosts; no reason to reverse that. |

## Real-world patterns

- [Wikimedia Universal Language Selector](https://github.com/wikimedia/mediawiki-extensions-UniversalLanguageSelector) separates native-script picker labels from on-demand webfont application. Its webfonts are applied after choosing a language rather than being required to browse the picker ([ULS WebFonts](https://www.mediawiki.org/wiki/Universal_Language_Selector/WebFonts)).
- [`tmoroney/auto-subs`](https://github.com/tmoroney/auto-subs/blob/main/AutoSubs-App/src/lib/font-loader.ts) keeps font registration in a dedicated, idempotent loader and dynamically imports Noto packages for active transcript languages.
- [`block/buzz`](https://github.com/block/buzz/blob/main/desktop/src/main.tsx) statically imports Fontsource variable CSS and relies on `unicode-range` for ordinary content-driven downloads. A multi-script picker is the edge case where option typography must be isolated.
- [`vrcx-team/VRCX`](https://github.com/vrcx-team/VRCX/blob/master/src/styles/fonts.css) statically imports several regional CJK packages and changes family priority by document language. It supports language-aware family ordering, but its desktop-app tradeoff is not a lazy-loading model for this web app.

## Recommended implementation shape

### CSS selection

Keep language-specific family choice declarative. A CSS custom property allows Tailwind's existing `font-sans` and `font-serif` utilities to remain unchanged at call sites:

```css
:root {
  --font-sans: "Noto Sans Variable", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "App Serif", "Noto Sans Variable", serif;
}

:lang(ja) {
  --font-sans: "Noto Sans Variable", "Noto Sans JP Variable", sans-serif;
  --font-serif: "App Serif", "Noto Sans JP Variable", serif;
}

:lang(zh),
:lang(zh-Hans) {
  --font-sans: "Noto Sans Variable", "Noto Sans SC Variable", sans-serif;
  --font-serif: "App Serif", "Noto Sans SC Variable", serif;
}
```

Then configure Tailwind's families as `var(--font-sans)` and `var(--font-serif)`. `App Serif` can retain its Unicode exclusions so Latin headings stay serif while CJK/Devanagari glyphs fall through.

`zh` currently means Simplified Chinese in this app. `zh-Hans` would encode that decision explicitly; bare `zh` does not identify Simplified versus Traditional Chinese. BCP 47 language/script matching is defined by [RFC 4647](https://www.rfc-editor.org/rfc/rfc4647), and the Noto project ships distinct SC, TC, and HK forms.

### Loading

Use a small font module independent of Lingui:

```ts
const fontLoaders = {
  ja: () => import("@fontsource-variable/noto-sans-jp/wght.css"),
  zh: () => import("@fontsource-variable/noto-sans-sc/wght.css"),
} as const;
```

Load the relevant family when either active language changes. Imports are module-cached, so repeat requests do not reload the stylesheet. Do not await the result before activating translations; keep error reporting because a failed CSS chunk should not break locale switching.

Add `lang={wikiLanguage}` around Wikipedia article content and titles. This lets an English interface with Japanese content select JP, and lets nested content override the page language correctly. The current `wikiLanguage` list contains many scripts for which the app bundles no font; those should continue through robust system generic fallbacks rather than adding hundreds of webfonts.

### Picker previews

Apply `font-family: system-ui, sans-serif` only to option rows in both language selectors. Do not apply it to the selected page content. This preserves native-script readability through platform fallback while preventing inactive labels from matching registered Noto webfont faces.

### Rendering policy

Keep `font-display: swap`. `optional` can reduce layout shifts but may leave first-time users on system fonts for the whole navigation; that works against the reason for bundling regional CJK fonts. Preloading is not appropriate because the needed CJK Unicode chunks are not known before text exists. Use the Font Loading API only in visual checks such as the existing `document.fonts.ready` wait.

## Verification criteria for an implementation

1. Fresh `en` UI: only the base Latin face is requested; no JP/SC CSS or font requests.
2. Opening either language selector: no WOFF2 request.
3. Selecting `el`, `hi`, `ru`, or `vi`: the matching base Noto Sans subset is requested when translated content renders.
4. Fresh `ja` UI: JP variable CSS loads; SC does not; actual Japanese glyphs report JP via Chrome `CSS.getPlatformFontsForNode`.
5. Fresh `zh` UI: SC variable CSS loads; actual Chinese glyphs report SC.
6. In one SPA document, switch `ja → zh → ja`: no heading mixes JP and SC glyphs.
7. Keep interface `en`, set Wikipedia language to `ja` or `zh`: article title/body has the matching `lang`, loads the matching family, and reports the matching actual font.
8. Locale catalog activation still succeeds if a font CSS request fails.
9. Build output contains variable WOFF2 assets and no duplicate WOFF fallback set.
10. Existing all-locale visual scenarios pass after baselines are reviewed for intentional metric changes.
