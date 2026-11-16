import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getRoutesFromTypedRouter } from '../src/typed-router'

const fixturePath = join(__dirname, 'fixtures', 'typed-router.d.ts')

describe('getRoutesFromTypedRouter', () => {
  it('extracts static routes from a vue-router typed-router.d.ts', () => {
    expect(getRoutesFromTypedRouter(fixturePath)).toEqual([
      '/',
      '/about',
      '/contact',
    ])
  })

  it('keeps dynamic routes when includeDynamic is true', () => {
    expect(getRoutesFromTypedRouter(fixturePath, { includeDynamic: true })).toEqual([
      '/',
      '/about',
      '/contact',
      '/names/:name',
    ])
  })

  it('returns an empty list when RouteNamedMap is empty', () => {
    const tmp = join(__dirname, 'fixtures', 'empty-router.d.ts')
    writeFileSync(tmp, `declare module 'vue-router/auto-routes' {
  export interface RouteNamedMap {
  }
}
export {}
`)
    expect(getRoutesFromTypedRouter(tmp)).toEqual([])
  })

  it('returns an empty list when RouteNamedMap is absent', () => {
    const tmp = join(__dirname, 'fixtures', 'no-map-router.d.ts')
    writeFileSync(tmp, '// no route map here\nexport {}\n')
    expect(getRoutesFromTypedRouter(tmp)).toEqual([])
  })
})
