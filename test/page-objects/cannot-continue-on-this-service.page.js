import { Page } from 'page-objects/page'

class CannotContinueOnThisServicePage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get signOutLink() {
    return $('.govuk-body>a[href="/sign-out"]')
  }

  // assertions
  async verifyUserIsOnCannotContinueOnThisServicePage() {
    await this.verifyPageTitle()
    await expect(browser).toHaveUrl(/\/account/)
    await this.verifyPageHeading()
    await expect(this.signOutLink).toBeExisting()
  }
}

export default new CannotContinueOnThisServicePage()
