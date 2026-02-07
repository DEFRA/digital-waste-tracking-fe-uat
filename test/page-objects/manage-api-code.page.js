import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

// This page is now obsolete as it is now lives outside of our service
// and will be maintained by Defra content team
// leaving it here for now and will be removed in the future
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
      if (apiCodeText === expectedApiCode) {
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
}

export default new ManageApiCodePage()
