import { $, $$, browser } from '@wdio/globals'
import { Page } from '../page.js'
import { adminUiPageTitle } from '../../utils/software-provider-environment.js'

const entraOrigin = 'https://login.microsoftonline.com'

/**
 * Signing in to the admin tool with Entra ID.
 * Locally, floci-az signs the user in without a form.
 * On CDP the browser is sent to login.microsoftonline.com.
 */
class AdminToolLoginPage extends Page {
  get emailInput() {
    // The password page keeps a hidden name=loginfmt, and that copy has no id.
    return $('input#i0116[name="loginfmt"]')
  }

  get passwordInput() {
    // The username page keeps #i0118 in the DOM with aria-hidden="true".
    return $('input#i0118[name="passwd"]:not([aria-hidden="true"])')
  }

  get passwordHeading() {
    return $('div[role="heading"]=Enter password')
  }

  get nextButton() {
    return $('input#idSIButton9[value="Next"]')
  }

  get signInButton() {
    return $('input#idSIButton9[value="Sign in"]')
  }

  get staySignedInNoButton() {
    // The password page Back control is button#idBtn_Back, so it does not match.
    return $('input#idBtn_Back[value="No"]')
  }

  get continueToSignInButton() {
    return $('[data-testid="continue-to-sign-in-button"]')
  }

  open(baseUrl) {
    return browser.url(baseUrl)
  }

  /**
   * Selects "Continue to sign in" on the admin tool's own sign in page
   * (DWTSPI-532), if it's on it, and waits to leave it.
   * @param {string} baseUrl
   * @returns {Promise<boolean>} Whether it was on the sign in page
   */
  async continueToSignInIfAsked(baseUrl) {
    if (!this.#isOnSignInPage(await browser.getUrl(), baseUrl)) return false

    await this.click(this.continueToSignInButton)
    await browser.waitUntil(
      async () => !this.#isOnSignInPage(await browser.getUrl(), baseUrl),
      { timeoutMsg: 'Continue to sign in did not leave the sign in page' }
    )
    return true
  }

  /**
   * @returns {Promise<boolean>}
   */
  async isOnEntra() {
    const url = await browser.getUrl()
    return url.startsWith(entraOrigin)
  }

  /**
   * @param {string} baseUrl
   * @returns {Promise<boolean>}
   */
  async hasSettled(baseUrl) {
    const url = await browser.getUrl()
    if (url.startsWith(entraOrigin)) return true
    if (this.#isOnSignInPage(url, baseUrl)) return true
    return this.#isOnAdminApp(url, baseUrl)
  }

  /**
   * @param {string} baseUrl
   */
  async waitUntilSettled(baseUrl) {
    await browser.waitUntil(() => this.hasSettled(baseUrl), {
      timeoutMsg: 'Admin tool did not sign in or open Entra ID'
    })
  }

  /**
   * @param {string} username
   * @param {string} password
   * @param {string} baseUrl
   */
  async signInWithEntra(username, password, baseUrl) {
    await this.emailInput.waitForDisplayed()
    await this.emailInput.setValue(username)
    await this.click(this.nextButton)
    await this.#waitUntil(
      () => this.passwordHeading.isDisplayed(),
      'Entra ID did not open the password page'
    )

    await this.passwordInput.waitForDisplayed()
    await this.passwordInput.click()
    await this.passwordInput.setValue(password)
    await this.click(this.signInButton)
    await this.#waitUntilBackOnAdmin(baseUrl)
  }

  /**
   * @param {string} baseUrl
   * @param {string} environment
   */
  async verifySignInPage(baseUrl, environment) {
    await browser.waitUntil(
      async () => this.#isOnSignInPage(await browser.getUrl(), baseUrl),
      { timeoutMsg: 'Admin tool did not open the sign in page' }
    )
    await this.waitForPageToLoad()
    await this.verifyPageTitle(
      null,
      'en',
      adminUiPageTitle('Sign in', environment)
    )
    await expect($('[data-testid="app-heading-title"]')).toHaveText(
      'Sign in to DWT admin portal'
    )
    await expect($('main p.govuk-body')).toHaveText(
      'DWT admin portal allows you to:'
    )
    await this.#verifyPurposeList()
    await expect(this.continueToSignInButton).toHaveText('Continue to sign in')
    await expect($('.govuk-service-navigation')).not.toBeExisting()
  }

  /**
   * @param {string} baseUrl
   * @param {string} environment
   */
  async verifyUserIsSignedIn(baseUrl, environment) {
    const home = baseUrl.replace(/\/$/, '')
    await browser.waitUntil(
      async () => (await browser.getUrl()).replace(/\/$/, '') === home,
      {
        timeoutMsg: `User was not signed in and sent to ${home}`
      }
    )
    await this.waitForPageToLoad()
    await this.verifyPageTitle(
      null,
      'en',
      adminUiPageTitle('Home', environment)
    )
    await expect($('[data-testid="app-heading-title"]')).toHaveText(
      'DWT admin portal'
    )
    await expect($('[data-testid="app-page-body"] > p')).toHaveText(
      'This site allows the Digital waste tracking service team to:'
    )
    await this.#verifyPurposeList()
    await expect(
      $('.govuk-service-navigation__link=DWT admin portal')
    ).toBeDisplayed()
    await expect(
      $('.govuk-service-navigation__link=Software providers')
    ).toBeDisplayed()
    await expect(
      $('.govuk-service-navigation__link=Waste organisations')
    ).toBeDisplayed()
  }

  /**
   * The two things the portal is for, in the order shown.
   */
  async #verifyPurposeList() {
    const items = await $$('main ul.govuk-list--bullet li')
    await expect(items).toBeElementsArrayOfSize(2)
    await expect(items[0]).toHaveText('manage software provider credentials')
    await expect(items[1]).toHaveText('search waste organisations')
  }

