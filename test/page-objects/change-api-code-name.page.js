import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class ChangeApiCodeNamePage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get apiCodeNameInput() {
    return $('#name')
  }

  get continueButton() {
    return $('button[type="submit"]')
  }

  // assertions

  async verifyUserIsOnChangeApiCodeNamePage(apiCode) {
    await this.verifyPageTitle()
    await expect(browser).toHaveUrl(new RegExp(`/api/change-name/${apiCode}`))
    await this.verifyPageHeading()
  }

  async userChangesTheApiCodeName(newName) {
    await this.apiCodeNameInput.waitForDisplayed()
    await this.apiCodeNameInput.setValue(newName)
    await this.continueButton.click()
  }

  async userAbortsTheApiCodeNameChange() {
    await this.backLink.click()
  }
}

export default new ChangeApiCodeNamePage()
