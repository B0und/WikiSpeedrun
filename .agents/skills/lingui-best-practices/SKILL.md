---
name: lingui-best-practices
description: Implement internationalization with Lingui in React and JavaScript applications. Use when adding i18n, translating UI, working with Trans/useLingui/Plural, extracting messages, compiling catalogs, or when the user mentions Lingui, internationalization, i18n, translations, locales, message extraction, ICU MessageFormat, or working with .po files.
---

# Lingui Best Practices

Lingui is a powerful internationalization (i18n) framework for JavaScript. This skill covers best practices for implementing i18n in React and vanilla JavaScript applications.

## Quick Start Workflow

The standard Lingui workflow consists of these steps:

1. Wrap your app in `I18nProvider`
2. Mark messages for translation using macros (`Trans`, `t`, etc.)
3. Extract messages: `lingui extract`
4. Translate the catalogs
5. Compile catalogs: `lingui compile`
6. Load and activate locale in your app

## Core Packages

Import from these packages:

```jsx
// React macros (recommended)
import { Trans, Plural, Select, useLingui } from "@lingui/react/macro";

// Core macros for vanilla JS
import { t, msg, plural, select } from "@lingui/core/macro";

// Runtime (rarely used directly)
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
```

## Setup I18nProvider

Wrap your application with `I18nProvider`:

```jsx
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { messages } from "./locales/en/messages";

i18n.load("en", messages);
i18n.activate("en");

function App() {
  return (
    <I18nProvider i18n={i18n}>
      {/* Your app */}
    </I18nProvider>
  );
}
```

## Translating UI Text

### Choosing the Right Macro

Work through these questions in order:

1. **Does the message depend on a count?** → `Plural` (JSX) or `plural` (strings). Never wrap a count-dependent string in plain `Trans` — that bakes English plural rules into the message.
2. **Is it JSX content?** → `Trans`
3. **Is it a string inside a component** (attribute, alert, function argument)? → `useLingui()` + `` t`...` ``
4. **Is it defined outside a component** (module scope, constants, config)? → `msg` descriptor, resolved with `t(descriptor)` or `_(descriptor)` at render time
5. **Is it in non-React code?** → `t` from `@lingui/core/macro`

If the string needs a translator comment, take the **object** form of whichever macro the tree picks — `` t`…` `` and `` msg`…` `` have nowhere to attach one. Deciding that while you wrap costs nothing; converting a whole codebase afterwards does not. See the enhanced-message-context skill.

Some destinations expect a plain string and will not take a macro at all — a Zod message, a count inside an `aria-label`, a server function's return value, an `Intl` formatter. Those have their own recipes: [integration-recipes.md](references/integration-recipes.md).

### Use Trans for JSX Content

The `Trans` macro is the primary way to translate JSX:

```jsx
import { Trans } from "@lingui/react/macro";

// Simple text
<Trans>Hello World</Trans>

// With variables
<Trans>Hello {userName}</Trans>

// With components (rich text)
<Trans>
  Read the <a href="/docs">documentation</a> for more info.
</Trans>

// Extracted as: "Read the <0>documentation</0> for more info."
```

**When to use**: For any translatable text in JSX elements.

### Use useLingui for Non-JSX

For strings outside JSX (attributes, alerts, function calls):

```jsx
import { useLingui } from "@lingui/react/macro";

function MyComponent() {
  const { t } = useLingui();

  const handleClick = () => {
    alert(t`Action completed!`);
  };

  return (
    <div>
      <img src="..." alt={t`Image description`} />
      <button onClick={handleClick}>{t`Click me`}</button>
    </div>
  );
}
```

**When to use**: Element attributes, alerts, function parameters, any non-JSX string.

The macro hook returns **`i18n` as well as `t`**, and both are bound to the React context — so one hook covers reading the active locale, formatting against it, and subscribing the component to locale changes. One import covers it — the runtime `useLingui` from `@lingui/react` is for code that has no macro transform:

