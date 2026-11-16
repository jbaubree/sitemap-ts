import type { ResolvedOptions, UserOptions } from './types'
import process from 'node:process'

// https://reproducible-builds.org/specs/source-date-epoch/
export function defaultLastmod(): Date {
  const epoch = Number(process.env.SOURCE_DATE_EPOCH)
  return Number.isInteger(epoch) && epoch > 0
    ? new Date(epoch * 1000)
    : new Date()
}

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
      lastmod: defaultLastmod(),
    },
    defaultOptions,
    userOptions,
  )
}
