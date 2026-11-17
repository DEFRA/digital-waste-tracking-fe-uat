import { $, browser } from '@wdio/globals'
import { Page } from '../page.js'

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

  async login(username, password) {
    await this.usernameInput.setValue(username)
    await this.passwordInput.setValue(password)
    await this.click(this.signInButton)
  }

  async verifyUserIsSignedIn(baseUrl) {
    await browser.waitUntil(
      async () => (await browser.getUrl()).startsWith(baseUrl),
      {
        timeoutMsg: 'User was not sent back to the admin tool after signing in'
      }
    )
    await this.waitForPageToLoad()

    const currentUrl = (await browser.getUrl()).replace(/\/$/, '')
    expect(currentUrl).toBe(baseUrl.replace(/\/$/, ''))
  }
}

export default new AdminToolLoginPage()
