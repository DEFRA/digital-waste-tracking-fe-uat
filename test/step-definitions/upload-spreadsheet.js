import { When, Then } from '@wdio/cucumber-framework'
import UploadSpreadsheetPage from '../page-objects/upload-spreadsheet.page.js'
import UploadSuccessfulPage from '../page-objects/upload-successful.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

When(
  'user selects a valid spreadsheet file {string} to upload',
  async function (spreadsheetFile) {
    this.pageName = 'upload-spreadsheet-page'
    await UploadSpreadsheetPage.verifyUserIsOnUploadSpreadsheetPage()
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
    await UploadSpreadsheetPage.uploadSpreadsheet(spreadsheetFile)
  }
)

Then(
  'user should be redirected to "Upload successful" page',
  async function () {
    this.pageName = 'upload-successful-page'
    await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage()
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)

When(
  'user selects a valid spreadsheet file {string} to update existing waste movements',
  async function (spreadsheetFile) {
    this.pageName = 'update-spreadsheet-page'
    await UploadSpreadsheetPage.verifyUserIsOnUploadSpreadsheetPage('update')
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
    await UploadSpreadsheetPage.uploadSpreadsheet(spreadsheetFile, 'update')
  }
)

Then(
  'user should be redirected to "Spreadsheet update successful" page',
  async function () {
    this.pageName = 'spreadsheet-update-successful-page'
    await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage('update')
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)
