import { browser, $ } from '@wdio/globals'
import { config } from '../../wdio.conf.js'

class Page {
  get pageHeading() {
    return $('h1')
  }

  open(path) {
    return browser.url(path)
  }

  get menuLink() {
    return $('button[id="super-navigation-menu-toggle"]')
  }

  get superNavigationSection() {
    return $('div[id="super-navigation-menu"]')
  }

  async clickLink(element) {
    await element.waitForDisplayed({ timeout: config.waitforTimeout })
    return await element.click()
  }

  async clickOnLinkWithText(linkText) {
    const link = await $(`=${linkText}`)
    await link.waitForClickable({ timeout: config.waitforTimeout })
    return await link.click()
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
