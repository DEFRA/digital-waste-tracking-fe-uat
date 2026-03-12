import { When, Then, Given } from '@wdio/cucumber-framework'
import UploadSpreadsheetPage from '../page-objects/upload-spreadsheet.page.js'
import UploadSuccessfulPage from '../page-objects/upload-successful.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import NextActionPage from '../page-objects/next-action.page.js'

const spreadsheetActions = {
  upload: {
    action: 'uploadSpreadsheet',
    file: 'Test1-spreadsheet.xlsx',
    mode: undefined
  },
  update: {
    action: 'updateSpreadsheet',
    file: 'Test1-update-spreadsheet.xlsx',
    mode: 'update'
  }
}

async function processSpreadsheetForBusiness(context, type) {
  const { action, file, mode } = spreadsheetActions[type]
  await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
  await MyAccountHomePage.navigateToReportReceiptOfWasteOptionsPage()
  await NextActionPage.selectNextAction(action)
  await UploadSpreadsheetPage.verifyUserIsOnUploadSpreadsheetPage(mode)
  context.uploadedFileName = await UploadSpreadsheetPage.uploadSpreadsheet(
    file,
    mode
  )
  context.organisationId =
    await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage(mode)
}

Given(
  /^the user successfully (uploads a waste movement spreadsheet|updates existing waste movements using a spreadsheet) for the selected business$/,
  async function (action) {
    await processSpreadsheetForBusiness(
      this,
      action.startsWith('uploads') ? 'upload' : 'update'
    )
  }
)

Then(
  /^the user should be able to successfully (upload a waste movement spreadsheet|update existing waste movements using a spreadsheet) for that business$/,
  async function (action) {
    await processSpreadsheetForBusiness(
      this,
      action.startsWith('upload ') ? 'upload' : 'update'
    )
  }
)

When(
  'user selects copy of a valid spreadsheet file {string} to upload',
  async function (spreadsheetFile) {
    this.pageName = 'upload-spreadsheet-page'
    await UploadSpreadsheetPage.verifyUserIsOnUploadSpreadsheetPage()
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
    this.uploadedFileName =
      await UploadSpreadsheetPage.uploadSpreadsheet(spreadsheetFile)
  }
)

When(
  'user selects copy of a valid spreadsheet file {string} to update existing waste movements',
  async function (spreadsheetFile) {
    this.pageName = 'update-spreadsheet-page'
    await UploadSpreadsheetPage.verifyUserIsOnUploadSpreadsheetPage('update')
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
    this.uploadedFileName = await UploadSpreadsheetPage.uploadSpreadsheet(
      spreadsheetFile,
      'update'
    )
  }
)

Then(
  'user should be redirected to "Spreadsheet update successful" page',
  async function () {
    this.pageName = 'spreadsheet-update-successful-page'
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
    this.organisationId =
      await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage('update')
  }
)

Then(
  /^all the waste movements should be successfully (created|updated)$/,
  async function (action) {
    await UploadSuccessfulPage.verifyFileHasBeenUploadedSuccessfullyToTheS3(
      this.apis.wasteOrganisationBackendAPI,
      this.organisationId,
      this.uploadedFileName,
      action
    )
    // ToDo:to be picked up after https://eaflood.atlassian.net/browse/DWT-1304
    // ToDo:get the list of waste records from waste-movement-backend service by using above bulkId/uploadId
  }
)
