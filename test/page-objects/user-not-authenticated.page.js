import { Page } from 'page-objects/page'

class UserNotAuthenticatedPage extends Page {
  // locators
  get signInButton() {
    return $('a.govuk-button')
  }

  // assertions
  async verifyUserIsOnUserNotAuthenticatedPage() {
    await this.verifyPageTitle()
    await this.verifyPageHeading()
    await expect(this.signInButton).toBeDisplayed()
    await expect(this.signInButton).toHaveProperty('href', '/signin-oidc')
  }
}

export default new UserNotAuthenticatedPage()
