import path from 'node:path'
import os from 'node:os'
import { $, $$, browser } from '@wdio/globals'
import { Page } from '../page.js'
import { config } from '../../../wdio.conf.js'
import {
  buildExpectedCsvFilenameRegex,
  formatSearchDateAsYymmdd
} from '../../data/expected-organisations-by-date-range.js'
import {
  downloadLinkViaBrowserFetch,
  downloadViaSelenium,
  supportsSeleniumFileDownloads
} from '../../utils/browser-file-download.js'

class WasteOrganisationsReportPage extends Page {
  get heading() {
    return $('[data-testid="app-heading-title"]')
  }

  get registrationDateGroup() {
    return $('[data-testid="registration-date"]')
  }

  get fromDayInput() {
    return $('[data-testid="date-from-day"]')
  }

  get fromMonthInput() {
    return $('[data-testid="date-from-month"]')
  }

  get fromYearInput() {
    return $('[data-testid="date-from-year"]')
  }

  get toDayInput() {
    return $('[data-testid="date-to-day"]')
  }

  get toMonthInput() {
    return $('[data-testid="date-to-month"]')
  }

  get toYearInput() {
    return $('[data-testid="date-to-year"]')
  }

  get searchButton() {
    return $('[data-testid="search-button"]')
  }

  get clearLink() {
    return $('[data-testid="clear-link"]')
  }

  get searchTimeframe() {
    return $('[data-testid="search-timeframe"]')
  }

  get resultsCount() {
    return $('[data-testid="search-results-count"]')
  }

  get resultsTable() {
    return $('[data-testid="waste-organisations-list"]')
  }

  get downloadCsvLink() {
    return $('[data-testid="download-csv-link"]')
  }

  get noResultsMessage() {
    return $('[data-testid="no-results"]')
  }

  get errorSummary() {
    return $('.govuk-error-summary')
  }

  // The errors are shown for the whole group, one for each date
  getInlineErrorForField(errorField) {
    return $(`[data-testid="${errorField}-error"]`)
  }

  get rowElements() {
    return $$('[data-testid="waste-organisations-list"] tbody tr')
  }

  open(baseUrl) {
    return browser.url(`${baseUrl}/reporting/waste-organisations`)
  }

  async verifyPageIsDisplayed(baseUrl) {
    await this.waitForPageToLoad()
    await this.verifyPageTitle()
    await expect(browser).toHaveUrl(`${baseUrl}/reporting/waste-organisations`)
    await expect(this.heading).toHaveText('Waste organisations')
    await expect(this.registrationDateGroup).toHaveText(
      expect.stringContaining('Registration date')
    )
  }

  async setDateInput(element, value) {
    await element.waitForDisplayed({ timeout: config.waitforTimeout })
    await element.clearValue()
    await element.setValue(value)
  }

  async enterFromDate({ day, month, year }) {
    await this.setDateInput(this.fromDayInput, day)
    await this.setDateInput(this.fromMonthInput, month)
    await this.setDateInput(this.fromYearInput, year)
  }

  async enterToDate({ day, month, year }) {
    await this.setDateInput(this.toDayInput, day)
    await this.setDateInput(this.toMonthInput, month)
    await this.setDateInput(this.toYearInput, year)
  }

  async clickSearch() {
    await this.click(this.searchButton)
  }

  async verifySearchFormIsDisplayed() {
    await expect(this.fromDayInput).toBeDisplayed()
    await expect(this.fromMonthInput).toBeDisplayed()
    await expect(this.fromYearInput).toBeDisplayed()
    await expect(this.toDayInput).toBeDisplayed()
    await expect(this.toMonthInput).toBeDisplayed()
    await expect(this.toYearInput).toBeDisplayed()
    await expect(this.searchButton).toHaveText('Search')
    await expect(this.clearLink).toHaveText('Clear')
  }

  async verifySearchTimeframe(expectedText) {
    await expect(this.searchTimeframe).toHaveText(expectedText)
  }

  async verifyResultsCount(expectedCount) {
    await expect(this.resultsCount).toHaveText(
      expect.stringContaining(
        `Organisations registered in period: ${expectedCount}`
      )
    )
  }

