import { resolve } from 'node:path'
import { ensurePrefix } from '@antfu/utils'
import { describe, expect, it } from 'vitest'

import { resolveOptions } from '../src/options'
import { getResolvedPath } from '../src/utils'

describe('utils', () => {
  it('get resolved path', async () => {
    const opt = resolveOptions({})
    const optAbsolute = resolveOptions({
      outDir: resolve('.'),
    })
    const file = 'test.txt'

    expect(getResolvedPath(file, opt))
      .toEqual(resolve(`${ensurePrefix('./', opt.outDir)}/${file}`))

    expect(getResolvedPath(file, optAbsolute))
      .toEqual(resolve(`${optAbsolute.outDir}/${file}`))
  })
})
