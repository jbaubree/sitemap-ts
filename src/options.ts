import type { ResolvedOptions, UserOptions } from './types'

export function resolveOptions(userOptions: UserOptions): ResolvedOptions {
  return Object.assign(
    {
      hostname: 'http://localhost/',
      dynamicRoutes: [],
      exclude: [],
      outDir: 'dist',
      extentions: 'html',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date(),
      readable: false,
      robots: [{
        userAgent: '*',
        allow: '/',
      }],
    },
    userOptions,
  )
}
