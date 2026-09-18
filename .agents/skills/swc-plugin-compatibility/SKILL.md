---
name: swc-plugin-compatibility
description: Diagnose and fix Lingui SWC plugin compatibility errors with Next.js, Vite, Rspack, or other SWC runtimes. Use when seeing errors like "failed to invoke plugin", "failed to run Wasm plugin transform", "Failed to deserialize program received from host", "Failed to execute SWC plugin", "out of bounds memory access", or "LayoutError" during builds with @lingui/swc-plugin — or when macros are silently not transformed (build succeeds but Trans/t render as raw untranslated output).
---

# SWC Plugin Compatibility

If you see errors like these during your build:

```
failed to invoke plugin on 'Some("/app/src/file.ts")'
failed to run Wasm plugin transform. Please ensure the version of `swc_core` used by the plugin is compatible with the host runtime.
    swc_plugin_runner: <n>
: Failed to deserialize program received from host
Failed to execute SWC plugin                      (Next.js / Turbopack wording of the same failure)
RuntimeError: out of bounds memory access         (older hosts)
LayoutError called Result::unwrap()               (older hosts)
```

**This is NOT a bug in your code or in Lingui.** The installed `@lingui/swc-plugin` was built against an `swc_core` version your SWC host cannot run.

## Why This Happens

Every `@lingui/swc-plugin` release is compiled against one pinned `swc_core` version — the plugin's [compatibility table](https://github.com/lingui/swc-plugin/blob/main/packages/lingui-macro/README.md#compatibility) lists them. The **host** (Next.js's bundled SWC, or the `@swc/core` that `@vitejs/plugin-react-swc` / Rspack resolves) accepts plugins from a range of `swc_core` versions. Outside that range the Wasm plugin cannot deserialize the AST it is handed, and the build fails on every file that uses a macro.

SWC has stabilised the plugin ABI over time, so mismatches are rarer than they were, but hosts still move past plugins and plugins past hosts (see lingui/swc-plugin [#250](https://github.com/lingui/swc-plugin/issues/250) and [#253](https://github.com/lingui/swc-plugin/issues/253) for one of each). The pairing is something to check, never assume.

## How to Fix

### Step 1: Identify the host and its resolved version

| Signal in the project | Host | Read the version from |
|---|---|---|
| `next` in dependencies, no `.babelrc` | Next.js's bundled SWC | `npm ls next` |
| `@vitejs/plugin-react-swc` | `@swc/core` | `npm ls @swc/core` — the **lockfile resolution**, not the caret range the plugin declares |
| Rspack / `@swc/core` directly | `@swc/core` | `npm ls @swc/core` |

Next.js embeds SWC and ignores any `@swc/core` in `package.json`; only the Next.js version decides its `swc_core`. On Vite, two projects with identical `package.json` can resolve different `@swc/core` versions — the lockfile is the source of truth.

### Step 2: Choose the plugin version

1. Read the host's accepted `swc_core` range. The error message usually prints a `https://plugins.swc.rs/versions/from-plugin-runner/<n>` URL — open it in a browser; for Next.js, select runtime `next` and the resolved version on https://plugins.swc.rs. The site is client-rendered, so a plain fetch returns an empty page; the fallback is the host's own pin: for Next.js, `swc_core` in the root `Cargo.toml` of the `vercel/next.js` tag (`v<version>`), for `@swc/core`, its GitHub release notes.
2. In the plugin's compatibility table, take the **newest** `@lingui/swc-plugin` whose `swc_core` falls inside that range.
3. Check its peer: `npm view @lingui/swc-plugin@<version> peerDependencies`. Each plugin major requires the matching `@lingui/core` major as a **required** peer (a newer plugin major may also admit the previous core major). A candidate whose peer excludes the installed `@lingui/core` is not a candidate — the install fails with `ERESOLVE` instead of the build failing. Pick the next-newest that passes, or go to "What If No Compatible Version Exists?".

The compatibility site has lagged behind releases before. When the table and the site disagree, or the host is newer than either lists, decide by building: try the newest plugin, then step back one `swc_core` row at a time until a macro-using file compiles.

Hosts drift independently, so two hosts in one repo (a Next.js app and a Vite app) can legitimately need two different plugin versions.

### Step 3: Pin exactly and confirm

```json
{
  "devDependencies": {
    "@lingui/swc-plugin": "<exact version>"
  }
}
```

Use an **exact version** (no `^` or `~`) so a routine dependency bump cannot move it. Done when the build passes on a file that uses a macro **and** the rendered output shows translated text rather than raw macro source.

## Keeping It Working

1. **Pin the plugin exactly** and exclude it from Renovate/Dependabot auto-merge; bump it deliberately, after checking the compatibility table.
2. **Treat host upgrades as plugin upgrades.** Hosts change `swc_core` in minor and patch releases, so a Next.js or `@vitejs/plugin-react-swc` bump needs the same check — put both packages in one update group.
3. **Build after any upgrade that touches SWC or the plugin.** The build, not the changelog, is the confirmation.

`@lingui/swc-plugin` does not track the other `@lingui/*` versions; it releases on its own cadence, so its version number carries no information about which `@lingui/core` it pairs with beyond the peer field.

## Example: Next.js Configuration

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [
      ['@lingui/swc-plugin', {
        // Plugin options
      }],
    ],
  },
};

