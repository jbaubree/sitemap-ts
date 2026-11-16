import type { ResolvedOptions, UserOptions } from './types'

export const defaultOptions = {
  hostname: 'http://localhost/',
  dynamicRoutes: [],
  exclude: [],
  externalSitemaps: [],
  basePath: '',
  outDir: 'dist',
  extensions: 'html',
  changefreq: 'daily',
  priority: 1,
  readable: false,
  generateRobotsTxt: true,
  robots: [
    {
      userAgent: '*',
      allow: '/',
    },
  ],
}

export function resolveOptions(userOptions: UserOptions): ResolvedOptions {
  return Object.assign(
    {
      lastmod: new Date(),
    },
    defaultOptions,
    userOptions,
  )
}
