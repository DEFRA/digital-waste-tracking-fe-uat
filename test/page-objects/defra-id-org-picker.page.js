import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'

class DefraIdOrgPickerPage extends Page {
  get heading() {
    return $('#header')
  }

  get organisationList() {
    return $$('.govuk-radios__item')
  }

  get continueButton() {
    return $('#continueReplacement')
  }

  async verifyUserIsOnOrgPickerPage() {
    await browser.waitUntil(
      async () => {
        const displayed = await this.heading.isDisplayed()
        const text = displayed ? await this.heading.getText() : ''
        return displayed && text === 'Who do you want to represent?'
      },
      {
        timeoutMsg:
          'Org picker heading "Who do you want to represent?" was not displayed'
      }
    )
  }

  async selectOrganisation(index) {
    await browser.waitUntil(
      async () => (await this.organisationList.getElements()).length > 1,
      { timeoutMsg: 'Organisation list did not load more than 1 item' }
    )
    const organisationList = await this.organisationList.getElements()
    const radio = await organisationList[index].$('.govuk-radios__input')
    const label = await organisationList[index].$('label').getText()
    await radio.click()
    await this.continueButton.click()
    return label
  }
}

export default new DefraIdOrgPickerPage()
