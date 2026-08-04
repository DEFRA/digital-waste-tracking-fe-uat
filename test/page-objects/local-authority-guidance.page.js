import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'

class LocalAuthorityGuidancePage extends Page {
  // locators
  get heading() {
    return $('[data-testid="app-heading-title"]')
  }

  get caption() {
    return $('[data-testid="app-heading-caption"]')
  }

  get guidanceSteps() {
    return $$('.govuk-list.govuk-list--number > li')
  }

  get finalNote() {
    return $('.final-note')
  }

  get continueButton() {
    return $('[data-testid="local-authority-signin"]')
  }

  // methods
  open() {
    return super.open('/local-authority-guidance')
  }

  // assertions
  async verifyUserIsOnLocalAuthorityGuidancePage() {
    await this.verifyPageTitle(
      'Are you registering as a local authority? | Report receipt of waste'
    )
    await expect(browser).toHaveUrl(/\/local-authority-guidance/)
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Are you registering as a local authority?'
    )
    await expect(this.continueButton).toBeDisplayed()
  }

  async verifyLocalAuthorityGuidanceIsDisplayed() {
    await expect(this.caption).toBeDisplayed()
    await expect(this.caption).toHaveText(
      'If you are registering as a local authority and do not have a company registration number, you will need to:'
    )

    const expectedSteps = [
      'Select "Yes" when asked if you are registering as a business or organisation.',
      'Confirm you do not have a company registration number.',
      'Select "Sole trader" when asked about what kind of business or organisation you have.'
    ]
    const steps = await this.guidanceSteps
    expect(steps).toHaveLength(expectedSteps.length)
    for (let i = 0; i < expectedSteps.length; i++) {
      await expect(steps[i]).toBeDisplayed()
      await expect(steps[i]).toHaveText(expectedSteps[i])
    }

    await expect(this.finalNote).toBeDisplayed()
    await expect(this.finalNote).toHaveText(
      'Before you continue, check if your local authority has already been registered.'
    )
  }
}

export default new LocalAuthorityGuidancePage()
