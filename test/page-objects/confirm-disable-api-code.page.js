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
    await expect(browser).toHaveUrl(new RegExp(`/api/disable/${apiCode}`))
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Do you want to disable this API code?'
    )
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
