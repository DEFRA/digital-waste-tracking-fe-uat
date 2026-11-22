import { $, $$, browser } from '@wdio/globals'
import { Page } from '../page.js'
import {
  adminUiPageTitle,
  softwareProviderEnvironmentLabel
} from '../../utils/software-provider-environment.js'

class DeleteSoftwareProviderPage extends Page {
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
      adminUiPageTitle(
        'Are you sure you want to delete the software provider?',
        environment
      )
    )
    await expect(browser).toHaveUrl(
      `${baseUrl}/software-providers/${encodeURIComponent(clientId)}/delete`
    )
    await expect($$('h1')).toBeElementsArrayOfSize(1)
    await expect(this.heading).toHaveText(
      'Are you sure you want to delete the software provider?'
    )
    const environmentLabel = softwareProviderEnvironmentLabel(environment)
    await expect(this.cardText).toHaveText(
      `You will delete the entire record for ${clientName}, including all the credentials, in the ${environmentLabel.toLowerCase()} environment only.`
    )
    await expect($('[data-testid="security-team-email"]')).not.toBeExisting()
    await expect(this.confirmButton).toHaveText('Yes, delete software provider')
    await expect(this.backToSoftwareProvider).toHaveText(
      'Go back to software provider'
    )
    const href = await this.backToSoftwareProvider.getAttribute('href')
    expect(href).toContain(`/software-providers/${clientId}`)
    expect(href).not.toContain('/delete')
  }

  async clickConfirm() {
    await this.click(this.confirmButton)
  }

  async clickBack() {
    await this.click(this.backToSoftwareProvider)
  }
}

export default new DeleteSoftwareProviderPage()
