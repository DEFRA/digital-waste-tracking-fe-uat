import logger from '@wdio/logger'
import { ZapApi } from '../utils/apis/zap-api.js'
import {
  ZAP_ALERTS_SUMMARY_PATH,
  ZAP_HTML_REPORT_PATH,
  ZAP_JSON_REPORT_PATH
} from '../utils/zap-report-paths.js'
import { writeTextToFile } from '../utils/write-text-file.js'
const log = logger('zap-reports')

/**
 * Opens a ZAP session and registers exclude regexes when the mode is zap.
 * @param {import('./test-env.js').TestEnv} testEnv
 * @param {import('./test-config.js').TestConfig} testConfig
 */
export async function openZapSession(testEnv, testConfig) {
  if (testEnv.proxyMode !== 'zap') return

  const zap = new ZapApi(testEnv.httpProxy, null, testEnv.zapApiKey)
  try {
    const sessionResponse = await zap.newSession()
    if (
      sessionResponse.statusCode !== 200 ||
      sessionResponse.json?.Result !== 'OK'
    ) {
      throw new Error(
        `ZAP newSession failed with status ${sessionResponse.statusCode} and result ${sessionResponse.json?.Result}`
      )
    }

    const excludeRegexes = testConfig.zapProxyExcludeRegexes
    const registered = await zap.excludeUrlsFromProxy(excludeRegexes)
    log.info(
      `ZAP proxy excludes applied (${excludeRegexes.length}). Registered: ${registered.join(', ')}`
    )
  } finally {
    await zap.close()
  }
}

/**
 * Writes zap-report/ from the current ZAP session when the mode is zap.
 * @param {import('./test-env.js').TestEnv} testEnv
 */
export async function publishZapReports(testEnv) {
  if (testEnv.proxyMode !== 'zap') return

  const zap = new ZapApi(testEnv.httpProxy, null, testEnv.zapApiKey)
  try {
    const jsonReport = await zap.jsonReport()
    await writeTextToFile(ZAP_JSON_REPORT_PATH, jsonReport.body)
    const htmlReport = await zap.htmlReport()
    await writeTextToFile(ZAP_HTML_REPORT_PATH, htmlReport.body)
    const alertsSummary = await zap.alertsSummary()
    await writeTextToFile(
      ZAP_ALERTS_SUMMARY_PATH,
      JSON.stringify(alertsSummary.json, null, 2)
    )
  } finally {
    await zap.close()
  }
}
