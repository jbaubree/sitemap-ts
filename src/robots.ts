import { ensurePrefix } from '@antfu/utils'

import type { RobotOption } from './types'
import { removeMaybeSuffix } from './utils'

enum RobotCorrespondences {
  userAgent = 'User-agent',
  allow = 'Allow',
  disallow = 'Disallow',
  crawlDelay = 'Crawl-delay',
  cleanParam = 'Clean-param',
}

type ValueOf<T> = T[keyof T]
type Value = string | number

interface RobotRuleInterface {
  key: ValueOf<RobotCorrespondences>
  value: Value
}

export function getRules(options: RobotOption[]) {
  const rules: RobotRuleInterface[] = []

  options.forEach((rule) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const keys: Array<keyof RobotOption> = Object.keys(RobotCorrespondences).filter((key: keyof RobotOption) => typeof (rule[key]) !== 'undefined')
    keys.forEach((key) => {
      const values = Array.isArray(rule[key]) ? rule[key] as Value[] : [rule[key]] as Value[]
      values.forEach((value) => {
        rules.push({
          key: RobotCorrespondences[key],
          value,
        })
      })
    })
  })

  return rules
}

export function getContent(rules: RobotRuleInterface[], hostname: string, externalSitemaps: string[]) {
  return rules.map(rule => `${rule.key}: ${String(rule.value).trim()}`).join('\n')
    .concat(`\n\nSitemap: ${getFinalSitemapPath(hostname)}`)
    .concat(externalSitemaps.map(s => `\nSitemap: ${
        s.startsWith('http') ? s : getFinalSitemapPath(hostname, s)
      }`).join(''))
}

export function getFinalSitemapPath(hostname: string, file = '/sitemap.xml') {
  return `${removeMaybeSuffix('/', hostname)}${ensurePrefix('/', file)}`
}
