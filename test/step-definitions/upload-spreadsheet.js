import { When, Then } from '@wdio/cucumber-framework'
import UploadSpreadsheetPage from '../page-objects/upload-spreadsheet.page.js'
import UploadSuccessfulPage from '../page-objects/upload-successful.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

When(
  'user selects a valid spreadsheet file {string} to upload',
  async function (spreadsheetFile) {
    this.pageName = 'upload-spreadsheet-page'
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
    await UploadSpreadsheetPage.verifyUserIsOnUploadSpreadsheetPage()
    await UploadSpreadsheetPage.uploadSpreadsheet(spreadsheetFile)
  }
)

Then('user should be redirected to {string} page', async function (s) {
  this.pageName = 'upload-successful-page'
  await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage()
})
