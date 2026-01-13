import { Page } from 'page-objects/page'

class CannotUseServicePage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  // assertions
  async verifyUserIsOnCannotUseServicePage() {
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Sorry, you cannot use the service')
  }
}

export default new CannotUseServicePage()
