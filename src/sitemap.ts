import { join, parse } from 'node:path'
import { ensurePrefix, ensureSuffix, slash } from '@antfu/utils'
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
  if (options.i18n?.strategy === 'prefix_except_default') {
    return routes.map(prefixExceptDefaultLanguageFactory(
      options,
      {
        defaultLanguage: options.i18n.defaultLanguage ?? 'en',
        languages: options.i18n.languages,
      },
    ))
  }
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
      const strategy = options.i18n.strategy ?? 'suffix'
      const languages = options.i18n.languages.map(str => ({
        lang: str,
        url: str === options.i18n?.defaultLanguage ? url : new URL(strategy === 'prefix' ? ensurePrefix('/', str) + routePath : removeMaybeSuffix('/', routePath) + ensurePrefix('/', str), hostNamePath).href,
      }))
      return Object.assign(formattedSitemap, { links: options.i18n.defaultLanguage ? [...languages, { lang: 'x-default', url }] : languages })
    }

    return formattedSitemap
  })
}

interface PrefixExceptDefaultStrategy {
  defaultLanguage: string
  languages: string[]
}

interface XHTMLanguageLink {
  hreflang: string
  rel: string
  href: string
}

interface SiteMapRouteEntry {
  url: string
  changefreq?: string
  priority?: number
  lastmod?: Date | string | number
  links: XHTMLanguageLink[]
}

function prefixExceptDefaultLanguageFactory(
  options: ResolvedOptions,
  i18n: PrefixExceptDefaultStrategy,
) {
  // we need N links, where N is the number of languages, the x-default should always use the default language link for the target route
  // we also need to handle special / cases like /en, /fr, etc. We need to ensure that the loc and xhtml:link always with the trailing /
  const hostNamePath = removeMaybeSuffix('/', options.hostname)
  const useBasePath = ensurePrefix('/', ensureSuffix('/', options.basePath))
  const contextPath = removeMaybeSuffix('/', useBasePath)
  const defaultLanguage = i18n.defaultLanguage ?? 'en'
  const locales = i18n.languages.filter(l => l !== defaultLanguage)
  const localePrefixes = locales.map((lang) => {
    return [`${contextPath}/${lang}/`, `${contextPath}/${lang}`, lang] as const
  })

  return (route: string) => {
    let url: string
    let pathWithoutLang: string
    if (route === useBasePath) {
      url = ensureSuffix('/', new URL(useBasePath, hostNamePath).href)
      pathWithoutLang = useBasePath[0] === '/' ? useBasePath.slice(1) : useBasePath
    }
    else {
      const locale = localePrefixes.find(([
        prefix1,
        prefix2,
      ]) => route.startsWith(prefix1) || route.startsWith(prefix2),
      )
      if (locale) {
        url = route.startsWith(locale[0])
          ? route.replace(locale[0], '')
          : route.replace(locale[1], '')
        if (url === '') {
          pathWithoutLang = useBasePath.slice(1)
          url = ensureSuffix('/', new URL(`${useBasePath}${locale[2]}`, hostNamePath).href)
        }
        else {
          pathWithoutLang = url[0] === '/' ? url.slice(1) : url
          url = new URL(route, hostNamePath).href
        }
      }
      else {
        pathWithoutLang = route.replace(useBasePath, '')
        url = new URL(route, hostNamePath).href
      }
    }
    const trailingSlash = url.at(-1) === '/'
    let xDefaultHref = new URL(`${useBasePath}${pathWithoutLang}`, hostNamePath).href
    if (trailingSlash)
      xDefaultHref = ensureSuffix('/', xDefaultHref)

    const links: XHTMLanguageLink[] = [{
      hreflang: defaultLanguage,
      rel: 'alternate',
      href: xDefaultHref,
    }]

    for (const l of locales) {
      const href = new URL(`${useBasePath}${l}/${pathWithoutLang}`, hostNamePath).href
      links.push({
        hreflang: l,
        rel: 'alternate',
        href: trailingSlash ? ensureSuffix('/', href) : href,
      })
    }

    links.push({
      hreflang: 'x-default',
      rel: 'alternate',
      href: xDefaultHref,
    })

    return {
      url,
      changefreq: getOptionByRoute(options.changefreq, route) ?? defaultOptions.changefreq,
      priority: getOptionByRoute(options.priority, route) ?? defaultOptions.priority,
      lastmod: getOptionByRoute(options.lastmod, route) ?? defaultOptions.lastmod,
      links,
    } satisfies SiteMapRouteEntry
  }
}
