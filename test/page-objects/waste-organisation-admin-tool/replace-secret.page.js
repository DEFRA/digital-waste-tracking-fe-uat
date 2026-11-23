import { $, $$, browser } from '@wdio/globals'
import { Page } from '../page.js'
import { adminUiPageTitle } from '../../utils/software-provider-environment.js'
class ReplaceSecretPage extends Page {
  get heading() {
    return $('[data-testid="app-heading-title"]')
  }

  get cardText() {
    return $('[data-testid="interruption-card-text"]')
  }

  get confirmButton() {
    return $('[data-testid="confirm-button"]')
  }

  get backToSoftwareProvider() {
    return $('[data-testid="interruption-card"] [data-testid="back-link"]')
  }

  async verifyPageIsDisplayed(baseUrl, clientId, clientName, environment) {
    await this.waitForPageToLoad()
    await this.verifyPageTitle(
      null,
      'en',
      adminUiPageTitle('Replace the client secret', environment)
    )
    await expect(browser).toHaveUrl(
      `${baseUrl}/software-providers/${encodeURIComponent(clientId)}/replace`
    )
    await expect($$('h1')).toBeElementsArrayOfSize(1)
    await expect(this.heading).toHaveText(
      'Are you sure you want to replace the current secret?'
    )
    await expect(this.cardText).toHaveText(
      expect.stringContaining(
        `The current secret for ${clientName} will stop working immediately. Make sure the software provider knows before you continue.`
      )
    )
    await expect(this.confirmButton).toHaveText('Yes, replace secret')
    await this.#verifyBackLink(clientId)
  }

  async clickConfirm() {
    await this.click(this.confirmButton)
  }

  async clickBack() {
    await this.click(this.backToSoftwareProvider)
  }

  async #verifyBackLink(clientId) {
    await expect(this.backToSoftwareProvider).toHaveText(
      'Go back to software provider'
    )
    const href = await this.backToSoftwareProvider.getAttribute('href')
    expect(href).toContain(`/software-providers/${clientId}`)
    expect(href).not.toContain('/replace')
  }
}

export default new ReplaceSecretPage()
