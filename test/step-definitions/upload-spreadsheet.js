import { When, Then, Given } from '@wdio/cucumber-framework'
import AllureReporter from '@wdio/allure-reporter'
import UploadSpreadsheetPage from '../page-objects/upload-spreadsheet.page.js'
import UploadSuccessfulPage from '../page-objects/upload-successful.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import NextActionPage from '../page-objects/next-action.page.js'
import {
  downloadAndParseSpreadsheet,
  extractDataFromWorkbook
} from '../utils/spreadsheet-parser.js'

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
  /^user selects copy of a( valid|) spreadsheet file "([^"]*)" to upload$/,
  async function (flag,spreadsheetFile) {
    this.pageName = 'upload-spreadsheet-page'
    await UploadSpreadsheetPage.verifyUserIsOnUploadSpreadsheetPage()
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
    // skip this step for non-chromium browsers
    if (
      !this.deviceInfo.includes('Samsung Galaxy') &&
      (this.browserInfo.includes('chrome') ||
        this.browserInfo.includes('MicrosoftEdge'))
    ) {
      this.uploadedFileName =
        await UploadSpreadsheetPage.uploadSpreadsheet(spreadsheetFile)
    } else {
      AllureReporter.addStep(
        `⚠️ Skipped due to test limitation: file upload is not supported for non-Chromium browser (${this.browserInfo}) — browser.uploadFile() is Chromium-only`,
        {},
        'skipped'
      )
    }
  }
)

When(
  /^user selects copy of a (valid |)spreadsheet file "([^"]*)" to update existing waste movements$/,
  async function (flag,spreadsheetFile) {
    this.pageName = 'update-spreadsheet-page'
    await UploadSpreadsheetPage.verifyUserIsOnUploadSpreadsheetPage('update')
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
    if (
      !this.deviceInfo.includes('Samsung Galaxy') &&
      (this.browserInfo.includes('chrome') ||
        this.browserInfo.includes('MicrosoftEdge'))
    ) {
      this.uploadedFileName = await UploadSpreadsheetPage.uploadSpreadsheet(
        spreadsheetFile,
        'update'
      )
    } else {
      AllureReporter.addStep(
        `⚠️ Skipped due to test limitation: file upload is not supported for non-Chromium browser (${this.browserInfo}) — browser.uploadFile() is Chromium-only`,
        {},
        'skipped'
      )
    }
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
  }
)

const WTID_STEP_TIMEOUT_MS = 180000
const WTID_STEP_MARGIN_MS = 10000
const PROCESSED_URL_POLL_TIMEOUT_MS = 60000

Then(
  'the processed spreadsheet should contain valid WTIDs',
  { timeout: WTID_STEP_TIMEOUT_MS },
  async function () {
    const stepStart = Date.now()

    const processedFileUrl = await UploadSuccessfulPage.getProcessedFileUrl(
      this.apis.wasteOrganisationBackendAPI,
      this.organisationId,
      this.uploadedFileName,
      PROCESSED_URL_POLL_TIMEOUT_MS
    )

    const elapsed = Date.now() - stepStart
    const downloadTimeout = WTID_STEP_TIMEOUT_MS - elapsed - WTID_STEP_MARGIN_MS

    const workbook = await downloadAndParseSpreadsheet(
      processedFileUrl,
      this.env.HTTP_PROXY,
      downloadTimeout
    )
    const wtids = extractDataFromWorkbook(workbook)

    expect(wtids.length).toBeGreaterThan(0)
    for (const wtid of wtids) {
      expect(wtid).toMatch(/^[A-Z0-9]{8}$/)
    }
  }
)

Then('the processed spreadsheet should contain error details',  { timeout: WTID_STEP_TIMEOUT_MS }, async function () {
  const stepStart = Date.now()

  const processedFileUrl = await UploadSuccessfulPage.getProcessedFileUrl(
    this.apis.wasteOrganisationBackendAPI,
    this.organisationId,
    this.uploadedFileName,
    PROCESSED_URL_POLL_TIMEOUT_MS
  )
  
  const elapsed = Date.now() - stepStart
  const downloadTimeout = WTID_STEP_TIMEOUT_MS - elapsed - WTID_STEP_MARGIN_MS

  const workbook = await downloadAndParseSpreadsheet(
    processedFileUrl,
    this.env.HTTP_PROXY,
    downloadTimeout
  )
  
  const errors = extractDataFromWorkbook(workbook, 'errors')

  expect(errors.length).toBeGreaterThan(0)
  console.log("--------------------------------")
  console.log("errors", errors)
  console.log("--------------------------------")
  // for (const error of errors) {
  //   expect(error).toMatch(/^[A-Z0-9]{8}$/)
  // }
})

Then('no waste movements should be created', () => {
  //ToDo: 
})
