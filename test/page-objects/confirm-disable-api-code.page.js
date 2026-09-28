import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class ConfirmDisableApiCodePage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get yesButton() {
    return $('#disableYes')
  }

  get noButton() {
    return $('#disableNo')
  }

  get continueButton() {
    return $('button[type="submit"]')
  }

  // assertions

  async verifyUserIsOnConfirmDisableApiCodePage(apiCode) {
    await this.verifyPageTitle()
    await expect(browser).toHaveUrl(new RegExp(`/api/disable/${apiCode}`))
    await this.verifyPageHeading()
  }

  async userContinuesWithDisableApiCodeAction() {
    await this.yesButton.click()
    await expect(this.continueButton).toBeDisplayed()
    await this.continueButton.click()
  }

  async userDoesNotContinueWithDisableApiCodeAction() {
    await this.noButton.click()
    await expect(this.continueButton).toBeDisplayed()
    await this.continueButton.click()
  }
}

export default new ConfirmDisableApiCodePage()
