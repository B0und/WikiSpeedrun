# Common Mistakes and Pitfalls

This document covers common mistakes when using Lingui and how to avoid them.

## Module-Level Macro Usage

### The Problem

Using macros like `t` at module level won't react to locale changes:

```jsx
// ❌ WRONG - This won't update when locale changes
import { t } from "@lingui/core/macro";

const COLORS = [
  t`Red`,
  t`Green`,
  t`Blue`
];

function ColorList() {
  return COLORS.map(color => <div>{color}</div>);
}
```

**Why it fails**: The `t` macro requires access to the active i18n context. At module level, the context isn't available and messages are evaluated only once.

### The Solution

Use the `msg` macro for lazy translations:

```jsx
// ✅ CORRECT - Use msg for module-level messages
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";

const COLORS = [
  msg`Red`,
  msg`Green`,
  msg`Blue`
];

function ColorList() {
  const { _ } = useLingui();
  return COLORS.map(color => <div>{_(color)}</div>);
}
```

**Key points**:
- `msg` creates a message descriptor, not the final string
- Use `_()` or `i18n._()` to translate the descriptor at render time
- Messages will update when locale changes

### Alternative Pattern

If you need the messages in a React component:

```jsx
// ✅ Also correct - define in component
import { useLingui } from "@lingui/react/macro";

function ColorList() {
  const { t } = useLingui();
  
  const colors = [t`Red`, t`Green`, t`Blue`];
  
  return colors.map(color => <div>{color}</div>);
}
```

### Bundle-Size Caveat for Module-Level msg

Module-scope `msg` calls are side effects a bundler cannot drop. In a lazy-loaded route, wrap the definition in a `/* @__PURE__ */` IIFE so tree-shaking can remove it when unused:

```js
const STATUSES = /* @__PURE__ */ (() => ({
  active: msg`Active`,
  inactive: msg`Inactive`,
}))();
```

## Plural Form Misunderstandings

### Zero Form Doesn't Exist in English

A common mistake is expecting English to have a `zero` plural form:

```jsx
// ❌ WRONG - English doesn't have 'zero' form
<Plural
  value={count}
  zero="No messages"
  one="1 message"
  other="# messages"
/>
```

**Result**: When `count = 0`, this displays `"0 messages"`, not `"No messages"`.

**Why**: English plural rules only have two forms:
- `one`: Used when value is exactly 1
- `other`: Used for everything else (0, 2, 3, ...)

### The Solution: Use Exact Matches

Use the `_N` syntax for exact number matches:

```jsx
// ✅ CORRECT - Use _0 for exact match
<Plural
  value={count}
  _0="No messages"
  one="# message"
  other="# messages"
/>
```

**How it works**:
- `_0` matches exactly 0 (takes precedence over plural forms)
- `one` matches exactly 1 (plural form)
- `other` matches everything else (plural form)

### Exact Matches vs Plural Forms

You can use exact matches for any number:

```jsx
<Plural
  value={count}
  _0="No items"
  _1="One item"
  _2="A couple of items"
  _10="Ten items!"
  other="# items"
/>
```

**Rule**: Exact matches (`_N`) always take precedence over plural forms (`one`, `few`, `many`, `other`).

### Decimal Numbers

Be aware that decimal numbers (even `1.0`) use the `other` form:

```jsx
<Plural value={1.0} one="# item" other="# items" />
// Shows: "1.0 items" (not "1.0 item")
```

### Ternary Instead of Plural

Never use a ternary to pick between two separate translation strings:

```jsx
// ❌ WRONG - bakes English's two plural forms into code logic;
// languages with 3-6 plural forms (Polish, Arabic, ...) can't translate this correctly
const label = count === 1 ? t`1 item` : t`${count} items`;

// ✅ CORRECT - one message, CLDR picks the form per language
import { plural } from "@lingui/core/macro";
const label = plural(count, { one: "# item", other: "# items" });
```

## Memoization Pitfalls

### The i18n Reference Problem

A common mistake when using React hooks:

```jsx
// ❌ WRONG - i18n reference is stable
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { useMemo } from "react";

const welcomeMessage = msg`Welcome!`;

function MyComponent() {
  const { i18n } = useLingui();
  
  const welcome = useMemo(
    () => i18n._(welcomeMessage),
    [i18n] // i18n reference doesn't change!
  );
  
  return <div>{welcome}</div>;
}
```

**Problem**: The `i18n` object reference is stable across re-renders. When locale changes, the component won't re-translate because the dependency (`i18n`) hasn't changed.

### Solution 1: Use the Macro Version

The easiest solution is to use the macro version of `useLingui`:

```jsx
// ✅ CORRECT - Macro version provides 't' that changes
import { useLingui } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { useMemo } from "react";

const welcomeMessage = msg`Welcome!`;

function MyComponent() {
  const { t } = useLingui();
  
  const welcome = useMemo(
    () => t(welcomeMessage),
    [t] // t reference changes with locale
  );
  
  return <div>{welcome}</div>;
}
```

### Solution 2: Use the Underscore Function

The runtime `useLingui` provides a `_` function that changes with locale:

