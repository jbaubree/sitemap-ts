import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

import { TEST_FILES } from './variables'

export function generateTestFiles() {
  TEST_FILES.forEach((testFile) => {
    const folder = dirname(testFile)
    if (!existsSync(folder))
      mkdirSync(folder)
    writeFileSync(testFile, '')
  })
}
