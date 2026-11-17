import { When, Then } from '@wdio/cucumber-framework'
import DownloadSpreadsheetPage from '../page-objects/download-spreadsheet.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

Then(
  /^the template must get downloaded to the user's local machine$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await DownloadSpreadsheetPage.verifySpreadsheetIsDownloaded()
  }
)

When(
  'user clicks on the Download spreadsheet button',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.pageName = 'download-spreadsheet-page'
    await DownloadSpreadsheetPage.verifyUserIsOnDownloadSpreadsheetPage()
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
    await DownloadSpreadsheetPage.downloadSpreadsheet()
  }
)
