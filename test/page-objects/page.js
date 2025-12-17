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

  // async select(element) {
  //   await element.waitForDisplayed({ timeout: config.waitforTimeout })
  //   return await element.se
  // }

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
}

export { Page }
