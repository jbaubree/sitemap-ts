import { afterEach, describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/options'

describe('options', () => {
  it('resolve options', () => {
    expect(resolveOptions({})).toMatchInlineSnapshot({
      lastmod: expect.any(Date),
    }, `
      {
        "basePath": "",
        "changefreq": "daily",
        "dynamicRoutes": [],
        "exclude": [],
        "extensions": "html",
        "externalSitemaps": [],
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
        "splitAt": 45000,
      }
    `)
  })

  it('resolve options with excluded routes', () => {
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
        "externalSitemaps": [],
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
        "splitAt": 45000,
      }
    `)
  })

  it('resolve options with specific extensions', () => {
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
        "externalSitemaps": [],
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
        "splitAt": 45000,
      }
    `)
  })

  it('resolve options with policies', () => {
    expect(resolveOptions({
      robots: [
        {
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
        },
      ],
    })).toMatchInlineSnapshot({
      lastmod: expect.any(Date),
    }, `
      {
        "basePath": "",
        "changefreq": "daily",
        "dynamicRoutes": [],
        "exclude": [],
        "extensions": "html",
        "externalSitemaps": [],
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
        "splitAt": 45000,
      }
    `)
  })

  describe('source_date_epoch support', () => {
    const originalValue = process.env.SOURCE_DATE_EPOCH

    afterEach(() => {
      if (originalValue === undefined)
        delete process.env.SOURCE_DATE_EPOCH
      else
        process.env.SOURCE_DATE_EPOCH = originalValue
    })

    it('uses SOURCE_DATE_EPOCH when set to a valid integer', () => {
      process.env.SOURCE_DATE_EPOCH = '1700000000'
      expect(resolveOptions({}).lastmod).toEqual(new Date(1700000000 * 1000))
    })

    it('ignores SOURCE_DATE_EPOCH when not an integer', () => {
      process.env.SOURCE_DATE_EPOCH = 'not-a-number'
      const before = Date.now()
      const resolved = resolveOptions({})
      const after = Date.now()
      expect((resolved.lastmod as Date).getTime()).toBeGreaterThanOrEqual(before)
      expect((resolved.lastmod as Date).getTime()).toBeLessThanOrEqual(after)
    })

    it('user-provided lastmod takes precedence over SOURCE_DATE_EPOCH', () => {
      process.env.SOURCE_DATE_EPOCH = '1700000000'
      const userDate = new Date('2024-01-01T00:00:00.000Z')
      expect(resolveOptions({ lastmod: userDate }).lastmod).toBe(userDate)
    })
  })

  it('resolve options with disabled robots.txt file', () => {
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
        "externalSitemaps": [],
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
        "splitAt": 45000,
      }
    `)
  })
})
