import { $, browser } from '@wdio/globals'
import { Page } from '../page.js'

class SoftwareProviderPage extends Page {
  get heading() {
    return $('[data-testid="app-heading-title"]')
  }

  async verifyPageIsDisplayed(baseUrl, clientId, clientName) {
    await this.waitForPageToLoad()
    // Titled with the client's name, so it isn't in HEADINGS
    await expect(browser).toHaveTitle(`${clientName} - DWT admin portal`)
    await expect(browser).toHaveUrl(
      `${baseUrl}/software-providers/${encodeURIComponent(clientId)}`
    )
    await expect(this.heading).toHaveText(clientName)
  }
}

export default new SoftwareProviderPage()
