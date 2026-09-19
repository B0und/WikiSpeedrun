# Migration Patterns Reference

Exhaustive side-by-side patterns for i18next → Lingui.

## Initialization Patterns

### Basic init

```js
// i18next
import i18next from "i18next";
i18next.init({ lng: "en", resources: { en: { translation: { key: "Hello" } } } });

// Lingui
import { i18n } from "@lingui/core";
import { messages } from "./locales/en/messages";
i18n.load("en", messages);
i18n.activate("en");
```

### Multiple locales loaded upfront

```js
// i18next
i18next.init({
  lng: "en",
  resources: {
    en: { translation: enMessages },
    de: { translation: deMessages },
  },
});

// Lingui
import { messages as enMessages } from "./locales/en/messages";
import { messages as deMessages } from "./locales/de/messages";

i18n.load({ en: enMessages, de: deMessages });
i18n.activate("en");
```

### Dynamic (lazy) loading

```js
// i18next - using i18next-http-backend
i18next.use(HttpBackend).init({ backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" } });

// Lingui
async function activate(locale) {
  const { messages } = await import(`./locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
```

## Translation Function Patterns

### Simple key lookup

```js
// i18next
t("hello"); // looks up key "hello" in JSON

// Lingui - message IS the default value (no separate JSON key lookup)
t`Hello`; // or with explicit ID: t({ id: "hello", message: "Hello" })
```

### With interpolated variables

```js
// i18next
t("greeting", { name: "Alice" }); // JSON: { "greeting": "Hello {{name}}" }

// Lingui - variables are inline
const name = "Alice";
t`Hello ${name}`;
```

### Nested key lookup

```js
// i18next
t("nav.home.label"); // JSON: { "nav": { "home": { "label": "Home" } } }

// Lingui - use explicit ID to preserve the dotted key
t({ id: "nav.home.label", message: "Home" });
```

### Default value fallback

```js
// i18next
t("missing_key", { defaultValue: "Fallback text" });

// Lingui - the message IS the default value; no key lookup
t`Fallback text`;
```

### With count (simple case, not plural)

```js
// i18next
t("items", { count: 5 }); // resolves to key_one or key_other

// Lingui - use plural macro
import { plural } from "@lingui/core/macro";
plural(count, { one: "# item", other: "# items" });
```

## React Hook Patterns

### `useTranslation`

```jsx
// i18next
import { useTranslation } from "react-i18next";

function Component() {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <p>{t("greeting")}</p>
      <button onClick={() => i18n.changeLanguage("de")}>DE</button>
    </div>
  );
}

// Lingui
import { useLingui } from "@lingui/react/macro";
import { i18n } from "@lingui/core";

function Component() {
  const { t } = useLingui();
  return (
    <div>
      <p>{t`Hello`}</p>
      <button onClick={() => activate("de")}>DE</button>
    </div>
  );
}
```

### `useTranslation` with namespace

```jsx
// i18next
const { t } = useTranslation("auth");
t("login.button"); // looks in "auth" namespace

// Lingui - no namespace concept; use explicit ID or organise by catalog
const { t } = useLingui();
t({ id: "auth.login.button", message: "Log in" });
```

### Accessing locale

```jsx
// i18next
const { i18n } = useTranslation();
console.log(i18n.language);

// Lingui
import { useLingui } from "@lingui/react";
const { i18n } = useLingui();
console.log(i18n.locale);
```

## `Trans` Component Patterns

### Static text

```jsx
// i18next
<Trans i18nKey="welcome">Hello World!</Trans>

// Lingui
<Trans>Hello World!</Trans>
// or with explicit ID
<Trans id="welcome">Hello World!</Trans>
```

### With variables

```jsx
// i18next
<Trans i18nKey="greeting" values={{ name }}>Hello {{ name }}!</Trans>

// Lingui
<Trans>Hello {name}!</Trans>
```

### With HTML / components

```jsx
// i18next
<Trans i18nKey="readDocs">
  Read the <a href="/docs">docs</a>.
</Trans>

// Lingui (identical syntax, different import)
import { Trans } from "@lingui/react/macro";
<Trans>
  Read the <a href="/docs">docs</a>.
</Trans>
```

### Plural inside Trans (i18next approach vs Lingui)

```jsx
// i18next - separate keys
// JSON: { "msg_one": "{{count}} message", "msg_other": "{{count}} messages" }
<Trans i18nKey="msg" count={count}>{{count}} messages</Trans>

