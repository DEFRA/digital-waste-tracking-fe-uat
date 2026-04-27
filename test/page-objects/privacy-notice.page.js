import { Page } from 'page-objects/page'

class PrivacyNoticePage extends Page {
  // methods
  open() {
    return super.open('/privacy-notice')
  }

  // locators
  get heading() {
    return $('h1')
  }

  async verifyUserIsOnPrivacyNoticePage() {
    await this.verifyPageTitle('Privacy notice | Report receipt of waste')
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Privacy notice')
  }
}

export default new PrivacyNoticePage()
