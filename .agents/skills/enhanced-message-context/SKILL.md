---
name: enhanced-message-context
description: Add translator comments to Lingui messages so translations are accurate. Use when adding or modifying translatable messages, when strings are short or ambiguous ("Back", "Delete", "Post"), when placeholders are unclear ({count}, {name}), when deciding between comment and context, or when auditing extracted .po catalogs for missing translator context.
---

# Enhanced Message Context

When implementing Lingui i18n, add translator comments to the messages that need them, so translators have the context to choose the right tone, length, and wording. Which messages need them is the whole question, and the tiers below answer it: a short label carries almost no context of its own and a full sentence carries most of it, so they earn very different treatment.

## Know the App Domain First

Before writing comments, identify what the product is about — check `package.json` description, the README, and route/component names. The domain disambiguates terms that are otherwise unresolvable: in a parking app, "Park" is a parking spot, not a nature park; in a social app, "Post" is likely a noun. Reference the domain in comments whenever a term is domain-sensitive.

## When to Add Comments

Prioritize in tiers:

**Must comment** — translations will be wrong without it:

- **Ambiguous short strings**: 1-2 word phrases with multiple meanings or parts of speech
  - "Back" (noun or verb?), "Delete" (button or confirmation?), "Close" (verb or adjective?)
- **Action labels without a visible object**: the code shows what's acted on, the translator can't see it
  - "Remove" (remove what?), "Apply" (apply to what?)
- **Domain-sensitive terms**: words whose meaning depends on the product
  - "Post" (verb or noun?), "Tag" (noun or verb?), "Park" (spot or greenspace?)
- **Grammatical-gender dependence**: the translation depends on what the message refers to
  - "Selected" (masculine/feminine/neutral depends on what is selected)
- **Unclear placeholders**: names that don't reveal what they contain
  - `{count}` (count of what?), `{name}` (user name, file name, project name?)

**Should comment** — quality improves noticeably:

- **UI jargon**: "Toast", "Drawer", "Chip", "Modal" — component names translators may read literally
- **Abbreviations**: "Qty", "Avg", "N/A"
- **Sentence fragments**: text completed by surrounding UI ("per month", "of 24")
- **Labels isolated from surroundings**: table column headers, tooltips, menu items

**Ship uncommented** — the message already carries its own context:

- **Full, self-explanatory sentences.** "We couldn't reach the server. Check your connection and try again." tells a translator everything a location note would. Comment one only where tone or length is genuinely constrained — a 40-character table cell, a legal phrase with a required register.
- **Strings whose comment would only restate the text or its file path.** "Feature card body text on the features page" attached to a three-sentence paragraph is cost without information.

Plural branches don't need separate comments — one comment on the whole message covers all forms.

### Aim for coverage, not saturation

A catalog where nearly every message carries a comment is evidence the tiers were skipped, not evidence of quality. **The must-comment tier at 100% is the target; the whole catalog at 100% is not.**

Two costs make that real, and both fall on people rather than tooling: comments on everything train translators to skim past comments, so the load-bearing ones stop being read; and every comment is a claim about the UI that rots when the UI moves.

When auditing an existing catalog, measure the must-comment tier specifically rather than overall `#.` coverage — short messages with no comment are the finding, and a headline percentage hides them. This lists every uncommented entry with its `#:` reference, which is enough to sort by tier at a glance:

```bash
awk -v RS='' '/msgid "[^"]/ && !/#\./' src/locales/en/messages.po
```

Paragraph mode (`RS=''`) matches against the whole entry, so leave the patterns unanchored — `^msgid` only fires on entries that begin with `msgid`, and most begin with a `#:` reference line.

## `t` tagged templates cannot carry a comment

This is the single most common way a wrapping pass ends up with no context: the tagged-template form has nowhere to put one.

```jsx
// ❌ No comment possible — there is no argument to attach one to
<img alt={t`Company logo`} />

// ✅ Object form takes `comment`
<img alt={t({ comment: "Alt text for the logo in the site header", message: "Company logo" })} />
```

