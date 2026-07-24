import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { $, $$, browser } from '@wdio/globals'
import { Page } from '../page.js'
import { config } from '../../../wdio.conf.js'
import {
  buildExpectedCsvFilenameRegex,
  formatSearchDateAsYymmdd
} from '../../data/expected-organisations-by-date-range.js'

class WasteOrganisationsReportPage extends Page {
  get heading() {
    return $('[data-testid="app-heading-title"]')
  }

  get pageBody() {
    return $('[data-testid="app-page-body"]')
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

  get showOrganisationsButton() {
    return $('button[type="submit"]')
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

  get downloadCsvButton() {
    return $('[data-testid="download-csv-button"]')
  }

  get errorSummary() {
    return $('.govuk-error-summary')
  }

  getInlineErrorForField(errorField) {
    return $(`[data-testid="${errorField}"] .govuk-error-message`)
  }

  get rowElements() {
    return $$('[data-testid="waste-organisations-list"] tbody tr')
  }

  open(baseUrl) {
    return browser.url(`${baseUrl}/reporting/waste-organisations`)
  }

  async verifyPageIsDisplayed(baseUrl) {
    await this.waitForPageToLoad()
    await this.verifyPageTitle('Waste Organisations Report | DWT Admin Portal')
    await expect(browser).toHaveUrl(`${baseUrl}/reporting/waste-organisations`)
    await expect(this.heading).toHaveText('Waste Organisations')
    await expect(this.pageBody).toHaveText(
      expect.stringContaining(
        'Search waste organisations by DefraID registration date.'
      )
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

  async clickShowOrganisations() {
    await this.click(this.showOrganisationsButton)
  }

  async verifySearchFormIsDisplayed() {
    await expect(this.fromDayInput).toBeDisplayed()
    await expect(this.fromMonthInput).toBeDisplayed()
    await expect(this.fromYearInput).toBeDisplayed()
    await expect(this.toDayInput).toBeDisplayed()
    await expect(this.toMonthInput).toBeDisplayed()
    await expect(this.toYearInput).toBeDisplayed()
    await expect(this.showOrganisationsButton).toHaveText('Show organisations')
  }

  async verifySearchTimeframe(expectedText) {
    await expect(this.searchTimeframe).toHaveText(expectedText)
  }

  async verifyResultsCount(expectedCount) {
    await expect(this.resultsCount).toHaveText(
      `Organisations registered (in period): ${expectedCount}`
    )
  }

  async verifyTableHeaders() {
    const headers = await $$('[data-testid="waste-organisations-list"] th')
    await expect(headers).toBeElementsArrayOfSize(3)
    await expect(await headers[0].getText()).toBe('Organisation ID')
    await expect(await headers[1].getText()).toBe('Registered')
    await expect(await headers[2].getText()).toBe('Active API Codes')
  }

  async verifyTableRows(expectedRows) {
    await expect(this.resultsTable).toBeDisplayed()
    await this.verifyTableHeaders()
    const rows = await this.rowElements
    await expect(rows).toBeElementsArrayOfSize(expectedRows.length)

    for (let i = 0; i < expectedRows.length; i++) {
      const columns = await rows[i].$$('td')
      await expect(columns).toBeElementsArrayOfSize(3)
      await expect(await columns[0].getText()).toBe(
        expectedRows[i].organisationId
      )
      await expect(await columns[1].getText()).toBe(expectedRows[i].registered)
      await expect(await columns[2].getText()).toBe(
        String(expectedRows[i].activeApiCodeCount)
      )
    }
  }

  async verifyResultsActionsAreDisplayed() {
    await expect(this.downloadCsvButton).toBeDisplayed()
    await expect(this.downloadCsvButton).toHaveText('Download CSV')
  }

  async verifyDownloadCsvButtonIsNotDisplayed() {
    await expect(this.downloadCsvButton).not.toBeExisting()
  }

  isBrowserStackSession() {
    const capabilities = browser.capabilities ?? {}
    const requestedCapabilities = browser.options?.capabilities ?? {}
    return Boolean(
      capabilities['bstack:options'] ||
        requestedCapabilities['bstack:options'] ||
        capabilities.browserstack
    )
  }

  supportsSeleniumFileDownloads() {
    if (this.isBrowserStackSession()) return false
    return typeof browser.deleteDownloadableFiles === 'function'
  }

  parseContentDispositionFilename(contentDisposition) {
    if (!contentDisposition) return undefined

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
    if (utf8Match) return decodeURIComponent(utf8Match[1])

    const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i)
    if (quotedMatch) return quotedMatch[1]

    const plainMatch = contentDisposition.match(/filename=([^;]+)/i)
    return plainMatch?.[1]?.trim()
  }

  buildFallbackCsvFilename(startDate, endDate) {
    const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 12)
    const start = formatSearchDateAsYymmdd(startDate)
    const end = formatSearchDateAsYymmdd(endDate)
    return `${stamp}-orgs-${start}-${end}.csv`
  }

  async downloadCsvViaBrowserFetch({ startDate, endDate, filenamePattern }) {
    await expect(this.downloadCsvButton).toBeDisplayed()

    const result = await browser.execute(async () => {
      const link = document.querySelector('[data-testid="download-csv-button"]')
      if (!link) {
        throw new Error('Download CSV button not found')
      }

      const url = link.href
      if (!url.includes('download=csv')) {
        throw new Error(
          `Download CSV href does not include download=csv: ${url}`
        )
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`CSV download failed: HTTP ${response.status}`)
      }

      const content = await response.text()
      const contentDisposition = response.headers.get('content-disposition')

      return { content, contentDisposition }
    })

    const fileNameFromHeader = this.parseContentDispositionFilename(
      result.contentDisposition
    )
    const fileName =
      fileNameFromHeader && filenamePattern.test(fileNameFromHeader)
        ? fileNameFromHeader
        : this.buildFallbackCsvFilename(startDate, endDate)

    return { fileName, content: result.content }
  }

  async downloadCsvViaSelenium(filenamePattern) {
    await browser.deleteDownloadableFiles()
    await this.click(this.downloadCsvButton)

    let fileName
    await browser.waitUntil(
      async () => {
        const { names } = await browser.getDownloadableFiles()
        fileName = names.find((name) => filenamePattern.test(name))
        return fileName !== undefined
      },
      {
        timeout: 15000,
        timeoutMsg: `CSV file matching ${filenamePattern} did not appear in downloadable files in time`
      }
    )

    const targetDir = path.join(os.tmpdir(), 'waste-organisations-csv')
    fs.mkdirSync(targetDir, { recursive: true })
    await browser.downloadFile(fileName, targetDir)

    const filePath = path.join(targetDir, fileName)
    const content = fs.readFileSync(filePath, 'utf8')

    return { fileName, content }
  }

  async downloadCsvReport({ startDate, endDate }) {
    const filenamePattern = buildExpectedCsvFilenameRegex(startDate, endDate)

    if (this.supportsSeleniumFileDownloads()) {
      return this.downloadCsvViaSelenium(filenamePattern)
    }

    return this.downloadCsvViaBrowserFetch({
      startDate,
      endDate,
      filenamePattern
    })
  }

  async verifyNoResultsDisplayed() {
    await this.resultsCount.waitForDisplayed({ timeout: config.waitforTimeout })
    await expect(this.resultsCount).toHaveText(
      'Organisations registered (in period): 0'
    )

    if (await this.resultsTable.isExisting()) {
      const rows = await this.rowElements
      expect(rows).toHaveLength(0)
    }
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
