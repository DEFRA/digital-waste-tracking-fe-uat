import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class ManageApiCodePage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get apiCodeList() {
    return $$('.govuk-summary-list>.govuk-summary-list__row')
  }

  get createAPICodeButton() {
    return $('button[class="govuk-button govuk-button--secondary"]')
  }

  get createNewCodeButton() {
    return $('button[type="submit"]')
  }

  get notificationBanner() {
    return $('.govuk-notification-banner__content')
  }

  // methods
  open() {
    return super.open('/api')
  }

  // assertions
  async getListOfActiveAPICodes() {
    const apiList = await this.apiCodeList.getElements()

    const activeAPICodes = []

    for (const apiCode of apiList) {
      const disableButton = await apiCode.$('dd.govuk-summary-list__actions>a')

      if (await disableButton.isDisplayed()) {
        const apiCodeText = await apiCode
          .$('dd.govuk-summary-list__value')
          .getText()
        activeAPICodes.push(apiCodeText)
      }
    }

    return activeAPICodes
  }

  async verifyUserIsOnYourApiCodePage() {
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Your API code')
  }

  async verifyAPICodeIsDisplayed(expectedApiCode, status) {
    const activeAPICodes = await this.getListOfActiveAPICodes()
    if (status === 'active') {
      expect(activeAPICodes).toContain(expectedApiCode)
    } else {
      expect(activeAPICodes).not.toContain(expectedApiCode)
    }
  }

  async clickDisableButtonForAPICode(expectedApiCode) {
    const apiList = await this.apiCodeList.getElements()

    let apiCodeRow = null

    for (const apiCode of apiList) {
      const apiCodeText = await apiCode
        .$('dd.govuk-summary-list__value')
        .getText()

      if (expectedApiCode !== '' && apiCodeText === expectedApiCode) {
        apiCodeRow = apiCode
        break
      }
    }

    if (!apiCodeRow) {
      throw new Error(`API Code "${expectedApiCode}" not found in the list`)
    }

    const disableButton = await apiCodeRow.$('dd.govuk-summary-list__actions>a')
    await expect(disableButton).toBeDisplayed()
    await disableButton.click()
  }

  async verifyDisableApiCodeNotificationBannerIsDisplayed(apiCode) {
    await expect(this.notificationBanner).toBeDisplayed()
    const notificationBannerText = await this.notificationBanner.getText()
    await expect(
      notificationBannerText.includes(
        `The code ${apiCode} cannot be used to send any new waste movements.`
      )
    ).toBe(true)
  }

  async userCreatesAnAdditionalAPICode() {
    await this.createAPICodeButton.waitForDisplayed()
    await this.createAPICodeButton.click()
  }

  async verifyAdditionalAPICodeIsCreated(previousActiveAPICodes) {
    browser.refresh()
    const activeAPICodes = await this.getListOfActiveAPICodes()
    expect(activeAPICodes.length).toBe(previousActiveAPICodes.length + 1)
  }

  async userCreatesANewAPICode() {
    browser.refresh()
    await this.createNewCodeButton.waitForDisplayed()
    await this.createNewCodeButton.click()
  }
}

export default new ManageApiCodePage()
