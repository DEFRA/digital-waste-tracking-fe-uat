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
    await expect(browser).toHaveUrl(/\/account/)
    await expect(this.heading).toBeExisting()
    await expect(this.heading).toHaveText('You cannot continue on this service')
    await expect(this.signOutLink).toBeExisting()
  }
}

export default new CannotContinueOnThisServicePage()
