# sitemap-ts

[![NPM Version](https://badgen.net/npm/v/sitemap-ts)](https://www.npmjs.com/package/sitemap-ts)
[![Monthly Downloads](https://badgen.net/npm/dm/sitemap-ts)](https://www.npmjs.com/package/sitemap-ts)
[![Types](https://badgen.net/npm/types/sitemap-ts)](https://github.com/jbaubree/sitemap-ts/blob/main/src/types.ts)
[![Licence](https://badgen.net/npm/license/sitemap-ts)](https://github.com/jbaubree/sitemap-ts/blob/main/LICENSE)
[![CI](https://github.com/jbaubree/sitemap-ts/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/jbaubree/sitemap-ts/actions/workflows/ci.yml)

> Sitemap generator.

> This plugin scans your dist folder to generate sitemap.xml and robots.txt files.

## Install

```bash
pnpm add -D sitemap-ts
# or
npm install -D sitemap-ts
```

## Usage

```ts
import { generateSitemap } from 'sitemap-ts'

generateSitemap({
  hostname: 'https://example.com',
})
```

By default, `sitemap-ts` scans the `dist/` directory for `.html` files and writes `sitemap.xml` + `robots.txt` next to them.

## Configuration options

### hostname

- **Type:** `string`
- **Default:** `'http://localhost/'`

Base URI.

### dynamicRoutes

- **Type:** `string[]`
- **Default:** `[]`

Array of strings with manual routes.

```js
const names = [
  'John',
  'Bryce',
  'Addison',
  'Dana',
]
const dynamicRoutes = names.map(name => `/names/${name}`)
generateSitemap({ dynamicRoutes })
```

### exclude

- **Type:** `string[]`
- **Default:** `[]`

Array of strings with excluded routes.

```js
generateSitemap({
  exclude: ['/admin', '/private']
})
```

### externalSitemaps

- **Type:** `string[]`
- **Default:** `[]`

Array of strings with other sitemaps paths or urls.

```js
generateSitemap({
  externalSitemaps: [
    'sitemap_1',
    'sitemap_2',
    'subpath/sitemap_3',
    'https://site.com/sitemap.xml'
  ]
})
```

### base path

- **Type:** `string`
- **Default:** ``

String with base path.

```js
generateSitemap({
  basePath: '/path'
})
```

### outDir

- **Type:** `string`
- **Default:** `'dist'`

Output directory.

### extensions

- **Type:** `string | string[]`
- **Default:** `'html'`

File extensions that need to be generated.
Example: ['html', 'md']

### changefreq

- **Type:** `string | RoutesOptionMap<string>`
- **Default:** `'daily'`

Change frequency option for sitemap.

### priority

- **Type:** `number | RoutesOptionMap<number>`
- **Default:** `1`

Priority option for sitemap.

### lastmod

- **Type:** `Date | RoutesOptionMap<Date>`
- **Default:** `new Date()`

Last modification option for sitemap.

The default value honors the [`SOURCE_DATE_EPOCH`](https://reproducible-builds.org/specs/source-date-epoch/) environment variable (Unix timestamp in seconds). When set, it is used instead of `new Date()` so builds are reproducible across environments (CI, Docker, etc.). Passing an explicit `lastmod` always takes precedence.

### RoutesOptionMap\<Type>

- **Type:** `{ [route: string]: Type }`

Used for changing `changefreq`, `priority`, or `lastmod` on a by-route level.
The (optional) route `'*'` is used as default.

### readable

- **Type:** `boolean`
- **Default:** `false`

Converts XML into a human-readable format

### i18n

- **Type:** `{ defaultLanguage?: string, languages: string[], strategy?: 'suffix' | 'prefix' | 'prefix_except_default', includeDefaultLanguageInURL?: boolean }`
- **Default:** `undefined, strategy: 'suffix'`

Add i18n support defining alternate links.
defaultLanguage will use this language with / and languages with /language.

`strategy` controls where the language code is placed in the URL:

- `'suffix'` (default) — language code appended to the path. Example: `http://localhost/mypage/en`
- `'prefix'` — language code prepended to the path. Example: `http://localhost/en/mypage`
- `'prefix_except_default'` — same as `'prefix'` for every language **except** `defaultLanguage`, which keeps the unprefixed URL (e.g. `/mypage` for the default, `/en/mypage` for others). Common pattern for sites that only prefix non-default locales.

Set `includeDefaultLanguageInURL: true` to also apply the strategy to the default language. In that case, `<loc>`, the default-language alternate, and `x-default` all point to the localized URL (e.g. http://localhost/en/mypage instead of http://localhost/mypage). Useful when every page is served under a language prefix, as recommended by [Google](https://developers.google.com/search/docs/specialty/international/localized-versions#example_2). Has no effect with `'prefix_except_default'`.

### splitAt

- **Type:** `number`
- **Default:** `45000`

Split threshold for large sitemaps. When the total number of URLs exceeds `splitAt`, the output changes:

- `sitemap.xml` becomes a **sitemap index** referencing the chunks
- URLs are split into `sitemap-1.xml`, `sitemap-2.xml`, …, each capped at `splitAt` entries

Below the threshold, a single `sitemap.xml` is produced (unchanged behavior). The sitemap protocol allows at most 50 000 URLs per file, so keep `splitAt ≤ 50000`.

```js
generateSitemap({
  hostname: 'https://example.com',
  splitAt: 10000, // force splitting earlier
})
```

### generateRobotsTxt

- **Type:** `boolean`
- **Default:** `true`

Enables robots.txt file generation

### xmlns

- **Type:** `NSArgs`
- **Default:** `undefined`

Trim the xml namespace
See https://www.npmjs.com/package/sitemap#options-you-can-pass
Type: https://github.com/ekalinin/sitemap.js/blob/0af656e6a4a7b1403c9b3af23603261bd9cf94d3/lib/sitemap-stream.ts#L20

### robots

- **Type:** `RobotOption[]`
- **Default:** `[{ userAgent: '*', allow: '/' }]`

RobotOption:

- **userAgent**: `string`
- **allow**?: `string | string[]`
- **disallow**?: `string | string[]`
- **crawlDelay**?: `number`
- **cleanParam**?: `string`

## Helpers

### `getRoutesFromTypedRouter(filePath, options?)`

Parses a `typed-router.d.ts` file generated by [vue-router](https://router.vuejs.org/) (v5+) or [unplugin-vue-router](https://uvr.esm.is/) and returns the list of route paths. Useful when building a sitemap for a SPA that uses file-based routing.

- **filePath**: `string` — path to the generated `typed-router.d.ts` file.
- **options.includeDynamic**: `boolean` — default `false`. When `true`, routes containing `:param` or `*` segments are kept. By default they are filtered out (they must be expanded to concrete values before being useful in a sitemap).

```js
import { generateSitemap, getRoutesFromTypedRouter } from 'sitemap-ts'

const names = ['John', 'Bryce', 'Addison', 'Dana']

generateSitemap({
  hostname: 'https://example.com',
  dynamicRoutes: [
    ...getRoutesFromTypedRouter('./typed-router.d.ts'),
    ...names.map(name => `/names/${name}`),
  ],
})
```

## License

[MIT](./LICENSE) License © 2022 [JB Aubrée](https://github.com/jbaubree)
