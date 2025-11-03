import { Page } from 'page-objects/page'
import { browser } from '@wdio/globals'

class HomePage extends Page {
  open() {
    return super.open(
      '/government/organisations/department-for-environment-food-rural-affairs'
    )
  }

  get heading() {
    return $(
      '.gem-c-organisation-logo.brand--department-for-environment-food-rural-affairs'
    )
  }

  get navigationLinkByText() {
    return $(`=Bringing food into Great Britain`)
  }
  // get gatewayRadioButton() {
  //   return $('input[id="authProvider-2"]')
  // }

  // // Wait for page to load (replaces the hardcoded pause)
  // async waitForPageLoad() {
  //   await browser.pause(10000)
  // }

  // Take screenshot if needed
  async takeScreenshot() {
    return await browser.takeScreenshot()
  }
}

export default new HomePage()
