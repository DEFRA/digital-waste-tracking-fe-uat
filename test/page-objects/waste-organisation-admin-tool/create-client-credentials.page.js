import { $, $$, browser } from '@wdio/globals'
import { Page } from '../page.js'
import { config } from '../../../wdio.conf.js'

class CreateClientCredentialsPage extends Page {
  get caption() {
    return $('[data-testid="app-heading-caption"]')
  }

  get heading() {
    return $('[data-testid="app-heading-title"]')
  }

  get clientNameInput() {
    return $('#clientName')
  }

  get clientNameLabel() {
    return $('label[for="clientName"]')
  }

  get clientNameHint() {
    return $('#clientName-hint')
  }

  get clientNameError() {
    return $('#clientName-error')
  }

  get generateButton() {
    return $('[data-testid="generate-credentials-button"]')
  }

  get cancelLink() {
    return $('[data-testid="cancel-link"]')
  }

  get errorSummary() {
    return $('.govuk-error-summary')
  }

  open(baseUrl) {
    return browser.url(`${baseUrl}/software-providers/create`)
  }

  async verifyPageIsDisplayed(baseUrl, caption) {
    await this.waitForPageToLoad()
    await this.verifyPageTitle()
    await expect(browser).toHaveUrl(`${baseUrl}/software-providers/create`)
    await expect($$('h1')).toBeElementsArrayOfSize(1)
    await expect(await this.caption.getTagName()).toBe('span')
    await expect(this.caption).toHaveText(caption)
    await expect(this.heading).toHaveText(
      'What is the name of the software provider and package?'
    )
    await expect(this.clientNameLabel).toHaveText('Client name')
    await expect(this.clientNameHint).toHaveText(
      expect.stringContaining('Waste1-Tech.com_Software')
    )
    await expect(this.clientNameInput).toHaveAttribute('autocomplete', 'off')
    await expect(this.clientNameInput).toHaveAttribute('spellcheck', 'false')
    await expect(this.clientNameInput).toHaveElementClass(
      'govuk-!-width-two-thirds'
    )
    await expect(this.generateButton).toHaveText('Generate credentials')
    await expect(this.cancelLink).toHaveText('Cancel')
    await expect(this.cancelLink).toHaveHref(
      expect.stringContaining('/software-providers')
    )
  }

  async enterClientName(clientName) {
    await this.clientNameInput.waitForDisplayed({
      timeout: config.waitforTimeout
    })
    await this.clientNameInput.clearValue()
    await this.clientNameInput.setValue(clientName)
  }

  async clickGenerateCredentials() {
    await this.click(this.generateButton)
  }

  async clickCancel() {
    await this.click(this.cancelLink)
  }

  async verifyClientNameError(clientName, errorMessage) {
    await this.waitForPageToLoad()
    await expect(browser).toHaveTitle(expect.stringMatching(/^Error: /))
    await expect(this.errorSummary).toBeDisplayed()
    await expect(this.errorSummary).toHaveText(
      expect.stringContaining('There is a problem')
    )
    await expect(this.errorSummary).toHaveText(
      expect.stringContaining(errorMessage)
    )
    await expect(this.errorSummary.$(`a[href="#clientName"]`)).toBeDisplayed()
    await expect(this.clientNameError).toHaveText(
      expect.stringContaining(errorMessage)
    )
    await expect(this.clientNameInput).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('clientName-hint')
    )
    await expect(this.clientNameInput).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('clientName-error')
    )
    await expect(this.clientNameInput).toHaveValue(clientName)
    const summaryHasFocus = await browser.execute(
      () =>
        document.activeElement?.classList.contains('govuk-error-summary') ||
        document.activeElement?.closest('.govuk-error-summary') != null
    )
    expect(summaryHasFocus).toBe(true)
  }
}

export default new CreateClientCredentialsPage()
