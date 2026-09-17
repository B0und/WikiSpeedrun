# Integration Recipes

The macro decision tree in `SKILL.md` covers where a string lives. This file covers the **seams** — the places where Lingui meets another library whose API expects a plain string, and the obvious move produces something that compiles, ships, and is wrong.

Each recipe states the trap first, because the trap is what makes the recipe necessary.

## Validation schemas (Zod, Yup, Valibot)

**The trap.** A schema is usually declared at module scope, and validation libraries want display-ready strings, not descriptors. So the natural code resolves every message once, at import time, against whatever locale happened to be active — and then never again. The form validates in English for the rest of the session.

```ts
// ❌ Frozen at import. Switching locale does not change these messages.
import { t } from '@lingui/core/macro'

export const contactSchema = z.object({
  email: z.string().email(t`Enter a valid email address.`),
})
```

`msg` does not fix this on its own: Zod needs a `string`, and a `MessageDescriptor` is an object.

**The recipe.** Make the schema a factory that takes the resolver, and rebuild it when the locale changes.

```ts
// src/features/contact/contact-schema.ts
import { z } from 'zod'
import { msg } from '@lingui/core/macro'
import type { MessageDescriptor } from '@lingui/core'

/** Pass `t` from `useLingui()` on the client. */
export type Translate = (descriptor: MessageDescriptor) => string

export function makeContactSchema(_: Translate) {
  return z.object({
    email: z
      .string()
      .min(1, _(msg({
        comment: 'Contact form validation: the email field was left empty',
        message: 'We need an email address to reply to.',
      })))
      .email(_(msg({
        comment: 'Contact form validation: the email address is malformed',
        message: 'Enter a valid email address.',
      }))),
  })
}

export type ContactValues = z.infer<ReturnType<typeof makeContactSchema>>
```

```tsx
// The consuming component
const { t } = useLingui()
const schema = useMemo(() => makeContactSchema(t), [t])

const form = useForm<ContactValues>({ resolver: zodResolver(schema) })
```

`useMemo` on `[t]` is what makes it reactive — `t` is a new binding per locale, so the schema is rebuilt exactly when it needs to be.

**Server-side validation.** The same schema usually runs on a server route or action, where there is no React context and often no activated i18n instance. Those messages never reach a reader — a `parse` failure surfaces as a generic error code — so resolve them to their source text rather than reaching for an instance:

```ts
/** Server-only. Messages never reach a reader; a parse failure becomes an error code. */
export const contactSchema = makeContactSchema((d) => String(d.message ?? ''))
```

Note the type flows from the factory (`z.infer<ReturnType<typeof makeContactSchema>>`), so there is one schema definition and one derived type, not two that can drift.

## Plurals inside a string, in React

**The trap.** `Plural` is a JSX component, so it cannot go in an `aria-label`, a `placeholder`, or a `toast()` argument. The available string-form macro, `plural`, is exported from `@lingui/core/macro` and binds the **global** `i18n` singleton — which is wrong in any app that activates a per-request instance (SSR) rather than the global one. The result is a count that renders in the source language while everything around it is translated.

**The recipe.** Nest the `plural` macro inside the context-bound `t` from `useLingui()`. Macros compose at compile time: `plural` becomes ICU inside the message, and the surrounding `t` is what binds it to the active instance.

```tsx
import { useLingui } from '@lingui/react/macro'
import { plural } from '@lingui/core/macro'

function NotificationBell({ unread }: { unread: number }) {
  const { t } = useLingui()

  return (
    <button
      aria-label={t`${plural(unread, {
        one: '# unread notification',
        other: '# unread notifications',
      })}`}
    >
      <BellIcon aria-hidden="true" />
    </button>
  )
}
```

Extracts as a single ICU message, so every plural category a target language needs is available to the translator:

```po
msgid "{unread, plural, one {# unread notification} other {# unread notifications}}"
```

Write only the categories the **source** language has (English: `one`/`other`). Languages with more — Ukrainian, Polish, Arabic — get their `few`/`many`/`zero` branches in the translation, not in your source. Adding them to the source is not how you support them.

Verify it once, in the catalog rather than in the diff: if extraction produces two separate messages instead of one ICU string, the macros did not compose and the transform is mis-wired.

## `i18n._()` with interpolation values

