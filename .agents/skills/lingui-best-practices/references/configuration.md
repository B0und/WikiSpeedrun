# Configuration Patterns

Essential patterns for `lingui.config.js` (or `.ts`).

## Basic Configuration

The minimal configuration:

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

**Key fields**:
- `sourceLocale` - Your source code's language (usually "en")
- `locales` - Array of BCP-47 locale codes
- `catalogs` - Where to find/store message catalogs

## Common Catalog Patterns

### Pattern 1: Single Directory (Recommended for most projects)

```js
catalogs: [
  {
    path: "src/locales/{locale}/messages",
    include: ["src"],
  },
]
```

**Structure**:
```
src/locales/
├── en/messages.po
├── es/messages.po
└── fr/messages.po
```

### Pattern 2: Separate Catalogs per Feature

For large projects where you want to split translations:

```js
catalogs: [
  {
    path: "src/{name}/locales/{locale}",
    include: ["src/{name}/"],
  },
]
```

**Structure**:
```
src/
├── auth/locales/en.po
├── dashboard/locales/en.po
└── settings/locales/en.po
```

Use `catalogsMergePath` to compile into single files:

```js
catalogsMergePath: "src/locales/{locale}"
```

## Essential Configuration Options

### Fallback Locales

Handle missing translations by falling back to other locales:

```js
fallbackLocales: {
  "en-US": "en",      // en-US → en
  "es-MX": "es",      // es-MX → es
  default: "en"       // Everything else → en
}
```

### Compilation Format

Control the output format of compiled catalogs:

```js
compileNamespace: "es"  // ES6 modules (default: "cjs")
```

**Common options**:
- `cjs` - CommonJS: `module.exports = {messages: {...}}`
- `es` - ES6: `export const messages = {...}`
- `ts` - TypeScript with type definitions

### TypeScript Support

For TypeScript projects:

```js
compileNamespace: "ts"
```

Then compile with:
```bash
lingui compile --typescript
```

### Parser Options

If using TypeScript experimental decorators or Flow:

```js
extractorParserOptions: {
  tsExperimentalDecorators: true,
}
```

## Message Ordering

Control catalog message order:

```js
orderBy: "messageId"  // Options: "message", "messageId", "origin"
```

## Common Issues & Solutions

### Issue: Messages Not Extracted

**Problem**: CLI doesn't find your messages.

**Solution**: Check your `include` patterns are correct:

```js
catalogs: [
  {
    path: "src/locales/{locale}/messages",
    include: ["src/**/*.{js,jsx,ts,tsx}"],  // Be specific
    exclude: ["**/*.test.*", "**/*.spec.*"],
  },
]
```

### Issue: Can't Import Compiled Catalogs

**Problem**: Import path doesn't match compiled location.

**Solution**: Ensure `path` matches your import:

```js
// Config
path: "src/locales/{locale}/messages"

// Import must match
import { messages } from "./locales/en/messages";
```

## Catalog Format (Lingui 6+)

PO is the default format — omit `format` entirely unless you need to configure it. The string form `format: "po"` and `formatOptions` were removed in Lingui 6; pass a formatter instance instead:

```js
import { formatter } from "@lingui/format-po";

export default defineConfig({
  // ...
  format: formatter({ lineNumbers: false }),
});
```

## Best Practices

1. **Use `<rootDir>` token** for portable paths
2. **Always exclude test files** in `exclude` patterns
3. **Set `sourceLocale`** to your development language
4. **Gitignore compiled catalogs by extension, never by directory** — `src/locales/**/messages.js` (and `.ts`), not `src/locales/` (a directory rule silently untracks the `.po` sources too). Verify with `git check-ignore`: the compiled file matches, the `.po` sibling doesn't.
