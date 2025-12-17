import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'
import { $ } from '@wdio/globals'

class DefraIdGovtGatewayPage extends Page {
  // Sign in using Government Gateway Page locators
  get govGatewayLoginPageheading() {
    return $('h1')
  }

  get form() {
    return $('#loginForm')
  }

  get govGatewayUserIdInput() {
    return $('#loginForm #user_id')
  }

  get govGatewayPasswordInput() {
    return $('#loginForm #password')
  }

  get govGatewayContinueButton() {
    return $('#loginForm #continue')
  }

  async verifyUserIsOnGovernmentGatewayLoginPage() {
    await expect(await this.getUrl()).toBe(
      'https://www.ete.access.service.gov.uk/login/signin/creds'
    )
    // Wait for heading to be displayed
    await expect(this.govGatewayLoginPageheading).toBeDisplayed()

    // Verify the heading text
    await expect(this.govGatewayLoginPageheading).toHaveText(
      'Sign in using Government Gateway'
    )
  }

  /**
   * Enter Government Gateway credentials and submit the login form
   * @param {string} userId - Government Gateway user ID
   * @param {string} password - Government Gateway password
   */
  async loginWithGovernmentGateway(userId, password) {
    await this.form.waitForDisplayed({
      timeout: config.waitforTimeout
    })

    await this.enterText(this.govGatewayUserIdInput, userId)
    await this.enterText(this.govGatewayPasswordInput, password)
    await this.click(this.govGatewayContinueButton)
  }
}

export default new DefraIdGovtGatewayPage()
