import { Page } from 'page-objects/page'

class CannotUseServicePage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get findOutMoreLink() {
    return $(
      'a.govuk-link[href="https://www.gov.uk/guidance/report-receipt-of-waste"]'
    )
  }

  // assertions
  async verifyUserIsOnCannotUseServicePage() {
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Sorry, you cannot use the service')
    await expect(this.findOutMoreLink).toBeExisting()
    await expect(this.findOutMoreLink).toHaveText(
      'Find out more about Digital waste tracking'
    )
  }
}

export default new CannotUseServicePage()