The same applies to `` msg`…` `` versus `msg({ … })`, and to `` plural(count, { … }) `` used bare.

**Decide the comment while wrapping, not afterwards.** For anything in the must-comment tier, reach for the object form the first time. The tagged-template form is the natural thing to type, so leaving it until later turns one decision into a mechanical edit across every attribute, placeholder, and toast in the codebase.

`Trans` has no such limitation: `comment` is just a prop, so JSX content can always be commented in place.

```jsx
<Trans comment="Button in the toolbar that returns to the previous page">Back</Trans>
```

## Leave vendored component libraries alone

Copy inside `components/ui/**` — shadcn/ui, or any generator-vendored Radix wrapper — is not yours to comment or wrap. `shadcn add` overwrites those files wholesale, so a macro or a comment added there disappears on the next update, silently and with a green build.

That governs this skill's audit pass too: when a catalog entry's `#:` reference points into a vendored directory, record it as a known residual and move to the next entry — the file itself stays closed.

If that copy genuinely needs translating, the fix is a project-owned wrapper component that holds the strings and delegates presentation to the primitive — a deliberate design decision for the project, not something a context pass introduces.

## Writing Effective Comments

A good translator comment includes:

1. **Location**: Where in the UI the message appears
   - "Button in the top navigation bar"
   - "Tooltip for the save icon"
   - "Column header in the users table"

2. **Action/Purpose**: What happens or what it means
   - "Navigates back to the previous page"
   - "Deletes the selected item permanently"
   - "Shows the number of unread notifications"

3. **Disambiguation**: Clarify part of speech or meaning
   - "Used as a verb, not a noun"
   - "Refers to email addresses, not postal addresses"
   - "Singular form, user will see 'item' or 'items' based on count"

### Quality Rules

- **Describe where it appears and what it refers to — not what the word means.**
  - Bad: "Save — means to store"
  - Good: "Save button in the document editor toolbar"
- **Keep it under ~80 characters.** A comment is a hint, not documentation.
- **Reference the app domain** when the term is domain-sensitive: "Park — a parking spot, not a nature park"
- **Write comments in the source language** of the project.
- **Use consistent terminology** across all comments (same words for the same UI areas).

### comment vs context

They solve different problems — don't mix them up:

- **`comment`** is advice for the translator. It never changes the message identity.
- **`context`** changes the message ID: the same text with two `context` values becomes two catalog entries translated independently. Use it only when the same source text genuinely needs different translations ("right" as direction vs. correctness).
- **Never use `context` as a namespace** (`auth.login`, `settings.title`). Identical strings with identical meaning should share one catalog entry; namespacing splits them into duplicate translation work.

## API Reference

Lingui provides three ways to add translator comments:

### 1. JS Macro (`t`)

For JavaScript code outside JSX:

```js
import { t } from "@lingui/core/macro";

// With comment
const backLabel = t({
  comment: "Button in the navigation bar that returns to the previous page",
  message: "Back",
});

// With comment and variable
const uploadSuccess = t({
  comment: "Success message showing the name of the file that was uploaded",
  message: `File ${fileName} uploaded successfully`,
});
```

### 2. React Macro (`Trans`)

For JSX elements:

```jsx
import { Trans } from "@lingui/react/macro";

// With comment
<Trans comment="Button that deletes the selected email message">Delete</Trans>

// With comment in a component
<button>
  <Trans comment="Label for button that saves changes to user profile">
    Save
  </Trans>
</button>
```

### 3. Deferred/Lazy Messages (`defineMessage` / `msg`)

For messages defined separately from their usage:

```js
import { defineMessage } from "@lingui/core/macro";

const messages = {
  deleteButton: defineMessage({
    comment: "Button that permanently removes the item from the database",
    message: "Delete",
  }),

  statusLabel: defineMessage({
    comment: "Shows whether the service is currently operational. Values: 'Active', 'Inactive', 'Pending'",
    message: "Status: {status}",
  }),
};
```

