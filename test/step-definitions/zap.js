import { When, Then } from '@wdio/cucumber-framework'
import {
  ZAP_JSON_REPORT_PATH,
  ZAP_HTML_REPORT_PATH,
  ZAP_ALERTS_SUMMARY_PATH
} from '../utils/zap-report-paths.js'
import { readZapReport } from '../utils/write-text-file.js'

Then(
  'assert that there are no High risk issues in the zap security report',
  async function () {
    const alertsSummaryRaw = await readZapReport(
      ZAP_ALERTS_SUMMARY_PATH,
      'ZAP alerts summary',
      'application/json'
    )
    const alertsSummaryParsed = JSON.parse(alertsSummaryRaw).alertsSummary
    expect(alertsSummaryParsed.High).toBe(0)
  }
)

When('a zap security report is available', async function () {
  await readZapReport(
    ZAP_JSON_REPORT_PATH,
    'ZAP JSON report',
    'application/json'
  )
  await readZapReport(ZAP_HTML_REPORT_PATH, 'ZAP HTML report', 'text/html')
})
