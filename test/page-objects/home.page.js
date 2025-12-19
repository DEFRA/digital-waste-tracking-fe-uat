import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'

class HomePage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get startNowButton() {
    return $('#start-now-button')
  }

  // methods
  open() {
    return super.open('/')
  }

  // assertions
  async verifyUserIsOnHomePage() {
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Report receipt of waste')
  }

  async verifyUserNavigatedCorrectlyToDefraIdService(defraIdServiceUrl) {
    await expect(browser).toHaveUrl(new RegExp(defraIdServiceUrl))
  }
}

export default new HomePage()
