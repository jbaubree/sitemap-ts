import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { generateSitemap } from '../src'
import { generateTestFiles } from './utils'
import { ROBOTS_FILE, SITEMAP_FILE, TEST_OPTION_1, TEST_OPTION_2 } from './variables'

describe('index', () => {
  it('generate sitemap', async () => {
    expect(existsSync(SITEMAP_FILE)).toBe(false)
    expect(existsSync(ROBOTS_FILE)).toBe(false)

    await generateSitemap({ generateRobotsTxt: false })

    expect(existsSync(SITEMAP_FILE)).toBe(false)
    expect(existsSync(ROBOTS_FILE)).toBe(false)

    await generateSitemap()
    expect(existsSync(SITEMAP_FILE)).toBe(false)
    expect(existsSync(ROBOTS_FILE)).toBe(true)

    generateTestFiles()

    await generateSitemap({ robots: TEST_OPTION_1 })
    expect(existsSync(SITEMAP_FILE)).toBe(true)
    expect(readFileSync(ROBOTS_FILE).toString('utf-8')).toEqual(
      'User-agent: *\nAllow: /\n\nSitemap: http://localhost/sitemap.xml',
    )

    await generateSitemap({ hostname: 'https://test.com/', robots: TEST_OPTION_2, readable: true })
    expect(readFileSync(ROBOTS_FILE).toString('utf-8')).toEqual(
      'User-agent: *\nAllow: /\nUser-agent: Googlebot\nAllow: /admin\nDisallow: /disallow\nDisallow: /test\nCrawl-delay: 10\n\nSitemap: https://test.com/sitemap.xml',
    )
  })

  describe('auto-split', () => {
    const CHUNK_1 = 'dist/sitemap-1.xml'
    const CHUNK_2 = 'dist/sitemap-2.xml'
    const CHUNK_3 = 'dist/sitemap-3.xml'

    it('keeps single sitemap.xml when route count is at or below splitAt', async () => {
      await generateSitemap({
        generateRobotsTxt: false,
        dynamicRoutes: ['/a', '/b'],
        splitAt: 2,
      })
      const content = readFileSync(SITEMAP_FILE).toString('utf-8')
      expect(content).toContain('<urlset')
      expect(content).not.toContain('<sitemapindex')
      expect(existsSync(CHUNK_1)).toBe(false)
    })

    it('writes sitemap.xml as index + sitemap-N.xml chunks when exceeding splitAt', async () => {
      await generateSitemap({
        generateRobotsTxt: false,
        hostname: 'https://example.com/',
        dynamicRoutes: ['/a', '/b', '/c', '/d', '/e'],
        splitAt: 2,
      })

      expect(existsSync(SITEMAP_FILE)).toBe(true)
      expect(existsSync(CHUNK_1)).toBe(true)
      expect(existsSync(CHUNK_2)).toBe(true)
      expect(existsSync(CHUNK_3)).toBe(true)

      const index = readFileSync(SITEMAP_FILE).toString('utf-8')
      expect(index).toContain('<sitemapindex')
      expect(index).toContain('https://example.com/sitemap-1.xml')
      expect(index).toContain('https://example.com/sitemap-2.xml')
      expect(index).toContain('https://example.com/sitemap-3.xml')

      const chunk1 = readFileSync(CHUNK_1).toString('utf-8')
      expect(chunk1).toContain('<urlset')
      expect(chunk1).toContain('<loc>https://example.com/a</loc>')
      expect(chunk1).toContain('<loc>https://example.com/b</loc>')
      expect(chunk1).not.toContain('<loc>https://example.com/c</loc>')

      const chunk3 = readFileSync(CHUNK_3).toString('utf-8')
      expect(chunk3).toContain('<loc>https://example.com/e</loc>')
    })
  })
})
