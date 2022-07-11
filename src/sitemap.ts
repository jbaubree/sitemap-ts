import { join, parse } from 'path'
import { slash } from '@antfu/utils'
import { sync } from 'fast-glob'

import type { ResolvedOptions } from './types'

export function getRoutes(options: ResolvedOptions) {
  const ext = typeof options.extentions === 'string' ? [options.extentions] : options.extentions
  const strExt = ext.map(e => `**/*.${e}`)

  return [
    ...sync(strExt, { cwd: options.outDir }).map((route) => {
      let r = route
      ext.forEach((e) => {
        const regex = new RegExp(`/index\.${e}`, 'g')
        r = r.replace(regex, '')
      })
      const parsedRoute = parse(r)
      return slash(join('/', parsedRoute.dir, parsedRoute.name))
    }),
    ...options.dynamicRoutes.map(route => slash(join('/', join(parse(route).dir, parse(route).name)))),
  ].filter(route => !options.exclude.includes(route))
}

export function getFormattedSitemap(options: ResolvedOptions, routes: string[]) {
  return routes.map(route => ({
    url: new URL(route, options.hostname).href,
    changefreq: options.changefreq,
    priority: options.priority,
    lastmod: options.lastmod,
  }))
}
