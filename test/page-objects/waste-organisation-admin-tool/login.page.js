import { $, browser } from '@wdio/globals'
import { Page } from '../page.js'
import { config } from '../../../wdio.conf.js'

class AdminToolLoginPage extends Page {
  get heading() {
    return $('[data-testid="app-heading-title"]')
  }

  get usernameInput() {
    return $('#username')
  }

  get passwordInput() {
    return $('#password')
  }

  get showPasswordButton() {
    return $('button.govuk-password-input__toggle')
  }

  get signInButton() {
    return $('[data-testid="sign-in-button"]')
  }

  get errorSummary() {
    return $('[data-testid="error-summary"]')
  }

  get usernameInlineError() {
    return $('#username-error')
  }

  get passwordInlineError() {
    return $('#password-error')
  }

  open(baseUrl) {
    return browser.url(baseUrl)
  }

  async verifyLoginPageIsDisplayed(baseUrl, redirectPath) {
    await this.waitForPageToLoad()
    await expect(browser).toHaveUrl(expect.stringContaining(`${baseUrl}/login`))
    if (redirectPath) {
      await expect(browser).toHaveUrl(
        expect.stringContaining(
          `redirectTo=${encodeURIComponent(redirectPath)}`
        )
      )
    }
    await this.verifyPageTitle('User Login | DWT Admin Portal')
    await expect(this.heading).toHaveText('User Login')
    await expect(this.usernameInput).toBeDisplayed()
    await expect(this.passwordInput).toBeDisplayed()
    await expect(this.signInButton).toHaveText('Sign in')
  }

  async enterUsername(username) {
    await this.usernameInput.waitForDisplayed({
      timeout: config.waitforTimeout
    })
    await this.usernameInput.clearValue()
    await this.usernameInput.setValue(username)
  }

  async enterPassword(password) {
    await this.passwordInput.waitForDisplayed({
      timeout: config.waitforTimeout
    })
    await this.passwordInput.clearValue()
    await this.passwordInput.setValue(password)
  }

  async clickSignIn() {
    await this.click(this.signInButton)
  }

  async login(username, password) {
    await this.enterUsername(username)
    await this.enterPassword(password)
    await this.clickSignIn()
  }

  async clickPasswordVisibilityToggle() {
    await this.click(this.showPasswordButton)
  }

  async verifyPasswordIsHidden(expectedPassword) {
    await expect(this.passwordInput).toHaveAttribute('type', 'password')
    await expect(this.passwordInput).toHaveValue(expectedPassword)
    await expect(this.showPasswordButton).toHaveText('Show')
    await expect(this.showPasswordButton).toHaveAttribute(
      'aria-label',
      'Show password'
    )
  }

  async verifyPasswordIsVisible(expectedPassword) {
    await expect(this.passwordInput).toHaveAttribute('type', 'text')
    await expect(this.passwordInput).toHaveValue(expectedPassword)
    await expect(this.showPasswordButton).toHaveText('Hide')
    await expect(this.showPasswordButton).toHaveAttribute(
      'aria-label',
      'Hide password'
    )
  }

  async verifyUserIsLoggedIn(baseUrl) {
    await browser.waitUntil(
      async () => {
        const currentUrl = await browser.getUrl()
        return !currentUrl.includes('/login')
      },
      {
        timeout: config.waitforTimeout,
        timeoutMsg: 'User was not redirected away from the login page'
      }
    )

    await this.waitForPageToLoad()

    const currentUrl = (await browser.getUrl()).replace(/\/$/, '')
    const expectedUrl = baseUrl.replace(/\/$/, '')
    expect(currentUrl).toBe(expectedUrl)
    await expect(browser).not.toHaveTitle('User Login | DWT Admin Portal')
  }

  async verifyStillOnLoginPage(baseUrl) {
    await this.waitForPageToLoad()
    await expect(browser).toHaveUrl(expect.stringContaining(`${baseUrl}/login`))
    await expect(this.heading).toHaveText('User Login')
  }

  async verifyLoginErrors({
    expectedSummaryErrors,
    expectInlineErrors = false,
    expectedInlineError
  }) {
    await this.errorSummary.waitForDisplayed({ timeout: config.waitforTimeout })
    await expect(this.errorSummary).toHaveText(
      expect.stringContaining('There is a problem')
    )

    for (const message of expectedSummaryErrors) {
      await expect(this.errorSummary).toHaveText(
        expect.stringContaining(message)
      )
    }

    if (expectInlineErrors) {
      await expect(this.usernameInlineError).toBeDisplayed()
      await expect(this.usernameInlineError).toHaveText(
        expect.stringContaining(expectedInlineError)
      )
      await expect(this.passwordInlineError).toBeDisplayed()
      await expect(this.passwordInlineError).toHaveText(
        expect.stringContaining(expectedInlineError)
      )
      return
    }

    await expect(this.usernameInlineError).not.toBeExisting()
    await expect(this.passwordInlineError).not.toBeExisting()
  }
}

export default new AdminToolLoginPage()
