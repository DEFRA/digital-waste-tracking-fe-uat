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
import { EXPECTED_ERRORS } from '../data/expected-errors.js'
import { EXPECTED_WASTE_MOVEMENT_RECORDS } from '../data/expected-waste-movement-records.js'
import AsyncUploadProcessHandler from '../utils/AsyncProcessHandler.js'

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
  context.organisationId = (
    await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage(mode)
  ).organisationId
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
  async function (flag, spreadsheetFile) {
    this.spreadsheetFileName = spreadsheetFile
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
  async function (flag, spreadsheetFile) {
    this.spreadsheetFileName = spreadsheetFile
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
        'update',
        this.wtids && this.wtids.length > 0 ? [this.wtids[0].value] : []
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

Then('the file is successfully accepted for processing', async function () {
  this.uploadId =
    await UploadSuccessfulPage.verifyFileHasBeenUploadedSuccessfullyToTheS3(
      this.apis.wasteOrganisationBackendAPI,
      this.organisationId,
      this.uploadedFileName
    )
})

Then(
  /^all the waste movements should be successfully (created|updated)$/,
  async function (action) {
    const wasteMovementRecords =
      await AsyncUploadProcessHandler.waitForWasteMovementRecords(
        this.apis.wasteMovementBackendAPI,
        this.uploadId
      )

    // assert the records are created/updated correctly
    expect(wasteMovementRecords.length).toBeGreaterThan(0)
    for (const record of wasteMovementRecords) {
      const exp =
        EXPECTED_WASTE_MOVEMENT_RECORDS[
          record.receipt.movement.yourUniqueReference
        ]
      expect(record.wasteTrackingId).not.toBeNull()
      expect(record.submittingOrganisation.defraCustomerOrganisationId).toBe(
        this.organisationId
      )
      expect(record.createdAt).not.toBeNull()
      expect(record.lastUpdatedAt).not.toBeNull()
      expect(record.traceId).not.toBeNull()
      expect(record.bulkId).not.toBeNull()
      expect(record.revision).toBe(1)
      expect(record.receipt.movement.receiver).toStrictEqual(exp.receiver)
      expect(record.receipt.movement.receipt).toStrictEqual(exp.receipt)
      // expect(record.receipt.movement.dateTimeReceived).toStrictEqual(exp.dateTimeReceived)
      expect(record.receipt.movement.reasonForNoConsignmentCode).toStrictEqual(
        exp.reasonForNoConsignmentCode
      )
      expect(record.receipt.movement.specialHandlingRequirements).toStrictEqual(
        exp.specialHandlingRequirements
      )
      expect(record.receipt.movement.carrier).toStrictEqual(exp.carrier)
      expect(record.receipt.movement.brokerOrDealer).toStrictEqual(
        exp.brokerOrDealer
      )
      expect(record.receipt.movement.wasteItems).toStrictEqual(exp.wasteItems)
      expect(
        record.receipt.movement.hazardousWasteConsignmentCode
      ).toStrictEqual(exp.hazardousWasteConsignmentCode)
    }
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
    const wtids = extractDataFromWorkbook(workbook).wtids

    expect(wtids.length).toBeGreaterThan(0)
    for (const wtid of wtids) {
      expect(wtid.value).toMatch(/^[A-Z0-9]{8}$/)
    }
    this.wtids = wtids
  }
)

Then(
  'the processed spreadsheet should contain error details',
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

    const errorsData = extractDataFromWorkbook(workbook, 'errors')
    const { errorsWasteMovementLevel, errorsWasteItemLevel } = {
      errorsWasteMovementLevel: errorsData.errors_waste_movement_level,
      errorsWasteItemLevel: errorsData.errors_waste_item_level
    }

    const expectedErrors = EXPECTED_ERRORS[this.spreadsheetFileName]

    if (expectedErrors) {
      const actualMovementErrors = errorsWasteMovementLevel.filter(
        (e) => typeof e.value === 'string'
      )
      const actualItemErrors = errorsWasteItemLevel.filter(
        (e) => typeof e.value === 'string'
      )

      expect(actualMovementErrors).toEqual(
        expect.arrayContaining(
          expectedErrors.errorsWasteMovementLevel.map((e) =>
            expect.objectContaining({ row: e.row, value: e.value })
          )
        )
      )
      expect(actualMovementErrors).toHaveLength(
        expectedErrors.errorsWasteMovementLevel.length
      )

      expect(actualItemErrors).toEqual(
        expect.arrayContaining(
          expectedErrors.errorsWasteItemLevel.map((e) =>
            expect.objectContaining({ row: e.row, value: e.value })
          )
        )
      )
      expect(actualItemErrors).toHaveLength(
        expectedErrors.errorsWasteItemLevel.length
      )
    } else {
      const actualMovementErrors = errorsWasteMovementLevel.filter(
        (e) => typeof e.value === 'string'
      )
      const actualItemErrors = errorsWasteItemLevel.filter(
        (e) => typeof e.value === 'string'
      )
      const totalErrors = actualMovementErrors.length + actualItemErrors.length
      expect(totalErrors).toBe(
        0,
        `Expected no errors but found ${totalErrors}: ${JSON.stringify([...actualMovementErrors, ...actualItemErrors])}`
      )
    }
  }
)

Then('no waste movements should be created', async function () {
  const response = await AsyncUploadProcessHandler.waitForWasteMovementRecords(
    this.apis.wasteMovementBackendAPI,
    this.uploadId
  )
  expect(response.statusCode).toBe(404)
  expect(response.message).toBe(
    `Waste inputs with values {"bulkId":"${this.uploadId}"} not found`
  )
})

Then('the spreadsheet must be rejected', { timeout: 30000 }, async function () {
  const { uploadId, errorMessage: actualErrorMessage } =
    await UploadSuccessfulPage.verifyFileHasBeenRejectedAndNotUploadedToS3(
      this.apis.wasteOrganisationBackendAPI,
      this.organisationId,
      this.uploadedFileName
    )
  this.uploadId = uploadId
  if (this.uploadedFileName.includes('File-size-greater-than-2MB')) {
    expect(actualErrorMessage).toBe(
      'The selected file must be smaller than 2 MB'
    )
  } else {
    expect(actualErrorMessage).toBe('The selected file must be a XLSX')
  }
})