  async verifyTableHeaders() {
    const headers = await $$(
      '[data-testid="waste-organisations-list"] thead th'
    )
    await expect(headers).toBeElementsArrayOfSize(4)
    await expect(await headers[0].getText()).toBe('Organisation name and ID')
    await expect(await headers[1].getText()).toBe('Local authority')
    await expect(await headers[2].getText()).toBe('Active API codes')
    await expect(await headers[3].getText()).toBe('Registered')
  }

  async verifyTableRows(expectedRows) {
    await expect(this.resultsTable).toBeDisplayed()
    await this.verifyTableHeaders()
    const rows = await this.rowElements
    await expect(rows).toBeElementsArrayOfSize(expectedRows.length)

    for (let i = 0; i < expectedRows.length; i++) {
      // The first cell, the name and ID, is a row header
      const columns = await rows[i].$$('th, td')
      await expect(columns).toBeElementsArrayOfSize(4)
      await expect(
        await rows[i].$('[data-testid="organisation-name"]').getText()
      ).toBe(expectedRows[i].name)
      await expect(
        await rows[i].$('[data-testid="organisation-id"]').getText()
      ).toBe(expectedRows[i].organisationId)
      await expect(await columns[1].getText()).toBe(
        expectedRows[i].localAuthority
      )
      await expect(await columns[2].getText()).toBe(
        String(expectedRows[i].activeApiCodeCount)
      )
      await expect(await columns[3].getText()).toBe(expectedRows[i].registered)
    }
  }

  async verifyResultsActionsAreDisplayed() {
    await expect(this.downloadCsvLink).toBeDisplayed()
    await expect(this.downloadCsvLink).toHaveText('download CSV')
  }

  async verifyDownloadCsvLinkIsNotDisplayed() {
    await expect(this.downloadCsvLink).not.toBeExisting()
  }

  buildFallbackCsvFilename(startDate, endDate) {
    const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 12)
    const start = formatSearchDateAsYymmdd(startDate)
    const end = formatSearchDateAsYymmdd(endDate)
    return `${stamp}-orgs-${start}-${end}.csv`
  }

  async downloadCsvReport({ startDate, endDate }) {
    const filenamePattern = buildExpectedCsvFilenameRegex(startDate, endDate)
    await expect(this.downloadCsvLink).toBeDisplayed()

    if (supportsSeleniumFileDownloads()) {
      return downloadViaSelenium({
        clickDownload: () => this.click(this.downloadCsvLink),
        filenamePattern,
        readContent: true,
        targetDir: path.join(os.tmpdir(), 'waste-organisations-csv')
      })
    }

    const result = await downloadLinkViaBrowserFetch({
      selector: '[data-testid="download-csv-link"]',
      responseType: 'text',
      hrefIncludes: 'download=csv'
    })

    const fileName =
      result.fileName && filenamePattern.test(result.fileName)
        ? result.fileName
        : this.buildFallbackCsvFilename(startDate, endDate)

    return { fileName, content: result.content }
  }

  async verifyNoResultsDisplayed() {
    await this.noResultsMessage.waitForDisplayed({
      timeout: config.waitforTimeout
    })
    await expect(this.noResultsMessage).toHaveText(
      'No organisations were registered in this period. Try a different date range, or select Clear.'
    )
    await expect(this.resultsTable).not.toBeExisting()
  }

  async verifyValidationErrors(expectedErrors) {
    await this.errorSummary.waitForDisplayed({ timeout: config.waitforTimeout })
    await expect(this.errorSummary).toHaveText(
      expect.stringContaining('There is a problem')
    )

    for (const { message, errorField } of expectedErrors) {
      await expect(this.errorSummary).toHaveText(
        expect.stringContaining(message)
      )
      const inlineError = this.getInlineErrorForField(errorField)
      await expect(inlineError).toBeDisplayed()
      await expect(inlineError).toHaveText(expect.stringContaining(message))
    }
  }
}

export default new WasteOrganisationsReportPage()
