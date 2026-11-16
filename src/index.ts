import type { Readable } from 'node:stream'
import type { ResolvedOptions, UserOptions } from './types'
import { writeFileSync } from 'node:fs'
import { SitemapIndexStream, SitemapStream, streamToPromise } from 'sitemap'

import format from 'xml-formatter'
import { resolveOptions } from './options'
import { getContent, getRules } from './robots'
import { getFormattedSitemap, getRoutes } from './sitemap'
import { getResolvedPath, removeMaybeSuffix } from './utils'

async function writeStream(stream: Readable, resolvedOptions: ResolvedOptions, filename: string) {
  const buffer = await streamToPromise(stream)
  const utf = buffer.toString('utf-8')
  const output = resolvedOptions.readable
    ? format(utf)
    : utf
  writeFileSync(getResolvedPath(filename, resolvedOptions), output)
}

export async function generateSitemap(options: UserOptions = {}) {
  const resolvedOptions: ResolvedOptions = resolveOptions(options)

  // robots.txt
  if (resolvedOptions.generateRobotsTxt) {
    const robotRules = getRules(resolvedOptions.robots)
    const robotContent = getContent(robotRules, resolvedOptions.hostname, resolvedOptions.externalSitemaps)
    writeFileSync(getResolvedPath('robots.txt', resolvedOptions), robotContent)
  }

  // sitemap.xml
  const routes = getRoutes(resolvedOptions)
  if (!routes.length)
    return
  const formattedSitemap = getFormattedSitemap(resolvedOptions, routes)

  const splitAt = resolvedOptions.splitAt
  if (formattedSitemap.length <= splitAt) {
    const stream = new SitemapStream({ xmlns: resolvedOptions.xmlns })
    formattedSitemap.forEach(item => stream.write(item))
    stream.end()
    await writeStream(stream, resolvedOptions, 'sitemap.xml')
    return
  }

  // Split mode: sitemap.xml becomes the index, children are sitemap-N.xml
  const chunkCount = Math.ceil(formattedSitemap.length / splitAt)
  const hostname = removeMaybeSuffix('/', resolvedOptions.hostname)
  const lastmod = resolvedOptions.lastmod instanceof Date
    ? resolvedOptions.lastmod
    : new Date()

  const childWrites: Promise<void>[] = []
  for (let i = 0; i < chunkCount; i++) {
    const chunk = formattedSitemap.slice(i * splitAt, (i + 1) * splitAt)
    const stream = new SitemapStream({ xmlns: resolvedOptions.xmlns })
    chunk.forEach(item => stream.write(item))
    stream.end()
    childWrites.push(writeStream(stream, resolvedOptions, `sitemap-${i + 1}.xml`))
  }
  await Promise.all(childWrites)

  const indexStream = new SitemapIndexStream()
  for (let i = 1; i <= chunkCount; i++) {
    indexStream.write({
      url: `${hostname}/sitemap-${i}.xml`,
      lastmod: lastmod.toISOString(),
    })
  }
  indexStream.end()
  await writeStream(indexStream, resolvedOptions, 'sitemap.xml')
}

export { resolveOptions } from './options'
export { getFormattedSitemap, getRoutes } from './sitemap'
export { getRoutesFromTypedRouter } from './typed-router'
export type { GetRoutesFromTypedRouterOptions } from './typed-router'
export * from './types'
export default generateSitemap
