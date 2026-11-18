import { $, browser } from '@wdio/globals'
import { Page } from '../page.js'
import { adminUiPageTitle } from '../../utils/software-provider-environment.js'

/**
 * Signing in to the admin tool, with Entra ID. Locally, floci-az stands in for
 * Entra ID and signs its dev user in without a form, so opening a page signs
 * the user in and lands on it. Until DWTSPI-531, the admin tool has a login
 * form instead (see signInIfAsked)
 */
class AdminToolLoginPage extends Page {
  get usernameInput() {
    return $('#username')
  }

  get passwordInput() {
    return $('#password')
  }

  get signInButton() {
    return $('[data-testid="sign-in-button"]')
  }

  open(baseUrl) {
    return browser.url(baseUrl)
  }

  isAskingForPassword() {
    return this.passwordInput.isExisting()
  }

  async verifyPageIsDisplayed(environment) {
    await this.waitForPageToLoad()
    await this.verifyPageTitle(
      null,
      'en',
      adminUiPageTitle('User login', environment)
    )
    await expect(this.usernameInput).toBeDisplayed()
    await expect(this.passwordInput).toBeDisplayed()
  }

  async login(username, password) {
    await this.usernameInput.setValue(username)
    await this.passwordInput.setValue(password)
    await this.click(this.signInButton)
  }

  async verifyUserIsSignedIn(baseUrl) {
    const home = baseUrl.replace(/\/$/, '')
    await browser.waitUntil(
      async () => (await browser.getUrl()).replace(/\/$/, '') === home,
      {
        timeoutMsg: `User was not signed in and sent to ${home}`
      }
    )
    await this.waitForPageToLoad()
  }
}

export default new AdminToolLoginPage()
