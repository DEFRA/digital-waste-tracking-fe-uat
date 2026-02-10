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
    return $('#start-now-button')
  }

  get notificationBanner() {
    return $('.govuk-notification-banner__content')
  }

  // methods
  open() {
    return super.open('/api')
  }

  // assertions

  async verifyUserIsOnYourApiCodePage() {
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Your API code')
  }

  async verifyAPICodeIsDisplayed(expectedApiCode, status) {
    const apiList = await this.apiCodeList.getElements()

    const apiCodeRow = await apiList.find(async (apiCode) => {
      const apiCodeText = await apiCode
        .$('dd.govuk-summary-list__value')
        .getText()
      if (expectedApiCode !== '' && apiCodeText === expectedApiCode) {
        return apiCode
      } else {
        return apiCode
      }
    })

    if (status === 'active') {
      const disableButton = await apiCodeRow.$(
        'dd.govuk-summary-list__actions>a'
      )
      await expect(await disableButton.isDisplayed()).toBe(true)
      await expect(disableButton).toBeDisplayed()
      await expect(disableButton).toHaveText('Disable')
    } else {
      const disableText = await apiCodeRow.$(
        'dd.govuk-summary-list__actions>strong'
      )
      await expect(await disableText.isDisplayed()).toBe(true)
      await expect(disableText).toBeDisplayed()
      await expect(disableText).toHaveText('Disabled')
    }
  }

  async clickDisableButtonForAPICode(expectedApiCode) {
    const apiList = await this.apiCodeList.getElements()

    const apiCodeRow = await apiList.find(async (apiCode) => {
      const apiCodeText = await apiCode
        .$('dd.govuk-summary-list__value')
        .getText()
      if (expectedApiCode !== '' && apiCodeText === expectedApiCode) {
        return apiCode
      } else {
        return apiCode
      }
    })
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
}

export default new ManageApiCodePage()