```jsx
import { useLingui } from "@lingui/react/macro";

const { t, i18n } = useLingui();
i18n.locale;                       // "de-DE" — the active locale
new Intl.NumberFormat(i18n.locale) // format against it
```

### Use msg for Lazy Translations

When you need to define messages at module level or in arrays/objects:

```jsx
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";

// Module-level constants
const STATUSES = {
  active: msg`Active`,
  inactive: msg`Inactive`,
  pending: msg`Pending`,
};

function StatusList() {
  const { _ } = useLingui();
  
  return Object.entries(STATUSES).map(([key, message]) => (
    <div key={key}>{_(message)}</div>
  ));
}
```

**When to use**: Module-level constants, arrays of messages, conditional message selection.

#### Descriptors change the field's type

`msg` turns a `string` field into a `MessageDescriptor`, so TypeScript points at every consuming site — which is what makes this conversion safe to apply in bulk. Two things get through it:

**React keys keep compiling.** `key={item.label}` becomes an object key, which React stringifies to `[object Object]` — identical for every row, so reconciliation degrades and the only signal is a console warning. Key on an identifier, never on the copy:

```jsx
// ❌ compiles; every key is now identical
{NAV.map((item) => <li key={item.label}>{t(item.label)}</li>)}

// ✅
{NAV.map((item) => <li key={item.to}>{t(item.label)}</li>)}
```

**String methods become type errors with a tempting wrong fix.** `LABELS[k].toLowerCase()` fails to compile — correctly — but `t(LABELS[k]).toLowerCase()` is not the repair. Lower-casing a translation breaks languages that capitalise by rule (German nouns) and is a no-op in scripts without case. If a lower-case variant is really needed, it is a second message with its own comment.

## Pluralization

Use the `Plural` macro for quantity-dependent messages:

```jsx
import { Plural } from "@lingui/react/macro";

<Plural 
  value={messageCount}
  one="You have # message"
  other="You have # messages"
/>
```

The `#` placeholder is replaced with the actual value.

### Exact Matches

Use `_N` syntax for exact number matches (takes precedence over plural forms):

```jsx
<Plural
  value={count}
  _0="No messages"
  one="One message"
  other="# messages"
/>
```

### With Variables and Components

Combine with `Trans` for complex messages:

```jsx
<Plural
  value={count}
  one={`You have # message, ${userName}`}
  other={
    <Trans>
      You have <strong>#</strong> messages, {userName}
    </Trans>
  }
/>
```

## Formatting Dates and Numbers

Use `Intl` directly:

```jsx
import { useLingui } from '@lingui/react/macro';

function MyComponent() {
  const { i18n } = useLingui();
  const lastLogin = new Date();
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(i18n.locale), [i18n.locale]);
  return <Trans>Last login: {dateFormatter.format(lastLogin)}</Trans>;
}
```

## Message IDs and Context

### Explicit IDs

Provide a custom ID for stable message keys:

```jsx
<Trans id="header.welcome">Welcome to our app</Trans>
```

### Context for Disambiguation

When the same text has different meanings, use `context`:

```jsx
<Trans context="direction">right</Trans>
<Trans context="correctness">right</Trans>
```

These create separate catalog entries.

Use `context` only when the same text genuinely needs different translations — not as a namespacing scheme (`auth.login`, `settings.title`). Identical strings with identical meaning should share one catalog entry so they are translated once.

### Comments for Translators

Add context for translators:

```jsx
<Trans comment="Greeting shown on homepage">Hello World</Trans>
```

## Configuration

Basic `lingui.config.js`:

```js
import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "es", "fr", "de"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
      exclude: ["**/node_modules/**"],
    },
  ],
});
```

For detailed configuration patterns, see [configuration.md](references/configuration.md).

### Lingui 6 Notes

Lingui 6 (April 2026) is ESM-only and requires Node.js ≥ 22.19 (or ≥ 24). If the project can't meet that, pin all `@lingui/*` packages to `^5`.

The deprecated string form `format: "po"` and the `formatOptions` option were removed in v6. Omit `format` entirely (PO remains the default), or pass a formatter instance to configure it:

```js
import { defineConfig } from "@lingui/cli";
import { formatter } from "@lingui/format-po";

export default defineConfig({
  // ...
  format: formatter({ lineNumbers: false }),
});
```

`lineNumbers: false` keeps catalog diffs small — line-number comments change on almost every source edit.

## Catalog Hygiene

Wire extraction and compilation into the project so they can't be forgotten:

```json
{
  "scripts": {
    "lingui:extract": "lingui extract",
    "lingui:compile": "lingui compile",
    "dev": "lingui compile && vite",
    "build": "lingui compile && vite build"
  }
}
```

- **Prepend `lingui compile && ` to the existing `dev`/`build` scripts** — never replace them, and don't rely on a `prebuild` hook: pnpm ≥ 7 and Yarn Berry don't run pre/post hooks by default.
- **Gitignore compiled catalogs by extension, never by directory.** A directory rule like `src/locales/` also swallows the `.po` files — the translation source of truth:

```gitignore
# ✅ compiled artifacts only
src/locales/**/messages.ts
src/locales/**/messages.js

