import { $, $$, browser } from '@wdio/globals'
import { Page } from '../page.js'
import {
  adminUiPageTitle,
  softwareProviderEnvironmentLabel
} from '../../utils/software-provider-environment.js'

const GENERATED_ON =
  /^(\d{1,2}) ([A-Za-z]+) (\d{4}) at (\d{1,2}):(\d{2})(am|pm)$/

const HEADER_TAG_CLASS = {
  Local: 'govuk-tag--red',
  'External test': 'govuk-tag--teal',
  Production: 'govuk-tag--purple'
}

/**
 * @param {string} text
 * @returns {Date}
 */
function generatedOnDate(text) {
  const match = GENERATED_ON.exec(text)
  if (!match) {
    throw new Error(`Unexpected generated on date "${text}"`)
  }
  const [, day, month, year, hour, minute, meridiem] = match
  let hours = Number(hour) % 12
  if (meridiem === 'pm') hours += 12
  return new Date(
    `${month} ${day}, ${year} ${String(hours).padStart(2, '0')}:${minute}:00`
  )
}

class SoftwareProviderPage extends Page {
  get heading() {
    return $('[data-testid="app-heading-title"]')
  }

  get caption() {
    return $('main .govuk-caption-l')
  }

  get backToSoftwareProviders() {
    return $('a.govuk-back-link[data-testid="back-link"]')
  }

  get clientIdValue() {
    return $('main .govuk-summary-list__value')
  }

  get secretsHeading() {
    return $('main h2.govuk-heading-m')
  }

  get secretTable() {
    return $('main table')
  }

  get environmentTag() {
    return $('.defra-header__environment .govuk-tag')
  }

  get addAnotherSecretButton() {
    return $('[data-testid="add-another-secret"]')
  }

  get replaceSecretLink() {
    return $('main table a[href$="/replace"]')
  }

  get removeSecretLink() {
    return $('main table a[href$="/remove"]')
  }

  get deleteSoftwareProviderLink() {
    return $('[data-testid="delete-software-provider"]')
  }

  get removedSecretAlert() {
    return $('[data-testid="removed-secret-alert"]')
  }

  get newSecretTag() {
    return $('main table .govuk-tag--green')
  }

  async verifyPageIsDisplayed(baseUrl, clientId, clientName, environment) {
    await this.waitForPageToLoad()
    // Titled with the client's name, so it isn't in HEADINGS
    await this.verifyPageTitle(
      null,
      'en',
      adminUiPageTitle(clientName, environment)
    )
    await expect(browser).toHaveUrl(
      `${baseUrl}/software-providers/${encodeURIComponent(clientId)}`
    )
    await expect(this.heading).toHaveText(clientName)
  }

  async verifyOneSecret(baseUrl, clientId, clientName, environment) {
    await this.#verifyClientDetails(baseUrl, clientId, clientName, environment)
    const secrets = await this.#readSecrets()
    expect(secrets).toHaveLength(1)
    expect(secrets[0].secret).toBe('[Hidden]')
    await expect(this.replaceSecretLink).toBeDisplayed()
    await expect(this.replaceSecretLink).toHaveText(
      expect.stringContaining('Replace secret')
    )
    await expect(this.addAnotherSecretButton).toBeDisplayed()
    await expect(this.addAnotherSecretButton).toHaveText('Add another secret')
    await expect(this.addAnotherSecretButton).toHaveElementClass(
      'govuk-button--secondary'
    )
    await expect(this.removeSecretLink).not.toBeExisting()
  }

  /**
   * @returns {Promise<string>} The older secret's generated-on date
   */
  async verifyTwoSecrets(baseUrl, clientId, clientName, environment) {
    await this.#verifyClientDetails(baseUrl, clientId, clientName, environment)
    const secrets = await this.#readSecrets()
    expect(secrets).toHaveLength(2)
    expect(secrets[0].secret).toBe('[Hidden]')
    expect(secrets[1].secret).toBe('[Hidden]')
    const newest = generatedOnDate(secrets[0].generatedOn).getTime()
    const older = generatedOnDate(secrets[1].generatedOn).getTime()
    expect(newest).toBeGreaterThanOrEqual(older)
    await expect(secrets[0].row.$('a[href$="/replace"]')).not.toBeExisting()
    await expect(secrets[0].row.$('a[href$="/remove"]')).not.toBeExisting()
    await expect(secrets[1].row.$('a[href$="/remove"]')).toBeDisplayed()
    await expect(secrets[1].row.$('a[href$="/remove"]')).toHaveText(
      expect.stringContaining('Remove secret')
    )
    await expect(this.addAnotherSecretButton).not.toBeExisting()
    await expect(this.replaceSecretLink).not.toBeExisting()
    return secrets[1].generatedOn
  }