```jsx
// ✅ Also correct - underscore function changes
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { useMemo } from "react";

// Define message descriptor outside component
const welcomeMessage = msg`Welcome!`;

function MyComponent() {
  const { _ } = useLingui();
  
  const welcome = useMemo(
    () => _(welcomeMessage),
    [_] // _ reference changes with locale
  );
  
  return <div>{welcome}</div>;
}
```

### When Memoization Matters

You typically need to consider this when:
- Using `useMemo` or `useCallback` with translations
- Creating refs or derived state from translated messages
- Passing translations to third-party components

## Complex Expressions in Messages

### The Problem

Using complex expressions directly in messages loses context:

```jsx
// ❌ BAD - Expression becomes a placeholder
<Trans>Hello {user.name.toUpperCase()}</Trans>
// Extracted as: "Hello {0}"

<Trans>Total: {items.reduce((sum, item) => sum + item.price, 0)}</Trans>
// Extracted as: "Total: {0}"
```

**Problem**: Translators see `{0}` instead of meaningful variable names, losing important context.

### The Solution

Extract the value to a named variable first:

```jsx
// ✅ GOOD - Variable has meaningful name
const userName = user.name.toUpperCase();
<Trans>Hello {userName}</Trans>
// Extracted as: "Hello {userName}"

const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
<Trans>Total: {totalPrice}</Trans>
// Extracted as: "Total: {totalPrice}"
```

### Method Calls and Properties

Even simple method calls should be extracted:

```jsx
// ❌ BAD
<Trans>Welcome {currentUser.getName()}</Trans>

// ✅ GOOD
const userName = currentUser.getName();
<Trans>Welcome {userName}</Trans>
```

### Alternative: Name the Placeholder with ph()

When a local variable is awkward (e.g., inside a tight expression), name the placeholder inline:

```jsx
import { ph } from "@lingui/core/macro";

<Trans>Welcome {ph({ userName: currentUser.getName() })}</Trans>
// Extracted as: "Welcome {userName}"
```

### ESLint Rule

Enable the Lingui ESLint plugin to catch these automatically:

```js
// eslint.config.js (flat config)
import pluginLingui from "eslint-plugin-lingui";

export default [
  pluginLingui.configs["flat/recommended"],
];

// Or configure individual rules:
// "lingui/no-expression-in-message": "error"
```

## Missing I18nProvider

### The Problem

Components using Lingui hooks or components without `I18nProvider`:

```jsx
// ❌ WRONG - No I18nProvider
import { Trans } from "@lingui/react/macro";

function App() {
  return (
    <div>
      <Trans>Hello</Trans>
    </div>
  );
}
```

**Error**: You'll get a runtime error: "Cannot read property 'locale' of undefined" or similar.

### The Solution

Always wrap your app with `I18nProvider`:

```jsx
// ✅ CORRECT
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

i18n.load("en", messages);
i18n.activate("en");

function App() {
  return (
    <I18nProvider i18n={i18n}>
      <div>
        <Trans>Hello</Trans>
      </div>
    </I18nProvider>
  );
}
```

### Where to Place It

Place `I18nProvider` as high as possible in your component tree:

```jsx
// App entry point
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
```

## Incorrect Import Paths (v5+)

### The Problem

Using old import paths from Lingui v4:

```jsx
// ❌ WRONG in v5
import { t, Trans } from "@lingui/macro";
```

### The Solution

Use split imports in v5:

```jsx
// ✅ CORRECT in v5
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
```

**Macro imports**:
- `@lingui/core/macro` - Core macros (t, msg, plural, select, etc.)
- `@lingui/react/macro` - React macros (Trans, Plural, Select, useLingui)

**Runtime imports**:
- `@lingui/core` - Core runtime (i18n object, setupI18n)
- `@lingui/react` - React runtime (I18nProvider, Trans component, useLingui)

## React Native: Missing Text Component

### The Problem

In React Native, translations render as strings by default, causing errors:

```jsx
// ❌ WRONG in React Native
<View>
  <Trans>Hello</Trans>
</View>
// Error: Text strings must be rendered within a <Text> component
```

### The Solution

Configure `defaultComponent` in `I18nProvider`:

```jsx
import { Text } from "react-native";

<I18nProvider i18n={i18n} defaultComponent={Text}>
  <App />
</I18nProvider>
```

Or use the `component` prop on individual components:

```jsx
import { Text } from "react-native";

<Trans component={Text}>Hello</Trans>
```

## Summary

**Top mistakes to avoid**:

1. ❌ Using `t` macro at module level → Use `msg` instead
2. ❌ Expecting English `zero` form → Use `_0` for exact matches
3. ❌ Memoizing with `i18n` reference → Use `t` from macro `useLingui`
4. ❌ Complex expressions in messages → Extract to named variables
5. ❌ Missing `I18nProvider` → Wrap your app
6. ❌ Loading uncompiled catalogs → Run `lingui compile`
7. ❌ Wrong imports in v5 → Use `@lingui/core/macro` and `@lingui/react/macro`
8. ❌ Forgetting extraction → Run `lingui extract` regularly

Following these practices will help you avoid the most common Lingui pitfalls.
