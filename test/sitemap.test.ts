import { describe, expect, it } from 'vitest'

import { resolveOptions } from '../src/options'
import { getFormattedSitemap, getRoutes } from '../src/sitemap'
import { generateTestFiles } from './utils'

describe('sitemap', () => {
  it('get routes', async () => {
    expect(getRoutes(resolveOptions({}))).toEqual([])
    expect(getRoutes(resolveOptions({ extensions: ['html', 'md'] }))).toEqual([])
    expect(getRoutes(resolveOptions({ dynamicRoutes: ['/', 'route', '/route/sub-route'] }))).toEqual([
      '/',
      '/route',
      '/route/sub-route',
    ])

    expect(getRoutes(resolveOptions({
      dynamicRoutes: ['/', 'route', '/route/sub-route'],
      exclude: ['/route'],
    }))).toEqual([
      '/',
      '/route/sub-route',
    ])

    generateTestFiles()

    expect(getRoutes(resolveOptions({}))).toEqual([
      '/',
      '/test',
      '/sub-path/deeper-path',
      '/sub-path',
    ])

    expect(getRoutes(resolveOptions({ extensions: ['html', 'md'] }))).toEqual([
      '/',
      '/md',
      '/test',
      '/sub-path/deeper-path',
      '/sub-path',
      '/sub-path/md',
      '/sub-path/md/md-deeper-path',
    ])

    expect(getRoutes(resolveOptions({ dynamicRoutes: ['/', 'route', '/route/sub-route'] }))).toEqual([
      '/',
      '/test',
      '/sub-path/deeper-path',
      '/sub-path',
      '/',
      '/route',
      '/route/sub-route',
    ])
  })

  it('get formatted sitemap', async () => {
    expect(getFormattedSitemap(resolveOptions({}), [])).toEqual([])
    expect(getFormattedSitemap(resolveOptions({}), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "daily",
          "lastmod": Any<Date>,
          "priority": 1,
          "url": "http://localhost/route",
        },
      ]
    `)
    expect(getFormattedSitemap(resolveOptions({ basePath: '/base' }), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "daily",
          "lastmod": Any<Date>,
          "priority": 1,
          "url": "http://localhost/base/route",
        },
      ]
    `)
    expect(getFormattedSitemap(resolveOptions({ changefreq: 'monthly', priority: 0.7 }), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "monthly",
          "lastmod": Any<Date>,
          "priority": 0.7,
          "url": "http://localhost/route",
        },
      ]
    `)
    expect(getFormattedSitemap(resolveOptions({ changefreq: { '*': 'weekly', '/otherRoute': 'monthly' }, priority: { '*': 0.8, '/otherRoute': 0.4 } }), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "weekly",
          "lastmod": Any<Date>,
          "priority": 0.8,
          "url": "http://localhost/route",
        },
      ]
    `)
    expect(getFormattedSitemap(resolveOptions({ changefreq: { '*': 'weekly', '/route': 'monthly', '/otherRoute': 'never' }, priority: { '*': 0.8, '/route': 0.6, '/otherRoute': 0.5 } }), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "monthly",
          "lastmod": Any<Date>,
          "priority": 0.6,
          "url": "http://localhost/route",
        },
      ]
    `)
    expect(getFormattedSitemap(resolveOptions({ i18n: { languages: ['fr', 'en'] } }), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "daily",
          "lastmod": Any<Date>,
          "links": [
            {
              "lang": "fr",
              "url": "http://localhost/route/fr",
            },
            {
              "lang": "en",
              "url": "http://localhost/route/en",
            },
          ],
          "priority": 1,
          "url": "http://localhost/route",
        },
      ]
    `)
    expect(getFormattedSitemap(resolveOptions({ i18n: { languages: ['fr', 'en'], strategy: 'suffix' } }), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "daily",
          "lastmod": Any<Date>,
          "links": [
            {
              "lang": "fr",
              "url": "http://localhost/route/fr",
            },
            {
              "lang": "en",
              "url": "http://localhost/route/en",
            },
          ],
          "priority": 1,
          "url": "http://localhost/route",
        },
      ]
    `)
    expect(getFormattedSitemap(resolveOptions({ i18n: { languages: ['fr', 'en'], strategy: 'prefix' } }), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "daily",
          "lastmod": Any<Date>,
          "links": [
            {
              "lang": "fr",
              "url": "http://localhost/fr/route",
            },
            {
              "lang": "en",
              "url": "http://localhost/en/route",
            },
          ],
          "priority": 1,
          "url": "http://localhost/route",
        },
      ]
    `)
    expect(getFormattedSitemap(resolveOptions({ i18n: { languages: ['fr', 'en'], defaultLanguage: 'fr' } }), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "daily",
          "lastmod": Any<Date>,
          "links": [
            {
              "lang": "fr",
              "url": "http://localhost/route",
            },
            {
              "lang": "en",
              "url": "http://localhost/route/en",
            },
            {
              "lang": "x-default",
              "url": "http://localhost/route",
            },
          ],
          "priority": 1,
          "url": "http://localhost/route",
        },
      ]
    `)
    expect(getFormattedSitemap(resolveOptions({ i18n: { languages: ['fr', 'en'], defaultLanguage: 'fr', strategy: 'suffix' } }), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "daily",
          "lastmod": Any<Date>,
          "links": [
            {
              "lang": "fr",
              "url": "http://localhost/route",
            },
            {
              "lang": "en",
              "url": "http://localhost/route/en",
            },
            {
              "lang": "x-default",
              "url": "http://localhost/route",
            },
          ],
          "priority": 1,
          "url": "http://localhost/route",
        },
      ]
    `)
    expect(getFormattedSitemap(resolveOptions({ i18n: { languages: ['fr', 'en'], defaultLanguage: 'fr', strategy: 'prefix' } }), ['/route'])).toMatchInlineSnapshot([{
      lastmod: expect.any(Date),
    }], `
      [
        {
          "changefreq": "daily",
          "lastmod": Any<Date>,
          "links": [
            {
              "lang": "fr",
              "url": "http://localhost/route",
            },
            {
              "lang": "en",
              "url": "http://localhost/en/route",
            },
            {
              "lang": "x-default",
              "url": "http://localhost/route",
            },
          ],
          "priority": 1,
          "url": "http://localhost/route",
        },
      ]
    `)
    expect(getFormattedSitemap(resolveOptions({
      i18n: {
        languages: ['fr', 'en'],
        defaultLanguage: 'fr',
        strategy: 'prefix_except_default',
      },
      lastmod: new Date('2025-07-18T12:00:00.000Z'),
    }), ['/', '/route-a', '/en/', '/en/route-a'])).toMatchInlineSnapshot(`
      [
        {
          "changefreq": "daily",
          "lastmod": 2025-07-18T12:00:00.000Z,
          "links": [
            {
              "hreflang": "fr",
              "rel": "alternate",
              "url": "http://localhost/",
            },
            {
              "hreflang": "en",
              "rel": "alternate",
              "url": "http://localhost/en/",
            },
            {
              "hreflang": "x-default",
              "rel": "alternate",
              "url": "http://localhost/",
            },
          ],
          "priority": 1,
          "url": "http://localhost/",
        },
        {
          "changefreq": "daily",
          "lastmod": 2025-07-18T12:00:00.000Z,
          "links": [
            {
              "hreflang": "fr",
              "rel": "alternate",
              "url": "http://localhost/route-a",
            },
            {
              "hreflang": "en",
              "rel": "alternate",
              "url": "http://localhost/en/route-a",
            },
            {
              "hreflang": "x-default",
              "rel": "alternate",
              "url": "http://localhost/route-a",
            },
          ],
          "priority": 1,
          "url": "http://localhost/route-a",
        },
        {
          "changefreq": "daily",
          "lastmod": 2025-07-18T12:00:00.000Z,
          "links": [
            {
              "hreflang": "fr",
              "rel": "alternate",
              "url": "http://localhost/",
            },
            {
              "hreflang": "en",
              "rel": "alternate",
              "url": "http://localhost/en/",
            },
            {
              "hreflang": "x-default",
              "rel": "alternate",
              "url": "http://localhost/",
            },
          ],
          "priority": 1,
          "url": "http://localhost/en/",
        },
        {
          "changefreq": "daily",
          "lastmod": 2025-07-18T12:00:00.000Z,
          "links": [
            {
              "hreflang": "fr",
              "rel": "alternate",
              "url": "http://localhost/route-a",
            },
            {
              "hreflang": "en",
              "rel": "alternate",
              "url": "http://localhost/en/route-a",
            },
            {
              "hreflang": "x-default",
              "rel": "alternate",
              "url": "http://localhost/route-a",
            },
          ],
          "priority": 1,
          "url": "http://localhost/en/route-a",
        },
      ]
    `)
  })
})
