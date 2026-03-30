import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'
import { browser, $ } from '@wdio/globals'

class NextActionPage extends Page {
  // methods
  open() {
    return super.open('/next-action')
  }

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

  get updateSpreadsheetRadio() {
    return $('#updateSpreadsheet')
  }

  get continueButton() {
    return $('button[type="submit"]')
  }

  // assertions
  async verifyUserIsOnChooseNextActionPage() {
    await expect(browser).toHaveUrl(config.baseUrl + '/next-action')
    await this.elementIsDisplayed(this.heading)
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Report receipt of waste')
  }

  async verifyListOfActionsToChooseFrom() {
    await expect(this.connectYourSoftwareRadio).toBeDisplayed()
    await expect(this.uploadSpreadsheetRadio).toBeDisplayed()
    await expect(this.downloadSpreadsheetRadio).toBeDisplayed()
    await expect(this.updateSpreadsheetRadio).toBeDisplayed()
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
      case 'updateSpreadsheet':
        radio = this.updateSpreadsheetRadio
        break
      default:
        throw new Error(`Unknown next action: ${option}`)
    }
    await radio.click()
    await this.continueButton.click()
  }
}

export default new NextActionPage()
