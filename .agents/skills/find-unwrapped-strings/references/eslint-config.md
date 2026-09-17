# Tuned `no-unlocalized-strings` Configs

The option names, preset contents, and measured hit counts below were checked against the plugin release current at the time of writing (`0.14.0`), which peers with `eslint@^8.37.0 || ^9 || ^10` and `typescript@^5.0.0 || ^6.0.0`. If something here doesn't match the version installed, the rule's own schema is the authority — and it is self-reporting: a misspelled option is a config error, so ESLint says so.

## The rule is not in `recommended`

`eslint-plugin-lingui` ships `recommended` and `flat/recommended` presets, and **neither enables `no-unlocalized-strings`.** Those presets turn on five different rules (`t-call-in-function`, `no-single-tag-to-translate`, `no-single-variables-to-translate`, `no-trans-inside-trans`, `no-expression-in-message`) — all of which check messages you already wrapped.

So extending the preset does nothing for this audit. The rule has to be switched on explicitly. Extending the preset alongside it is still worth doing; just don't mistake it for coverage.

## Flat config (ESLint 9+)

```js
// eslint.config.js
import pluginLingui from "eslint-plugin-lingui";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { lingui: pluginLingui },
    rules: {
      "lingui/no-unlocalized-strings": ["warn", {
        ignore: ["^[A-Z0-9_-]+$"],
        ignoreNames: ["className", "styleName", "src", "data-testid"],
        ignoreFunctions: ["console.*", "cn", "cva", "clsx"],
      }],
    },
  },
];
```

`warn`, not `error`, for two reasons: an audit that breaks the build on hit #1 gets disabled instead of finished, and warnings leave the exit code at 0 so the scan can be read as data. When the team later wants the guardrail to gate CI, `eslint --max-warnings 0` does it without touching severity.

A plain JS project can drop `languageOptions` entirely. Keep the `files` glob narrow — pointing the rule at build output or `node_modules` produces noise nobody will read.

### What each option does

Verified against the rule's own schema, which sets `additionalProperties: false` — a misspelled option is a config error, not a silent no-op.

| Option | Shape | Purpose |
|---|---|---|
| `ignore` | `string[]` of regex sources | Skip strings whose **text** matches |
| `ignoreNames` | `(string \| { regex: { pattern, flags } })[]` | Skip by JSX attribute / property **name** |
| `ignoreFunctions` | `string[]`, micromatch patterns | Skip string arguments to matching **callees** |
| `ignoreMethodsOnTypes` | `string[]` of `Type.method` | Skip methods on a TS type (needs `useTsTypes`) |
| `useTsTypes` | `boolean` | Consult TS type information |

Two behaviors worth knowing, both from the rule's source:

- **`ignore` entries are compiled with `new RegExp(item)`, unanchored.** `ignore: ["ACTIVE"]` silences every string *containing* `ACTIVE`. Anchor with `^…$` unless you mean substring.
- **Lingui's own callees are already allowlisted** — `t`, `msg`, `plural`, `select`, `selectOrdinal`, and `i18n._` never report. Don't spend `ignoreFunctions` entries on them.

The rule also skips any string with no letters at all (its built-in `/^[^\p{L}]+$/u`), so numbers, punctuation, and `"/"` cost you nothing.

## Legacy `.eslintrc` (pre-flat)

```json
{
  "plugins": ["lingui"],
  "extends": ["plugin:lingui/recommended"],
  "rules": {
    "lingui/no-unlocalized-strings": ["warn", {
      "ignore": ["^[A-Z0-9_-]+$"],
      "ignoreNames": ["className", "styleName", "src", "data-testid"],
      "ignoreFunctions": ["console.*", "cn", "cva", "clsx"]
    }]
  }
}
```

Same caveat as flat config: `extends` does not bring the rule with it. Use this form only for projects not yet on flat config — ESLint 10 drops `.eslintrc` support.

## TypeScript variant

`useTsTypes: true` lets the rule consult type information, which unlocks `ignoreMethodsOnTypes`:

```js
"lingui/no-unlocalized-strings": ["warn", {
  useTsTypes: true,
  ignoreMethodsOnTypes: ["Map.get", "Map.set", "Set.has", "URLSearchParams.get"],
  ignore: ["^[A-Z0-9_-]+$"],
  ignoreNames: ["className", "styleName", "src", "data-testid"],
  ignoreFunctions: ["console.*", "cn", "cva", "clsx"],
}]
```

Without type information the rule can't tell `cache.get("user profile")` (a lookup key) from `labels.get("user profile")`; with it, `Map.get` is skippable by type instead of by name.

