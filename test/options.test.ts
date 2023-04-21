import { describe, expect, test } from 'vitest'
import { resolveOptions } from '../src/options'

describe('Options', () => {
  test('resolve options', () => {
    expect(resolveOptions({})).toMatchInlineSnapshot({
      lastmod: expect.any(Date),
    }, `
      {
        "basePath": "",
        "changefreq": "daily",
        "dynamicRoutes": [],
        "exclude": [],
        "extensions": "html",
        "generateRobotsTxt": true,
        "hostname": "http://localhost/",
        "lastmod": Any<Date>,
        "outDir": "dist",
        "priority": 1,
        "readable": false,
        "robots": [
          {
            "allow": "/",
            "userAgent": "*",
          },
        ],
      }
    `)
  })

  test('resolve options with excluded routes', () => {
    expect(resolveOptions({
      exclude: ['/routes1', '/route2/sub-route'],
    })).toMatchInlineSnapshot({
      lastmod: expect.any(Date),
    }, `
      {
        "basePath": "",
        "changefreq": "daily",
        "dynamicRoutes": [],
        "exclude": [
          "/routes1",
          "/route2/sub-route",
        ],
        "extensions": "html",
        "generateRobotsTxt": true,
        "hostname": "http://localhost/",
        "lastmod": Any<Date>,
        "outDir": "dist",
        "priority": 1,
        "readable": false,
        "robots": [
          {
            "allow": "/",
            "userAgent": "*",
          },
        ],
      }
    `)
  })

  test('resolve options with specific extensions', () => {
    expect(resolveOptions({
      extensions: ['html', 'md'],
    })).toMatchInlineSnapshot({
      lastmod: expect.any(Date),
    }, `
      {
        "basePath": "",
        "changefreq": "daily",
        "dynamicRoutes": [],
        "exclude": [],
        "extensions": [
          "html",
          "md",
        ],
        "generateRobotsTxt": true,
        "hostname": "http://localhost/",
        "lastmod": Any<Date>,
        "outDir": "dist",
        "priority": 1,
        "readable": false,
        "robots": [
          {
            "allow": "/",
            "userAgent": "*",
          },
        ],
      }
    `)
  })

  test('resolve options with policies', () => {
    expect(resolveOptions({
      robots: [{
        userAgent: '*',
        allow: '/',
        disallow: '/some-path',
        crawlDelay: 10,
      },
      {
        userAgent: 'GoogleBot',
        allow: ['/', '/some-path'],
        disallow: ['/disabled-path', '/another-disabled-path'],
        crawlDelay: 10,
      }],
    })).toMatchInlineSnapshot({
      lastmod: expect.any(Date),
    }, `
      {
        "basePath": "",
        "changefreq": "daily",
        "dynamicRoutes": [],
        "exclude": [],
        "extensions": "html",
        "generateRobotsTxt": true,
        "hostname": "http://localhost/",
        "lastmod": Any<Date>,
        "outDir": "dist",
        "priority": 1,
        "readable": false,
        "robots": [
          {
            "allow": "/",
            "crawlDelay": 10,
            "disallow": "/some-path",
            "userAgent": "*",
          },
          {
            "allow": [
              "/",
              "/some-path",
            ],
            "crawlDelay": 10,
            "disallow": [
              "/disabled-path",
              "/another-disabled-path",
            ],
            "userAgent": "GoogleBot",
          },
        ],
      }
    `)
  })

  test('resolve options with disabled robots.txt file', () => {
    expect(resolveOptions({
      generateRobotsTxt: false,
    })).toMatchInlineSnapshot({
      lastmod: expect.any(Date),
    }, `
      {
        "basePath": "",
        "changefreq": "daily",
        "dynamicRoutes": [],
        "exclude": [],
        "extensions": "html",
        "generateRobotsTxt": false,
        "hostname": "http://localhost/",
        "lastmod": Any<Date>,
        "outDir": "dist",
        "priority": 1,
        "readable": false,
        "robots": [
          {
            "allow": "/",
            "userAgent": "*",
          },
        ],
      }
    `)
  })
})
