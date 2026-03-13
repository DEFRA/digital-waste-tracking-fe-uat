import { Page } from 'page-objects/page'

class UserNotAuthenticatedPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get signInButton() {
    return $('a.govuk-button')
  }

  // assertions
  async verifyUserIsOnUserNotAuthenticatedPage() {
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'You do not have permission to view this page'
    )
    await expect(this.signInButton).toBeDisplayed()
    await expect(this.signInButton).toHaveProperty('href', '/signin-oidc')
  }
}

export default new UserNotAuthenticatedPage()
