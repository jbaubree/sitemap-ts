# sitemap-ts

[![NPM Version](https://badgen.net/npm/v/sitemap-ts)](https://www.npmjs.com/package/sitemap-ts)
[![Monthly Downloads](https://badgen.net/npm/dm/sitemap-ts)](https://www.npmjs.com/package/sitemap-ts)
[![Types](https://badgen.net/npm/types/sitemap-ts)](https://github.com/jbaubree/sitemap-ts/blob/main/src/types.ts)
[![Licence](https://badgen.net/npm/license/sitemap-ts)](https://github.com/jbaubree/sitemap-ts/blob/main/LICENSE)
[![CI](https://github.com/jbaubree/sitemap-ts/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/jbaubree/sitemap-ts/actions/workflows/ci.yml)


> Sitemap generator.

> This plugin scans your dist folder to generate sitemap.xml and robots.txt files.

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

Array of strings with other sitemaps paths.
```js
generateSitemap({
  externalSitemaps: ['sitemap_1', 'sitemap_2', 'subpath/sitemap_3']
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

### RoutesOptionMap\<Type>

- **Type:** `{ [route: string]: Type }`

Used for changing `changefreq`, `priority`, or `lastmod` on a by-route level.
The (optional) route `'*'` is used as default.

### readable

- **Type:** `boolean`
- **Default:** `false`

Converts XML into a human-readable format

### generateRobotsTxt

- **Type:** `boolean`
- **Default:** `true`

Enables robots.txt file generation

### robots

- **Type:** `RobotOption[]`
- **Default:** `[{ userAgent: '*', allow: '/' }]`

RobotOption:
- **userAgent**: `string`
- **allow**?: `string | string[]`
- **disallow**?: `string | string[]`
- **crawlDelay**?: `number`
- **cleanParam**?: `string`

## License

[MIT](./LICENSE) License © 2022 [JB Aubrée](https://github.com/jbaubree)
