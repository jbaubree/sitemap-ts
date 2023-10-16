import { describe, expect, test } from 'vitest'

import { resolveOptions } from '../src/options'
import { getFormattedSitemap, getRoutes } from '../src/sitemap'
import { generateTestFiles } from './utils'

describe('Sitemap', () => {
  test('Get routes', async () => {
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

  test('Get formatted sitemap', async () => {
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
  })
})
