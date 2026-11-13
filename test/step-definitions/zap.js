import { When, Then } from '@wdio/cucumber-framework'
import {
  ZAP_JSON_REPORT_PATH,
  ZAP_HTML_REPORT_PATH,
  ZAP_ALERTS_SUMMARY_PATH
} from '../utils/zap-report-paths.js'
import { readZapReport, writeTextToFile } from '../utils/write-text-file.js'
import { ApiFactory } from '../utils/apis/api-factory.js'

Then(
  'assert that there are no High risk issues in the zap security report',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const alertsSummaryRaw = await readZapReport(
      ZAP_ALERTS_SUMMARY_PATH,
      'ZAP alerts summary',
      'application/json'
    )
    const alertsSummaryParsed = JSON.parse(alertsSummaryRaw).alertsSummary
    expect(alertsSummaryParsed.High).toBe(0)
  }
)

When(
  'a zap security report is available',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const apis = ApiFactory.create(this.testEnv, this.testConfig)
    if (apis.zapAPI) {
      const jsonReport = await apis.zapAPI.jsonReport()
      await writeTextToFile(ZAP_JSON_REPORT_PATH, jsonReport.body)
      const htmlReport = await apis.zapAPI.htmlReport()
      await writeTextToFile(ZAP_HTML_REPORT_PATH, htmlReport.body)
      const alertsSummary = await apis.zapAPI.alertsSummary()
      await writeTextToFile(
        ZAP_ALERTS_SUMMARY_PATH,
        JSON.stringify(alertsSummary.json, null, 2)
      )
    }
    await apis.close()

    await readZapReport(
      ZAP_JSON_REPORT_PATH,
      'ZAP JSON report',
      'application/json'
    )
    await readZapReport(ZAP_HTML_REPORT_PATH, 'ZAP HTML report', 'text/html')
  }
)
