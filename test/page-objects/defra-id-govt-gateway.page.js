import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'
import { $ } from '@wdio/globals'
import logger from '@wdio/logger'

const log = logger('defra-id-govt-gateway-page')
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

  async setBaseUrl(url) {
    this.baseUrl = url
  }

  async verifyUserIsOnGovernmentGatewayLoginPage() {
    await expect(browser).toHaveUrl(this.baseUrl)
    await this.govGatewayLoginPageheading.waitForDisplayed({
      timeout: config.waitforTimeout
    })

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
    log.info('Attempting to login with Government Gateway user ID: ', userId)

    await this.waitForPageToLoad()

    // Wait for form to be displayed
    await this.form.waitForDisplayed({
      timeout: config.waitforTimeout
    })

    // Verify fields exist and are ready
    await this.govGatewayUserIdInput.waitForExist({
      timeout: config.waitforTimeout
    })
    await this.govGatewayPasswordInput.waitForExist({
      timeout: config.waitforTimeout
    })

    await this.enterText(this.govGatewayUserIdInput, userId)
    await this.enterText(this.govGatewayPasswordInput, password)

    // Wait for continue button to be clickable
    await this.clickJavascriptByPass(this.govGatewayContinueButton)
  }
}

export default new DefraIdGovtGatewayPage()
