import type { NSArgs } from 'sitemap/dist/lib/sitemap-stream'

export interface RobotOption {
  /**
   * User-agent value.
   * Example: Googlebot
   */
  userAgent: string
  /**
   * Allowed routes for corresponding User-agent.
   * Example: '/'
   */
  allow?: string | string[]
  /**
   * Disallowed routes for corresponding User-agent.
   * Example: ['/admin', '/confidential']
   */
  disallow?: string | string[]
  /**
   * Crawl-delay option for robot.
   * Example: 2
   */
  crawlDelay?: number
  /**
   * Clean-param option for robot.
   * Example: 'ref /articles/'
   */
  cleanParam?: string
}

export type RoutesOptionMap<T> = T | { [key: string]: T }

/**
 * Plugin options.
 */
interface Options {
  /**
   * Base URI
   * @default 'http://localhost/'
   */
  hostname: string
  /**
   * Array of strings with dynamic routes.
   * Example: ['/routes1', '/route2/sub-route']
   * @default []
   */
  dynamicRoutes: string[]
  /**
   * Array of strings with excluded routes.
   * Example: ['/routes1', '/route2/sub-route']
   * @default []
   */
  exclude: string[]
  /**
   * Array of i18n languages.
   * Example: {
   *  defaultLanguage: 'fr'
   *  languages: ['fr', 'en', 'es']
   *  strategy: 'suffix' | 'prefix'
   * }
   * @default undefined, strategy: 'suffix'
   */
  i18n?: {
    defaultLanguage?: string
    languages: string[]
    strategy?: 'suffix' | 'prefix'
  }
  /**
   * Other sitemaps paths
   * Example: ['sitemap_1.xml', 'path/sitemap_2.xml', 'https://site.com/sitemap.xml']
   * @default []
   */
  externalSitemaps: string[]
  /**
   * String with base path.
   * Example: '/mysubpath'
   * @default ''
   */
  basePath: string
  /**
   * Output directory
   * @default 'dist'
   */
  outDir: string
  /**
   * File extensions that need to be generated.
   * Example: ['html', 'md']
   * @default 'html'
   */
  extensions: string | string[]
  /**
   * Change frequency option for sitemap
   * @default 'daily'
   */
  changefreq: string | RoutesOptionMap<string>
  /**
   * Priority option for sitemap
   * @default 1
   */
  priority: number | RoutesOptionMap<number>
  /**
   * Last modification option for sitemap
   * @default new Date()
   */
  lastmod: Date | RoutesOptionMap<Date>
  /**
   * Converts XML into a human-readable format
   * @default false
   */
  readable: boolean
  /**
   * Enables robots.txt file generation
   * @default true
   */
  generateRobotsTxt: boolean
  /**
   * Robots policy
   * @default [{ userAgent: '*', allow: '/' }]
   */
  robots: RobotOption[]
  /**
   * Trim the xml namespace
   * See https://www.npmjs.com/package/sitemap#options-you-can-pass
   * @default undefined
   */
  xmlns?: NSArgs
}

export type UserOptions = Partial<Options>

export interface ResolvedOptions extends Options { }
