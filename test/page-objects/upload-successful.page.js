import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'

class UploadSuccessfulPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  async verifyUserIsOnUploadSuccessfulPage() {
    await expect(browser).toHaveUrl(
      /\/organisation\/[a-zA-Z0-9-]+\/spreadsheet\/file-uploaded/
    )
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Spreadsheet upload successful')
  }
}

export default new UploadSuccessfulPage()
