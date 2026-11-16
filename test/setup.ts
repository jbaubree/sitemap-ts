import { existsSync, rmSync } from 'node:fs'
import { afterEach, beforeEach } from 'vitest'

import { ROBOTS_FILE, SITEMAP_FILE, SUBPATH_FOLDER, TEST_FILES } from './variables'

function removeFiles() {
  if (existsSync(SITEMAP_FILE))
    rmSync(SITEMAP_FILE)
  if (existsSync(ROBOTS_FILE))
    rmSync(ROBOTS_FILE)
  for (let i = 1; i <= 10; i++) {
    const chunk = `dist/sitemap-${i}.xml`
    if (existsSync(chunk))
      rmSync(chunk)
  }
  TEST_FILES.forEach((testFile) => {
    if (existsSync(testFile))
      rmSync(testFile)
  })
  if (existsSync(SUBPATH_FOLDER))
    rmSync(SUBPATH_FOLDER, { recursive: true, force: true })
}

beforeEach(() => {
  removeFiles()
})
afterEach(() => {
  removeFiles()
})
