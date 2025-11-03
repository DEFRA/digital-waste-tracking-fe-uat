import { browser, $ } from '@wdio/globals'

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
    await element.waitForDisplayed({ timeout: 3000 })
    return await element.click()
  }

  async getTextFrom(element) {
    await element.waitForDisplayed({ timeout: 3000 })
    return await element.getText()
  }

  async elementIsDisplayed(element) {
    return await element.waitForDisplayed({ timeout: 3000 })
  }
}

export { Page }
