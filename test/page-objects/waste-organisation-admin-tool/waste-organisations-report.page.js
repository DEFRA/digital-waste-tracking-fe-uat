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
    await expect(this.registrationDateGroup).toHaveText(
      expect.stringContaining('From date')
    )
    await expect(this.registrationDateGroup).toHaveText(
      expect.stringContaining('For example, 1 4 2025')
    )
    await expect(this.registrationDateGroup).toHaveText(
      expect.stringContaining('To date')
    )
    await expect(this.registrationDateGroup).toHaveText(
      expect.stringContaining('For example, 31 3 2026')
    )
    await expect(this.searchButton).toHaveText('Search')
    await expect(this.clearLink).toHaveText('Clear')
    await expect(this.clearLink).toHaveAttribute('aria-label', 'Clear search')
  }

  async clickClear() {
    await this.click(this.clearLink)
  }

  async verifyNoResultsSectionDisplayed() {
    await expect(this.searchTimeframe).not.toBeExisting()
    await expect(this.resultsCount).not.toBeExisting()
    await expect(this.resultsTable).not.toBeExisting()
    await expect(this.noResultsMessage).not.toBeExisting()
    await expect(this.downloadCsvLink).not.toBeExisting()
    await expect(this.fromDayInput).toHaveValue('')
    await expect(this.fromMonthInput).toHaveValue('')
    await expect(this.fromYearInput).toHaveValue('')
    await expect(this.toDayInput).toHaveValue('')
    await expect(this.toMonthInput).toHaveValue('')
    await expect(this.toYearInput).toHaveValue('')
  }

  async verifySearchTimeframe(expectedText) {
    await expect(this.searchTimeframe).toHaveText(expectedText)
  }

  async verifyResultsCount(expectedCount) {
    // Matches the whole number, so 1 doesn't also match 13
    await expect(this.resultsCount).toHaveText(
      new RegExp(`Organisations registered in period: ${expectedCount}\\b`)
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
    // Only the expected errors, so an extra one fails
    await expect($$('.govuk-error-summary__list li')).toBeElementsArrayOfSize(
      expectedErrors.length
    )

    for (const { message, errorField } of expectedErrors) {
      await expect(this.errorSummary).toHaveText(
        expect.stringContaining(message)
      )
      const inlineError = this.getInlineErrorForField(errorField)
      await expect(inlineError).toBeDisplayed()
      await expect(inlineError).toHaveText(expect.stringContaining(message))
    }

    // Exactly the wrong parts of each date are outlined, and none of a date
    // without an error
    for (const dateField of ['date-from', 'date-to']) {
      const error = expectedErrors.find(
        ({ errorField }) => errorField === dateField
      )
      if (!error) {
        await expect(this.getInlineErrorForField(dateField)).not.toBeExisting()
      }
      for (const part of ['day', 'month', 'year']) {
        const input = $(`[data-testid="${dateField}-${part}"]`)
        if (error?.parts.includes(part)) {
          await expect(input).toHaveElementClass('govuk-input--error')
        } else {
          await expect(input).not.toHaveElementClass('govuk-input--error')
        }
      }
    }
  }
}

export default new WasteOrganisationsReportPage()
