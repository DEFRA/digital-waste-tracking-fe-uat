import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'
import { browser, $ } from '@wdio/globals'

class NextActionPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get connectYourSoftwareRadio() {
    return $('#connectYourSoftware')
  }

  get uploadSpreadsheetRadio() {
    return $('#uploadSpreadsheet')
  }

  get continueButton() {
    return $('button[type="submit"]')
  }

  // assertions
  async verifyUserIsOnChooseNextActionPage() {
    await expect(browser).toHaveUrl(config.baseUrl + '/next-action')
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('What do you want to do?')
  }

  async selectConnectYourSoftwareRadio() {
    await this.connectYourSoftwareRadio.click()
    await this.continueButton.click()
  }

  async selectUploadSpreadsheetRadio() {
    await this.uploadSpreadsheetRadio.click()
    await this.continueButton.click()
  }
}

export default new NextActionPage()