# ❌ never — silently untracks the .po sources too
# src/locales/
```

Verify with `git check-ignore`: the compiled file must match, its `.po` sibling must not. Ignoring compiled catalogs is only safe because `lingui compile` runs before every build — don't do one without the other.
- **Match `compileNamespace` to how the app imports the catalog.** If the code imports `./locales/en/messages` as a `.ts` file, set `compileNamespace: "ts"` in `lingui.config` so a plain `lingui compile` regenerates exactly that artifact — no `--typescript` flag anyone can forget.
- **Vite alternative**: with `@lingui/vite-plugin`, the app can dynamically import `.po` catalogs directly (`await import(\`./locales/${locale}/messages.po\`)`) — the plugin compiles on the fly, so there are no compiled catalog files to script around or gitignore.
- **Add a CI drift check** so catalog state is part of the PR contract:

```json
"i18n:check": "lingui compile && lingui extract --clean && git diff --exit-code -- src/locales"
```

This fails the build when someone adds or edits a message without re-running extraction.

## Best Practices

### Always Use Macros

Prefer macros over runtime components. Macros are compiled at build time, reducing bundle size:

```jsx
// ✅ Good - uses macro
import { Trans } from "@lingui/react/macro";

// ❌ Avoid - runtime only
import { Trans } from "@lingui/react";
```

### Keep Messages Simple

Avoid complex expressions in messages - they'll be replaced with placeholders:

```jsx
// ❌ Bad - loses context
<Trans>Hello {user.name.toUpperCase()}</Trans>
// Extracted as: "Hello {0}"

// ✅ Good - clear variable name
const userName = user.name.toUpperCase();
<Trans>Hello {userName}</Trans>
// Extracted as: "Hello {userName}"
```

When extracting to a local variable isn't practical, name the placeholder inline with `ph()`:

```jsx
import { ph } from "@lingui/core/macro";

// Extracted as: "Hello {name}" instead of "Hello {0}"
t`Hello ${ph({ name: getUserName() })}`;
```

`ph()` also works inside `Trans`, `Plural`, and `Select`.

### Use Trans for JSX, t for Strings

Choose the right tool:

```jsx
// ✅ For JSX content
<h1><Trans>Welcome</Trans></h1>

// ✅ For string values
const { t } = useLingui();
<img alt={t`Profile picture`} />
```

### Don't Use Macros at Module Level

Macros need component context - use `msg` instead:

```jsx
// ❌ Bad - won't work
import { t } from "@lingui/core/macro";
const LABELS = [t`Red`, t`Green`, t`Blue`];

// ✅ Good - use msg for lazy translation
import { msg } from "@lingui/core/macro";
const LABELS = [msg`Red`, msg`Green`, msg`Blue`];
```

### Don't Wrap Non-UI Strings

Not every string is a message. Leave these unwrapped:

- CSS classes and `className` values
- `console.*` / logger output and developer-facing error codes
- Import paths, URLs, API routes, query keys
- Object keys, enum values, ALL_CAPS constants, `data-testid` values
- Values that are compared against or persisted (statuses, slugs)

Locale-prefixing URLs is a routing concern, not a translation concern — don't wrap paths in macros.

### Use the ESLint Plugin

Install and configure `eslint-plugin-lingui` to catch common mistakes automatically:

```bash
npm install --save-dev eslint-plugin-lingui
```

```js
// eslint.config.js
import pluginLingui from "eslint-plugin-lingui";

export default [
  pluginLingui.configs["flat/recommended"],
];
```

## Locale Metadata: Single-Source It

Define locale facts once in a shared module with no React or framework imports, so it's safe to use from config, middleware, tests, and components alike:

```ts
// src/i18n/locales.ts
export const locales = ["en", "es", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const sourceLocale: Locale = "en";

const RTL_LOCALES = new Set(["ar", "he", "fa", "ur"]);
export const getDirection = (locale: string): "ltr" | "rtl" =>
  RTL_LOCALES.has(locale.split("-")[0]) ? "rtl" : "ltr";

// "Deutsch", not "German" — each language name rendered in its own language
export const localeDisplayName = (locale: string) =>
  new Intl.DisplayNames([locale], { type: "language" }).of(locale) ?? locale;

// `null` is in the signature on purpose: detect() and headers.get() both return it
export function resolveLocale(candidate: string | null | undefined): Locale {
  if (!candidate) return sourceLocale;
  if ((locales as readonly string[]).includes(candidate)) return candidate as Locale;
  const base = candidate.split("-")[0]; // es-MX → es
  return (locales as readonly string[]).includes(base) ? (base as Locale) : sourceLocale;
}
```

Signs this went wrong: `getDirection` or `Intl.DisplayNames` defined in more than one file, hardcoded `dir="rtl"` conditionals scattered around, hand-maintained language-name maps.

Layout caveat: don't keep both `src/i18n.ts` and `src/i18n/` — the flat file shadows the directory's `index.ts` in module resolution, the build still passes, and the app is quietly wrong. Pick one layout.

## Common Patterns

### Dynamic Locale Switching

```jsx
import { i18n } from "@lingui/core";

async function changeLocale(locale) {
  const { messages } = await import(`./locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
```

### Loading Catalogs Dynamically

```jsx
import { useEffect } from "react";
import { i18n } from "@lingui/core";

function loadCatalog(locale) {
  return import(`./locales/${locale}/messages`);
}

function App() {
  useEffect(() => {
    loadCatalog("en").then(catalog => {
      i18n.load("en", catalog.messages);
      i18n.activate("en");
    });
  }, []);
  
  return <I18nProvider i18n={i18n}>{/* ... */}</I18nProvider>;
}
```

### Memoization with useLingui

When using memoization, use the `t` function from the macro version:

```jsx
import { useLingui } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { useMemo } from "react";

const welcomeMessage = msg`Welcome!`;

function MyComponent() {
  const { t } = useLingui(); // Macro version - reference changes with locale
  
  // ✅ Safe - t reference updates with locale
  const message = useMemo(() => t(welcomeMessage), [t]);
  
  return <div>{message}</div>;
}
```

## Troubleshooting

If you encounter issues:

1. **Messages not extracted**: Check `include` patterns in `lingui.config.js`
2. **Translations not applied**: Ensure catalogs are compiled with `lingui compile`
3. **Runtime errors**: Verify `I18nProvider` wraps your app
4. **Type errors**: Run `lingui compile --typescript` for TypeScript projects

For detailed common mistakes and pitfalls, see [common-mistakes.md](references/common-mistakes.md).

For the seams where Lingui meets a library that wants a plain string — validation schemas, plurals inside attributes, `i18n._()` with values, server-composed messages, `Intl` formatters — see [integration-recipes.md](references/integration-recipes.md). Each of those has a version that compiles, ships, and is wrong; the recipes lead with the trap.
