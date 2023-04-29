import { writeFileSync } from 'fs'
import { SitemapStream, streamToPromise } from 'sitemap'
import format from 'xml-formatter'

import { resolveOptions } from './options'
import { getContent, getRules } from './robots'
import { getFormattedSitemap, getRoutes } from './sitemap'
import { getResolvedPath } from './utils'
import type { ResolvedOptions, UserOptions } from './types'

export function generateSitemap(options: UserOptions = {}) {
  const resolvedOptions: ResolvedOptions = resolveOptions(options)

  // robots.txt
  if (resolvedOptions.generateRobotsTxt) {
    const robotRules = getRules(resolvedOptions.robots)
    const robotContent = getContent(robotRules, resolvedOptions.hostname)
    writeFileSync(getResolvedPath('robots.txt', resolvedOptions), robotContent)
  }

  // sitemap.xml
  const routes = getRoutes(resolvedOptions)
  if (!routes.length)
    return
  const formattedSitemap = getFormattedSitemap(resolvedOptions, routes)

  const stream = new SitemapStream()
  formattedSitemap.forEach(item => stream.write(item))
  streamToPromise(stream).then((sitemap) => {
    const utfSitemap = sitemap.toString('utf-8')
    const formattedSitemap = resolvedOptions.readable ? format(utfSitemap) : utfSitemap
    writeFileSync(getResolvedPath('sitemap.xml', resolvedOptions), formattedSitemap)
  })
  stream.end()
}

export { getRoutes, getFormattedSitemap } from './sitemap'
export { resolveOptions } from './options'
export * from './types'
export default generateSitemap