  async verifyNewestSecretIsTaggedNew() {
    const rows = await this.secretTable.$$('tbody tr')
    await expect(rows[0].$('.govuk-tag--green')).toHaveText('New')
    if (rows[1]) {
      await expect(rows[1].$('.govuk-tag--green')).not.toBeExisting()
    }
  }

  async verifyNewestSecretIsNotTaggedNew() {
    await this.waitForPageToLoad()
    await expect(this.newSecretTag).not.toBeExisting()
  }

  async verifySecretRemoved(clientName) {
    await expect(this.removedSecretAlert).toBeDisplayed()
    await expect(
      this.removedSecretAlert.$('[data-testid="alert-heading"]')
    ).toHaveText('Secret removed')
    await expect(
      this.removedSecretAlert.$('[data-testid="alert-text"]')
    ).toHaveText(`The oldest secret for ${clientName} has been removed.`)
  }

  async verifySecretRemovedIsGone() {
    await this.waitForPageToLoad()
    await expect(this.removedSecretAlert).not.toBeExisting()
  }

  async clickAddAnotherSecret() {
    await this.click(this.addAnotherSecretButton)
  }

  async clickReplaceSecret() {
    await this.click(this.replaceSecretLink)
  }

  async clickRemoveSecret() {
    await this.click(this.removeSecretLink)
  }

  async clickDeleteSoftwareProvider() {
    await this.click(this.deleteSoftwareProviderLink)
  }

  async #verifyClientDetails(baseUrl, clientId, clientName, environment) {
    await this.verifyPageIsDisplayed(baseUrl, clientId, clientName, environment)
    await expect($$('h1')).toBeElementsArrayOfSize(1)
    const label = softwareProviderEnvironmentLabel(environment)
    await expect(this.caption).toHaveText('Software provider')
    await expect(this.backToSoftwareProviders).toHaveText('Back')
    const backHref = await this.backToSoftwareProviders.getAttribute('href')
    expect(backHref.replace(/\/$/, '')).toMatch(/\/software-providers$/)
    await expect($('main .govuk-summary-list__key')).toHaveText('Client ID')
    await expect(this.clientIdValue).toHaveText(clientId)
    await expect(this.secretsHeading).toHaveText(
      `Client secrets for ${label.toLowerCase()} environment`
    )
    await this.#verifySecretTableHeaders()
    await expect(this.environmentTag).toHaveText(label)
    const colour = HEADER_TAG_CLASS[label]
    if (colour) {
      await expect(this.environmentTag).toHaveElementClass(colour)
    }
    await expect(this.deleteSoftwareProviderLink).toBeDisplayed()
    await expect(this.deleteSoftwareProviderLink).toHaveText(
      'Delete software provider'
    )
  }

  async #verifySecretTableHeaders() {
    const headers = await this.secretTable.$$('th')
    await expect(headers).toBeElementsArrayOfSize(3)
    await expect((await headers[0].getText()).trim()).toBe('Generated on')
    await expect((await headers[1].getText()).trim()).toBe('Client secret')
    await expect((await headers[2].getText()).trim()).toBe('Actions')
  }

  async #readSecrets() {
    const rows = await this.secretTable.$$('tbody tr')
    const secrets = []
    for (const row of rows) {
      const cells = await row.$$('td')
      const generatedOn = (await cells[0].getText())
        .replace(/\s+New\s*$/i, '')
        .replace(/\s+/g, ' ')
        .trim()
      expect(generatedOn).toMatch(GENERATED_ON)
      secrets.push({
        generatedOn,
        secret: (await cells[1].getText()).trim(),
        row
      })
    }
    return secrets
  }
}

export default new SoftwareProviderPage()
