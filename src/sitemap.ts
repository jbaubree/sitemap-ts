import { join, parse } from 'node:path'
import { ensurePrefix, slash } from '@antfu/utils'
import fg from 'fast-glob'

import type { ResolvedOptions, RoutesOptionMap } from './types'
import { removeMaybeSuffix } from './utils'
import { defaultOptions } from './options'

export function getRoutes(options: ResolvedOptions) {
  const ext = typeof options.extensions === 'string' ? [options.extensions] : options.extensions
  const strExt = ext.map(e => `**/*.${e}`)

  return [
    ...fg.sync(strExt, { cwd: options.outDir }).map((route) => {
      let r = route
      ext.forEach((e) => {
        const regex = new RegExp(`index\.${e}`, 'g')
        r = r.replace(regex, '')
      })
      const parsedRoute = parse(r)
      return slash(join('/', parsedRoute.dir, parsedRoute.name))
    }),
    ...options.dynamicRoutes.map(route => slash(join('/', join(parse(route).dir, parse(route).name)))),
  ].filter(route => !options.exclude.includes(route))
}

function getOptionByRoute<T extends Date | string | number>(options: T | RoutesOptionMap<T>, route: string): T | undefined {
  if (options instanceof Date || typeof options === 'string' || typeof options === 'number')
    return options
  const givenRoutes = Object.keys(options)
  if (givenRoutes.includes(route))
    return options[route]
  if (givenRoutes.includes('*'))
    return options['*']
  return undefined
}

export function getFormattedSitemap(options: ResolvedOptions, routes: string[]) {
  return routes.map((route) => {
    const hostNamePath = removeMaybeSuffix('/', options.hostname)
    const routePath = options.basePath ? ensurePrefix('/', options.basePath) + ensurePrefix('/', route) : ensurePrefix('/', route)
    const url = new URL(routePath, hostNamePath).href
    const formattedSitemap = {
      url,
      changefreq: getOptionByRoute(options.changefreq, route) ?? defaultOptions.changefreq,
      priority: getOptionByRoute(options.priority, route) ?? defaultOptions.priority,
      lastmod: getOptionByRoute(options.lastmod, route) ?? defaultOptions.lastmod,
    }
    if (options.i18n) {
      const languages = options.i18n.languages.map(str => ({
        lang: str,
        url: str === options.i18n?.defaultLanguage ? url : new URL(options.i18n?.pathPrefix ? ensurePrefix('/', str) + routePath : removeMaybeSuffix('/', routePath) + ensurePrefix('/', str), hostNamePath).href,
      }))
      return Object.assign(formattedSitemap, { links: options.i18n.defaultLanguage ? [...languages, { lang: 'x-default', url }] : languages })
    }

    return formattedSitemap
  })
}
