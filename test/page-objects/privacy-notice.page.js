import { Page } from 'page-objects/page'

class PrivacyNoticePage extends Page {
  // methods
  open() {
    return super.open('/privacy-notice')
  }

  // locators
  async verifyUserIsOnPrivacyNoticePage() {
    await this.verifyPageTitle()
    await this.verifyPageHeading()
  }
}

export default new PrivacyNoticePage()
