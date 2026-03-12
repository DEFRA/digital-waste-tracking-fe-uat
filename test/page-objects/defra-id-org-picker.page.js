import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

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
    // Wait for heading to be displayed
    await expect(this.heading).toBeDisplayed()

    // Verify the heading text
    await expect(this.heading).toHaveText('Who do you want to represent?')
  }

  async selectOrganisation(index) {
    const organisationList = await this.organisationList.getElements()
    const radio = await organisationList[index].$('.govuk-radios__input')
    const label = await organisationList[index].$('label').getText()
    await radio.click()
    await this.continueButton.click()
    return label
  }
}

export default new DefraIdOrgPickerPage()