**The trap.** The overloads are `_(descriptor)` and `_(id, values, options)` — there is no `_(descriptor, values)`. Reaching for the obvious call silently drops the values, leaving raw `{placeholders}` in the output.

**The recipe.** For a descriptor that needs values, use the three-argument form and pass the descriptor's own fields:

```ts
const PAGE_TITLE = msg({
  comment: 'Browser tab title for an article. {title} is the headline',
  message: '{title} — Kestrel Blog',
})

// ❌ values are dropped; renders literally as "{title} — Kestrel Blog"
i18n._(PAGE_TITLE, { title })

// ✅
i18n._(PAGE_TITLE.id, { title }, { message: PAGE_TITLE.message })
```

This comes up wherever there is no render moment to hook into: document `<head>` metadata, email templates, server-composed notifications, CLI output.

Where a render moment does exist, prefer `Trans` and skip the whole question:

```tsx
<Trans comment="Article byline">{title} — Kestrel Blog</Trans>
```

## Server-rendered messages: return data, not prose

**The trap.** A server function or route handler composing a user-facing sentence has two ways to be wrong at once. Module-scoped `t` binds the global singleton the SSR setup never activated, so the sentence ships in the source language. And a hand-built plural (`count === 1 ? 'project' : 'projects'`) bakes the source language's plural rules into the data layer, where no translation can reach them.

```ts
// ❌ Both problems in three lines
export const archiveProjects = createServerFn().handler(async ({ data }) => ({
  message: data.ids.length === 1 ? '1 project archived.' : `${data.ids.length} projects archived.`,
}))
```

**The recipe.** Return the facts. Compose the sentence at the render boundary, where a macro is bound to the reader's locale and `Plural` can express every category.

```ts
export const archiveProjects = createServerFn().handler(async ({ data }) => ({
  count: data.ids.length,
}))
```

```tsx
const result = await archiveProjects({ data: { ids } })
toast.success(
  t`${plural(result.count, { one: '# project archived.', other: '# projects archived.' })}`,
)
```

This is the same shape most codebases already use for errors — a stable `code` mapped to a message at the boundary — extended to success messages.

Where a server-side string genuinely must be translated (an outgoing email, a PDF), thread the request's i18n instance in explicitly and resolve with `i18n._(descriptor)`. Never rely on the global singleton to have the right locale.

## Locale-aware `Intl` formatting

**The trap.** Formatting helpers are usually written before i18n arrives, with the locale hardcoded:

```ts
const LOCALE = 'en-US'   // ❌ every date, number and currency ignores the active locale
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(LOCALE, { dateStyle: 'long' })
```

Wrapping strings does not touch this, extraction does not see it, and the build is green — so a fully translated UI still shows US dates and `1,234.56` to a German reader. There is a second cost hiding here: constructing `Intl` objects per call is expensive, and this shape does it on every render.

**The recipe.** Bind formatters to a locale once, and hand components a hook.

```ts
// src/lib/format.ts
export function createFormatters(locale: string) {
  const number = new Intl.NumberFormat(locale)
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long' })
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  return {
    number: (v: number) => number.format(v),
    date: (iso: string) => date.format(new Date(iso)),
    // …
  }
}
export type Formatters = ReturnType<typeof createFormatters>
```

```ts
// src/lib/use-formatters.ts
export function useFormatters(): Formatters {
  const { i18n } = useLingui()
  return useMemo(() => createFormatters(i18n.locale), [i18n.locale])
}
```

Outside React, call `createFormatters(locale)` with the locale already in hand.

Two related cases worth checking while you are in there:

- **Prose assembled inside a formatter** — `` `${minutes} min read` ``, `` `${used} of ${total} seats used` ``
  — is a translatable, count-dependent message wearing a formatter's clothes. Return the number and let a `Plural` at the render site own the sentence.
- **Unit suffixes** — `['B','KB','MB','GB']` — have an `Intl` equivalent:
  `{ style: 'unit', unit: 'megabyte', unitDisplay: 'short' }` localizes the symbol too.

## Descriptors change types

Converting a field from `string` to `MessageDescriptor` makes the compiler point at every consuming site, which is what makes the `msg` pattern safe to apply in bulk. Two things slip past it — React keys, and string methods on what is now an object. Both are covered in the main skill under "Use msg for Lazy Translations".