// Lingui - inline ICU MessageFormat
import { Plural } from "@lingui/react/macro";
<Plural value={count} one="# message" other="# messages" />
```

## Plural Patterns (Comprehensive)

### Basic plural

```jsx
// i18next JSON
{ "key_one": "item", "key_other": "items" }
// usage
t("key", { count });

// Lingui JS
plural(count, { one: "item", other: "items" });

// Lingui JSX
<Plural value={count} one="item" other="items" />
```

### Plural with count in string

```jsx
// i18next JSON
{ "key_one": "{{count}} item", "key_other": "{{count}} items" }

// Lingui: # is replaced with the value
<Plural value={count} one="# item" other="# items" />
```

### Plural with zero

```jsx
// i18next JSON
{ "key_zero": "no items", "key_one": "{{count}} item", "key_other": "{{count}} items" }

// Lingui: use exact match _0
<Plural value={count} _0="no items" one="# item" other="# items" />
```

### Plural with variables

```jsx
// i18next
t("welcome", { count, name }); // JSON: "{{name}} has {{count}} message_one/other"

// Lingui
<Plural
  value={count}
  one={`${name} has # message`}
  other={`${name} has # messages`}
/>
```

### Plural with custom ID

```jsx
// Lingui - add ID via parent msg/t macro
import { msg, plural } from "@lingui/core/macro";

msg({
  id: "inbox.count",
  message: plural(count, { one: "# message", other: "# messages" }),
});
```

## Context Patterns

```js
// i18next
t("right", { context: "direction" });
t("right", { context: "correctness" });

// Lingui
import { msg } from "@lingui/core/macro";

msg({ message: "right", context: "direction" });
msg({ message: "right", context: "correctness" });

// JSX
<Trans context="direction">right</Trans>
<Trans context="correctness">right</Trans>
```

## Select / Gender Patterns

```js
// i18next - separate context keys
// JSON: { "pronoun_male": "He", "pronoun_female": "She", "pronoun_other": "They" }
t("pronoun", { context: gender });

// Lingui - ICU select
import { select } from "@lingui/core/macro";

select(gender, {
  male: "He",
  female: "She",
  other: "They",
});
```

## Lazy / Deferred Translation Patterns

```js
// i18next - strings defined as constants
const STATUS = { active: "status.active", inactive: "status.inactive" };
// later: t(STATUS.active)

// Lingui - msg creates a descriptor, translated at render time
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";

const STATUS = {
  active: msg`Active`,
  inactive: msg`Inactive`,
};

function StatusBadge({ status }) {
  const { _ } = useLingui();
  return <span>{_(STATUS[status])}</span>;
}
```

## Number & Date Formatting

```js
// i18next
t("intlNumber", { val: 1000 });

// Lingui - use Intl directly with i18n.locale
import { useLingui } from "@lingui/react/macro";

function Price({ amount }) {
  const { i18n } = useLingui();
  return <span>{new Intl.NumberFormat(i18n.locale, { style: "currency", currency: "USD" }).format(amount)}</span>;
}

function LoginDate({ date }) {
  const { i18n } = useLingui();
  return <span>{new Intl.DateTimeFormat(i18n.locale).format(date)}</span>;
}
```

## HOC / Class Component Patterns

```jsx
// i18next - withTranslation HOC
import { withTranslation } from "react-i18next";

class MyComponent extends React.Component {
  render() {
    const { t } = this.props;
    return <h1>{t("title")}</h1>;
  }
}
export default withTranslation()(MyComponent);

// Lingui - use i18n singleton directly (no HOC needed)
import { i18n } from "@lingui/core";

class MyComponent extends React.Component {
  render() {
    return <h1>{i18n.t("Title")}</h1>;
  }
}
```

## Error / Missing Translation Handling

```js
// i18next
i18next.init({ saveMissing: true, missingKeyHandler: (lng, ns, key) => { ... } });

// Lingui
import { setupI18n } from "@lingui/core";

const i18n = setupI18n({
  missing: (locale, id) => {
    console.warn(`Missing translation [${locale}]: ${id}`);
    return id;
  },
});
```

## Testing

```jsx
// i18next
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";

render(<I18nextProvider i18n={i18n}><MyComponent /></I18nextProvider>);

// Lingui
import { render } from "@testing-library/react";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { messages } from "./locales/en/messages";

i18n.load("en", messages);
i18n.activate("en");

render(<I18nProvider i18n={i18n}><MyComponent /></I18nProvider>);
```