  /**
   * @param {string} url
   * @param {string} baseUrl
   * @returns {boolean}
   */
  #isOnAdminApp(url, baseUrl) {
    let parsed
    let admin
    try {
      parsed = new URL(url)
      admin = new URL(baseUrl)
    } catch {
      return false
    }
    if (parsed.origin !== admin.origin) return false
    if (['/login', '/auth', '/sign-in'].includes(parsed.pathname)) {
      return false
    }
    return true
  }

  /**
   * @param {string} url
   * @param {string} baseUrl
   * @returns {boolean}
   */
  #isOnSignInPage(url, baseUrl) {
    try {
      const parsed = new URL(url)
      return (
        parsed.origin === new URL(baseUrl).origin &&
        parsed.pathname === '/sign-in'
      )
    } catch {
      return false
    }
  }

  /**
   * Waits for condition. A visible Entra error fails the step with that text.
   * @param {() => Promise<boolean>} condition
   * @param {string} timeoutMsg
   */
  async #waitUntil(condition, timeoutMsg) {
    let entraError = ''

    await browser.waitUntil(
      async () => {
        entraError = await this.#entraErrorText()
        if (entraError) return true
        return condition()
      },
      { timeoutMsg }
    )

    if (entraError) {
      throw new Error(`Entra ID rejected the sign-in: ${entraError}`)
    }
  }

  /**
   * @returns {Promise<string>}
   */
  async #entraErrorText() {
    const selectors = ['#usernameError', '#passwordError']

    for (const selector of selectors) {
      const error = $(selector)
      if (!(await error.isExisting())) continue
      if (!(await error.isDisplayed())) continue
      const text = (await error.getText()).trim()
      if (text) return text
    }

    return ''
  }

  /**
   * Leaves Entra, clicking No if it asks to stay signed in.
   * @param {string} baseUrl
   */
  async #waitUntilBackOnAdmin(baseUrl) {
    let declinedStaySignedIn = false

    await this.#waitUntil(async () => {
      const url = await browser.getUrl()
      if (this.#isOnAdminApp(url, baseUrl)) return true
      if (declinedStaySignedIn || !url.startsWith(entraOrigin)) return false

      const noButton = this.staySignedInNoButton
      if (!(await noButton.isExisting())) return false
      if (!(await noButton.isDisplayed())) return false

      declinedStaySignedIn = true
      await noButton.click()
      return false
    }, `User was not signed in and sent back to ${baseUrl}`)
  }
}

export default new AdminToolLoginPage()
