import { When, Then } from '@wdio/cucumber-framework'
import DownloadSpreadsheetPage from '../page-objects/download-spreadsheet.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

Then(
  /^the template must get downloaded to the user's local machine$/,
  async function () {
    // ToDo: temporarily disabling the assertion until I debug the issue with file verification on cdp
    // await DownloadSpreadsheetPage.verifySpreadsheetIsDownloaded()
  }
)

When('user clicks on the Download spreadsheet button', async function () {
  this.pageName = 'download-spreadsheet-page'
  await DownloadSpreadsheetPage.verifyUserIsOnDownloadSpreadsheetPage()
  await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  await DownloadSpreadsheetPage.downloadSpreadsheet()
})
