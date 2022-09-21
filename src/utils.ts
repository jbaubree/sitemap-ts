import { isAbsolute, resolve } from 'path'
import { ensurePrefix } from '@antfu/utils'

import type { ResolvedOptions } from './types'

export function getResolvedPath(file: string, resolvedOptions: ResolvedOptions) {
  if (isAbsolute(resolvedOptions.outDir))
    return resolve(`${resolvedOptions.outDir}/${file}`)
  return resolve(`${ensurePrefix('./', resolvedOptions.outDir)}/${file}`)
}
