import { isAbsolute, resolve } from 'node:path'
import { ensurePrefix } from '@antfu/utils'

import type { ResolvedOptions } from './types'

export function getResolvedPath(file: string, resolvedOptions: ResolvedOptions) {
  if (isAbsolute(resolvedOptions.outDir))
    return resolve(`${resolvedOptions.outDir}/${file}`)
  return resolve(`${ensurePrefix('./', resolvedOptions.outDir)}/${file}`)
}

export function removeMaybeSuffix(suffix: string, str: string) {
  if (!str.endsWith(suffix))
    return str
  return str.slice(0, -suffix.length)
}
