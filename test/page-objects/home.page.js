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

  async verifyUserNavigatedCorrectlyToDefraIdService(env) {
    if (env === 'dev') {
      await expect(browser).toHaveUrl(
        /https:\/\/cdp-defra-id-stub.dev.cdp-int.defra.cloud\/cdp-defra-id-stub\/authorize/
      )
    } else {
      await expect(browser).toHaveUrl(
        'https://dcidmtest.b2clogin.com/dcidmtest.onmicrosoft.com/oauth2/authresp'
      )
    }
  }
}

export default new HomePage()
