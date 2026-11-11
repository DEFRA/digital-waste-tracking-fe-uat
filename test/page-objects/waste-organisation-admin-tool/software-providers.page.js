import { $, $$, browser } from '@wdio/globals'
import { Page } from '../page.js'
import { sortClientsByName } from '../../utils/software-provider-environment.js'

const COLUMN_INDEX = {
  'Client name': 0,
  'Client ID': 1,
  Environment: 2
}

class SoftwareProvidersPage extends Page {
  get heading() {
    return $('[data-testid="app-heading-title"]')
  }

  get pageBody() {
    return $('[data-testid="app-page-body"]')
  }

  get createCredentialsButton() {
    return $('[data-testid="create-credentials-button"]')
  }

  get resultsTable() {
    return $('[data-testid="client-credentials"]')
  }

  get tableCaption() {
    return $('[data-testid="client-credentials"] caption')
  }

  get emptyHeading() {
    return $('[data-testid="client-credentials-empty-heading"]')
  }

  get emptyMessage() {
    return $('[data-testid="client-credentials-empty"]')
  }

  get rowElements() {
    return $$('[data-testid="client-credentials"] tbody tr')
  }

  get headerElements() {
    return $$('[data-testid="client-credentials"] th')
  }

  open(baseUrl) {
    return browser.url(`${baseUrl}/software-providers`)
  }

  async verifyPageIsDisplayed(baseUrl) {
    await this.waitForPageToLoad()
    await this.verifyPageTitle()
    await expect(browser).toHaveUrl(`${baseUrl}/software-providers`)
    await expect(this.heading).toHaveText('Software providers')
    await expect(this.pageBody).toHaveText(
      expect.stringContaining(
        'Manage the client credentials that software providers use to connect to the Digital Waste Tracking service.'
      )
    )
    await expect($$('h1')).toBeElementsArrayOfSize(1)
  }

  async verifyCreateCredentialsButton() {
    await expect(this.createCredentialsButton).toBeDisplayed()
    await expect(this.createCredentialsButton).toHaveText(
      'Create new credentials'
    )
    await expect(this.createCredentialsButton).toHaveHref(
      expect.stringContaining('/software-providers/create')
    )
    await expect(this.createCredentialsButton).toHaveElementClass(
      'govuk-button--secondary'
    )
  }

  async clickCreateCredentials() {
    await this.click(this.createCredentialsButton)
  }

  async header(columnName) {
    const headers = await this.headerElements
    const index = COLUMN_INDEX[columnName]
    if (index === undefined) {
      throw new Error(`Unknown client credentials column "${columnName}"`)
    }
    return headers[index]
  }

  async verifyTableHeaders() {
    const headers = await this.headerElements
    await expect(headers).toBeElementsArrayOfSize(3)
    await expect((await headers[0].getText()).trim()).toBe('Client name')
    await expect((await headers[1].getText()).trim()).toBe('Client ID')
    await expect((await headers[2].getText()).trim()).toBe('Environment')
    for (const header of headers) {
      await expect(header).toHaveAttribute('scope', 'col')
    }
  }

  async ariaSort(columnName) {
    const header = await this.header(columnName)
    const onHeader = await header.getAttribute('aria-sort')
    if (onHeader) {
      return onHeader
    }
    return header.$('button').getAttribute('aria-sort')
  }

  async verifyInitialSortState() {
    await expect(await this.ariaSort('Client name')).toBe('ascending')
    await expect(await this.ariaSort('Client ID')).toBe('none')
    await expect(await this.ariaSort('Environment')).toBe('none')
  }

  async sortBy(columnName) {
    const header = await this.header(columnName)
    const button = header.$('button')
    await button.waitForClickable()
    await button.click()
  }

  async readDisplayedClients() {
    const rows = await this.rowElements
    const displayed = []

    for (const row of rows) {
      const columns = await row.$$('td')
      displayed.push({
        clientName: (await columns[0].getText()).trim(),
        clientId: (await columns[1].getText()).trim(),
        environment: (await columns[2].getText()).trim()
      })
    }

    return displayed
  }

  async verifyEmptyState() {
    await expect(this.emptyHeading).toBeDisplayed()
    await expect(this.emptyHeading).toHaveText('Client credentials')
    await expect(this.emptyMessage).toBeDisplayed()
    await expect(this.emptyMessage).toHaveText(
      'New client credentials will be shown here.'
    )
    await expect(this.resultsTable).not.toBeExisting()
  }

  async verifyClientsAreDisplayed(expectedClients, environmentLabel) {
    if (expectedClients.length === 0) {
      await this.verifyEmptyState()
      return
    }

    await expect(this.resultsTable).toBeDisplayed()
    await expect(this.tableCaption).toHaveText(
      expect.stringMatching(
        /^Client credentials\s*\(column headers with buttons are sortable\)\.$/
      )
    )
    await this.verifyTableHeaders()
    await this.verifyInitialSortState()

    const displayed = await this.readDisplayedClients()
    const sorted = sortClientsByName(expectedClients)
    await expect(this.rowElements).toBeElementsArrayOfSize(sorted.length)

    for (let index = 0; index < sorted.length; index++) {
      expect(displayed[index].clientId).toBe(sorted[index].clientId)
      expect(displayed[index].clientName).toBe(sorted[index].clientName ?? '')
      expect(displayed[index].environment).toBe(environmentLabel)
    }
  }

  async verifyColumnSort(columnName, direction) {
    await expect(await this.ariaSort(columnName)).toBe(direction)
    if (columnName === 'Environment') {
      return
    }

    const displayed = await this.readDisplayedClients()
    if (displayed.length < 2) {
      return
    }

    const values = displayed.map((row) =>
      columnName === 'Client name' ? row.clientName : row.clientId
    )
    const sorted = [...values].sort((a, b) => a.localeCompare(b, 'en-GB'))
    const expected = direction === 'descending' ? sorted.reverse() : sorted
    expect(values).toEqual(expected)
  }

  async verifyClientIsListed(clientName, clientId) {
    const displayed = await this.readDisplayedClients()
    const match = displayed.find((row) => row.clientId === clientId)
    expect(match).toBeDefined()
    expect(match.clientName).toBe(clientName)
  }
}

export default new SoftwareProvidersPage()