## Examples

### Example 1: Ambiguous Short Word

**Before** (no context):

```jsx
<button onClick={goBack}>
  <Trans>Back</Trans>
</button>
```

**After** (with context):

```jsx
<button onClick={goBack}>
  <Trans comment="Button in the toolbar that navigates to the previous page">
    Back
  </Trans>
</button>
```

### Example 2: UI Label Without Context

**Before** (no context):

```jsx
const columns = [
  { key: "name", label: t`Name` },
  { key: "status", label: t`Status` },
];
```

**After** (with context):

```jsx
const columns = [
  { 
    key: "name", 
    label: t({
      comment: "Column header in the projects table showing project name",
      message: "Name"
    })
  },
  { 
    key: "status", 
    label: t({
      comment: "Column header showing project status: Active, Inactive, or Archived",
      message: "Status"
    })
  },
  { 
    key: "created", 
    label: t({
      comment: "Column header showing the date when the project was created",
      message: "Created"
    })
  },
];
```

### Example 3: Domain-Specific Term

**Before** (ambiguous):

```jsx
<button onClick={handlePost}>
  <Trans>Post</Trans>
</button>
```

**After** (clarified as verb):

```jsx
<button onClick={handlePost}>
  <Trans comment="Button that publishes the content. Used as a verb (to post), not a noun (a post)">
    Post
  </Trans>
</button>
```

### Example 4: Variable Without Clear Meaning

**Before** (unclear what count represents):

```js
const message = t`${count} items selected`;
```

**After** (clarified):

```js
const message = t({
  comment: "Shows the number of email messages currently selected in the inbox",
  message: `${count} items selected`,
});
```

### Example 5: Self-Explanatory Message (Lower Priority, Still Valuable)

```jsx
// Message is clear on its own; adding a comment with location still helps translators
<Trans comment="Validation hint shown below the password field on the sign-up form">
  Your password must contain at least 8 characters, including one uppercase letter and one number.
</Trans>
```

## Workflow

When implementing or reviewing Lingui messages:

1. **Know the domain**: Identify what the app is about (see above) so comments can disambiguate domain terms
2. **Read the message**: Look at the string itself
3. **Check context**: Consider where and how it's used in the code
4. **Ask**: "Could a translator misinterpret this without seeing the UI?"
5. **If yes**: reach for the object form (`t({ comment, message })`, `Trans comment=…`) *at the moment you wrap*, and give it location, purpose, and any disambiguation
6. **If no**: leave it uncommented and move on. A self-explanatory sentence does not need a location note, and adding one costs more than it returns

## Post-Extraction Review Pass

After a batch of i18n work, audit the catalog instead of trusting that comments were added along the way:

1. Run `lingui extract`
2. Scan the source-locale `.po` file for entries with **no `#.` line** (that's where `comment` lands)
3. **Triage by tier — do not treat every uncommented entry as a defect.** Short or ambiguous strings, unclear placeholders and domain terms go back to the source and get a comment. Full self-explanatory sentences are a correct outcome, not a gap
4. **Skip entries whose `#:` reference points into a vendored directory** (`components/ui/**`) and record them as known residuals
5. Re-run `lingui extract` and confirm the `#.` lines appear

Report the result as the must-comment tier's coverage plus what you deliberately left alone — "every short label commented, 120 self-explanatory sentences left as-is, 25 vendored residuals" — rather than a single catalog-wide percentage, which cannot distinguish those three.

```po
#. Button in the toolbar that navigates to the previous page
#: src/components/Toolbar.tsx:24
msgid "Back"
msgstr ""
```

## Notes

- Comments are extracted into message catalogs for translators
- Comments are stripped from production builds — zero *runtime* cost, which is not the same as zero cost: the cost is a translator's attention and a maintainer's upkeep, and that is what the tiers ration
- Comments appear in translation management systems (TMS)
- Use consistent terminology across all comments in your project