This is not free. `useTsTypes` calls ESLint's parser services, so the config must enable typed linting (`parserOptions.projectService: true`, or `project` pointing at your tsconfig), and the run gets several times slower on a large repo. Worth it when key-lookup false positives dominate your hit list; skip it otherwise — most audits finish without it.

## Growing the ignores

Each ignore is earned by evidence, one confirmed false positive at a time:

- A property or attribute name that is structurally never UI copy (`data-analytics-id`, `testId`) → add to `ignoreNames`. For a family of names, use the regex form: `{ regex: { pattern: "^data-", flags: "i" } }`.
- A helper whose string arguments are never messages (`logger.debug`, a query-key builder, `clsx`) → add to `ignoreFunctions`. Micromatch means `console.*` and `*.headers.set` both work.
- A string shape confirmed across several hits — enum members, SKU patterns → add an anchored `ignore` regex.

Three properties keep the guardrail worth having as it grows. Severity stays where it is, and the rule stays enabled — a run made clean by deleting the rule is unmonitored, not clean. Silencing happens in the config, where a rule is inherited by the next contributor, rather than in `eslint-disable` comments that speak for one line each. And every regex is added *after* reading the hits it covers, because a pattern written ahead of the evidence is a string you will never be told about again.

### Why that last one matters

On a partially-internationalized React app — component layer wrapped, a 4-entry product data module and a toast helper not — the starting config above reported **32 hits: 16 real messages and 16 decoys** (`sku`/`slug`/image-path values, a `CustomEvent` name, `getElementById("root")`, a locale fallback).

Adding the plugin docs' tighter first pattern, so `ignore` reads:

```js
ignore: ["^(?![A-Z])\\S+$", "^[A-Z0-9_-]+$"],
```

dropped it to **exactly the 16 real messages, zero decoys**. `^(?![A-Z])\S+$` skips any whitespace-free string not starting with a capital — which is what identifiers, slugs, paths, and event names look like, and what display copy does not.

Note the tradeoff before copying it: it also silences genuine one-word lowercase UI text. A lone `"submit"` or `"cancel"` in your codebase will never be reported again. That is why this belongs in the *grown* config, added once you've read the single-token hits and confirmed they're all identifiers — not in the starting config.

## Reducing a scan to a worklist

Given the `--format json` output from the skill's Step 2, reduce it to `file:line` plus the offending source line. The recipe reads each result's `.source`, which is why the run needs `--format json` rather than a human-readable formatter:

```bash
jq -r '.[]
  | (.source // "" | split("\n")) as $lines
  | .filePath as $f
  | .messages[]
  | select(.ruleId == "lingui/no-unlocalized-strings")
  | "\($f):\(.line)  \($lines[.line-1] // "" | gsub("^\\s+|\\s+$"; ""))"' /tmp/lingui-scan.json
```

Output looks like this, which is the judge step's input:

```
src/data/products.ts:20  name: "AeroPress Go",
src/data/products.ts:21  tagline: "Espresso-style coffee, anywhere",
src/lib/notify.ts:2      added: "Added to your cart",
```

Filtering on `ruleId` matters — other Lingui rules and the rest of your ESLint config report into the same JSON.

### Keep the options in the config, not on the CLI

Configure the rule in `eslint.config.js` and run the CLI with no rule flags. Passing it on the command line is how tuned ignores get silently discarded — but the exact behavior depends on the form, and the difference is easy to trip over:

```bash
# ⚠️ severity only — options are PRESERVED (ESLint merges severity onto the configured entry)
npx eslint 'src/**/*.{ts,tsx}' --rule '{"lingui/no-unlocalized-strings":"warn"}'

# ❌ options included — the configured entry is REPLACED, every tuned ignore is gone
npx eslint 'src/**/*.{ts,tsx}' --rule '{"lingui/no-unlocalized-strings":["warn",{}]}'
```

Measured on the same project and the same tuned config (ESLint 9.39): the configured run and the severity-only run both reported **16** hits; the options-bearing run reported **37**. An options array on the CLI replaces the configured one outright — no merge, no warning, just a hit list two-plus times longer with every class name, enum, and `console.log` argument back in it.

The failure mode this creates is worse than the noise: an audit run that way looks *more* thorough, so its extra hits get treated as real findings and "fixed" by wrapping identifiers. If you inherit a scan command with `--rule` in it, re-run it from config before judging anything.

### What the scan structurally cannot see

The rule is an AST check on the files it is pointed at, not a full-repo copy audit. Strings living outside the glob's file types — `.mdx` content, JSON copy decks, template files — are invisible to it no matter how the options are tuned, so a clean scan is a statement about the globbed source only. Audit those surfaces by hand if the project keeps copy in them.
