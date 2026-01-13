import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'
import { config } from '../../wdio.conf.js'

class UKPermitPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get continueButton() {
    return $("button[type='submit']")
  }

  get yesOption() {
    return $('#isPermitYes')
  }

  get noOption() {
    return $('#isPermit-2')
  }

  get errorMessage() {
    return $('.govuk-error-summary')
  }

  // methods
  open() {
    return super.open('/uk-permit')
  }

  async selectYesOption() {
    this.yesOption.waitForExist({ timeout: config.waitforTimeout })
    await this.yesOption.click()
  }

  async selectNoOption() {
    this.noOption.waitForExist({ timeout: config.waitforTimeout })
    await this.noOption.click()
  }

  // assertions
  async verifyUserIsOnUKPermitPage() {
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Do you operate one or more licensed or permitted waste receiving sites?'
    )
  }

  async verifyUserNavigatedCorrectlyToDefraIdService(defraIdServiceUrl) {
    await expect(browser).toHaveUrl(new RegExp(defraIdServiceUrl))
  }

  async verifyErrorMessage(expectedMessage) {
    await this.errorMessage.waitForDisplayed({ timeout: config.waitforTimeout })
    await expect(this.errorMessage).toHaveText(new RegExp(expectedMessage))
  }
}

export default new UKPermitPage()
