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
    return $('#isPermitNo')
  }

  // methods
  open() {
    return super.open('/')
  }

  async selectYesOption() {
    await this.yesOption.waitForExist({ timeout: config.waitforTimeout })
    await this.yesOption.click()
  }

  async selectNoOption() {
    await this.noOption.waitForExist({ timeout: config.waitforTimeout })
    await this.noOption.click()
  }

  // assertions
  async verifyUserIsOnUKPermitPage() {
    await this.verifyPageTitle(
      'Are you registering as a local authority? | Report receipt of waste'
    )
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Are you registering as a local authority?'
    )
  }

  async verifyUserNavigatedCorrectlyToDefraIdService(defraIdServiceUrl) {
    await expect(browser).toHaveUrl(new RegExp(defraIdServiceUrl))
  }
}

export default new UKPermitPage()
