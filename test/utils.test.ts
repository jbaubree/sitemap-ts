import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'
import { ensurePrefix } from '@antfu/utils'

import { getResolvedPath } from '../src/utils'
import { resolveOptions } from '../src/options'

describe('Utils', () => {
  test('Get resolved path', async () => {
    const opt = resolveOptions({})
    const optAbsolute = resolveOptions({ outDir: resolve('.') })
    const file = 'test.txt'

    expect(getResolvedPath(file, opt))
      .toEqual(resolve(`${ensurePrefix('./', opt.outDir)}/${file}`))

    expect(getResolvedPath(file, optAbsolute))
      .toEqual(resolve(`${optAbsolute.outDir}/${file}`))
  })
})
