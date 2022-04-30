# sitemap-ts

[![NPM Version](https://badgen.net/npm/v/sitemap-ts)](https://www.npmjs.com/package/sitemap-ts)
[![Monthly Downloads](https://badgen.net/npm/dm/sitemap-ts)](https://www.npmjs.com/package/sitemap-ts)
[![Types](https://badgen.net/npm/types/sitemap-ts)](https://github.com/jbaubree/sitemap-ts/blob/main/src/types.ts)
[![Licence](https://badgen.net/npm/license/sitemap-ts)](https://github.com/jbaubree/sitemap-ts/blob/main/LICENSE)
[![CI](https://github.com/jbaubree/sitemap-ts/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/jbaubree/sitemap-ts/actions/workflows/ci.yml)

## Configuration options

### hostname

- **Type:** `string`
- **Default:** `'http://localhost/'`

Base URI.

### dynamicRoutes

- **Type:** `string[]`
- **Default:** `[]`

Array of strings with manual dynamic routes.
```js
const names = [
  'John',
  'Bryce',
  'Addison',
  'Dana',
]
const dynamicRoutes = names.map(name => `/names/${name}`)

export default {
  plugins: [
    Vue(),
    Sitemap({ dynamicRoutes }),
  ],
}
```

You can find a working example in example folder.

### outDir

- **Type:** `string`
- **Default:** `'dist'`

Output directory.

### changefreq

- **Type:** `string`
- **Default:** `'daily'`

Change frequency option for sitemap.

### priority

- **Type:** `number`
- **Default:** `1`

Priority option for sitemap.

### lastmod

- **Type:** `Date`
- **Default:** `new Date()`

Last modification option for sitemap.

### readable

- **Type:** `boolean`
- **Default:** `false`

Converts XML into a human readable format

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