export default nextConfig;
```

## Example: .swcrc Configuration

```json
{
  "$schema": "https://json.schemastore.org/swcrc",
  "jsc": {
    "experimental": {
      "plugins": [
        ["@lingui/swc-plugin", {}]
      ]
    }
  }
}
```

## Example: Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { lingui } from "@lingui/vite-plugin";

export default defineConfig({
  plugins: [
    react({ plugins: [["@lingui/swc-plugin", {}]] }),
    lingui(),
  ],
});
```

## Silent Failure: Wrong Plugin Entry Shape

Every SWC plugin entry must be a `[name, options]` **tuple**, even with empty options. Passing the plugin name as a bare string silently disables the macro transform: the build succeeds, but `<Trans>` never resolves and messages render as raw macro output.

```ts
// ❌ Silently does nothing
react({ plugins: ["@lingui/swc-plugin"] })

// ✅ Tuple with options object
react({ plugins: [["@lingui/swc-plugin", {}]] })
```

The same applies to Next.js `swcPlugins` and `.swcrc` `plugins` arrays.

## What If No Compatible Version Exists?

When no plugin version that installs beside the project's `@lingui/core` fits the host, make an explicit choice rather than guessing:

1. **Move the host** to a version whose `swc_core` range has a matching plugin (usually forward: newer hosts accept newer plugins)
2. **Switch to the Babel transform** (`@lingui/babel-plugin-lingui-macro`) — see the caveats below
3. Open an issue or PR at https://github.com/lingui/swc-plugin

Forcing the install (`--legacy-peer-deps`) or downgrading `@lingui/core` to satisfy an old plugin's peer are not on this list: the first hides the mismatch until the build, the second regresses the runtime to please a build tool.

### Babel Fallback on Next.js

```bash
npm install -D @lingui/babel-plugin-lingui-macro babel-plugin-macros @babel/types
```

```json
// .babelrc
{ "presets": ["next/babel"], "plugins": ["macros"] }
```

Remove the `experimental.swcPlugins` entry. Three things the Babel path needs that the SWC plugin did not:

1. **`@babel/types` installed explicitly.** Next bundles its own Babel and does not expose it to plugins; without it the build fails with `Cannot find package '@babel/types'`.
2. **A `lingui.config.ts` (or `.js`/`.mjs`).** The Babel macro reads it at compile time; the SWC plugin never did, so a project that got by without one breaks here.
3. **Acceptance that `.babelrc` turns off Next's SWC compiler for the whole project** — Next prints `Disabled SWC as replacement for Babel because of custom Babel configuration`, and `compiler` options in `next.config` are ignored from then on. Builds get slower; prefer moving the host when that is an option.

### Babel Fallback Caveat: @vitejs/plugin-react 6

`@vitejs/plugin-react@6` dropped its internal Babel and **removed the `babel` option entirely**. On v6+, the classic form:

```ts
react({ babel: { plugins: ["@lingui/babel-plugin-lingui-macro"] } })
```

no longer works — a TypeScript config fails with TS2353 ("babel does not exist in type..."); a plain JS config is **silently ignored** and macros never get transformed.

Your options on Vite:

- Stay on SWC: `@vitejs/plugin-react-swc` + an exactly pinned `@lingui/swc-plugin` chosen by the steps above (preferred)
- Run the macro as a standalone Babel pass (`@rolldown/plugin-babel` on Vite 8, `vite-plugin-babel` on Vite ≤ 7) — the lingui-framework-setup skill has the wiring
- Pin `@vitejs/plugin-react@^5`, which still supports the `babel` option
