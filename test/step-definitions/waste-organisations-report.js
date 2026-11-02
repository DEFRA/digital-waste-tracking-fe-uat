import { Given, When, Then } from '@wdio/cucumber-framework'
import WasteOrganisationsReportPage from '../page-objects/waste-organisation-admin-tool/waste-organisations-report.page.js'
import AdminToolLoginPage from '../page-objects/waste-organisation-admin-tool/login.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import {
  DATE_RANGE_FIXTURES,
  FRONTEND_VALIDATION_FIXTURES,
  buildExpectedCsvFilenameRegex,
  formatRegisteredDateForDisplay,
  formatSearchDateForDisplay,
  mapExpectedCsvRows,
  parseIsoDateToFormFields,
  sortOrganisationsForReport
} from '../data/expected-organisations-by-date-range.js'
import {
  assertWasteOrganisationsCsvMatches,
  parseWasteOrganisationsCsv
} from '../utils/csv-parser.js'
import { getAdminUiCredentials } from '../utils/admin-tool-credentials.js'

const WASTE_ORGANISATIONS_REPORT_PATH = '/reporting/waste-organisations'

function getDateRangeFixture(fixtureKey) {
  const fixture = DATE_RANGE_FIXTURES[fixtureKey]
  if (!fixture) {
    throw new Error(`Unknown date range fixture: ${fixtureKey}`)
  }
  return fixture
}

function getFrontendValidationFixture(fixtureKey) {
  const fixture = FRONTEND_VALIDATION_FIXTURES[fixtureKey]
  if (!fixture) {
    throw new Error(`Unknown frontend validation fixture: ${fixtureKey}`)
  }
  return fixture
}

function mapExpectedRows(expectedOrganisations) {
  return sortOrganisationsForReport(expectedOrganisations).map((org) => ({
    organisationId: org.organisationId,
    registered: formatRegisteredDateForDisplay(org.dateRegistered),
    activeApiCodeCount: org.activeApiCodeCount
  }))
}

Given(
  'the user navigates to the waste organisations report page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const baseUrl = this.testConfig.adminUiBaseUrl
    const { username, password } = getAdminUiCredentials(this)

    await WasteOrganisationsReportPage.open(baseUrl)
    await AdminToolLoginPage.verifyLoginPageIsDisplayed(
      baseUrl,
      WASTE_ORGANISATIONS_REPORT_PATH
    )
    this.testMemory.pageName = 'waste-organisations-report-page'
    await AdminToolLoginPage.login(username, password)
    await WasteOrganisationsReportPage.verifyPageIsDisplayed(baseUrl)
  }
)

When(
  'the user searches for organisations in the {string} date range',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = getDateRangeFixture(fixtureKey)
    this.testMemory.dateRangeFixtureKey = fixtureKey

    await WasteOrganisationsReportPage.enterFromDate(
      parseIsoDateToFormFields(fixture.startDate)
    )
    await WasteOrganisationsReportPage.enterToDate(
      parseIsoDateToFormFields(fixture.endDate)
    )
    await WasteOrganisationsReportPage.clickShowOrganisations()
  }
)

When(
  'the user enters invalid dates for {string}',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = getFrontendValidationFixture(fixtureKey)
    this.testMemory.frontendValidationFixtureKey = fixtureKey

    await WasteOrganisationsReportPage.enterFromDate(fixture.fromDate)
    await WasteOrganisationsReportPage.enterToDate(fixture.toDate)
    await WasteOrganisationsReportPage.clickShowOrganisations()
  }
)

When(
  'the user downloads the waste organisations report CSV for the {string} date range',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = getDateRangeFixture(fixtureKey)
    this.testMemory.downloadedCsv =
      await WasteOrganisationsReportPage.downloadCsvReport({
        startDate: fixture.startDate,
        endDate: fixture.endDate
      })
  }
)

Then(
  'the waste organisations report search form should be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await WasteOrganisationsReportPage.verifySearchFormIsDisplayed()
  }
)

Then(
  'the waste organisations report results should match the {string} fixture',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = getDateRangeFixture(fixtureKey)
    const expectedRows = mapExpectedRows(fixture.expectedOrganisations)
    const expectedTimeframe =
      `Waste organisations registered from ${formatSearchDateForDisplay(fixture.startDate)} ` +
      `to ${formatSearchDateForDisplay(fixture.endDate)}`

    await WasteOrganisationsReportPage.verifySearchTimeframe(expectedTimeframe)
    await WasteOrganisationsReportPage.verifyResultsCount(expectedRows.length)
    await WasteOrganisationsReportPage.verifyTableRows(expectedRows)
    await WasteOrganisationsReportPage.verifyResultsActionsAreDisplayed()
  }
)

Then(
  'no waste organisations should be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await WasteOrganisationsReportPage.verifyNoResultsDisplayed()
  }
)

Then(
  'the download CSV button should not be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await WasteOrganisationsReportPage.verifyDownloadCsvButtonIsNotDisplayed()
  }
)

Then(
  'the downloaded CSV filename should match the {string} fixture',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = getDateRangeFixture(fixtureKey)
    const filenamePattern = buildExpectedCsvFilenameRegex(
      fixture.startDate,
      fixture.endDate
    )

    expect(this.testMemory.downloadedCsv).toBeDefined()
    expect(this.testMemory.downloadedCsv.fileName).toMatch(filenamePattern)
  }
)

Then(
  'the downloaded CSV contents should match the {string} fixture',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = getDateRangeFixture(fixtureKey)
    const expectedRows = mapExpectedCsvRows(fixture.expectedOrganisations)
    const actualRows = parseWasteOrganisationsCsv(
      this.testMemory.downloadedCsv.content
    )

    assertWasteOrganisationsCsvMatches(actualRows, expectedRows)
  }
)

Then(
  'a date validation error should be displayed for {string}',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = getFrontendValidationFixture(fixtureKey)
    await WasteOrganisationsReportPage.verifyValidationErrors(
      fixture.expectedErrors
    )
  }
)

Then(
  'the waste organisations report page should generate accessibility tests',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
  }
)
