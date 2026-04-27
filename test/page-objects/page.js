import { browser, $ } from '@wdio/globals'
import { config } from '../../wdio.conf.js'

class Page {

  get pageHeading() {
    return $('h1')
  }

  get reportReceiptOfWasteBanner() {
    return $('.govuk-service-navigation__link')
  }

  get betaBanner() {
    return $('.govuk-phase-banner')
  }

  get feedbackLink() {
    return $('.govuk-phase-banner .govuk-link')
  }

  get footer() {
    return $('footer')
  }

  get backLink() {
    return $('.govuk-back-link')
  }

  get signOutLink() {
    return $('a[href="/sign-out"]')
  }

  get errorMessage() {
    return $('.govuk-error-summary')
  }

  open(path) {
    return browser.url(path)
  }

  async click(element) {
    await element.waitForDisplayed({ timeout: config.waitforTimeout })
    return await element.click()
  }

  async clickJavascriptByPass(elementMatcher) {
    const element = await elementMatcher
    await element.waitForExist({
      timeout: config.waitforTimeout
    })
    await element.scrollIntoView()
    // Wait until element is clickable before attempting JavaScript click
    // Bail out gracefully for devices that do not support that method
    try {
      await element.waitForClickable({ timeout: config.waitforTimeout })
    } catch (error) {
      if (
        !error.message.includes(
          'The `waitForClickable` command is only available for desktop and mobile browsers.'
        )
      ) {
        throw error
      } else {
        await element.waitForDisplayed({ timeout: config.waitforTimeout })
      }
    }
    await browser.execute('arguments[0].click();', element)
  }

  /**
   * Click an element using JavaScript execution (bypasses visibility/interactability checks)
   * @param {string} elementId - The ID of the element to click
   * @param {string} elementName - Optional name for logging purposes
   * @returns {Promise<boolean>} - Returns true if click was successful
   */
  async clickUsingJavaScript(elementId, elementName = 'element') {
    const clicked = await browser.execute((id) => {
      const element = document.getElementById(id)
      if (element) {
        element.click()
        // Trigger click event for any listeners
        const clickEvent = new Event('click', { bubbles: true })
        element.dispatchEvent(clickEvent)
        return true
      }
      return false
    }, elementId)

    if (!clicked) {
      throw new Error(`Failed to find ${elementName} with id: ${elementId}`)
    }

    return clicked
  }

  /**
   * Select a radio button using JavaScript execution (bypasses visibility checks)
   * @param {string} radioId - The ID of the radio button to select
   * @param {string} radioName - Optional name for logging purposes
   * @returns {Promise<boolean>} - Returns true if selection was successful
   */
  async selectRadioUsingJavaScript(radioId, radioName = 'radio button') {
    const selected = await browser.execute((id) => {
      const radio = document.getElementById(id)
      if (radio) {
        radio.click()
        radio.checked = true
        // Trigger change event for any listeners
        const changeEvent = new Event('change', { bubbles: true })
        radio.dispatchEvent(changeEvent)
        return true
      }
      return false
    }, radioId)

    if (!selected) {
      throw new Error(`Failed to find ${radioName} with id: ${radioId}`)
    }

    // Verify it's selected
    const isSelected = await browser.execute((id) => {
      const radio = document.getElementById(id)
      return radio ? radio.checked : false
    }, radioId)

    return isSelected
  }

  async clickOnLinkWithText(linkText) {
    const link = await $(`=${linkText}`)
    await link.waitForClickable({ timeout: config.waitforTimeout })
    return await link.click()
  }

  async enterText(element, text) {
    await element.waitForDisplayed({ timeout: config.waitforTimeout })
    return await element.setValue(text)
  }

  async getTextFrom(element) {
    await element.waitForDisplayed({ timeout: config.waitforTimeout })
    return await element.getText()
  }

  async elementIsDisplayed(element) {
    return await element.waitForDisplayed({ timeout: config.waitforTimeout })
  }

  async getUrl() {
    return await browser.getUrl()
  }

  async verifyUserNavigatedCorrectlyToTargetPage(targetUrl) {
    await expect(await this.getUrl()).toBe(config.baseUrl + targetUrl)
  }

  async waitForPageToLoad() {
    await browser.waitUntil(
      async () => {
        const readyState = await browser.execute(() => document.readyState)
        return readyState === 'complete'
      },
      {
        timeout: config.waitforTimeout,
        timeoutMsg: 'Page did not load within the expected time'
      }
    )
  }

  async verifyBetaBannerIsDisplayed() {
    await expect(this.betaBanner).toBeDisplayed()
    await expect(this.betaBanner).toHaveText(expect.stringContaining('Beta'))
    await expect(this.betaBanner).toHaveText(
      expect.stringContaining('This is a new service. Help us improve it and')
    )
  }

  async verifyFeedbackLinkIsDisplayed() {
    await expect(this.feedbackLink).toBeDisplayed()
    await expect(this.feedbackLink).toHaveAttribute(
      'href',
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1ALCrSKxbPNvlKC'
    )
    await expect(this.feedbackLink).toHaveText(
      'give your feedback (opens in new tab)'
    )
  }

  async clickFeedbackLink() {
    await this.click(this.feedbackLink)
  }

  async verifyFeedbackFormOpenedInNewTab() {
    const handles = await browser.getWindowHandles()
    expect(handles.length).toBe(2)
    await browser.switchToWindow(handles[1])
    await expect(browser).toHaveUrl(
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1ALCrSKxbPNvlKC'
    )
  }

  async clickLinkInFooter(linkText) {
    const link = await this.footer.$(`=${linkText}`)
    await link.waitForClickable({ timeout: config.waitforTimeout })
    return await link.click()
  }

  async clickSignOutLink() {
    await this.click(this.signOutLink)
  }

  async verifyErrorMessage(expectedMessage) {
    await expect(browser).toHaveTitle(/Error:/)
    await this.errorMessage.waitForDisplayed({ timeout: config.waitforTimeout })
    await expect(this.errorMessage).toHaveText(new RegExp(expectedMessage))
  }

  async verifyUserIsSignedOut() {
    await expect(browser).toHaveUrl(
      /\/management\/sign-out-successful|\/signed-out/
    )
  }

  async verifyPageTitle(expectedTitle) {
    await expect(browser).toHaveTitle(expectedTitle)
  }
}

export { Page }
