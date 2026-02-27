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

  get downloadSpreadsheetRadio() {
    return $('#downloadSpreadsheet')
  }

  get continueButton() {
    return $('button[type="submit"]')
  }

  // assertions
  async verifyUserIsOnChooseNextActionPage() {
    await expect(browser).toHaveUrl(config.baseUrl + '/next-action')
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Report receipt of waste')
  }

  /**
   * @param {'connectYourSoftware' | 'uploadSpreadsheet' | 'downloadSpreadsheet'} option
   */
  async selectNextAction(option) {
    let radio
    switch (option) {
      case 'connectYourSoftware':
        radio = this.connectYourSoftwareRadio
        break
      case 'uploadSpreadsheet':
        radio = this.uploadSpreadsheetRadio
        break
      case 'downloadSpreadsheet':
        radio = this.downloadSpreadsheetRadio
        break
      default:
        throw new Error(`Unknown next action: ${option}`)
    }
    await radio.click()
    await this.continueButton.click()
  }
}

export default new NextActionPage()
