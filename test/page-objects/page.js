import { browser, $ } from '@wdio/globals'
import { config } from '../../wdio.conf.js'

class Page {
  get pageHeading() {
    return $('h1')
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
    await element.waitForClickable({
      timeout: config.waitforTimeout
    })
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
}

export { Page }
